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
    href: '/approval',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    hoverColor: 'hover:bg-orange-100 hover:border-orange-300 hover:shadow-orange-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: '검토 요청',
    badge: 2,
    href: '/review',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    hoverColor: 'hover:bg-blue-100 hover:border-blue-300 hover:shadow-blue-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: '개정 대기',
    badge: 1,
    href: '/revision',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    hoverColor: 'hover:bg-purple-100 hover:border-purple-300 hover:shadow-purple-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    label: '교육 대기',
    href: '/training',
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    hoverColor: 'hover:bg-teal-100 hover:border-teal-300 hover:shadow-teal-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: '내 문서함',
    href: '/my-docs',
    color: 'text-green-600 bg-green-50 border-green-200',
    hoverColor: 'hover:bg-green-100 hover:border-green-300 hover:shadow-green-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    label: '문서 검색',
    href: '/search',
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
        <h3 className="text-sm font-semibold text-gray-800">업무 바로가기</h3>
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
          신규문서 등록
        </a>
      </div>
    </div>
  );
}
