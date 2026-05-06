'use client';

import { useState } from 'react';

export type ActionResult = 'approved' | 'rejected' | 'held';

interface ApprovalActionPanelProps {
  onAction: (result: ActionResult, comment: string) => void;
  isProcessing?: boolean;
  disabled?: boolean;
  currentRole?: string;
}

export default function ApprovalActionPanel({
  onAction,
  isProcessing = false,
  disabled = false,
  currentRole = '검토자',
}: ApprovalActionPanelProps) {
  const [comment, setComment] = useState('');
  const [activeAction, setActiveAction] = useState<ActionResult | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ActionResult | null>(null);

  const handleClick = (action: ActionResult) => {
    if (action === 'rejected' && !comment.trim()) {
      setActiveAction(action); // 반려 시 의견 필수 안내
      return;
    }
    setConfirmTarget(action);
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    onAction(confirmTarget, comment);
    setConfirmTarget(null);
    setComment('');
    setActiveAction(null);
  };

  return (
    <div className="space-y-4">
      {/* 처리 의견 입력 */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          처리 의견
          {activeAction === 'rejected' && !comment.trim() && (
            <span className="ml-2 text-red-500 font-normal text-[11px]">반려 시 의견 입력이 필수입니다</span>
          )}
        </label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => { setComment(e.target.value); setActiveAction(null); }}
          disabled={disabled}
          placeholder={`${currentRole}로서 처리 의견을 입력하세요.\n(반려 시 필수, 승인/보류 시 선택)`}
          className={[
            'w-full px-3 py-2.5 text-sm border rounded-xl resize-none focus:outline-none focus:ring-2 transition-all',
            disabled ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-white border-gray-200 focus:ring-blue-500 focus:border-transparent',
            activeAction === 'rejected' && !comment.trim() ? 'border-red-300 ring-2 ring-red-100' : '',
          ].join(' ')}
        />
        <div className="flex justify-end mt-1">
          <span className={`text-[11px] ${comment.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {comment.length}/500
          </span>
        </div>
      </div>

      {/* 빠른 의견 템플릿 */}
      {!disabled && (
        <div>
          <p className="text-[11px] text-gray-400 mb-1.5">빠른 의견 선택</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              '내용 검토 완료, 적정합니다.',
              'ISO 요구사항 부합 확인.',
              '현장 적용성 검토 완료.',
              '재작성 후 재기안 요청.',
              '추가 자료 첨부 필요.',
            ].map((tmpl) => (
              <button
                key={tmpl}
                type="button"
                onClick={() => setComment((prev) => prev ? prev + ' ' + tmpl : tmpl)}
                className="px-2.5 py-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors border border-gray-200"
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      {!disabled && (
        <div className="flex gap-2.5">
          {/* 보류 */}
          <button
            onClick={() => handleClick('held')}
            disabled={isProcessing}
            className="flex-1 py-2.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-300 rounded-xl hover:bg-yellow-100 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            보류
          </button>
          {/* 반려 */}
          <button
            onClick={() => handleClick('rejected')}
            disabled={isProcessing}
            className="flex-1 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-xl hover:bg-red-100 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            반려
          </button>
          {/* 승인 */}
          <button
            onClick={() => handleClick('approved')}
            disabled={isProcessing}
            className="flex-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isProcessing ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isProcessing ? '처리 중...' : '승인'}
          </button>
        </div>
      )}

      {/* 확인 모달 */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className={[
              'px-5 py-4 border-b',
              confirmTarget === 'approved' ? 'bg-blue-50 border-blue-100' :
              confirmTarget === 'rejected' ? 'bg-red-50 border-red-100' :
              'bg-yellow-50 border-yellow-100',
            ].join(' ')}>
              <div className="flex items-center gap-2">
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  confirmTarget === 'approved' ? 'bg-blue-100' :
                  confirmTarget === 'rejected' ? 'bg-red-100' : 'bg-yellow-100',
                ].join(' ')}>
                  {confirmTarget === 'approved' && <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {confirmTarget === 'rejected' && <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                  {confirmTarget === 'held'     && <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" /></svg>}
                </div>
                <h3 className="text-sm font-bold text-gray-800">
                  {confirmTarget === 'approved' ? '승인 처리' : confirmTarget === 'rejected' ? '반려 처리' : '보류 처리'}하시겠습니까?
                </h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-600 mb-3">
                {confirmTarget === 'approved' && '다음 결재 단계로 이동하거나 최종 승인 처리됩니다.'}
                {confirmTarget === 'rejected' && '반려 처리 후 기안자에게 알림이 전송됩니다.'}
                {confirmTarget === 'held' && '처리를 일시 보류합니다. 추후 재검토 시 재개 가능합니다.'}
              </p>
              {comment && (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 border border-gray-200 mb-3">
                  <p className="font-medium text-gray-500 mb-1">입력한 의견:</p>
                  {comment}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmTarget(null)}
                  className="flex-1 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirm}
                  className={[
                    'flex-1 py-2 text-sm font-semibold text-white rounded-xl transition-colors',
                    confirmTarget === 'approved' ? 'bg-blue-600 hover:bg-blue-700' :
                    confirmTarget === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-yellow-500 hover:bg-yellow-600',
                  ].join(' ')}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
