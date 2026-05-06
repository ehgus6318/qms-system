'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  APPROVAL_ITEMS,
  calcApprovalStats,
  isOverdue,
  daysUntil,
  daysSince,
  type ApprovalItem,
  type ApprovalItemStatus,
} from '@/lib/approvalsData';
import ApprovalStatusBadge from '@/components/shared/ApprovalStatusBadge';
import ApprovalStepTimeline from '@/components/shared/ApprovalStepTimeline';

type TabId = '전체' | '결재 대기' | '검토 중' | '승인' | '반려' | '보류';

const TAB_LIST: TabId[] = ['전체', '결재 대기', '검토 중', '승인', '반려', '보류'];

/* ── 통계 카드 ── */
function StatCard({
  label, value, sub, color, border, urgent,
}: {
  label: string; value: number; sub?: string;
  color: string; border: string; urgent?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${border} shadow-sm p-4`}>
      <div className="flex items-center gap-1.5 mb-1">
        {urgent && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── 결재 항목 로우 ── */
function ApprovalRow({ item, onClick }: { item: ApprovalItem; onClick: () => void }) {
  const overdue = isOverdue(item.dueDate, item.status);
  const dueDays = daysUntil(item.dueDate);
  const elapsed = daysSince(item.requestedAt);
  const currentStep = item.steps[item.currentStepIndex];

  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors group"
    >
      {/* 긴급 / 문서 */}
      <td className="px-4 py-3.5">
        <div className="flex items-start gap-2">
          {item.urgency !== 'normal' && (
            <span className={`mt-0.5 w-1.5 h-4 rounded-full flex-shrink-0 ${item.urgency === 'critical' ? 'bg-red-500' : 'bg-orange-400'}`} />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-gray-400 font-mono">{item.docNo}</span>
              <span className="text-gray-200 text-[10px]">·</span>
              <span className="text-[10px] text-gray-400">{item.docType}</span>
              <span className="text-gray-200 text-[10px]">·</span>
              <span className="text-[10px] text-gray-500 font-medium">{item.docVer}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate max-w-[220px]">
              {item.docName}
            </p>
            {item.requestComment && (
              <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[220px]">{item.requestComment}</p>
            )}
          </div>
        </div>
      </td>

      {/* 요청자 */}
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 text-[10px] font-bold">{item.requestedBy.charAt(0)}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">{item.requestedBy}</p>
            <p className="text-[10px] text-gray-400">{item.requestedByDept}</p>
          </div>
        </div>
      </td>

      {/* 결재 진행 */}
      <td className="px-3 py-3.5">
        <ApprovalStepTimeline steps={item.steps} compact />
      </td>

      {/* 현재 처리자 */}
      <td className="px-3 py-3.5">
        {currentStep ? (
          <div>
            <p className="text-xs font-medium text-gray-700">{currentStep.approver}</p>
            <p className="text-[10px] text-gray-400">{currentStep.role}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-300">-</span>
        )}
      </td>

      {/* 요청일 / 경과 */}
      <td className="px-3 py-3.5">
        <p className="text-xs text-gray-600">{item.requestedAt.split(' ')[0]}</p>
        <p className="text-[11px] text-gray-400">{elapsed}일 경과</p>
      </td>

      {/* 처리 기한 */}
      <td className="px-3 py-3.5">
        <p className={`text-xs font-medium ${overdue ? 'text-red-600' : dueDays <= 2 ? 'text-orange-600' : 'text-gray-600'}`}>
          {item.dueDate}
        </p>
        {overdue ? (
          <span className="text-[10px] font-bold text-red-600">⚠ {Math.abs(dueDays)}일 초과</span>
        ) : (
          <p className="text-[11px] text-gray-400">{dueDays}일 남음</p>
        )}
      </td>

      {/* 상태 */}
      <td className="px-3 py-3.5">
        <ApprovalStatusBadge
          status={item.status}
          urgency={item.urgency !== 'normal' ? item.urgency : undefined}
        />
      </td>

      {/* 액션 */}
      <td className="px-3 py-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
        >
          상세 처리 →
        </button>
      </td>
    </tr>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function ApprovalsListClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('전체');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(APPROVAL_ITEMS);

  const stats = calcApprovalStats(items);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchTab = activeTab === '전체' || item.status === activeTab;
      const q = search.toLowerCase();
      const matchSearch = !q || [item.docNo, item.docName, item.requestedBy, item.requestedByDept]
        .some((s) => s.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });
  }, [items, activeTab, search]);

  const tabCounts: Record<TabId, number> = useMemo(() => ({
    '전체':    items.length,
    '결재 대기': stats.pending,
    '검토 중':  stats.reviewing,
    '승인':     stats.approved,
    '반려':     stats.rejected,
    '보류':     stats.held,
  }), [items, stats]);

  return (
    <div className="px-6 py-5 space-y-5">
      {/* 통계 카드 */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="결재 대기"   value={stats.pending}   color="text-orange-600" border="border-orange-400" />
        <StatCard label="검토 중"     value={stats.reviewing} color="text-blue-600"   border="border-blue-400" />
        <StatCard label="기한 초과"   value={stats.overdueCount} color="text-red-600" border="border-red-400" urgent />
        <StatCard label="승인 완료"   value={stats.approved}  color="text-green-600" border="border-green-400" sub="이번 달" />
        <StatCard label="평균 처리일" value={0} color="text-gray-600" border="border-gray-300" sub={`${stats.avgProcessDays}일`} />
      </div>

      {/* 탭 + 검색 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {TAB_LIST.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {tab}
              {tabCounts[tab] > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="문서번호, 문서명, 요청자 검색..."
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-64"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {['문서 정보', '요청자', '결재 진행', '현재 처리자', '요청일', '처리 기한', '상태', ''].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap first:px-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">검색 결과가 없습니다</p>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <ApprovalRow
                  key={item.id}
                  item={item}
                  onClick={() => router.push(`/approvals/${item.id}`)}
                />
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-400">{filtered.length}건 표시 / 전체 {items.length}건</span>
          <div className="flex items-center gap-1">
            {['긴급', '일반'].map((u) => (
              <span key={u} className="flex items-center gap-1 text-[11px] text-gray-400 ml-3">
                <span className={`w-1.5 h-1.5 rounded-full ${u === '긴급' ? 'bg-orange-400' : 'bg-gray-300'}`} />
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
