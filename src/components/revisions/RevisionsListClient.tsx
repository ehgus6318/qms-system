'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  REVISION_ITEMS,
  calcRevisionStats,
  type RevisionItem,
  type RevisionStatus,
} from '@/lib/revisionsData';
import ApprovalStatusBadge from '@/components/shared/ApprovalStatusBadge';
import ApprovalStepTimeline from '@/components/shared/ApprovalStepTimeline';

type TabId = '전체' | RevisionStatus;
const TAB_LIST: TabId[] = ['전체', '개정 대기', '개정 진행 중', '개정 완료', '개정 반려'];

const REASON_COLORS: Record<string, string> = {
  '정기 개정':          'bg-blue-100 text-blue-700',
  '심사 지적사항 반영': 'bg-orange-100 text-orange-700',
  '법규/표준 변경':     'bg-purple-100 text-purple-700',
  '업무 프로세스 변경': 'bg-teal-100 text-teal-700',
  '오류 수정':          'bg-red-100 text-red-700',
  '고객 요구사항 반영': 'bg-green-100 text-green-700',
  '기타':               'bg-gray-100 text-gray-600',
};

function StatCard({ label, value, color, border }: { label: string; value: number; color: string; border: string }) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${border} shadow-sm p-4`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function RevisionRow({ item, onClick }: { item: RevisionItem; onClick: () => void }) {
  const approvedSteps = item.approvalSteps.filter((s) => s.status === '승인').length;
  const totalSteps = item.approvalSteps.length;

  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors group"
    >
      {/* 문서 정보 */}
      <td className="px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-gray-400 font-mono">{item.docNo}</span>
            <span className="text-gray-200 text-[10px]">·</span>
            <span className="text-[10px] text-gray-400">{item.docType}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate max-w-[200px]">
            {item.docName}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[200px]">{item.changeSummary}</p>
        </div>
      </td>

      {/* 버전 변경 */}
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono font-medium">{item.currentVer}</span>
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-mono font-medium">{item.newVer}</span>
        </div>
      </td>

      {/* 개정 사유 */}
      <td className="px-3 py-3.5">
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${REASON_COLORS[item.reason] ?? REASON_COLORS['기타']}`}>
          {item.reason}
        </span>
      </td>

      {/* 결재 진행 */}
      <td className="px-3 py-3.5">
        <ApprovalStepTimeline steps={item.approvalSteps} compact />
      </td>

      {/* 요청자 */}
      <td className="px-3 py-3.5">
        <p className="text-xs font-medium text-gray-700">{item.requestedBy}</p>
        <p className="text-[10px] text-gray-400">{item.requestedByDept}</p>
      </td>

      {/* 요청일 */}
      <td className="px-3 py-3.5">
        <p className="text-xs text-gray-600">{item.requestedAt.split(' ')[0]}</p>
        {item.effectiveDate && (
          <p className="text-[10px] text-gray-400">시행: {item.effectiveDate}</p>
        )}
      </td>

      {/* 상태 */}
      <td className="px-3 py-3.5">
        <ApprovalStatusBadge status={item.status} />
      </td>

      {/* 액션 */}
      <td className="px-3 py-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors whitespace-nowrap"
        >
          상세 보기 →
        </button>
      </td>
    </tr>
  );
}

export default function RevisionsListClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('전체');
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('전체');

  const stats = calcRevisionStats(REVISION_ITEMS);

  const filtered = useMemo(() => {
    return REVISION_ITEMS.filter((item) => {
      const matchTab    = activeTab === '전체' || item.status === activeTab;
      const matchReason = reasonFilter === '전체' || item.reason === reasonFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || [item.docNo, item.docName, item.requestedBy, item.changeSummary]
        .some((s) => s.toLowerCase().includes(q));
      return matchTab && matchReason && matchSearch;
    });
  }, [activeTab, search, reasonFilter]);

  const tabCounts: Record<TabId, number> = useMemo(() => ({
    '전체':       REVISION_ITEMS.length,
    '개정 대기':  stats.waiting,
    '개정 진행 중': stats.inProgress,
    '개정 완료':  stats.completed,
    '개정 반려':  stats.rejected,
  }), [stats]);

  const allReasons = ['전체', ...Array.from(new Set(REVISION_ITEMS.map((i) => i.reason)))];

  return (
    <div className="px-6 py-5 space-y-5">
      {/* 통계 카드 */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="개정 대기"   value={stats.waiting}    color="text-orange-600" border="border-orange-400" />
        <StatCard label="개정 진행 중" value={stats.inProgress} color="text-indigo-600" border="border-indigo-400" />
        <StatCard label="개정 완료"   value={stats.completed}  color="text-green-600"  border="border-green-400" />
        <StatCard label="개정 반려"   value={stats.rejected}   color="text-red-600"    border="border-red-400" />
        <StatCard label="올해 총 개정" value={stats.totalThisYear} color="text-gray-600" border="border-gray-300" />
      </div>

      {/* 필터 영역 */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* 탭 */}
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
                  activeTab === tab ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'
                }`}>{tabCounts[tab]}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 사유 필터 */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          >
            {allReasons.map((r) => <option key={r}>{r}</option>)}
          </select>
          {/* 검색 */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="문서번호, 문서명, 요청자..."
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-56"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <button
            onClick={() => router.push('/revisions/new')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            개정 등록
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {['문서 정보', '버전 변경', '개정 사유', '결재 진행', '요청자', '요청일', '상태', ''].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap first:px-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <p className="text-sm font-medium">검색 결과가 없습니다</p>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <RevisionRow
                  key={item.id}
                  item={item}
                  onClick={() => router.push(`/revisions/${item.id}`)}
                />
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400">{filtered.length}건 표시 / 전체 {REVISION_ITEMS.length}건</span>
        </div>
      </div>
    </div>
  );
}
