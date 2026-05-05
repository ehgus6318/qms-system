import { getStatusStyle } from '@/lib/qmsColors';

const approvals = [
  { name: '품질메뉴얼 개정 (Rev.4)',         no: 'QMS-M-001',  author: '김영훈', date: '2024-05-21', status: '결재 대기' },
  { name: '프로세스 관리 절차 (Rev.3)',       no: 'QMS-P-001',  author: '이부서', date: '2024-05-21', status: '검토 중' },
  { name: '내부심사지침서 (Rev.2)',           no: 'QMS-I-001',  author: '최감사', date: '2024-05-20', status: '결재 대기' },
  { name: '제품 감사 작업표준서 (Rev.2)',     no: 'QMS-WI-001', author: '박작업', date: '2024-05-19', status: '승인 대기' },
  { name: '수입검사 기준서 (Rev.2)',          no: 'QMS-IN-001', author: '최감사', date: '2024-05-19', status: '반려' },
];

export default function ApprovalProgress() {
  return (
    <div className="bg-white rounded-xl border-l-4 border-l-orange-400 border-t border-r border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">결재 진행 현황</h3>
          <span className="w-5 h-5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full flex items-center justify-center">
            {approvals.length}
          </span>
        </div>
        <button className="text-xs text-orange-600 hover:text-orange-800 font-semibold transition-colors">
          대보기 →
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {approvals.map((item, i) => {
          const st = getStatusStyle(item.status);
          const isPending = item.status === '결재 대기';
          return (
            <button
              key={i}
              className={[
                'w-full text-left px-4 py-2.5 transition-colors duration-150 group btn-ripple',
                isPending ? 'hover:bg-orange-50' : 'hover:bg-gray-50',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={[
                  'text-xs font-semibold leading-tight truncate flex-1 transition-colors',
                  isPending ? 'text-gray-800 group-hover:text-orange-700' : 'text-gray-700 group-hover:text-blue-700',
                ].join(' ')}>
                  {isPending && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-1 mb-0.5 animate-pulse" />
                  )}
                  {item.name}
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${st.badge}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 pl-0">
                <span className="font-mono text-blue-500 font-medium">{item.no}</span>
                <span className="text-gray-200">|</span>
                <span>{item.author}</span>
                <span className="text-gray-200">|</span>
                <span className="tabular-nums">{item.date}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
