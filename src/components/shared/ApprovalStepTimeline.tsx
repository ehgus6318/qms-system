'use client';

interface Step {
  step: number;
  role: string;
  approver: string;
  dept: string;
  status: string;
  date?: string;
  comment?: string;
  duration?: number;
}

interface ApprovalStepTimelineProps {
  steps: Step[];
  currentStepIndex?: number;
  compact?: boolean;
}

const STEP_CONFIG: Record<string, { icon: React.ReactNode; border: string; bg: string; text: string; connLine: string }> = {
  승인: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    border: 'border-green-400', bg: 'bg-green-500', text: 'text-white', connLine: 'bg-green-300',
  },
  반려: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
    border: 'border-red-400', bg: 'bg-red-500', text: 'text-white', connLine: 'bg-red-300',
  },
  보류: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    border: 'border-yellow-400', bg: 'bg-yellow-500', text: 'text-white', connLine: 'bg-yellow-300',
  },
  '검토 중': {
    icon: <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    border: 'border-blue-400 border-2', bg: 'bg-blue-50', text: 'text-blue-600', connLine: 'bg-blue-200',
  },
  대기: {
    icon: <span className="text-xs font-bold text-gray-400">○</span>,
    border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-400', connLine: 'bg-gray-200',
  },
};

export default function ApprovalStepTimeline({ steps, currentStepIndex, compact = false }: ApprovalStepTimelineProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {steps.map((step, i) => {
          const cfg = STEP_CONFIG[step.status] ?? STEP_CONFIG['대기'];
          return (
            <div key={step.step} className="flex items-center gap-1.5">
              <div
                title={`${step.role}: ${step.approver} (${step.status})`}
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${cfg.border} ${cfg.bg} ${cfg.text} cursor-help`}
              >
                <span className="text-[10px] font-bold">{step.step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-4 ${cfg.connLine}`} />
              )}
            </div>
          );
        })}
        <span className="ml-1 text-[10px] text-gray-400">
          {steps.filter((s) => s.status === '승인').length}/{steps.length}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 배경 연결선 */}
      <div className="absolute top-6 left-6 right-6 h-px bg-gray-100 z-0" />

      <div className="flex items-start justify-between relative z-10">
        {steps.map((step, i) => {
          const cfg = STEP_CONFIG[step.status] ?? STEP_CONFIG['대기'];
          const isCurrent = step.status === '검토 중';

          return (
            <div key={step.step} className="flex flex-col items-center flex-1">
              {/* 아이콘 */}
              <div
                className={[
                  'w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all',
                  cfg.border, cfg.bg,
                  isCurrent ? 'ring-4 ring-blue-100 shadow-md' : '',
                ].join(' ')}
              >
                <span className={cfg.text}>{cfg.icon}</span>
              </div>

              {/* 이름 / 역할 */}
              <div className="text-center px-1">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{step.approver}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{step.role}</p>
                <p className="text-[10px] text-gray-400">{step.dept}</p>
                {step.date && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{step.date}</p>
                )}
                {/* 상태 뱃지 */}
                <span className={[
                  'inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium',
                  step.status === '승인'   ? 'bg-green-100 text-green-700' :
                  step.status === '반려'   ? 'bg-red-100 text-red-700' :
                  step.status === '보류'   ? 'bg-yellow-100 text-yellow-700' :
                  step.status === '검토 중'? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                ].join(' ')}>
                  {step.status}
                </span>

                {/* 의견 */}
                {step.comment && (
                  <div className="mt-2 max-w-[110px] bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1.5 text-[10px] text-gray-700 text-left leading-relaxed">
                    <svg className="w-2.5 h-2.5 text-yellow-500 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    {step.comment.length > 50 ? step.comment.slice(0, 50) + '…' : step.comment}
                  </div>
                )}
                {step.duration !== undefined && step.duration > 0 && (
                  <p className="text-[9px] text-gray-300 mt-1">{step.duration}분 소요</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
