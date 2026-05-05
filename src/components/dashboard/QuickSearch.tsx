'use client';

import { useState } from 'react';

const favorites = [
  '품질메뉴얼',
  '문서 및 기록 관리 절차',
  '내부심사지침서',
  '제품 감사 작업표준서',
];

export default function QuickSearch() {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('전체 문서');

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Quick search */}
        <div className="flex-1">
          <div className="flex items-center gap-0 mb-1">
            <h3 className="text-sm font-semibold text-gray-700">빠른 검색</h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            >
              <option>전체 문서</option>
              <option>품질메뉴얼</option>
              <option>프로세스</option>
              <option>절차서</option>
              <option>지침서</option>
              <option>기록문서</option>
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="문서번호, 제목, 내용 검색"
              className="flex-1 text-xs border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors flex-shrink-0">
              검색
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 hidden sm:block" />

        {/* Favorites */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">즐겨찾기</h3>
          <div className="flex flex-wrap items-center gap-2">
            {favorites.map((fav) => (
              <button
                key={fav}
                className="px-2.5 py-1 text-[11px] text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full transition-colors"
              >
                {fav}
              </button>
            ))}
            <button className="w-6 h-6 flex items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-xs">
              +
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-500 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span>문서 백업 상태: <strong className="text-green-600">정상</strong> (2024-05-21 02:00)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span>시스템 상태: <strong className="text-green-600">정상</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>접속 IP: 192.168.1.100</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          <span>사용자: <strong className="text-gray-600">45명</strong> 접속 중</span>
        </div>
      </div>
    </div>
  );
}
