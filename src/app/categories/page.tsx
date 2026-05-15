import PageLayout from '@/components/layout/PageLayout';

export const metadata = {
  title: 'DMS - 문서 분류 관리',
  description: '문서 분류 체계 관리',
};

const categories = [
  { code: 'QP',      label: '절차서',     count: 342, parentCode: null,  order: 1 },
  { code: 'QP-QUAL', label: '품질관리',   count: 120, parentCode: 'QP',  order: 1 },
  { code: 'QP-PROD', label: '생산관리',   count: 88,  parentCode: 'QP',  order: 2 },
  { code: 'WI',      label: '지침서',     count: 289, parentCode: null,  order: 2 },
  { code: 'WI-INSPECT', label: '검사지침', count: 45, parentCode: 'WI',  order: 1 },
  { code: 'WI-EQUIP',   label: '설비지침', count: 62, parentCode: 'WI',  order: 2 },
  { code: 'FORM',    label: '서식',       count: 98,  parentCode: null,  order: 3 },
  { code: 'REG',     label: '규정',       count: 45,  parentCode: null,  order: 4 },
  { code: 'EXT',     label: '외부문서',   count: 19,  parentCode: null,  order: 5 },
];

const topLevel = categories.filter((c) => !c.parentCode);
const children = categories.filter((c) => !!c.parentCode);

export default function CategoriesPage() {
  return (
    <PageLayout title="문서 분류 관리" breadcrumb="DMS 홈 > 문서분류 > 문서 분류 관리">
      <div className="px-6 py-5 space-y-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">문서 분류 관리</h2>
            <p className="text-sm text-gray-500 mt-0.5">문서 분류 체계를 설정하고 관리합니다.</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            분류 추가
          </button>
        </div>

        {/* 분류 트리 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-5">분류명</div>
              <div className="col-span-2">코드</div>
              <div className="col-span-2 text-right">문서 수</div>
              <div className="col-span-3 text-right">작업</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topLevel.map((cat) => {
              const subs = children.filter((c) => c.parentCode === cat.code);
              return (
                <div key={cat.code}>
                  {/* 상위 분류 */}
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-800">{cat.label}</span>
                      </div>
                      <div className="col-span-2 font-mono text-xs text-gray-500">{cat.code}</div>
                      <div className="col-span-2 text-right text-sm font-medium text-gray-700">{cat.count.toLocaleString()}</div>
                      <div className="col-span-3 flex items-center justify-end gap-1">
                        <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">수정</button>
                        <button className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded transition-colors">하위 추가</button>
                      </div>
                    </div>
                  </div>
                  {/* 하위 분류 */}
                  {subs.map((sub) => (
                    <div key={sub.code} className="px-4 py-2.5 bg-gray-50/50 hover:bg-gray-100/50 transition-colors border-t border-gray-100">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 flex items-center gap-2 pl-6">
                          <span className="w-1 h-4 rounded-full bg-gray-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{sub.label}</span>
                        </div>
                        <div className="col-span-2 font-mono text-xs text-gray-400">{sub.code}</div>
                        <div className="col-span-2 text-right text-sm text-gray-600">{sub.count.toLocaleString()}</div>
                        <div className="col-span-3 flex items-center justify-end gap-1">
                          <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">수정</button>
                          <button className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors">삭제</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '상위 분류', value: topLevel.length, color: 'text-blue-600' },
            { label: '하위 분류', value: children.length, color: 'text-indigo-600' },
            { label: '전체 분류', value: categories.length, color: 'text-purple-600' },
            { label: '전체 문서', value: categories.reduce((a, c) => a + c.count, 0).toLocaleString(), color: 'text-green-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

      </div>
    </PageLayout>
  );
}
