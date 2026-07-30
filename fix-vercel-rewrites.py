import os
import json

vercel_path = 'E:/桌面/peter-world/vercel.json'
with open(vercel_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 添加留言管理的重写规则
# 把 /api/contact/messages/:id 重写到 /api/contact/messages
new_rewrite = {
    "source": "/api/contact/messages/:id",
    "destination": "/api/contact/messages"
}

# 插入到合适的位置（在 /api/:path* 前面）
rewrites = config['rewrites']
# 找到 /api/:path* 的位置
idx = None
for i, r in enumerate(rewrites):
    if r.get('source') == '/api/:path*':
        idx = i
        break

if idx is not None:
    rewrites.insert(idx, new_rewrite)
else:
    rewrites.append(new_rewrite)

# 保存
with open(vercel_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print('vercel.json 修改成功')
print('当前 rewrites:')
for r in config['rewrites']:
    print(f"  {r['source']} → {r['destination']}")
