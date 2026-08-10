import { supabase } from './_lib/supabase'
import { requireAuth } from './_lib/auth'
import { apiHandler, success, error } from './_lib/response'

/** 按 Asia/Shanghai 取当天日期 YYYY-MM-DD */
function getTodayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** 在日历日期上加减天数（与服务器本地时区无关） */
function shiftDateKey(dateKey, deltaDays) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays))
  const yy = dt.getUTCFullYear()
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** 解析并裁剪近 7 天的每日访问量 */
function pruneDailyVisits(daily, todayKey) {
  const kept = {}
  for (let i = 0; i < 7; i++) {
    const key = shiftDateKey(todayKey, -i)
    kept[key] = Number(daily?.[key]) || 0
  }
  return kept
}

// 默认设置
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
  // GET - 获取设置
  if (req.method === 'GET') {
    const { data: settingsRows, error: dbError } = await supabase
      .from('site_settings')
      .select('*')

    if (dbError) {
      return error(res, '获取设置失败')
    }

    // 转换为对象
    const settings = { ...defaultSettings }
    settingsRows.forEach(row => {
      settings[row.key] = row.value
    })

    // 规范化近 7 天访问量（补齐缺失日期、去掉过期）
    let dailyRaw = {}
    try {
      dailyRaw = settings.visit_daily ? JSON.parse(settings.visit_daily) : {}
      if (!dailyRaw || typeof dailyRaw !== 'object' || Array.isArray(dailyRaw)) {
        dailyRaw = {}
      }
    } catch {
      dailyRaw = {}
    }
    const daily = pruneDailyVisits(dailyRaw, getTodayKey())
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

    // 逐条更新或插入（禁止通过设置接口改写访问量统计）
    const protectedKeys = new Set(['visit_count', 'visit_daily'])
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

  // POST - 统计访问量（总访问量 + 近 7 天每日）
  if (req.method === 'POST') {
    const { action } = req.query

    if (action === 'visit') {
      const todayKey = getTodayKey()

      const { data: rows, error: fetchError } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['visit_count', 'visit_daily'])

      if (fetchError) {
        return error(res, '统计访问量失败')
      }

      const map = Object.fromEntries((rows || []).map((r) => [r.key, r.value]))
      const total = (parseInt(map.visit_count || '0', 10) || 0) + 1

      let dailyRaw = {}
      try {
        dailyRaw = map.visit_daily ? JSON.parse(map.visit_daily) : {}
        if (!dailyRaw || typeof dailyRaw !== 'object' || Array.isArray(dailyRaw)) {
          dailyRaw = {}
        }
      } catch {
        dailyRaw = {}
      }

      const daily = pruneDailyVisits(dailyRaw, todayKey)
      daily[todayKey] = (daily[todayKey] || 0) + 1

      await Promise.all([
        supabase
          .from('site_settings')
          .upsert({ key: 'visit_count', value: String(total) }, { onConflict: 'key' }),
        supabase
          .from('site_settings')
          .upsert({ key: 'visit_daily', value: JSON.stringify(daily) }, { onConflict: 'key' }),
      ])

      return success(res, { count: total, daily })
    }

    return error(res, '无效的操作', 400)
  }

  return error(res, '方法不允许', 405)
})
