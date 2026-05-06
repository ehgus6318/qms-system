'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REVISION_ITEMS, type RevisionItem } from '@/lib/revisionsData';
import ApprovalStatusBadge from '@/components/shared/ApprovalStatusBadge';
import ApprovalStepTimeline from '@/components/shared/ApprovalStepTimeline';
import RevisionComparePanel from '@/components/shared/RevisionComparePanel';

type TabId = 'compare' | 'info' | 'history' | 'approval';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="w-24 flex-shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="flex-1 text-xs text-gray-800">{children}</span>
    </div>
  );
}

const ATTACH_TYPE_CONFIG = {
  added:     { label: '신규 추가',  bg: 'bg-green-100 text-green-700',   icon: '+' },
  replaced:  { label: '교체',       bg: 'bg-yellow-100 text-yellow-700', icon: '↺' },
  removed:   { label: '삭제',       bg: 'bg-red-100 text-red-700',       icon: '−' },
  unchanged: { label: '변경없음',   bg: 'bg-gray-100 text-gray-600',     icon: '=' },
};

export default function RevisionDetailClient({ revisionId }: { revisionId: number }) {
  const router = useRouter();
  const item: RevisionItem | undefined = REVISION_ITEMS.find((r) => r.id === revisionId);
  const [activeTab, setActiveTab] = useState<TabId>('compare');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [actionDone, setActionDone] = useState<'approved' | 'rejected' | null>(null);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">개정 항목을 찾을 수 없습니다</p>
        <button onClick={() => router.push('/revisions')} className="mt-3 text-xs text-blue-600 hover:underline">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const canAct = ['개정 대기', '개정 진행 중'].includes(item.status) && !actionDone;

  const TABS: { id: TabId; label: string }[] = [
    { id: 'compare',  label: '변경 내용 비교' },
    { id: 'info',     label: '개정 정보' },
    { id: 'history',  label: `개정 이력 (${item.history.length})` },
    { id: 'approval', label: '결재 현황' },
  ];

  return (
    <>
      {/* 승인 확인 모달 */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-blue-100 bg-blue-50">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                개정 승인 요청 확인
              </h3>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-600 mb-4">
                <span className="font-semibold">{item.docName}</span>의 개정({item.currentVer} → {item.newVer})을 결재 요청합니다. 계속하시겠습니까?
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">취소</button>
                <button onClick={() => { setActionDone('approved'); setShowApproveModal(false); }}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">승인 요청</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 반려 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-red-100 bg-red-50">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                반려 처리
              </h3>
            </div>
            <div className="p-5">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">반려 사유 <span className="text-red-500">*</span></label>
              <textarea rows={4} value={rejectComment} onChange={(e) => setRejectComment(e.target.value)}
                placeholder="반려 사유를 구체적으로 기술하세요."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-3" />
              <div className="flex gap-2">
                <button onClick={() => { setShowRejectModal(false); setRejectComment(''); }}
                  className="flex-1 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100">취소</button>
                <button
                  onClick={() => { if (rejectComment.trim()) { setActionDone('rejected'); setShowRejectModal(false); } }}
                  disabled={!rejectComment.trim()}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >반려</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-5 px-6 py-5 min-h-full items-start">
        {/* ── 왼쪽 메인 ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* 결과 배너 */}
          {actionDone && (
            <div className={`rounded-xl border p-4 flex items-center gap-3 ${
              actionDone === 'approved' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-bold">
                {actionDone === 'approved' ? '개정 승인 요청이 완료되었습니다.' : '개정이 반려 처리되었습니다.'}
              </p>
              <button onClick={() => router.push('/revisions')}
                className="ml-auto text-xs font-medium underline opacity-70 hover:opacity-100">목록으로</button>
            </div>
          )}

          {/* 문서 헤더 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-gray-400 font-mono">{item.docNo}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{item.docType}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{item.docName}</h1>
                <p className="text-xs text-gray-500 mt-1">{item.changeSummary}</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-mono font-semibold">{item.currentVer}</span>
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-mono font-semibold">{item.newVer}</span>
                  </div>
                  <ApprovalStatusBadge status={item.status} />
                </div>
              </div>
              <button
                onClick={() => router.push(`/documents/${item.docId}`)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                원본 문서 보기
              </button>
            </div>
          </div>

          {/* 탭 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={[
                    'px-4 py-3 text-xs font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                  ].join(' ')}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* 변경 내용 비교 */}
              {activeTab === 'compare' && (
                <RevisionComparePanel
                  currentVer={item.currentVer}
                  newVer={item.newVer}
                  beforeContent={item.beforeContent}
                  afterContent={item.afterContent}
                  changeItems={item.changeItems}
                />
              )}

              {/* 개정 정보 */}
              {activeTab === 'info' && (
                <div>
                  <div className="grid grid-cols-2 gap-x-8 mb-4">
                    <div>
                      <InfoRow label="문서번호">{item.docNo}</InfoRow>
                      <InfoRow label="현재 버전">{item.currentVer}</InfoRow>
                      <InfoRow label="개정 버전">{item.newVer}</InfoRow>
                      <InfoRow label="개정 사유">{item.reason}</InfoRow>
                    </div>
                    <div>
                      <InfoRow label="요청자">{item.requestedBy} ({item.requestedByDept})</InfoRow>
                      <InfoRow label="요청일">{item.requestedAt.split(' ')[0]}</InfoRow>
                      <InfoRow label="시행 예정일">{item.effectiveDate ?? '-'}</InfoRow>
                      <InfoRow label="변경 항목 수">{item.changeItems.length}개</InfoRow>
                    </div>
                  </div>
                  {/* 첨부파일 변경 */}
                  {item.attachmentChanges.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">첨부파일 변경 사항</p>
                      <div className="space-y-1.5">
                        {item.attachmentChanges.map((att, i) => {
                          const cfg = ATTACH_TYPE_CONFIG[att.changeType];
                          return (
                            <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.bg}`}>{cfg.icon} {cfg.label}</span>
                              <span className="text-xs text-gray-700 flex-1">{att.fileName}</span>
                              <span className="text-[11px] text-gray-400">{att.fileSize}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 개정 이력 */}
              {activeTab === 'history' && (
                item.history.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">이전 개정 이력이 없습니다.</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['버전', '개정일', '작성자', '사유', '주요 변경'].map((h) => (
                          <th key={h} className="text-left py-2 pr-4 font-medium text-gray-500 text-[11px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.history.map((h, i) => (
                        <tr key={h.ver} className={`border-b border-gray-50 ${i === 0 ? 'bg-blue-50/30' : ''}`}>
                          <td className={`py-2.5 pr-4 font-semibold font-mono ${i === 0 ? 'text-blue-700' : 'text-gray-700'}`}>{h.ver}</td>
                          <td className="py-2.5 pr-4 text-gray-500">{h.date}</td>
                          <td className="py-2.5 pr-4 text-gray-500">{h.author}</td>
                          <td className="py-2.5 pr-4 text-gray-500">{h.reason}</td>
                          <td className="py-2.5 text-gray-500">{h.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}

              {/* 결재 현황 */}
              {activeTab === 'approval' && (
                <div className="space-y-4">
                  {item.approvalStatus && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">현재 결재 상태:</p>
                      <ApprovalStatusBadge status={item.approvalStatus} />
                    </div>
                  )}
                  <ApprovalStepTimeline steps={item.approvalSteps} />
                  {/* 반려 의견 */}
                  {item.approvalSteps.some((s) => s.status === '반려' && s.comment) && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-red-700 mb-2">반려 사유</p>
                      {item.approvalSteps.filter((s) => s.status === '반려' && s.comment).map((s) => (
                        <div key={s.step} className="text-xs text-gray-700">
                          <span className="font-medium text-red-600">{s.approver} ({s.role}): </span>
                          {s.comment}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 오른쪽 사이드바 ── */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* 액션 버튼 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50/70">
              <h3 className="text-sm font-semibold text-gray-800">처리 액션</h3>
            </div>
            <div className="p-4 space-y-2">
              {canAct ? (
                <>
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    승인 요청
                  </button>
                  <button
                    onClick={() => router.push(`/documents/${item.docId}/revision`)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    내용 수정
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    반려
                  </button>
                </>
              ) : (
                <div className="text-center py-4 text-gray-400 text-xs">
                  {actionDone ? '처리가 완료되었습니다' : '현재 처리 가능한 액션이 없습니다'}
                </div>
              )}
              <div className="h-px bg-gray-100" />
              <button
                onClick={() => router.push(`/documents/${item.docId}`)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                원본 문서 보기
              </button>
            </div>
          </div>

          {/* 개정 요약 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">개정 요약</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">개정 사유</span><span className="text-gray-700 text-right max-w-[100px] leading-tight">{item.reason}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">변경 항목</span><span className="text-gray-700">{item.changeItems.length}개</span></div>
              <div className="flex justify-between"><span className="text-gray-400">파일 변경</span><span className="text-gray-700">{item.attachmentChanges.filter(a => a.changeType !== 'unchanged').length}개</span></div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between"><span className="text-gray-400">요청자</span><span className="text-gray-700">{item.requestedBy}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">요청일</span><span className="text-gray-700">{item.requestedAt.split(' ')[0]}</span></div>
              {item.effectiveDate && (
                <div className="flex justify-between"><span className="text-gray-400">시행일</span><span className="text-gray-700">{item.effectiveDate}</span></div>
              )}
            </div>
          </div>

          {/* 변경 유형 요약 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">변경 유형</h3>
            <div className="space-y-1.5">
              {[
                { type: 'added',    label: '추가',  color: 'bg-green-500' },
                { type: 'modified', label: '변경',  color: 'bg-yellow-500' },
                { type: 'removed',  label: '삭제',  color: 'bg-red-500' },
              ].map(({ type, label, color }) => {
                const count = item.changeItems.filter((c) => c.type === type).length;
                return count > 0 ? (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-xs text-gray-600 flex-1">{label}</span>
                    <span className="text-xs font-semibold text-gray-700">{count}건</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
