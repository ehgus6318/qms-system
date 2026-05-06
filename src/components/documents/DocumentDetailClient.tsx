'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DUMMY_DOCUMENTS,
  REVISION_HISTORIES,
  APPROVAL_STEPS,
  ACCESS_LEVEL_META,
  type Document,
  type RevisionRecord,
  type ApprovalStep,
} from '@/lib/documentsData';
import { getStatusStyle } from '@/lib/qmsColors';

/* ── 탭 타입 ── */
type TabId = 'info' | 'files' | 'revision' | 'approval' | 'circulation';

/* ── 작은 배지 ── */
function StatusBadge({ status }: { status: string }) {
  const s = getStatusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

/* ── 정보 행 ── */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="w-28 flex-shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="flex-1 text-xs text-gray-800">{children}</span>
    </div>
  );
}

/* ── 결재 단계 타임라인 ── */
function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  const statusConfig: Record<string, { icon: string; color: string; bg: string }> = {
    '승인':   { icon: '✓', color: 'text-green-600', bg: 'bg-green-100 border-green-300' },
    '반려':   { icon: '✕', color: 'text-red-600',   bg: 'bg-red-100 border-red-300' },
    '검토 중':{ icon: '◎', color: 'text-blue-600',  bg: 'bg-blue-100 border-blue-300' },
    '대기':   { icon: '○', color: 'text-gray-400',  bg: 'bg-gray-100 border-gray-200' },
  };

  return (
    <div className="flex items-start gap-2 overflow-x-auto pb-2">
      {steps.map((step, idx) => {
        const cfg = statusConfig[step.status] ?? statusConfig['대기'];
        return (
          <div key={step.step} className="flex items-start gap-2 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-base font-bold ${cfg.bg} ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="mt-2 text-center min-w-[80px]">
                <p className="text-[10px] font-semibold text-gray-700">{step.approver}</p>
                <p className="text-[10px] text-gray-400">{step.role}</p>
                {step.date && <p className="text-[10px] text-gray-400 mt-0.5">{step.date}</p>}
                <StatusBadge status={step.status} />
              </div>
              {step.comment && (
                <div className="mt-1.5 max-w-[88px] bg-yellow-50 border border-yellow-200 rounded px-1.5 py-1 text-[10px] text-yellow-800 text-center">
                  {step.comment.length > 30 ? step.comment.slice(0, 30) + '…' : step.comment}
                </div>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div className="mt-5 flex-shrink-0">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function DocumentDetailClient({ docId }: { docId: number }) {
  const router = useRouter();
  const doc: Document | undefined = DUMMY_DOCUMENTS.find((d) => d.id === docId);
  const [activeTab, setActiveTab] = useState<TabId>('info');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">문서를 찾을 수 없습니다</p>
        <button onClick={() => router.push('/documents')}
          className="mt-3 text-xs text-blue-600 hover:underline">문서 목록으로 돌아가기</button>
      </div>
    );
  }

  const revisions: RevisionRecord[] = REVISION_HISTORIES[docId] ?? [];
  const approvalSteps: ApprovalStep[] = APPROVAL_STEPS[docId] ?? [];
  const accessMeta = ACCESS_LEVEL_META[doc.accessLevel ?? 'internal'];
  const statusStyle = getStatusStyle(doc.status);

  const TABS: { id: TabId; label: string; count?: number }[] = [
    { id: 'info',        label: '기본 정보' },
    { id: 'files',       label: '첨부파일', count: 2 },
    { id: 'revision',    label: '개정 이력', count: revisions.length },
    { id: 'approval',    label: '결재 이력', count: approvalSteps.length },
    { id: 'circulation', label: '회람 현황', count: doc.circulationList?.length ?? 0 },
  ];

  return (
    <div className="flex gap-4 px-6 py-5 min-h-full">
      {/* ── 왼쪽: 탭 콘텐츠 ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* 문서 헤더 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-gray-400 font-mono font-medium">{doc.no}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-500">{doc.type}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-500">{doc.ver}</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">{doc.name}</h1>
              <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
              <div className="flex items-center gap-2 mt-2.5">
                <StatusBadge status={doc.status} />
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${accessMeta.color}`}>
                  {accessMeta.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* 탭: 기본 정보 */}
          {activeTab === 'info' && (
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="문서번호">{doc.no}</InfoRow>
                  <InfoRow label="문서명">{doc.name}</InfoRow>
                  <InfoRow label="문서유형">{doc.type}</InfoRow>
                  <InfoRow label="버전">{doc.ver}</InfoRow>
                  <InfoRow label="상태"><StatusBadge status={doc.status} /></InfoRow>
                </div>
                <div>
                  <InfoRow label="작성자">{doc.author} ({doc.dept})</InfoRow>
                  <InfoRow label="등록일">{doc.date}</InfoRow>
                  <InfoRow label="시행일">{doc.effectiveDate ?? '-'}</InfoRow>
                  <InfoRow label="보존 기간">{doc.retentionPeriod ?? '-'}</InfoRow>
                  <InfoRow label="관련 표준">{doc.relatedStandard ?? '-'}</InfoRow>
                </div>
              </div>
              {doc.keywords && doc.keywords.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">키워드</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.keywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 탭: 첨부파일 */}
          {activeTab === 'files' && (
            <div className="p-5 space-y-2">
              {[
                { name: `${doc.no}_${doc.ver}.pdf`, size: doc.fileSize, type: 'pdf' },
                { name: `${doc.no}_변경이력서.xlsx`, size: '0.1 MB', type: 'xlsx' },
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 group hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <span className={`w-9 h-9 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    file.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {file.type.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-[11px] text-gray-400">{file.size}</p>
                  </div>
                  <button className="px-3 py-1 text-xs text-blue-600 border border-blue-200 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-100">
                    다운로드
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 탭: 개정 이력 */}
          {activeTab === 'revision' && (
            <div className="p-5">
              {revisions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">개정 이력이 없습니다.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['버전', '개정일', '작성자', '개정 사유', '주요 변경 내용'].map((h) => (
                        <th key={h} className="text-left py-2 pr-4 font-medium text-gray-500 text-[11px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {revisions.map((r, i) => (
                      <tr key={r.ver} className={`border-b border-gray-50 ${i === 0 ? 'bg-blue-50/40' : ''}`}>
                        <td className="py-2.5 pr-4">
                          <span className={`font-semibold ${i === 0 ? 'text-blue-700' : 'text-gray-700'}`}>{r.ver}</span>
                          {i === 0 && <span className="ml-1.5 text-[9px] bg-blue-600 text-white px-1 py-0.5 rounded">현재</span>}
                        </td>
                        <td className="py-2.5 pr-4 text-gray-600">{r.date}</td>
                        <td className="py-2.5 pr-4 text-gray-600">{r.author}</td>
                        <td className="py-2.5 pr-4 text-gray-600">{r.reason}</td>
                        <td className="py-2.5 text-gray-600">{r.changes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 탭: 결재 이력 */}
          {activeTab === 'approval' && (
            <div className="p-5">
              {approvalSteps.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">결재 이력이 없습니다.</p>
              ) : (
                <ApprovalTimeline steps={approvalSteps} />
              )}
            </div>
          )}

          {/* 탭: 회람 현황 */}
          {activeTab === 'circulation' && (
            <div className="p-5">
              {(!doc.circulationList || doc.circulationList.length === 0) ? (
                <p className="text-xs text-gray-400 text-center py-8">회람 대상이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {doc.circulationList.map((item) => {
                    const statusLabel = { pending: '미열람', read: '열람완료', confirmed: '확인완료' }[item.status];
                    const statusColor = { pending: 'bg-gray-100 text-gray-600', read: 'bg-blue-100 text-blue-700', confirmed: 'bg-green-100 text-green-700' }[item.status];
                    return (
                      <div key={item.deptId} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-xs font-bold">{item.representative.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-800">{item.representative} <span className="text-gray-400 font-normal">({item.deptName})</span></p>
                          {item.readAt && <p className="text-[10px] text-gray-400">열람: {item.readAt}</p>}
                          {item.confirmedAt && <p className="text-[10px] text-gray-400">확인: {item.confirmedAt}</p>}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor}`}>{statusLabel}</span>
                      </div>
                    );
                  })}
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    확인완료: {doc.circulationList.filter(c => c.status === 'confirmed').length}명
                    <span className="w-2 h-2 rounded-full bg-blue-400 ml-2" />
                    열람: {doc.circulationList.filter(c => c.status === 'read').length}명
                    <span className="w-2 h-2 rounded-full bg-gray-300 ml-2" />
                    미열람: {doc.circulationList.filter(c => c.status === 'pending').length}명
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 적용부서 */}
        {doc.appliedDepts && doc.appliedDepts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>
              적용부서
            </h3>
            <div className="flex flex-wrap gap-2">
              {doc.appliedDepts.map((d) => {
                const permColor = { full: 'bg-blue-100 text-blue-700 border-blue-200', read: 'bg-gray-100 text-gray-600 border-gray-200', none: 'bg-red-50 text-red-500 border-red-100' }[d.permission];
                const permLabel = { full: '전체권한', read: '열람만', none: '접근불가' }[d.permission];
                return (
                  <span key={d.deptId} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs ${permColor}`}>
                    {d.deptName}
                    <span className="text-[10px] opacity-70">({permLabel})</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 오른쪽: 사이드바 ── */}
      <div className="w-60 flex-shrink-0 space-y-3">
        {/* 액션 버튼 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
          <button
            onClick={() => router.push(`/documents/${docId}/edit`)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            문서 수정
          </button>
          <button
            onClick={() => router.push(`/documents/${docId}/revision`)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            개정 등록
          </button>
          <button
            onClick={() => router.push('/documents/approval')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            결재 요청
          </button>
          <div className="h-px bg-gray-100" />
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            다운로드
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
            즐겨찾기 추가
          </button>
        </div>

        {/* 문서 요약 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">문서 요약</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">문서번호</span>
              <span className="font-mono font-medium text-gray-700">{doc.no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">버전</span>
              <span className="font-medium text-gray-700">{doc.ver}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">파일크기</span>
              <span className="text-gray-700">{doc.fileSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">상태</span>
              <StatusBadge status={doc.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">권한</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${accessMeta.color}`}>{accessMeta.label}</span>
            </div>
            <div className="h-px bg-gray-100 my-1" />
            <div className="flex justify-between">
              <span className="text-gray-400">작성자</span>
              <span className="text-gray-700">{doc.author}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">부서</span>
              <span className="text-gray-700">{doc.dept}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">등록일</span>
              <span className="text-gray-700">{doc.date}</span>
            </div>
          </div>
        </div>

        {/* 관련 문서 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">관련 문서</h3>
          <div className="space-y-1.5">
            {DUMMY_DOCUMENTS.filter((d) => d.type === doc.type && d.id !== doc.id).slice(0, 3).map((d) => (
              <button
                key={d.id}
                onClick={() => router.push(`/documents/${d.id}`)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-50 transition-colors group"
              >
                <p className="text-[10px] text-gray-400 font-mono">{d.no}</p>
                <p className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors truncate">{d.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
