import PageLayout from '@/components/layout/PageLayout';

export const metadata = {
  title: 'DMS - 폴더 관리',
  description: '문서 폴더 구조 관리',
};

export default function FoldersPage() {
  return (
    <PageLayout title="폴더 관리" breadcrumb="DMS 홈 > 문서분류 > 폴더 관리">
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">폴더 관리</h2>
            <p className="text-sm text-gray-500 mt-0.5">부서별·프로젝트별 문서 폴더를 관리합니다.</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            폴더 추가
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-800">폴더 관리 기능</p>
            <p className="text-xs text-blue-700 mt-0.5">부서별, 프로젝트별 폴더를 생성하여 문서를 체계적으로 관리할 수 있습니다. API 연결 후 실제 폴더 구조가 표시됩니다.</p>
          </div>
        </div>

        {/* 폴더 구조 placeholder */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="space-y-2">
            {[
              { name: '품질관리팀', icon: '📁', children: ['절차서', '지침서', '기록'] },
              { name: '생산관리팀', icon: '📁', children: ['생산절차서', '설비지침'] },
              { name: '연구개발팀', icon: '📁', children: ['개발문서', '시험보고서'] },
              { name: '공용',       icon: '📁', children: ['양식', '외부문서'] },
            ].map((folder) => (
              <div key={folder.name}>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                  <span>{folder.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{folder.name}</span>
                  <span className="text-xs text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    {folder.children.length}개 하위폴더
                  </span>
                </div>
                <div className="ml-6 space-y-0.5">
                  {folder.children.map((child) => (
                    <div key={child} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <span className="text-sm">📂</span>
                      <span className="text-xs text-gray-600">{child}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
