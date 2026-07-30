import os

settings_path = 'E:/桌面/peter-world/frontend/src/pages/admin/Settings.tsx'
with open(settings_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到修改密码后清空输入框的代码，在后面加上 return
old_code = """        // 修改成功，清空输入框
        setPasswordSettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }

      await settingsApi.update(settingsToSave)"""

new_code = """        // 修改成功，清空输入框
        setPasswordSettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        setIsSaving(false)
        return
      }

      await settingsApi.update(settingsToSave)"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print('修复成功')
else:
    print('没找到目标代码')
    # 找找看
    idx = content.find('修改成功，清空输入框')
    if idx > -1:
        print('找到位置：', idx)
        print(content[idx-50:idx+300])

# 保存文件
with open(settings_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Settings.tsx 保存完成')
