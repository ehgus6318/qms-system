const trainings = [
  {
    title: 'ISO 9001:2015 내부심사자 교육',
    date: '2024-06-25',
    time: '14:00',
    type: '심사',
    color: 'bg-blue-500',
  },
  {
    title: 'QMS 문서관리 시스템 교육',
    date: '2024-05-30',
    time: '10:00',
    type: '시스템',
    color: 'bg-green-500',
  },
  {
    title: '품질관리 기본 교육',
    date: '2024-06-30',
    time: '14:00',
    type: '기본',
    color: 'bg-purple-500',
  },
];

export default function TrainingSchedule() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">교육 일정</h3>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">대보기 &gt;</button>
      </div>
      <div className="divide-y divide-gray-50">
        {trainings.map((item, i) => (
          <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-start gap-2.5">
              <div className={`w-1 h-full min-h-[40px] rounded-full flex-shrink-0 ${item.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-700 font-medium leading-snug mb-1">{item.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{item.date} {item.time}</span>
                  <span className={`px-1 rounded text-[9px] font-semibold text-white ${item.color}`}>
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
