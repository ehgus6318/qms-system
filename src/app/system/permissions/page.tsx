import PageLayout from '@/components/layout/PageLayout';
import { USERS, PERMISSION_META, PERMISSION_GROUPS } from '@/lib/usersData';

export const metadata = {
  title: 'DMS - 권한 관리',
  description: '사용자 권한 일괄 관리',
};

export default function PermissionsPage() {
  return (
    <PageLayout title="권한 관리" breadcrumb="DMS 홈 > 사용자관리 > 권한 관리">
      <div className="px-6 py-5 space-y-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">권한 관리</h2>
            <p className="text-sm text-gray-500 mt-0.5">사용자별 권한을 일괄 조회하고 관리합니다.</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            변경사항 저장
          </button>
        </div>

        {/* 권한 매트릭스 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-xs min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 sticky left-0 bg-gray-50 z-10 min-w-[160px]">
                  권한
                </th>
                {USERS.map((u) => (
                  <th key={u.id} className="px-3 py-3 text-center font-medium text-gray-600 min-w-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full ${u.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                        {u.avatarInitials}
                      </div>
                      <span className="text-[11px] text-gray-600 font-medium">{u.name}</span>
                      <span className={`text-[9px] px-1 rounded ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {u.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_GROUPS.map((group) => {
                const groupPerms = PERMISSION_META.filter((p) => p.group === group);
                return (
                  <>
                    {/* 그룹 헤더 */}
                    <tr key={`group-${group}`} className="bg-slate-50 border-y border-gray-200">
                      <td colSpan={USERS.length + 1} className="px-4 py-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{group}</span>
                      </td>
                    </tr>
                    {/* 권한별 행 */}
                    {groupPerms.map((perm) => (
                      <tr key={perm.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 sticky left-0 bg-white z-10 border-r border-gray-100">
                          <div>
                            <span className={`font-medium text-gray-700 ${perm.dangerous ? 'text-red-700' : ''}`}>
                              {perm.dangerous ? '⚠️ ' : ''}{perm.label}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-0.5">{perm.description}</p>
                          </div>
                        </td>
                        {USERS.map((u) => {
                          const has = u.permissions.includes(perm.key);
                          return (
                            <td key={u.id} className="px-3 py-2.5 text-center">
                              <div className="flex items-center justify-center">
                                {has ? (
                                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            권한 보유
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </span>
            권한 없음
          </div>
          <span className="text-red-500">⚠️ 관리자 전용 권한</span>
        </div>

      </div>
    </PageLayout>
  );
}
