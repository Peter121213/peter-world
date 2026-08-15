import { supabase } from './_lib/supabase'
import { requireAuth } from './_lib/auth'
import { apiHandler, success, error } from './_lib/response'

const MAX_VISITORS_PER_DAY = 300

/** 按 Asia/Shanghai 取当天日期 YYYY-MM-DD */
function getTodayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function shiftDateKey(dateKey, deltaDays) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays))
  const yy = dt.getUTCFullYear()
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

function pruneDailyVisits(daily, todayKey) {
  const kept = {}
  for (let i = 0; i < 7; i++) {
    const key = shiftDateKey(todayKey, -i)
    kept[key] = Number(daily?.[key]) || 0
  }
  return kept
}

function parseJsonObject(raw, fallback = {}) {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fallback
    return parsed
  } catch {
    return fallback
  }
}

/** 只保留近 7 天访客明细 */
function pruneVisitors(visitors, todayKey) {
  const kept = {}
  for (let i = 0; i < 7; i++) {
    const key = shiftDateKey(todayKey, -i)
    const list = Array.isArray(visitors?.[key]) ? visitors[key] : []
    kept[key] = list.slice(0, MAX_VISITORS_PER_DAY)
  }
  return kept
}

function decodeHeader(value) {
  if (!value || typeof value !== 'string') return ''
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '))
  } catch {
    return value
  }
}

/** 从请求头取真实 IP（优先 Cloudflare，再 Vercel，再反代） */
function getClientIp(req) {
  // 优先用 Cloudflare 的真实访客 IP（用户用了 Cloudflare CDN）
  const cfIp = req.headers['cf-connecting-ip']
  if (typeof cfIp === 'string' && cfIp.trim()) {
    return cfIp.trim()
  }
  if (Array.isArray(cfIp) && cfIp[0]) {
    return String(cfIp[0]).trim()
  }

  // 其次用 Vercel 的真实 IP
  const vercelIp = req.headers['x-vercel-forwarded-for']
  if (typeof vercelIp === 'string' && vercelIp.trim()) {
    return vercelIp.split(',')[0].trim()
  }

  // 最后用 x-forwarded-for（取最左边的客户端 IP）
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).split(',')[0].trim()
  }

  return (
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    ''
  )
}

/** Vercel 地理头：国家 / 地区 / 城市 */
function getGeoFromRequest(req) {
  return {
    country: String(req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || '').toUpperCase(),
    region: decodeHeader(req.headers['x-vercel-ip-country-region'] || ''),
    city: decodeHeader(req.headers['x-vercel-ip-city'] || ''),
  }
}

function summarizeVisitors(visitorsByDay) {
  const flat = []
  const regionCount = {}

  for (const [date, list] of Object.entries(visitorsByDay || {})) {
    for (const item of list || []) {
      flat.push({ ...item, date })
      const label =
        [item.country, item.region, item.city].filter(Boolean).join(' · ') || '未知地区'
      regionCount[label] = (regionCount[label] || 0) + 1
    }
  }

  flat.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')))

  const distribution = Object.entries(regionCount)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)

  return {
    visitors: flat.slice(0, 200),
    distribution,
    uniqueIps: new Set(flat.map((v) => v.ip).filter(Boolean)).size,
  }
}

const defaultSettings = {
  site_name: "Peter 的小世界",
  site_description: "用镜头记录美好，用音乐传递情感",
  hero_title: "用镜头记录美好，\n用音乐传递情感",
  hero_subtitle: "这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片",
  hero_image: "https://picsum.photos/seed/hero/1920/1080",
  about_title: "关于我",
  about_content: "你好，我是 Peter，一个热爱摄影和音乐的普通人。\n我喜欢用镜头记录生活中的美好瞬间，也喜欢用音乐表达内心的情感。\n\n这个小世界是我分享作品和心情的地方，\n希望你能在这里找到一些共鸣和感动。",
  about_image: "https://picsum.photos/seed/about/600/600",
  about_page_image: "https://picsum.photos/seed/aboutme/600/750",
  contact_email: "2309031942@qq.com",
  social_weibo: "",
  social_instagram: "",
  social_x: "",
  social_github: "",
  music_section_title: "音乐陪伴",
  music_section_description: "每一张照片都有它的故事，每一首歌都有它的心情。\n点击右下角的音乐按钮，开启你的听觉之旅。",
}

