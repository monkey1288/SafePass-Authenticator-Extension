import React from 'react';
import type { TOTPAccount } from '../types';
import { AccountCard } from './AccountCard';

interface AccountListProps {
  accounts: TOTPAccount[];
  onDelete: (id: string) => void;
  showSeconds?: boolean;
}

export const AccountList: React.FC<AccountListProps> = ({ accounts, onDelete, showSeconds = true }) => {
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-lg font-medium mb-2">暂无账号</p>
        <p className="text-sm text-gray-400">点击右下角的"+"按钮添加您的第一个账号</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onDelete={onDelete}
          showSeconds={showSeconds}
        />
      ))}
    </div>
  );
}; 