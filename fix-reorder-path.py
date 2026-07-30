import os

api_path = 'E:/桌面/peter-world/frontend/src/lib/api.ts'
with open(api_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 修改照片排序 API 路径
old_photos_reorder = """  reorder: (photos: any[]) =>
    request('/photos', {
      method: 'PUT',"""

new_photos_reorder = """  reorder: (photos: any[]) =>
    request('/photos/reorder', {
      method: 'PUT',"""

if old_photos_reorder in content:
    content = content.replace(old_photos_reorder, new_photos_reorder)
    print('照片排序API路径修改成功')
else:
    print('没找到照片排序API')

# 修改音乐排序 API 路径
old_music_reorder = """  reorder: (tracks: any[]) =>
    request('/music', {
      method: 'PUT',"""

new_music_reorder = """  reorder: (tracks: any[]) =>
    request('/music/reorder', {
      method: 'PUT',"""

if old_music_reorder in content:
    content = content.replace(old_music_reorder, new_music_reorder)
    print('音乐排序API路径修改成功')
else:
    print('没找到音乐排序API')

# 保存文件
with open(api_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('api.ts 修改完成')
