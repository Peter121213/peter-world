import json

vercel_path = 'E:/桌面/peter-world/vercel.json'
with open(vercel_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 添加精选照片的重写规则
new_rewrite = {
    'source': '/api/photos/featured',
    'destination': '/api/photos?featured=true'
}

# 插入到合适的位置
rewrites = config['rewrites']
rewrites.insert(2, new_rewrite)

with open(vercel_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print('vercel.json 修改成功')
for r in rewrites:
    print(f"  {r['source']} -> {r['destination']}")
