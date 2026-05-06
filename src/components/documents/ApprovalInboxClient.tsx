'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PENDING_APPROVALS,
  MY_REQUESTS,
  COMPLETED_APPROVALS,
  type ApprovalRequest,
  type ApprovalStep,
} from '@/lib/documentsData';
import { getStatusStyle } from '@/lib/qmsColors';

type TabId = 'pending' | 'my' | 'done';

/* ── 상태 배지 ── */
function StatusBadge({ status }: { status: string }) {
  const s = getStatusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

/* ── 결재 진행 미니 바 ── */
function ApprovalProgress({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {steps.map((step, i) => {
        const colorMap: Record<string, string> = {
          '승인':   'bg-green-500',
          '반려':   'bg-red-500',
          '검토 중':'bg-blue-400',
          '대기':   'bg-gray-200',
        };
        return (
          <div key={i} className="flex items-center gap-1">
            <div title={`${step.role}: ${step.approver} (${step.status})`}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-bold ${colorMap[step.status] ?? 'bg-gray-200'}`}>
              {step.step}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-4 ${colorMap[step.status] ?? 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-[10px] text-gray-400">
        {steps.filter((s) => s.status === '승인').length}/{steps.length} 완료
      </span>
    </div>
  );
}

/* ── 결재 카드 ── */
function ApprovalCard({
  req,
  showActions,
  onApprove,
  onReject,
}: {
  req: ApprovalRequest;
  showActions?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}) {
  const router = useRouter();
  const isUrgent = req.urgency === 'urgent';
  const currentStep = req.steps.find((s) => s.status === '검토 중' || s.status === '대기');
  const daysDiff = Math.floor(
    (new Date().getTime() - new Date(req.requestedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={[
        'bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        isUrgent ? 'border-orange-300 border-l-4 border-l-orange-400' : 'border-gray-200',
      ].join(' ')}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  긴급
                </span>
              )}
              <span className="text-[11px] text-gray-400 font-mono">{req.docNo}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-[11px] text-gray-400">{req.docType}</span>
            </div>
            <button
              onClick={() => router.push(`/documents/${req.docId}`)}
              className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors text-left truncate block max-w-xs"
            >
              {req.docName}
            </button>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
              <span>{req.requestedBy} ({req.requestedByDept})</span>
              <span>·</span>
              <span>{req.requestedAt}</span>
              {daysDiff > 0 && (
                <span className={`font-medium ${daysDiff >= 3 ? 'text-red-500' : 'text-gray-400'}`}>
                  ({daysDiff}일 경과)
                </span>
              )}
            </div>
            {req.comment && (
              <p className="mt-1.5 text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded border-l-2 border-gray-300 italic">
                &ldquo;{req.comment}&rdquo;
              </p>
            )}
            <ApprovalProgress steps={req.steps} />
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <StatusBadge status={req.status} />
            {currentStep && showActions && (
              <span className="text-[10px] text-gray-400">{currentStep.role} 차례</span>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => router.push(`/documents/${req.docId}`)}
              className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              문서 보기
            </button>
            <button
              onClick={() => onReject?.(req.id)}
              className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              반려
            </button>
            <button
              onClick={() => onApprove?.(req.id)}
              className="flex-1 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              승인
            </button>
          </div>
        )}
        {!showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => router.push(`/documents/${req.docId}`)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              문서 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 반려 모달 ── */
function RejectModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (comment: string) => void;
  onClose: () => void;
}) {
  const [comment, setComment] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            문서 반려
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-600 mb-3">반려 사유를 기재해주세요. 작성자에게 알림이 전송됩니다.</p>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="반려 사유를 구체적으로 기술하세요. (필수)"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
        </div>
        <div className="px-5 pb-4 flex gap-2 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            취소
          </button>
          <button
            onClick={() => { if (comment.trim()) onConfirm(comment); }}
            disabled={!comment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            반려 처리
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function ApprovalInboxClient() {
  const [activeTab, setActiveTab] = useState<TabId>('pending');
  const [pendingList, setPendingList] = useState<ApprovalRequest[]>(PENDING_APPROVALS);
  const [approvedIds, setApprovedIds] = useState<Set<number>>(new Set());
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setApprovedIds((prev) => new Set([...prev, id]));
    setPendingList((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (comment: string) => {
    setPendingList((prev) => prev.filter((r) => r.id !== rejectTarget));
    setRejectTarget(null);
  };

  const pendingCount = pendingList.length;
  const urgentCount = pendingList.filter((r) => r.urgency === 'urgent').length;

  const TABS = [
    { id: 'pending' as TabId, label: '결재 대기', count: pendingCount, urgent: urgentCount > 0 },
    { id: 'my'      as TabId, label: '내가 요청한', count: MY_REQUESTS.length },
    { id: 'done'    as TabId, label: '완료',         count: COMPLETED_APPROVALS.length },
  ];

  return (
    <>
      {rejectTarget && (
        <RejectModal
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
        />
      )}

      <div className="px-6 py-5">
        {/* 통계 요약 */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: '결재 대기', value: pendingCount, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
            { label: '긴급 처리', value: urgentCount,  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200', pulse: true },
            { label: '내가 요청', value: MY_REQUESTS.filter(r => r.status === '검토 중').length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
            { label: '이번 달 완료', value: COMPLETED_APPROVALS.length, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-4`}>
              <div className="flex items-center gap-1.5 mb-1">
                {stat.pulse && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={[
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  activeTab === tab.id
                    ? (tab.urgent ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700')
                    : 'bg-gray-200 text-gray-500',
                ].join(' ')}>
                  {tab.count}
                  {tab.urgent && ' ⚡'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 목록 */}
        <div className="space-y-3">
          {activeTab === 'pending' && (
            pendingList.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">처리할 결재 문서가 없습니다</p>
              </div>
            ) : (
              pendingList.map((req) => (
                <ApprovalCard
                  key={req.id}
                  req={req}
                  showActions
                  onApprove={handleApprove}
                  onReject={(id) => setRejectTarget(id)}
                />
              ))
            )
          )}

          {activeTab === 'my' && (
            MY_REQUESTS.map((req) => (
              <ApprovalCard key={req.id} req={req} />
            ))
          )}

          {activeTab === 'done' && (
            COMPLETED_APPROVALS.map((req) => (
              <ApprovalCard key={req.id} req={req} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
