import PageLayout from '@/components/layout/PageLayout';

export const metadata = {
  title: 'DMS - 휴지통',
  description: '삭제된 문서 임시 보관함',
};

const trashItems = [
  { no: 'WI-2022-003', title: '구 수입검사 지침서 (폐기)', version: 'v1.0', deletedAt: '2024-01-15', deletedBy: '김영훈', daysLeft: 15 },
  { no: 'FORM-2023-011', title: '구 불량품 처리 양식', version: 'v2.1', deletedAt: '2024-03-22', deletedBy: '이수진', daysLeft: 8 },
];

export default function TrashPage() {
  return (
    <PageLayout title="휴지통" breadcrumb="DMS 홈 > 문서관리 > 휴지통">
      <div className="px-6 py-5 space-y-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">휴지통</h2>
            <p className="text-sm text-gray-500 mt-0.5">삭제된 문서는 30일 후 자동으로 영구 삭제됩니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              전체 복원
            </button>
            <button className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              영구 삭제
            </button>
          </div>
        </div>

        {/* 경고 배너 */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">주의: 영구 삭제 불가 복구</p>
            <p className="text-xs text-red-700 mt-0.5">30일이 지난 문서는 자동으로 영구 삭제되며 복구할 수 없습니다. 필요한 문서는 즉시 복원하세요.</p>
          </div>
        </div>

        {/* 문서 목록 */}
        {trashItems.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">문서번호</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">문서명</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">버전</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">삭제일</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">삭제자</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">만료까지</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trashItems.map((doc) => (
                  <tr key={doc.no} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{doc.no}</td>
                    <td className="px-4 py-3 text-gray-600 line-through">{doc.title}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{doc.version}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{doc.deletedAt}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{doc.deletedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${doc.daysLeft <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                        {doc.daysLeft}일 남음
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">복원</button>
                        <button className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">영구삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-gray-400 text-sm font-medium">휴지통이 비어 있습니다</p>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
