// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/NoticeBoard.tsx
// 공지사항 — 5개 표시, compact, h-full (page.tsx에서 h-[350px] wrapper 적용)
// ─────────────────────────────────────────────────────────────────────────────

type Notice = {
  id: number;
  title: string;
  date: string;
  isNew: boolean;
  category: '시스템' | '일정' | '정책' | '교육' | '안내';
  important?: boolean;
};

const CATEGORY_STYLE: Record<Notice['category'], string> = {
  시스템: 'bg-red-100 text-red-700',
  일정:   'bg-blue-100 text-blue-700',
  정책:   'bg-purple-100 text-purple-700',
  교육:   'bg-green-100 text-green-700',
  안내:   'bg-gray-100 text-gray-600',
};

// ★ 5개만 정의 (slice 없이 직접 제한)
const notices: Notice[] = [
  { id: 1, title: 'DMS 시스템 정기 점검 안내 (5월 25일 02:00–06:00)',  date: '2024-05-20', isNew: true,  category: '시스템', important: true },
  { id: 2, title: '2025년 2분기 문서 정기 검토 일정 공지',              date: '2024-05-18', isNew: true,  category: '일정' },
  { id: 3, title: '문서 분류 체계 개편 안내 — 기존 분류 코드 변경',     date: '2024-05-15', isNew: false, category: '정책' },
  { id: 4, title: '신규 개정 절차 가이드라인 배포 (v2.1)',               date: '2024-05-10', isNew: false, category: '안내' },
  { id: 5, title: '문서관리 우수 사례 공유 세션 — 5월 28일 14:00',      date: '2024-05-08', isNew: false, category: '교육' },
];

const newCount = notices.filter((n) => n.isNew).length;

export default function NoticeBoard() {
  return (
    /* h-full → page.tsx의 h-[350px] wrapper를 꽉 채움 */
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 leading-tight">공지사항</h3>
            {newCount > 0 && (
              <p className="text-[10px] text-blue-600 font-medium leading-tight">새 공지 {newCount}건</p>
            )}
          </div>
        </div>
        <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 transition-colors">
          전체보기
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* 목록 — flex-1 + overflow-y-auto로 카드 높이 초과 시 스크롤 */}
      <div className="flex-1 divide-y divide-gray-50 overflow-y-auto min-h-0">
        {notices.map((item) => (
          <button
            key={item.id}
            className={[
              'w-full text-left px-4 py-2.5 transition-colors duration-150 group',
              item.important ? 'hover:bg-red-50' : 'hover:bg-gray-50',
            ].join(' ')}
          >
            <div className="flex items-start gap-2">
              {/* 아이콘 */}
              {item.important ? (
                <div className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-[7px] font-black">!</span>
                </div>
              ) : (
                <div className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors" />
              )}

              <div className="flex-1 min-w-0">
                {/* 제목 */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  {item.isNew && (
                    <span className="flex-shrink-0 px-1 py-px text-[7px] font-extrabold bg-red-500 text-white rounded-sm leading-tight tracking-wide">
                      NEW
                    </span>
                  )}
                  <p className={[
                    'text-xs leading-snug truncate transition-colors',
                    item.important
                      ? 'font-semibold text-gray-900 group-hover:text-red-700'
                      : 'font-medium text-gray-700 group-hover:text-blue-700',
                  ].join(' ')}>
                    {item.title}
                  </p>
                </div>
                {/* 메타 */}
                <div className="flex items-center gap-1.5">
                  <span className={`px-1 py-px text-[9px] font-semibold rounded ${CATEGORY_STYLE[item.category]}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-400 tabular-nums">{item.date}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/60 rounded-b-xl flex-shrink-0">
        <span className="text-[10px] text-gray-400">총 {notices.length}건 표시</span>
        <button className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold transition-colors">
          공지 등록 +
        </button>
      </div>
    </div>
  );
}
