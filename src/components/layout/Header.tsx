'use client';

import { useState } from 'react';

interface HeaderProps {
  title?: string;
  breadcrumb?: string;
}

export default function Header({
  title = '대시보드',
  breadcrumb = 'QMS 홈 > 대시보드',
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0 z-10 shadow-sm">
      {/* Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 flex-shrink-0 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <div className="text-base font-bold text-gray-800 leading-tight">{title}</div>
          <div className="text-[11px] text-gray-400 leading-tight">{breadcrumb}</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="문서번호, 제목, 내용, 키워드 검색 (Ctrl + K)"
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-shadow"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1 ml-auto flex-shrink-0">
        {/* 결재 */}
        <button className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>결재</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">7</span>
        </button>

        {/* 알림 */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">1</span>
        </button>

        {/* 도움말 */}
        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>도움말</span>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User */}
        <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">김</span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-medium text-gray-800 leading-tight">김영훈</div>
            <div className="text-[10px] text-gray-400 leading-tight">IT팀</div>
          </div>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
