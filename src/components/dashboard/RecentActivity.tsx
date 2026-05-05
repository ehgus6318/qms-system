const activities = [
  {
    user: '김영훈',
    action: '품질메뉴얼 문서를 승인했습니다.',
    time: '10분 전',
    type: '승인',
    color: 'bg-green-500',
  },
  {
    user: '이부서',
    action: '프로세스 관리 절차를 첨부했습니다.',
    time: '14분 전',
    type: '첨부',
    color: 'bg-blue-500',
  },
  {
    user: '박작업',
    action: '제품 감사 작업표준서를 등록했습니다.',
    time: '1시간 전',
    type: '등록',
    color: 'bg-purple-500',
  },
  {
    user: '홍길동',
    action: '내부심사 체크리스트를 등록했습니다.',
    time: '3시간 전',
    type: '등록',
    color: 'bg-purple-500',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">최근 활동</h3>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">대보기 &gt;</button>
      </div>
      <div className="divide-y divide-gray-50">
        {activities.map((item, i) => (
          <div key={i} className="px-4 py-2.5 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-2.5">
              {/* Avatar */}
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold mt-0.5 ${item.color}`}>
                {item.user[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-700 leading-snug">
                  <span className="font-semibold">{item.user}</span>님이{' '}
                  <span className="text-gray-600">{item.action}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] px-1 rounded text-white font-semibold ${item.color}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
