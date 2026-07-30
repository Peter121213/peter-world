import os

# 修改 music/index.js 的 PUT 方法，手动解析 JSON body
music_path = 'E:/桌面/peter-world/api/music/index.js'
with open(music_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_put = """  // PUT - 批量更新排序
  if (req.method === 'PUT') {
    requireAuth(req)

    const { tracks } = req.body

    if (!tracks || !Array.isArray(tracks)) {
      return error(res, '请提供音乐排序数组', 400)
    }

    // 批量更新 sort_order
    const updates = tracks.map((track, index) =>
      supabase
        .from('music_tracks')
        .update({ sort_order: index })
        .eq('id', track.id)
    )

    await Promise.all(updates)

    return success(res, { message: '排序更新成功' })
  }"""

new_put = """  // PUT - 批量更新排序
  if (req.method === 'PUT') {
    requireAuth(req)

    // 手动解析 JSON body（因为 bodyParser 被禁用了）
    let body = ''
    for await (const chunk of req) {
      body += chunk.toString()
    }
    const { tracks } = JSON.parse(body || '{}')

    if (!tracks || !Array.isArray(tracks)) {
      return error(res, '请提供音乐排序数组', 400)
    }

    // 批量更新 sort_order
    const updates = tracks.map((track, index) =>
      supabase
        .from('music_tracks')
        .update({ sort_order: index })
        .eq('id', track.id)
    )

    await Promise.all(updates)

    return success(res, { message: '排序更新成功' })
  }"""

if old_put in content:
    content = content.replace(old_put, new_put)
    print('音乐PUT方法修改成功')
else:
    print('没找到音乐PUT方法')
    # 找找看
    idx = content.find('PUT - 批量更新排序')
    if idx > -1:
        print('找到PUT方法位置:', idx)
        print(content[idx:idx+500])

# 保存文件
with open(music_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('music/index.js 保存完成')