export default apiHandler(async (req, res) => {
  // GET - 设置；或管理员拉取访客明细
  if (req.method === 'GET') {
    const { action } = req.query

    // 访客 IP / 地区分布（仅管理员）
    if (action === 'visitors') {
      requireAuth(req)

      const { data: row, error: dbError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'visit_visitors')
        .maybeSingle()

      if (dbError) {
        return error(res, '获取访客记录失败')
      }

      const todayKey = getTodayKey()
      const visitors = pruneVisitors(parseJsonObject(row?.value, {}), todayKey)
      const summary = summarizeVisitors(visitors)

      return success(res, {
        days: visitors,
        ...summary,
      })
    }

    const { data: settingsRows, error: dbError } = await supabase
      .from('site_settings')
      .select('*')

    if (dbError) {
      return error(res, '获取设置失败')
    }

    const settings = { ...defaultSettings }
    settingsRows.forEach((row) => {
      // 不把访客 IP 明细暴露给公开接口
      if (row.key === 'visit_visitors') return
      settings[row.key] = row.value
    })

    const daily = pruneDailyVisits(parseJsonObject(settings.visit_daily, {}), getTodayKey())
    settings.visit_daily = daily
    settings.visit_count = settings.visit_count || '0'

    return success(res, { settings })
  }

  // PUT - 更新设置
  if (req.method === 'PUT') {
    requireAuth(req)

    const settings = req.body

    if (!settings || typeof settings !== 'object') {
      return error(res, '无效的设置数据', 400)
    }

    const protectedKeys = new Set(['visit_count', 'visit_daily', 'visit_visitors'])
    const updates = Object.entries(settings)
      .filter(([key]) => !protectedKeys.has(key))
      .map(([key, value]) =>
        supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' })
      )

    await Promise.all(updates)

    return success(res, { message: '设置已更新' })
  }

  // POST - 统计访问量 + 记录 IP/地区
  if (req.method === 'POST') {
    const { action } = req.query

    if (action === 'visit') {
      const todayKey = getTodayKey()
      const ip = getClientIp(req)
      const geo = getGeoFromRequest(req)

      const { data: rows, error: fetchError } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['visit_count', 'visit_daily', 'visit_visitors'])

      if (fetchError) {
        return error(res, '统计访问量失败')
      }

      const map = Object.fromEntries((rows || []).map((r) => [r.key, r.value]))
      const total = (parseInt(map.visit_count || '0', 10) || 0) + 1

      const daily = pruneDailyVisits(parseJsonObject(map.visit_daily, {}), todayKey)
      daily[todayKey] = (daily[todayKey] || 0) + 1

      const visitors = pruneVisitors(parseJsonObject(map.visit_visitors, {}), todayKey)
      const todayList = Array.isArray(visitors[todayKey]) ? [...visitors[todayKey]] : []

      // 同一天同一 IP 只记一次（更新地区与时间）
      const existingIdx = ip ? todayList.findIndex((v) => v.ip === ip) : -1
      const entry = {
        ip: ip || 'unknown',
        country: geo.country || '',
        region: geo.region || '',
        city: geo.city || '',
        at: new Date().toISOString(),
      }

      if (existingIdx >= 0) {
        todayList[existingIdx] = entry
      } else if (todayList.length < MAX_VISITORS_PER_DAY) {
        todayList.unshift(entry)
      }

      visitors[todayKey] = todayList

      await Promise.all([
        supabase
          .from('site_settings')
          .upsert({ key: 'visit_count', value: String(total) }, { onConflict: 'key' }),
        supabase
          .from('site_settings')
          .upsert({ key: 'visit_daily', value: JSON.stringify(daily) }, { onConflict: 'key' }),
        supabase
          .from('site_settings')
          .upsert({ key: 'visit_visitors', value: JSON.stringify(visitors) }, { onConflict: 'key' }),
      ])

      return success(res, { count: total, daily })
    }

    return error(res, '无效的操作', 400)
  }

  return error(res, '方法不允许', 405)
})
