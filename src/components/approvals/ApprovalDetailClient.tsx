'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { APPROVAL_ITEMS, type ApprovalItem } from '@/lib/approvalsData';
import ApprovalStatusBadge from '@/components/shared/ApprovalStatusBadge';
import ApprovalStepTimeline from '@/components/shared/ApprovalStepTimeline';
import ApprovalActionPanel, { type ActionResult } from '@/components/shared/ApprovalActionPanel';
import { DUMMY_DOCUMENTS } from '@/lib/documentsData';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="w-24 flex-shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="flex-1 text-xs text-gray-800">{children}</span>
    </div>
  );
}

export default function ApprovalDetailClient({ approvalId }: { approvalId: number }) {
  const router = useRouter();
  const item: ApprovalItem | undefined = APPROVAL_ITEMS.find((a) => a.id === approvalId);

  const [processed, setProcessed] = useState(false);
  const [processResult, setProcessResult] = useState<{ action: ActionResult; comment: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">결재 항목을 찾을 수 없습니다</p>
        <button onClick={() => router.push('/approvals')}
          className="mt-3 text-xs text-blue-600 hover:underline">목록으로 돌아가기</button>
      </div>
    );
  }

  const doc = DUMMY_DOCUMENTS.find((d) => d.id === item.docId);
  const relatedDocs = (item.relatedDocIds ?? [])
    .map((id) => DUMMY_DOCUMENTS.find((d) => d.id === id))
    .filter(Boolean);

  const canProcess = ['결재 대기', '검토 중', '보류'].includes(item.status) && !processed;

  const handleAction = async (action: ActionResult, comment: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsProcessing(false);
    setProcessed(true);
    setProcessResult({ action, comment });
  };

  const actionLabel = processResult?.action === 'approved' ? '승인' : processResult?.action === 'rejected' ? '반려' : '보류';
  const actionColor = processResult?.action === 'approved' ? 'text-green-700 bg-green-50 border-green-200' :
                      processResult?.action === 'rejected' ? 'text-red-700 bg-red-50 border-red-200' :
                      'text-yellow-700 bg-yellow-50 border-yellow-200';

  return (
    <div className="flex gap-5 px-6 py-5 min-h-full items-start">
      {/* ── 왼쪽 메인 ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* 처리 완료 배너 */}
        {processed && processResult && (
          <div className={`rounded-xl border p-4 flex items-center gap-3 ${actionColor}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold">{actionLabel} 처리 완료</p>
              {processResult.comment && (
                <p className="text-xs mt-0.5 opacity-80">{processResult.comment}</p>
              )}
            </div>
            <button onClick={() => router.push('/approvals')}
              className="text-xs font-medium underline opacity-70 hover:opacity-100">목록으로</button>
          </div>
        )}

        {/* 문서 헤더 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {item.urgency !== 'normal' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    {item.urgency === 'critical' ? '긴급처리' : '긴급'}
                  </span>
                )}
                <span className="text-xs text-gray-400 font-mono">{item.docNo}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{item.docType}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs font-semibold text-gray-700">{item.docVer}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{item.docName}</h1>
              {item.docDescription && (
                <p className="text-xs text-gray-500 mt-1">{item.docDescription}</p>
              )}
              <div className="flex items-center gap-2 mt-2.5">
                <ApprovalStatusBadge status={item.status} urgency={item.urgency !== 'normal' ? item.urgency : undefined} />
              </div>
            </div>
            <button
              onClick={() => router.push(`/documents/${item.docId}`)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              문서 원본 보기
            </button>
          </div>
        </div>

        {/* 결재 요청 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
            <h2 className="text-sm font-semibold text-gray-800">결재 요청 정보</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="요청자">{item.requestedBy} ({item.requestedByDept})</InfoRow>
              <InfoRow label="요청일시">{item.requestedAt}</InfoRow>
              <InfoRow label="처리 기한">
                <span className={(() => {
                  const d = new Date(item.dueDate).getTime() - Date.now();
                  return d < 0 ? 'text-red-600 font-semibold' : d < 2 * 86400000 ? 'text-orange-600 font-semibold' : '';
                })()}>
                  {item.dueDate}
                  {(() => {
                    const days = Math.floor((new Date(item.dueDate).getTime() - Date.now()) / 86400000);
                    if (days < 0) return <span className="ml-1 text-[10px]">({Math.abs(days)}일 초과)</span>;
                    if (days === 0) return <span className="ml-1 text-[10px]">(오늘 마감)</span>;
                    return <span className="ml-1 text-[10px] text-gray-400">({days}일 남음)</span>;
                  })()}
                </span>
              </InfoRow>
            </div>
            <div>
              <InfoRow label="문서번호">{item.docNo}</InfoRow>
              <InfoRow label="문서유형">{item.docType}</InfoRow>
              <InfoRow label="버전">{item.docVer}</InfoRow>
            </div>
          </div>
          {item.requestComment && (
            <div className="px-5 pb-4">
              <p className="text-xs font-medium text-gray-500 mb-1.5">기안 사유</p>
              <div className="bg-blue-50 border-l-4 border-blue-400 px-4 py-3 rounded-r-lg text-xs text-gray-700 leading-relaxed">
                {item.requestComment}
              </div>
            </div>
          )}
        </div>

        {/* 결재선 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
            <h2 className="text-sm font-semibold text-gray-800">결재선 진행 현황</h2>
          </div>
          <div className="p-6">
            <ApprovalStepTimeline steps={item.steps} currentStepIndex={item.currentStepIndex} />
          </div>
        </div>

        {/* 이전 결재 의견 */}
        {item.steps.some((s) => s.comment && s.status !== '대기') && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
              <h2 className="text-sm font-semibold text-gray-800">결재 의견 이력</h2>
            </div>
            <div className="p-5 space-y-3">
              {item.steps.filter((s) => s.comment).map((step) => (
                <div key={step.step} className={[
                  'flex gap-3 p-3.5 rounded-xl border',
                  step.status === '승인' ? 'bg-green-50 border-green-200' :
                  step.status === '반려' ? 'bg-red-50 border-red-200' :
                  step.status === '보류' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200',
                ].join(' ')}>
                  <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-gray-600">{step.approver.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-800">{step.approver}</span>
                      <span className="text-[10px] text-gray-400">{step.role} · {step.dept}</span>
                      {step.date && <span className="text-[10px] text-gray-400">{step.date}</span>}
                      <ApprovalStatusBadge status={step.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{step.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 오른쪽 사이드바 ── */}
      <div className="w-72 flex-shrink-0 space-y-4">
        {/* 처리 패널 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className={[
            'px-4 py-3.5 border-b',
            canProcess ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100',
          ].join(' ')}>
            <h3 className="text-sm font-bold text-gray-800">
              {canProcess ? '결재 처리' : processed ? '처리 완료' : '처리 불가'}
            </h3>
            {canProcess && (
              <p className="text-[11px] text-gray-500 mt-0.5">품질 검토 단계 처리</p>
            )}
          </div>
          <div className="p-4">
            {canProcess ? (
              <ApprovalActionPanel
                onAction={handleAction}
                isProcessing={isProcessing}
                currentRole="품질 검토"
              />
            ) : (
              <div className="text-center py-6 text-gray-400">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs">
                  {processed ? '처리가 완료되었습니다' : '현재 처리 권한이 없습니다'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 문서 요약 */}
        {doc && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">문서 요약</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">작성자</span><span className="text-gray-700">{doc.author}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">소속</span><span className="text-gray-700">{doc.dept}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">등록일</span><span className="text-gray-700">{doc.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">파일크기</span><span className="text-gray-700">{doc.fileSize}</span></div>
            </div>
            <button
              onClick={() => router.push(`/documents/${item.docId}`)}
              className="w-full mt-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              문서 상세 보기 →
            </button>
          </div>
        )}

        {/* 관련 문서 */}
        {relatedDocs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">관련 문서</h3>
            <div className="space-y-1.5">
              {relatedDocs.map((d) => d && (
                <button key={d.id} onClick={() => router.push(`/documents/${d.id}`)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-50 transition-colors group">
                  <p className="text-[10px] text-gray-400 font-mono">{d.no}</p>
                  <p className="text-xs text-gray-700 group-hover:text-blue-600 truncate">{d.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
