import os

# 修改 photos/index.js 的 PUT 方法，手动解析 JSON body
photos_path = 'E:/桌面/peter-world/api/photos/index.js'
with open(photos_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_put = """  // PUT - 批量更新排序
  if (req.method === 'PUT') {
    requireAuth(req)

    const { photos } = req.body

    if (!photos || !Array.isArray(photos)) {
      return error(res, '请提供照片排序数组', 400)
    }

    // 批量更新 sort_order
    const updates = photos.map((photo, index) =>
      supabase
        .from('photos')
        .update({ 
          sort_order: index,
          is_featured: photo.is_featured
        })
        .eq('id', photo.id)
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
    const { photos } = JSON.parse(body || '{}')

    if (!photos || !Array.isArray(photos)) {
      return error(res, '请提供照片排序数组', 400)
    }

    // 批量更新 sort_order
    const updates = photos.map((photo, index) =>
      supabase
        .from('photos')
        .update({ 
          sort_order: index,
          is_featured: photo.is_featured
        })
        .eq('id', photo.id)
    )

    await Promise.all(updates)

    return success(res, { message: '排序更新成功' })
  }"""

if old_put in content:
    content = content.replace(old_put, new_put)
    print('照片PUT方法修改成功')
else:
    print('没找到照片PUT方法')
    # 找找看
    idx = content.find('PUT - 批量更新排序')
    if idx > -1:
        print('找到PUT方法位置:', idx)
        print(content[idx:idx+500])

# 保存文件
with open(photos_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('photos/index.js 保存完成')
