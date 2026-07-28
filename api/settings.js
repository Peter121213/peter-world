import { supabase } from './_lib/supabase'
import { requireAuth } from './_lib/auth'
import { apiHandler, success, error } from './_lib/response'

// 默认设置
const defaultSettings = {
  site_name: "Peter 的小世界",
  site_description: "记录生活，分享美好",
  about_title: "关于我",
  about_content: "你好，我是 Peter，一个热爱生活的人。",
  contact_email: "2309031942@qq.com",
  social_instagram: "",
  social_twitter: "",
  social_github: "",
  social_weibo: "",
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

  return error(res, '方法不允许', 405)
})
