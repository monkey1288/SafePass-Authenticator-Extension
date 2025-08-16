import React, { useState, useEffect } from 'react';
import type { TOTPAccount, AppSettings } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';

interface SettingsPageProps {
  onBack: () => void;
  accounts: TOTPAccount[];
  onRestoreAccounts: (accounts: TOTPAccount[]) => void;
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsPage({ onBack, accounts, onRestoreAccounts, onSettingsChange }: SettingsPageProps) {
  const [settings, setSettings] = useState<AppSettings>({ showSeconds: true });

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleShowSecondsChange = async (checked: boolean) => {
    const newSettings = { ...settings, showSeconds: checked };
    setSettings(newSettings);
    
    try {
      await saveSettings(newSettings);
      onSettingsChange(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('保存设置失败，请重试');
    }
  };

  const handleBackup = () => {
    try {
      const dataStr = JSON.stringify(accounts, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `safepass-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Backup failed:', error);
      alert('备份失败，请重试');
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const restoredAccounts = JSON.parse(content) as TOTPAccount[];
            
            // 验证数据格式
            if (Array.isArray(restoredAccounts) && restoredAccounts.length > 0) {
                           const isValid = restoredAccounts.every(account => 
               account.id && account.accountName && account.secret && account.issuer
             );
              
              if (isValid) {
                onRestoreAccounts(restoredAccounts);
                alert(`成功恢复 ${restoredAccounts.length} 个账号`);
              } else {
                alert('备份文件格式无效，请检查文件内容');
              }
            } else {
              alert('备份文件为空或格式错误');
            }
          } catch (error) {
            console.error('Restore failed:', error);
            alert('恢复失败，请检查文件格式');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-96 h-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-bold text-lg">设置</h1>
              <p className="text-blue-100 text-sm">SafePass 配置选项</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* 备份和恢复 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">数据管理</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">账号数量</span>
                <span className="text-blue-600 font-medium">{accounts.length} 个</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBackup}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6-4l2 2m0 0l2-2m-2 2V4" />
                  </svg>
                  <span>备份</span>
                </button>
                <button
                  onClick={handleRestore}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>恢复</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                备份文件将保存到您的下载文件夹，恢复时会智能添加新账号并跳过重复账号
              </p>
            </div>
          </div>

          {/* 显示设置 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">显示设置</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">显示秒数</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.showSeconds}
                    onChange={(e) => handleShowSecondsChange(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

  

          {/* 链接 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">更多信息</h3>
            <div className="space-y-3">
              <a
                href="https://www.safepass-authenticator.cc/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-700 group-hover:text-blue-600">隐私政策</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a
                href="https://github.com/monkey1288/SafePass-Authenticator/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 group-hover:text-green-600">反馈与支持</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* 关于 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">关于</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>SafePass Authenticator</p>
              <p>版本: 1.0.0</p>
              <p>一个安全可靠的二步验证器</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
} 