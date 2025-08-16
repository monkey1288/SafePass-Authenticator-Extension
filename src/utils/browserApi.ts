/**
 * Browser API compatibility layer
 * Handles differences between Chrome, Firefox, Edge and Safari extension APIs
 */

// Firefox browser namespace type definition
declare const browser: typeof chrome;

// Helper to check browser type
const isFirefox = typeof browser !== 'undefined';
// Edge uses the chrome namespace but may have different behaviors in some cases
const isEdge = !isFirefox && navigator.userAgent.includes('Edg');
// Safari has specific extension API behaviors
const isSafari = !isFirefox && !isEdge && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');

// Storage API compatibility
export const storage = {
  local: {
    get: async (keys: string | string[] | object | null) => {
      if (isFirefox) {
        return browser.storage.local.get(keys);
      }
      // Chrome, Edge and Safari all use chrome namespace for extensions
      return chrome.storage.local.get(keys);
    },
    set: async (items: object) => {
      if (isFirefox) {
        return browser.storage.local.set(items);
      }
      // Chrome, Edge and Safari all use chrome namespace for extensions
      return chrome.storage.local.set(items);
    }
  }
};

// Runtime API compatibility
export const runtime = {
  getURL: (path: string): string => {
    if (isFirefox) {
      return browser.runtime.getURL(path);
    }
    // Chrome, Edge and Safari all use chrome namespace for extensions
    return chrome.runtime.getURL(path);
  }
}; 