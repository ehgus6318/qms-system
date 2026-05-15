// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/FavoriteDocuments.tsx
// 즐겨찾기 문서 위젯 (Dashboard)
// ─────────────────────────────────────────────────────────────────────────────

const favorites = [
  {
    no: 'QP-2024-001',
    title: '품질경영 시스템 운영 절차서',
    version: 'v3.1',
    status: '승인',
    statusColor: 'bg-green-100 text-green-700',
    category: '절차서',
  },
  {
    no: 'WI-2024-001',
    title: '수입검사 작업지침서',
    version: 'v1.2',
    status: '검토중',
    statusColor: 'bg-blue-100 text-blue-700',
    category: '지침서',
  },
  {
    no: 'QP-2024-002',
    title: '문서 및 기록 관리 절차서',
    version: 'v2.0',
    status: '승인',
    statusColor: 'bg-green-100 text-green-700',
    category: '절차서',
  },
];

export default function FavoriteDocuments() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-700">즐겨찾기 문서</h3>
        </div>
        <a href="/documents/favorites" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          전체보기 &gt;
        </a>
      </div>
      <div className="divide-y divide-gray-50">
        {favorites.map((item, i) => (
          <a
            key={i}
            href={`/documents/${item.no}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] text-gray-400 font-mono">{item.no}</span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">{item.version}</span>
              </div>
              <p className="text-xs text-gray-700 font-medium leading-snug truncate">{item.title}</p>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${item.statusColor}`}>
              {item.status}
            </span>
          </a>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-gray-50">
        <a
          href="/documents/favorites"
          className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          즐겨찾기 관리
        </a>
      </div>
    </div>
  );
}
