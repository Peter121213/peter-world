import json

vercel_path = 'E:/桌面/peter-world/vercel.json'
with open(vercel_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 添加随笔详情的重写规则
new_rewrite = {
    'source': '/api/blog/:id',
    'destination': '/api/blog'
}

rewrites = config['rewrites']
# 插入到 /api/:path* 前面
idx = None
for i, r in enumerate(rewrites):
    if r.get('source') == '/api/:path*':
        idx = i
        break

if idx is not None:
    rewrites.insert(idx, new_rewrite)
else:
    rewrites.append(new_rewrite)

with open(vercel_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print('vercel.json 修改成功')
for r in rewrites:
    print(f"  {r['source']} -> {r['destination']}")
