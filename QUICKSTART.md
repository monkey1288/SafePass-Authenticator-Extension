# SafePass Authenticator - 快速启动指南

## 🚀 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```

### 3. 在Chrome中加载扩展
1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `build/chrome-mv3-dev` 文件夹

### 4. 测试扩展
1. 点击Chrome工具栏中的SafePass图标
2. 点击右下角的"+"按钮添加新账号
3. 选择"手动输入"或"二维码"方式
4. 输入账号信息并保存

## 📱 功能特性

- ✅ **实时TOTP生成**: 每30秒自动更新6位验证码
- ✅ **多种添加方式**: 支持手动输入和二维码识别
- ✅ **本地存储**: 所有数据安全存储在浏览器本地
- ✅ **一键复制**: 点击即可复制验证码到剪贴板
- ✅ **进度条显示**: 直观显示验证码剩余有效时间
- ✅ **现代化UI**: 基于Tailwind CSS的响应式设计

## 🔧 开发命令

```bash
# 开发模式
pnpm dev

# 生产构建
pnpm build

# 打包扩展
pnpm package
```

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── AccountCard.tsx # 账号卡片组件
│   ├── AccountList.tsx # 账号列表组件
│   └── AddAccountModal.tsx # 添加账号模态框
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
│   ├── totp.ts        # TOTP生成逻辑
│   ├── storage.ts     # 存储操作
│   └── qr.ts          # 二维码解析
└── popup.tsx          # 主弹窗界面
```

## 🧪 测试TOTP功能

打开 `test-example.html` 文件来测试TOTP生成功能：
- 输入任意密钥字符串
- 点击"Generate TOTP"按钮
- 观察6位验证码和倒计时

## 🔐 支持的格式

- Google Authenticator QR码
- Authy QR码
- 手动密钥输入
- otpauth:// URL格式

## 🚨 注意事项

- 所有数据仅存储在浏览器本地
- 请妥善保管您的密钥信息
- 建议定期备份重要账号
- 扩展需要"存储"和"剪贴板写入"权限

## 🆘 常见问题

**Q: 扩展无法加载？**
A: 确保已开启Chrome开发者模式，并选择正确的构建文件夹

**Q: TOTP码不更新？**
A: 检查浏览器是否允许扩展运行，确保没有阻止JavaScript执行

**Q: 无法复制验证码？**
A: 确保扩展有"剪贴板写入"权限

## 📞 获取帮助

如果遇到问题，请：
1. 检查Chrome控制台是否有错误信息
2. 确认所有依赖已正确安装
3. 尝试重新构建项目
4. 查看项目README获取更多信息 