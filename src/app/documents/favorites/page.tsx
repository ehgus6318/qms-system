import PageLayout from '@/components/layout/PageLayout';

export const metadata = {
  title: 'DMS - 즐겨찾기',
  description: '즐겨찾기로 등록한 문서 목록',
};

const favorites = [
  { no: 'QP-2024-001', title: '품질경영 시스템 운영 절차서', version: 'v3.1', status: '승인', category: '절차서', dept: '품질관리팀' },
  { no: 'QP-2024-002', title: '문서 및 기록 관리 절차서',    version: 'v2.0', status: '승인', category: '절차서', dept: '품질관리팀' },
  { no: 'WI-2024-001', title: '수입검사 작업지침서',          version: 'v1.2', status: '검토중', category: '지침서', dept: '품질관리팀' },
];

const statusColors: Record<string, string> = {
  '승인':   'bg-green-100 text-green-700',
  '검토중': 'bg-blue-100 text-blue-700',
  '초안':   'bg-gray-100 text-gray-600',
  '반려':   'bg-red-100 text-red-700',
};

export default function FavoritesPage() {
  return (
    <PageLayout title="즐겨찾기" breadcrumb="DMS 홈 > 문서관리 > 즐겨찾기">
      <div className="px-6 py-5 space-y-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">즐겨찾기 문서</h2>
            <p className="text-sm text-gray-500 mt-0.5">자주 사용하는 문서를 즐겨찾기로 등록하세요.</p>
          </div>
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg">
            ★ {favorites.length}건
          </span>
        </div>

        {/* 문서 목록 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">
                  <span className="text-amber-500">★</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">문서번호</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">문서명</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">유형</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">버전</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">부서</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {favorites.map((doc) => (
                <tr key={doc.no} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button className="text-amber-400 hover:text-amber-500 transition-colors text-lg leading-none">★</button>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">{doc.no}</td>
                  <td className="px-4 py-3">
                    <a href={`/documents/${doc.no}`} className="text-gray-800 font-medium hover:text-blue-600 transition-colors">
                      {doc.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{doc.category}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs font-mono">{doc.version}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{doc.dept}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[doc.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <a href={`/documents/${doc.no}`} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        보기
                      </a>
                      <button className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded transition-colors">
                        해제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 즐겨찾기 안내 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">즐겨찾기 사용 안내</p>
            <p className="text-xs text-amber-700 mt-0.5">문서 목록 또는 상세 화면에서 ★ 아이콘을 클릭하면 즐겨찾기에 추가됩니다.</p>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
