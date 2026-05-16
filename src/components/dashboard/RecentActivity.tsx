// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/RecentActivity.tsx
// 최근 활동 — 5개 표시, 타임라인, compact, h-full (page.tsx에서 h-[350px] wrapper 적용)
// ─────────────────────────────────────────────────────────────────────────────

type ActivityType = '승인' | '반려' | '등록' | '첨부' | '개정' | '검토';

type Activity = {
  user: string;
  avatarColor: string;
  docName: string;
  time: string;
  timeGroup: string;
  type: ActivityType;
};

const TYPE_STYLE: Record<ActivityType, { badge: string; dot: string }> = {
  승인: { badge: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  반려: { badge: 'bg-red-100 text-red-700',        dot: 'bg-red-500' },
  등록: { badge: 'bg-purple-100 text-purple-700',  dot: 'bg-purple-500' },
  첨부: { badge: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  개정: { badge: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500' },
  검토: { badge: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500' },
};

// ★ 5개만 정의 (slice 없이 직접 제한)
const activities: Activity[] = [
  { user: '김영훈', avatarColor: 'bg-blue-600',   type: '승인', docName: '품질메뉴얼 Rev.4',         time: '10분 전',  timeGroup: '오늘' },
  { user: '이수진', avatarColor: 'bg-teal-600',   type: '첨부', docName: '프로세스 관리 절차 Rev.3', time: '14분 전',  timeGroup: '오늘' },
  { user: '박준혁', avatarColor: 'bg-purple-600', type: '반려', docName: '수입검사 지침서 Rev.1',    time: '32분 전',  timeGroup: '오늘' },
  { user: '한상우', avatarColor: 'bg-green-700',  type: '검토', docName: '제품 운영 작업표준서',     time: '1시간 전', timeGroup: '오늘' },
  { user: '최민지', avatarColor: 'bg-rose-600',   type: '개정', docName: '문서 및 기록 관리 절차',  time: '어제',     timeGroup: '어제' },
];

// 날짜 그룹
const grouped: { group: string; items: Activity[] }[] = [];
for (const act of activities) {
  const last = grouped[grouped.length - 1];
  if (last && last.group === act.timeGroup) last.items.push(act);
  else grouped.push({ group: act.timeGroup, items: [act] });
}

const todayCount = activities.filter((a) => a.timeGroup === '오늘').length;

export default function RecentActivity() {
  return (
    /* h-full → page.tsx의 h-[350px] wrapper를 꽉 채움 */
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 leading-tight">최근 활동</h3>
            <p className="text-[10px] text-gray-400 font-medium leading-tight">오늘 {todayCount}건</p>
          </div>
        </div>
        <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 transition-colors">
          전체보기
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* 타임라인 — flex-1 + overflow-y-auto로 카드 높이 초과 시 스크롤 */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2 space-y-3">
        {grouped.map(({ group, items }) => (
          <div key={group}>
            {/* 날짜 구분선 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{group}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* 아이템 */}
            <div className="relative space-y-0">
              {/* 수직 연결선 */}
              {items.length > 1 && (
                <div className="absolute left-[14px] top-3 bottom-3 w-px bg-gray-100" />
              )}

              {items.map((item, i) => {
                const style = TYPE_STYLE[item.type];
                return (
                  <div
                    key={i}
                    className="relative flex items-center gap-2.5 py-1.5 group cursor-pointer"
                  >
                    {/* 아바타 */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className={[
                        'w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold',
                        'ring-2 ring-white shadow-sm transition-transform group-hover:scale-105',
                        item.avatarColor,
                      ].join(' ')}>
                        {item.user[0]}
                      </div>
                      {/* 타입 도트 */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${style.dot}`} />
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {item.user}
                        </span>
                        <span className={`px-1 py-px text-[8px] font-bold rounded ${style.badge}`}>
                          {item.type}
                        </span>
                        <span className="text-[9px] text-gray-400 tabular-nums ml-auto flex-shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate leading-tight" title={item.docName}>
                        {item.docName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/60 rounded-b-xl flex-shrink-0">
        <span className="text-[10px] text-gray-400">최근 {activities.length}건 표시</span>
        <button className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold transition-colors">
          활동 로그 전체보기 →
        </button>
      </div>
    </div>
  );
}
