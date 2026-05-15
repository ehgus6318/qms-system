'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/usersData';
import { isAdmin, canManageUsers } from '@/lib/authUtils';

interface HeaderProps {
  title?: string;
  breadcrumb?: string;
}

export default function Header({
  title = '대시보드',
  breadcrumb = 'DMS 홈 > 대시보드',
}: HeaderProps) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const admin = isAdmin(currentUser);
  const canManage = canManageUsers(currentUser);

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

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {/* 아바타 */}
            <div className={`w-7 h-7 rounded-full ${currentUser?.avatarColor ?? 'bg-blue-500'} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-xs font-bold">
                {currentUser?.avatarInitials ?? '?'}
              </span>
            </div>
            {/* 이름 + 부서 */}
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-800 leading-tight">
                  {currentUser?.name ?? '사용자'}
                </span>
                {admin && (
                  <span className="px-1 py-px text-[9px] font-bold bg-red-100 text-red-600 rounded leading-none">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 leading-tight">
                {currentUser?.departmentName ?? ''} · {currentUser?.position ?? ''}
              </div>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 드롭다운 메뉴 */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
              {/* 사용자 정보 헤더 */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${currentUser?.avatarColor ?? 'bg-blue-500'} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{currentUser?.avatarInitials ?? '?'}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">{currentUser?.name}</span>
                      {admin && (
                        <span className="px-1.5 py-px text-[9px] font-bold bg-red-100 text-red-600 rounded">ADMIN</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{currentUser?.email}</div>
                    <div className="text-[11px] text-gray-400">
                      {currentUser?.departmentName} · {currentUser?.jobTitle}
                    </div>
                    {currentUser && (
                      <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                        {ROLE_LABELS[currentUser.role]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 메뉴 항목 */}
              <div className="py-1">
                <button
                  onClick={() => { setDropdownOpen(false); /* TODO: /settings/profile */ }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>내 프로필</span>
                  <span className="ml-auto text-[10px] text-gray-300">준비 중</span>
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); /* TODO: /settings/account */ }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>계정 설정</span>
                  <span className="ml-auto text-[10px] text-gray-300">준비 중</span>
                </button>
                {canManage && (
                  <button
                    onClick={() => { setDropdownOpen(false); router.push('/system/users'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>사용자 관리</span>
                  </button>
                )}
                {admin && (
                  <button
                    onClick={() => { setDropdownOpen(false); router.push('/system/users'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>시스템 관리</span>
                  </button>
                )}
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
