import PageLayout from '@/components/layout/PageLayout';

export const metadata = {
  title: 'DMS - 시스템설정',
  description: '전자문서관리시스템 환경 설정',
};

const settingGroups = [
  {
    title: '기본 설정',
    icon: '⚙️',
    items: [
      { label: '시스템 명칭',    value: 'DMS - 전자문서관리시스템',  type: 'text' },
      { label: '회사명',          value: 'DH2 Co., Ltd.',              type: 'text' },
      { label: '시스템 언어',     value: '한국어',                      type: 'select' },
      { label: '날짜 형식',       value: 'YYYY-MM-DD',                  type: 'select' },
    ],
  },
  {
    title: '문서 관리 설정',
    icon: '📄',
    items: [
      { label: '문서 번호 형식',  value: 'TYPE-YYYY-NNN',   type: 'text' },
      { label: '버전 형식',        value: 'vX.X',             type: 'text' },
      { label: '최대 파일 크기',  value: '50 MB',             type: 'text' },
      { label: '휴지통 보관 기간', value: '30일',              type: 'select' },
    ],
  },
  {
    title: '결재 설정',
    icon: '✅',
    items: [
      { label: '결재 마감 기본값', value: '7일',   type: 'select' },
      { label: '결재 알림',        value: '활성화', type: 'toggle' },
      { label: '반려 시 재결재',   value: '허용',   type: 'toggle' },
      { label: '결재선 최대 단계', value: '5단계',  type: 'select' },
    ],
  },
  {
    title: '보안 설정',
    icon: '🔐',
    items: [
      { label: '세션 만료 시간',   value: '8시간',  type: 'select' },
      { label: '비밀번호 만료',    value: '90일',   type: 'select' },
      { label: '감사 로그',        value: '활성화', type: 'toggle' },
      { label: '접근 로그 보관',   value: '1년',    type: 'select' },
    ],
  },
];

export default function SystemSettingsPage() {
  return (
    <PageLayout title="시스템설정" breadcrumb="DMS 홈 > 시스템설정">
      <div className="px-6 py-5 space-y-5">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">시스템 설정</h2>
            <p className="text-sm text-gray-500 mt-0.5">전자문서관리시스템의 환경을 설정합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              초기화
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
              저장
            </button>
          </div>
        </div>

        {/* 설정 그룹 */}
        {settingGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>{group.icon}</span>
                {group.title}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                  <label className="text-sm font-medium text-gray-700">{item.label}</label>
                  <div className="flex items-center gap-3">
                    {item.type === 'toggle' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 font-medium">{item.value}</span>
                        <div className="relative">
                          <div className="w-9 h-5 bg-blue-500 rounded-full" />
                          <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    ) : item.type === 'select' ? (
                      <select
                        defaultValue={item.value}
                        className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option>{item.value}</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={item.value}
                        className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 시스템 정보 */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3">시스템 정보</h3>
          <div className="grid grid-cols-3 gap-4 text-xs text-slate-500">
            <div><span className="font-medium">버전:</span> DMS v1.0.0</div>
            <div><span className="font-medium">빌드:</span> 2025.05.11</div>
            <div><span className="font-medium">DB:</span> PostgreSQL 15</div>
            <div><span className="font-medium">Framework:</span> Next.js 16.2</div>
            <div><span className="font-medium">ORM:</span> Prisma 7</div>
            <div><span className="font-medium">Node.js:</span> 20.x</div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
