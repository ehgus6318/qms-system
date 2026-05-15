// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/QuickAccess.tsx
// 빠른 작업 바로가기 (DMS 중심)
// ─────────────────────────────────────────────────────────────────────────────

interface QuickButton {
  label: string;
  badge?: number;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  href: string;
}

const quickButtons: QuickButton[] = [
  {
    label: '결재 대기',
    badge: 7,
    href: '/approvals',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    hoverColor: 'hover:bg-orange-100 hover:border-orange-300 hover:shadow-orange-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: '개정 요청',
    badge: 5,
    href: '/revisions',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    hoverColor: 'hover:bg-purple-100 hover:border-purple-300 hover:shadow-purple-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    label: '내 문서함',
    href: '/documents/my',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    hoverColor: 'hover:bg-blue-100 hover:border-blue-300 hover:shadow-blue-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    label: '요청 문서',
    href: '/approvals/requested',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    hoverColor: 'hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-indigo-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: '즐겨찾기',
    href: '/documents/favorites',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    hoverColor: 'hover:bg-amber-100 hover:border-amber-300 hover:shadow-amber-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    label: '문서 검색',
    href: '/documents',
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    hoverColor: 'hover:bg-gray-100 hover:border-gray-300 hover:shadow-gray-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

export default function QuickAccess() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">빠른 작업</h3>
        <button className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">편집</button>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {quickButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              className={[
                'relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border',
                'transition-all duration-150 active:scale-95 shadow-sm btn-ripple',
                btn.color,
                btn.hoverColor,
              ].join(' ')}
            >
              {btn.badge !== undefined && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {btn.badge}
                </span>
              )}
              {btn.icon}
              <span className="text-[10px] font-semibold leading-tight text-center">{btn.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="px-3 pb-3 mt-auto">
        <a
          href="/documents/new"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm shadow-blue-200 btn-ripple"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          신규 문서 등록
        </a>
      </div>
    </div>
  );
}
