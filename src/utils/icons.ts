// 使用 Plasmo 框架推荐的导入方式
// 参考: https://docs.plasmo.com/framework/assets
import { runtime } from './browserApi';

// 图标映射表 - 使用相对路径，通过 runtime.getURL 获取完整路径
const icons: Record<string, string> = {
  'Google': 'assets/icons/google.png',
  'Facebook': 'assets/icons/facebook.png',
  'Twitter': 'assets/icons/twitter.png',
  'GitHub': 'assets/icons/github.png',
  'LinkedIn': 'assets/icons/linkedin.png',
  'Instagram': 'assets/icons/instagram.png',
  'Microsoft': 'assets/icons/microsoft.png',
  'Dropbox': 'assets/icons/dropbox.png',
  'Slack': 'assets/icons/slack.png',
  'Amazon': 'assets/icons/amazon.png',
  'Twitch': 'assets/icons/twitch.png',
  'Snapchat': 'assets/icons/snapchat.png',
  'WhatsApp': 'assets/icons/whatsapp.png',
  'PayPal': 'assets/icons/paypal.png',
  'TikTok': 'assets/icons/tiktok.png',
  'Netflix': 'assets/icons/netflix.png',
  'Spotify': 'assets/icons/spotify.png',
  'Discord': 'assets/icons/discord.png',
  'Reddit': 'assets/icons/reddit.png',
  'Steam': 'assets/icons/steam.png',
  'Origin': 'assets/icons/origin.png',
  'Uplay': 'assets/icons/uplay.png',
  'Battle.net': 'assets/icons/battle_net.png',
  'Xbox': 'assets/icons/xbox.png',
  'Nintendo': 'assets/icons/nintendo.png',
  'Apple': 'assets/icons/apple.png',
  'Samsung': 'assets/icons/samsung.png',
  'Epic Games': 'assets/icons/epic_games.png'
};

/**
 * 根据发行者名称获取对应的图标URL
 * @param issuer 发行者名称
 * @returns 图标URL或null（如果没有找到对应图标）
 */
export function getIssuerIconUrl(issuer: string): string | null {
  const iconPath = icons[issuer];
  if (!iconPath) return null;
  
  // 使用 runtime.getURL 获取完整的图标URL
  try {
    return runtime.getURL(iconPath);
  } catch (error) {
    console.warn('Failed to get icon URL:', error);
    return null;
  }
} 