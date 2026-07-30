import os
import json

vercel_path = 'E:/桌面/peter-world/vercel.json'
with open(vercel_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 添加 verify 的重写规则
new_rewrite = {
    "source": "/api/auth/verify",
    "destination": "/api/auth/login"
}

# 插入到 rewrites 列表的前面
rewrites = config['rewrites']
rewrites.insert(0, new_rewrite)

# 保存
with open(vercel_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print('vercel.json 修改成功')
print('当前 rewrites:')
for r in config['rewrites']:
    print(f"  {r['source']} → {r['destination']}")
