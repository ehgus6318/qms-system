interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  change: string;
  changePositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  urgent?: boolean;  // 결재 대기 강조
}

function KPICard({
  title, value, subtitle, change, changePositive,
  icon, iconBg, href, urgent,
}: KPICardProps) {
  return (
    <a
      href={href}
      className={[
        'group block bg-white rounded-xl border shadow-sm p-4 cursor-pointer',
        'card-lift select-none',
        urgent
          ? 'border-t-4 border-t-orange-400 border-x-orange-200 border-b-orange-200 kpi-urgent'
          : 'border-gray-200 hover:border-blue-200',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: text */}
        <div className="min-w-0 flex-1">
          {/* 제목 */}
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {title}
          </p>

          {/* 값 */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span
              className={[
                'text-2xl font-extrabold leading-none',
                urgent ? 'text-orange-600' : 'text-gray-900',
              ].join(' ')}
            >
              {value}
            </span>
            {urgent && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />
                주의
              </span>
            )}
          </div>

          {/* 서브타이틀 */}
          <p className="text-[11px] text-gray-400 mb-2 leading-tight">{subtitle}</p>

          {/* 전월 대비 */}
          <div className="flex items-center gap-1">
            <span
              className={[
                'text-[10px] font-semibold flex items-center gap-0.5',
                changePositive ? 'text-green-600' : 'text-red-500',
              ].join(' ')}
            >
              {changePositive ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {change}
            </span>
            <span className="text-[10px] text-gray-400">전월 대비</span>
          </div>
        </div>

        {/* Right: icon */}
        <div className="flex flex-col items-end gap-1">
          <div
            className={[
              'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
              iconBg,
              urgent ? 'ring-2 ring-orange-200' : '',
            ].join(' ')}
          >
            {icon}
          </div>
          {/* 바로가기 화살표 */}
          <span className="text-[10px] text-gray-300 group-hover:text-blue-400 transition-colors duration-200 flex items-center gap-0.5 font-medium">
            바로가기
            <svg className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function KPICards() {
  const cards: KPICardProps[] = [
    {
      title: '전체 문서',
      value: '1,248',
      subtitle: '전체 등록 문서 수',
      change: '+120',
      changePositive: true,
      iconBg: 'bg-blue-50',
      href: '/documents',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: '최신 문서',
      value: '23',
      subtitle: '최근 7일 신규 등록',
      change: '+8',
      changePositive: true,
      iconBg: 'bg-green-50',
      href: '/documents?filter=recent',
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: '결재 대기',
      value: '7',
      subtitle: '결재가 필요한 문서',
      change: '+2',
      changePositive: false,
      iconBg: 'bg-orange-50',
      href: '/approval',
      urgent: true,
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '개정 대기',
      value: '5',
      subtitle: '개정이 필요한 문서',
      change: '+1',
      changePositive: false,
      iconBg: 'bg-purple-50',
      href: '/revision',
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: '교육 일정',
      value: '3',
      subtitle: '예정된 교육 세션',
      change: '+1',
      changePositive: true,
      iconBg: 'bg-rose-50',
      href: '/training',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <KPICard key={i} {...card} />
      ))}
    </div>
  );
}
