const categories = [
  { label: '매뉴얼',   count: 23,  color: 'bg-blue-400' },
  { label: '프로세스', count: 156, color: 'bg-green-400' },
  { label: '절차서',   count: 342, color: 'bg-purple-400' },
  { label: '지침서',   count: 289, color: 'bg-amber-400' },
  { label: '운영문서', count: 276, color: 'bg-teal-400' },
  { label: '서식',     count: 98,  color: 'bg-red-400' },
  { label: '기록문서', count: 45,  color: 'bg-indigo-400' },
  { label: '외부문서', count: 19,  color: 'bg-gray-400' },
];

export default function DocumentTree() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">문서 분류</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        {/* Root node */}
        <div className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded hover:bg-gray-50 cursor-pointer">
          <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
            <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
          </svg>
          <span className="text-xs font-semibold text-gray-700">DMS</span>
        </div>

        {/* Categories */}
        <div className="pl-4 space-y-0.5">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${cat.color}`} />
                <span className="text-xs text-gray-600 group-hover:text-blue-700">{cat.label}</span>
              </div>
              <span className="text-xs font-medium text-gray-400 group-hover:text-blue-600">
                {cat.count}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between px-2">
          <span className="text-xs font-medium text-gray-500">전체</span>
          <span className="text-xs font-bold text-gray-700">
            {categories.reduce((s, c) => s + c.count, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
