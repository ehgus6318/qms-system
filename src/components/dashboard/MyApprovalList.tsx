// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/MyApprovalList.tsx
// 내 결재 대기 — compact 스타일, flex-1로 우측 열 잔여 높이 채움
// ─────────────────────────────────────────────────────────────────────────────

import { getStatusStyle } from '@/lib/qmsColors';

const myApprovals = [
  { name: '품질메뉴얼 개정',       ver: 'Rev.4', requester: '이부서 부장', date: '05-21', status: '결재 대기', urgent: true },
  { name: '프로세스 관리 절차',     ver: 'Rev.3', requester: '박작업 반장', date: '05-20', status: '검토 요청', urgent: false },
  { name: '제품 감사 작업표준서',   ver: 'Rev.2', requester: '최감사 대리', date: '05-19', status: '결재 대기', urgent: true },
];

export default function MyApprovalList() {
  return (
    /* flex-1 → 우측 flex-col 내에서 남은 높이를 모두 채움 */
    <div className="bg-white rounded-xl border border-orange-200 shadow-sm flex flex-col flex-1 min-h-0">

      {/* 헤더 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-orange-50 border-b border-orange-100 rounded-t-xl flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
          <h3 className="text-xs font-bold text-orange-800">내 결재 대기</h3>
          <span className="w-4 h-4 bg-orange-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center">
            {myApprovals.length}
          </span>
        </div>
        <button className="text-[10px] text-orange-600 hover:text-orange-800 font-semibold transition-colors">
          전체보기 →
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex-1 divide-y divide-gray-50 overflow-y-auto min-h-0">
        {myApprovals.map((item, i) => {
          const st = getStatusStyle(item.status);
          return (
            <button
              key={i}
              className="w-full text-left px-3.5 py-2 hover:bg-orange-50/60 transition-colors duration-150 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    {item.urgent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    )}
                    <p className="text-[11px] text-gray-800 font-semibold truncate group-hover:text-orange-700 transition-colors">
                      {item.name}
                    </p>
                    <span className="text-[9px] text-gray-400 font-mono flex-shrink-0">{item.ver}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {item.requester}
                    <span className="mx-1 text-gray-200">|</span>
                    {item.date}
                  </p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 mt-0.5 ${st.badge}`}>
                  {item.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 결재함 바로가기 */}
      <div className="px-3.5 py-2 border-t border-orange-100 bg-orange-50/30 rounded-b-xl flex-shrink-0">
        <button className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-[11px] font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          결재함 바로가기
        </button>
      </div>
    </div>
  );
}
