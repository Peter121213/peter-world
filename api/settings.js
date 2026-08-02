import { supabase } from './_lib/supabase'
import { requireAuth } from './_lib/auth'
import { apiHandler, success, error } from './_lib/response'

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

    return success(res, { settings })
  }

  // PUT - 更新设置
  if (req.method === 'PUT') {
    requireAuth(req)

    const settings = req.body

    if (!settings || typeof settings !== 'object') {
      return error(res, '无效的设置数据', 400)
    }

    // 逐条更新或插入
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' })
    )

    await Promise.all(updates)

    return success(res, { message: '设置已更新' })
  }

  // POST - 统计访问量
  if (req.method === 'POST') {
    const { action } = req.query

    if (action === 'visit') {
      // 先获取当前访问量
      const { data: row, error: fetchError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'visit_count')
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 是没找到数据的错误，没关系
        return error(res, '统计访问量失败')
      }

      const currentCount = row ? parseInt(row.value || '0', 10) : 0
      const newCount = currentCount + 1

      // 更新访问量
      await supabase
        .from('site_settings')
        .upsert({ key: 'visit_count', value: String(newCount) }, { onConflict: 'key' })

      return success(res, { count: newCount })
    }

    return error(res, '无效的操作', 400)
  }

  return error(res, '方法不允许', 405)
})
