# 账户图标功能说明

## 概述
SafePass 扩展现在支持为不同的账户发行者显示自定义图标，当无法获取图标时会自动回退到首字母显示。

## 功能特性

### 1. 自动图标识别
系统会自动识别以下发行者的图标：
- **社交媒体**: Google, Facebook, Twitter, Instagram, LinkedIn, Snapchat, TikTok, WhatsApp, Discord, Reddit
- **游戏平台**: Steam, Origin, Uplay, Battle.net, Xbox, Nintendo, Epic Games
- **科技公司**: Microsoft, Apple, Samsung, GitHub
- **流媒体**: Netflix, Spotify, Twitch
- **其他服务**: Amazon, Dropbox, Slack, PayPal

### 2. 智能回退机制
- 当发行者不在预定义列表中时，显示首字母图标
- 当图标文件加载失败时，自动回退到首字母图标
- 首字母图标使用渐变紫色背景，保持视觉一致性

### 3. 性能优化
- 图标文件存储在本地 `assets/icons/` 目录中
- 使用 `object-contain` 确保图标正确显示
- 添加适当的 `alt` 属性提高可访问性

## 技术实现

### 核心函数
```typescript
// src/utils/icons.ts
export function getIssuerIconUrl(issuer: string): string | null
```

### 组件集成
```typescript
// src/components/AccountCard.tsx
import { getIssuerIconUrl } from '../utils/icons';

// 在账户图标部分使用
const iconUrl = getIssuerIconUrl(account.issuer);
```

## 使用方法

### 添加新的发行者图标
1. 将图标文件（推荐尺寸：48x48px，PNG格式）放入 `assets/icons/` 目录
2. 在 `src/utils/icons.ts` 中的 `icons` 对象中添加新条目
3. 确保键名与UI标签保持一致

### 示例
```typescript
const icons: Record<string, string> = {
  'NewService': 'assets/icons/newservice.png',
  // ... 其他图标
};
```

## 测试
运行 `test-icons.html` 文件来测试所有图标的显示效果，包括回退机制。

## 注意事项
- 图标文件名应与发行者名称匹配
- 建议使用PNG格式的透明背景图标
- 图标尺寸建议为48x48px，系统会自动缩放
- 确保图标文件路径正确，避免加载失败 