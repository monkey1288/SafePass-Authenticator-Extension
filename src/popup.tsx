import React, { useState, useEffect } from 'react';
import type { TOTPAccount, AddAccountData, AppSettings } from './types';
import { loadAccounts, addAccount, deleteAccount, loadSettings } from './utils/storage';
import { AccountList } from './components/AccountList';
import { AddAccountModal } from './components/AddAccountModal';
import { SettingsPage } from './components/SettingsPage';
import './style.css';
// import iconImage from "data-base64:~assets/icon.png";

export default function IndexPopup() {
  const [accounts, setAccounts] = useState<TOTPAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');
  const [settings, setSettings] = useState<AppSettings>({ showSeconds: true });

  useEffect(() => {
    loadAccountsData();
    loadSettingsData();
  }, []);

  const loadAccountsData = async () => {
    try {
      const loadedAccounts = await loadAccounts();
      setAccounts(loadedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettingsData = async () => {
    try {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleAddAccount = async (data: AddAccountData) => {
    try {
      await addAccount(data);
      await loadAccountsData(); // Reload the accounts
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Failed to add account. Please try again.');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleRestoreAccounts = async (restoredAccounts: TOTPAccount[]) => {
    try {
      // 检查是否有重复账号（基于账号名和发行者）
      const existingAccounts = new Set(
        accounts.map(account => `${account.accountName}-${account.issuer}`)
      );
      
      const newAccounts = [];
      const duplicateAccounts = [];
      
      for (const account of restoredAccounts) {
        const accountKey = `${account.accountName}-${account.issuer}`;
        if (existingAccounts.has(accountKey)) {
          duplicateAccounts.push(account);
        } else {
          newAccounts.push(account);
        }
      }
      
      // 只添加新的账号
      for (const account of newAccounts) {
        await addAccount({
          accountName: account.accountName,
          issuer: account.issuer,
          secret: account.secret
        });
      }
      
      // 重新加载账号列表
      await loadAccountsData();
      
      // 显示恢复结果
      if (newAccounts.length > 0) {
        if (duplicateAccounts.length > 0) {
          alert(`成功恢复 ${newAccounts.length} 个新账号，跳过 ${duplicateAccounts.length} 个重复账号`);
        } else {
          alert(`成功恢复 ${newAccounts.length} 个账号`);
        }
      } else if (duplicateAccounts.length > 0) {
        alert(`所有账号都已存在，未添加重复账号`);
      }
    } catch (error) {
      console.error('Error restoring accounts:', error);
      alert('恢复账号失败，请重试');
    }
  };

  if (isLoading) {
    return (
      <div className="w-[500px] h-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading SafePass...</p>
        </div>
      </div>
    );
  }

  // 如果当前页面是设置页面，显示设置页面
  if (currentPage === 'settings') {
    return (
      <SettingsPage 
        onBack={() => setCurrentPage('main')} 
        accounts={accounts}
        onRestoreAccounts={handleRestoreAccounts}
        onSettingsChange={handleSettingsChange}
      />
    );
  }

  // 主页面
  return (
    <div className="w-[500px] h-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <img src={chrome.runtime.getURL("assets/icon.png")} alt="SafePass Icon" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">SafePass Authenticator</h1>
              <p className="text-blue-100 text-sm">Secure 2FA Management</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('settings')}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            title="设置"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AccountList
          accounts={accounts}
          onDelete={handleDeleteAccount}
          showSeconds={settings.showSeconds}
        />
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 flex items-center justify-center"
        title="Add new account"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAccount}
      />
    </div>
  );
}
