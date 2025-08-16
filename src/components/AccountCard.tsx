import React, { useState, useEffect } from 'react';
import type { TOTPAccount } from '../types';
import { getTOTPInfo } from '../utils/totp';
import { deleteAccount } from '../utils/storage';
import { getIssuerIconUrl } from '../utils/icons';

interface AccountCardProps {
  account: TOTPAccount;
  onDelete: (id: string) => void;
  showSeconds?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onDelete, showSeconds = true }) => {
  const [totpInfo, setTotpInfo] = useState(() => getTOTPInfo(account.secret));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotpInfo(getTOTPInfo(account.secret));
    }, 1000);

    return () => clearInterval(interval);
  }, [account.secret]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(totpInfo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${account.accountName}?`)) {
      onDelete(account.id);
    }
  };

  const progressPercentage = (totpInfo.remainingTime / totpInfo.totalTime) * 100;
  const radius = 14; // Reduced radius to avoid clipping
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Truncate account name if too long
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 min-h-[200px]">
      {/* Top Row - Account Icon + Info + Progress */}
      <div className="flex items-start justify-between mb-4">
        {/* Left - Account Icon + Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Account Icon - Shows actual icon or falls back to first letter */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
            {(() => {
              const iconUrl = getIssuerIconUrl(account.issuer);
              if (iconUrl) {
                return (
                  <img 
                    src={iconUrl} 
                    alt={`${account.issuer} icon`}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      // Fallback to default icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                );
              }
              return null;
            })()}
            {/* Fallback icon with first letter */}
            <div 
              className={`w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center ${
                getIssuerIconUrl(account.issuer) ? 'hidden' : 'flex'
              }`}
            >
              <span className="text-lg font-bold text-white">
                {account.issuer.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Account Info - Limited width to prevent overlap */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-base font-bold text-gray-900 mb-1 truncate" title={account.accountName}>
              {truncateText(account.accountName, 20)}
            </span>
            <span className="text-sm text-gray-500 truncate" title={account.issuer}>
              {truncateText(account.issuer, 25)}
            </span>
          </div>
        </div>

        {/* Right - Progress Indicator - Adjusted size and positioning */}
        <div className="relative flex-shrink-0 ml-2">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 32 32">
            <path
              d="M16 2
                a 14 14 0 0 1 0 28
                a 14 14 0 0 1 0 -28"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="transparent"
            />
            <path
              d="M16 2
                a 14 14 0 0 1 0 28
                a 14 14 0 0 1 0 -28"
              r={radius}
              stroke="#3b82f6"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          {showSeconds && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {Math.ceil(totpInfo.remainingTime / 1000)}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row - TOTP Code */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-0.5">
          {totpInfo.code.split('').map((digit, index) => (
            <div
              key={index}
              className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-inner border border-gray-200"
            >
              <span className="text-xl font-mono font-bold text-gray-800">
                {digit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row - Action Buttons */}
      <div className="flex justify-center space-x-3">
         {/* Delete button */}
         <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-md"
          title="Delete account"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-white">Delete</span>
        </button>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-md"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-white">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <span className="text-sm font-medium text-white">Copy</span>
            </>
          )}
        </button>
        
       
      </div>
    </div>
  );
}; 