import { getStatusStyle } from '@/lib/qmsColors';

const myApprovals = [
  { name: '품질메뉴얼 개정', ver: 'Rev.4', requester: '이부서 부장', date: '05-21', status: '결재 대기', urgent: true },
  { name: '프로세스 관리 절차', ver: 'Rev.3', requester: '박작업 반장', date: '05-20', status: '검토 요청', urgent: false },
  { name: '제품 감사 작업표준서', ver: 'Rev.2', requester: '최감사 대리', date: '05-19', status: '결재 대기', urgent: true },
];

export default function MyApprovalList() {
  return (
    <div className="bg-white rounded-xl border border-orange-200 shadow-sm">
      {/* 헤더 - 오렌지 강조 */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-orange-50 border-b border-orange-100 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
            <h3 className="text-xs font-bold text-orange-800">내 결재 대기</h3>
          </div>
          <span className="w-5 h-5 bg-orange-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
            {myApprovals.length}
          </span>
        </div>
        <button className="text-[10px] text-orange-600 hover:text-orange-800 font-semibold transition-colors">
          전체보기 →
        </button>
      </div>

      {/* 리스트 */}
      <div className="divide-y divide-gray-50">
        {myApprovals.map((item, i) => {
          const st = getStatusStyle(item.status);
          return (
            <button
              key={i}
              className="w-full text-left px-4 py-2.5 hover:bg-orange-50/60 transition-colors duration-150 group btn-ripple"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {item.urgent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    )}
                    <p className="text-xs text-gray-800 font-semibold truncate group-hover:text-orange-700 transition-colors">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">{item.ver}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-0">
                    요청자: <span className="text-gray-600">{item.requester}</span>
                    <span className="mx-1.5 text-gray-200">|</span>
                    {item.date}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${st.badge}`}>
                  {item.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 빠른 처리 버튼 */}
      <div className="px-4 py-2.5 border-t border-orange-100 bg-orange-50/30 rounded-b-xl">
        <button className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 btn-ripple">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          결재함 바로가기
        </button>
      </div>
    </div>
  );
}
