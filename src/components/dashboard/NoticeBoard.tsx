const notices = [
  { title: '2024년 2분기 내부심사 일정 안내', date: '2024-05-20', isNew: true },
  { title: 'QMS 시스템 점검 만내 (5/25)', date: '2024-05-18', isNew: true },
  { title: 'ISO 9001:2015 개정사항 교육 안내', date: '2024-05-15', isNew: false },
  { title: '신입 감사 사원입사 QMS 교육 일정', date: '2024-05-10', isNew: false },
  { title: '품질관리 우수사례 발표 안내', date: '2024-05-08', isNew: false },
];

export default function NoticeBoard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">공지사항</h3>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">대보기 &gt;</button>
      </div>
      <div className="divide-y divide-gray-50">
        {notices.map((item, i) => (
          <div
            key={i}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-2 mb-0.5">
              {item.isNew && (
                <span className="flex-shrink-0 mt-0.5 px-1 py-0 text-[8px] font-bold bg-red-500 text-white rounded leading-tight">
                  NEW
                </span>
              )}
              <p className="text-xs text-gray-700 leading-snug line-clamp-1">{item.title}</p>
            </div>
            <p className="text-[10px] text-gray-400 pl-0">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
