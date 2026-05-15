/* ═══════════════════════════════════════════════════════════════════════════
   승인관리 (Approval Management) 데이터 구조 및 더미 데이터
   ── DB/API 연결 시 이 interface 를 그대로 활용합니다.
   ═══════════════════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────────────────────
// 1. Types / Enums
// ──────────────────────────────────────────────────────────────────────────

export type ApprovalItemStatus =
  | '결재 대기'   // 아직 내 차례가 아닌 대기
  | '검토 중'     // 현재 내가 처리해야 할 단계
  | '승인'        // 최종 승인 완료
  | '반려'        // 반려 처리됨
  | '보류';       // 일시 보류

export type ApprovalStepStatus = '승인' | '반려' | '보류' | '검토 중' | '대기';

export type Urgency = 'normal' | 'urgent' | 'critical';

// ──────────────────────────────────────────────────────────────────────────
// 2. Interfaces
// ──────────────────────────────────────────────────────────────────────────

/** 결재 단계 */
export interface ApprovalStep {
  step: number;
  role: string;           // 예: '기안자', '팀장 검토', '품질 검토', '최종 승인'
  approver: string;       // 성명
  approverId?: string;    // 향후 user ID 연결
  dept: string;
  status: ApprovalStepStatus;
  date?: string;          // 처리일시
  comment?: string;       // 처리 의견
  duration?: number;      // 처리 소요 시간(분) - 분석용
}

/** 결재 항목 (승인관리 메인 목록용) */
export interface ApprovalItem {
  id: number;
  docId: number;
  docNo: string;
  docName: string;
  docType: string;
  docVer: string;

  requestedAt: string;
  requestedBy: string;
  requestedByDept: string;
  requesterId?: string;   // 향후 user ID 연결

  dueDate: string;        // 처리 기한
  urgency: Urgency;

  steps: ApprovalStep[];
  currentStepIndex: number; // 현재 진행 중인 step 인덱스
  status: ApprovalItemStatus;

  requestComment?: string;  // 기안 사유/요청 메모
  docDescription?: string;  // 문서 설명

  // 관련 문서 (참조)
  relatedDocIds?: number[];
}

/** 결재 통계 (대시보드/요약용) */
export interface ApprovalStats {
  pending: number;
  reviewing: number;
  approved: number;
  rejected: number;
  held: number;
  overdueCount: number;
  avgProcessDays: number;
}

// ──────────────────────────────────────────────────────────────────────────
// 3. 더미 데이터
// ──────────────────────────────────────────────────────────────────────────

export const APPROVAL_ITEMS: ApprovalItem[] = [
  /* ── 결재 대기 ─────────────────────────────────────── */
  {
    id: 1001,
    docId: 19, docNo: 'QMS-IN-003', docName: '완제품 검사 기준서', docType: '운영문서', docVer: 'Rev.2',
    requestedAt: '2024-05-14 16:00', requestedBy: '최감사', requestedByDept: '품질팀',
    dueDate: '2024-05-21', urgency: 'urgent',
    status: '결재 대기',
    currentStepIndex: 1,
    requestComment: '완제품 합부 기준 수치 변경으로 인한 긴급 개정 요청입니다.',
    docDescription: '완제품 최종 검사 항목 및 합부 기준',
    steps: [
      { step: 1, role: '기안자',    approver: '최감사', dept: '품질팀', status: '승인',   date: '2024-05-14', comment: '합부 기준 수치 변경 및 샘플링 방법 개선 요청', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '대기' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
  },
  {
    id: 1002,
    docId: 23, docNo: 'QMS-F-004', docName: '시정조치 요구서', docType: '기록문서', docVer: 'Rev.1',
    requestedAt: '2024-05-11 10:30', requestedBy: '이부서', requestedByDept: '관리팀',
    dueDate: '2024-05-18', urgency: 'normal',
    status: '결재 대기',
    currentStepIndex: 1,
    requestComment: '5월 내부심사에서 발견된 부적합 사항에 대한 시정조치 요구서입니다.',
    docDescription: '부적합 시정조치 요구 및 결과 기록',
    steps: [
      { step: 1, role: '기안자',    approver: '이부서', dept: '관리팀', status: '승인',   date: '2024-05-11', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '대기' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    ],
  },

  /* ── 검토 중 ────────────────────────────────────────── */
  {
    id: 1003,
    docId: 3, docNo: 'QMS-P-001', docName: '프로세스 관리 절차', docType: '프로세스', docVer: 'Rev.2',
    requestedAt: '2024-05-15 09:30', requestedBy: '박작업', requestedByDept: '생산팀',
    dueDate: '2024-05-22', urgency: 'urgent',
    status: '검토 중',
    currentStepIndex: 2,
    requestComment: '린(Lean) 방법론 적용으로 인한 프로세스 재설계 반영 요청',
    docDescription: '핵심 프로세스 식별 및 관리 절차',
    relatedDocIds: [14, 18],
    steps: [
      { step: 1, role: '기안자',    approver: '박작업', dept: '생산팀', status: '승인',   date: '2024-05-14', comment: '린 방법론 적용을 위한 프로세스 재설계 요청', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '승인',   date: '2024-05-15', comment: '현장 적용성 검토 완료. 품질팀 확인 필요', duration: 120 },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '검토 중' },
      { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
  },
  {
    id: 1004,
    docId: 10, docNo: 'QMS-S-004', docName: '고객만족 관리 절차', docType: '절차서', docVer: 'Rev.2',
    requestedAt: '2024-05-01 14:00', requestedBy: '박작업', requestedByDept: '생산팀',
    dueDate: '2024-05-20', urgency: 'normal',
    status: '검토 중',
    currentStepIndex: 1,
    requestComment: '고객 불만 처리 프로세스 개선 및 피드백 양식 업데이트',
    docDescription: '고객 불만 접수·처리·피드백 절차',
    steps: [
      { step: 1, role: '기안자',    approver: '박작업', dept: '생산팀', status: '승인',   date: '2024-05-01', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '검토 중' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    ],
  },
  {
    id: 1005,
    docId: 12, docNo: 'QMS-I-002', docName: '품질기록 관리지침', docType: '지침서', docVer: 'Rev.2',
    requestedAt: '2024-05-12 11:00', requestedBy: '최감사', requestedByDept: '품질팀',
    dueDate: '2024-05-26', urgency: 'normal',
    status: '검토 중',
    currentStepIndex: 1,
    requestComment: '전자기록 관리 체계 반영을 위한 지침 개정',
    docDescription: '품질 기록 식별·보관·처분 지침',
    steps: [
      { step: 1, role: '기안자',    approver: '최감사', dept: '품질팀', status: '승인',   date: '2024-05-12', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '검토 중' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
  },

  /* ── 승인 완료 ──────────────────────────────────────── */
  {
    id: 1006,
    docId: 1, docNo: 'QMS-M-001', docName: '품질메뉴얼', docType: '매뉴얼', docVer: 'Rev.3',
    requestedAt: '2024-05-19 08:30', requestedBy: '김영훈', requestedByDept: 'IT팀',
    dueDate: '2024-05-26', urgency: 'normal',
    status: '승인',
    currentStepIndex: 3,
    requestComment: 'ISO 9001:2015 7.5조 요구사항 정기 개정 반영',
    docDescription: 'ISO 9001 기반 통합 품질 메뉴얼',
    steps: [
      { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인', date: '2024-05-19', comment: '개정 사유 명확, 상위 결재 요청', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀',   status: '승인', date: '2024-05-19', comment: '내용 검토 완료. 품질팀 확인 요청', duration: 180 },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-20', comment: 'ISO 요구사항 부합 확인', duration: 240 },
      { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-05-20', comment: '승인합니다', duration: 60 },
    ],
  },
  {
    id: 1007,
    docId: 8, docNo: 'QMS-S-002', docName: '내부심사 절차', docType: '절차서', docVer: 'Rev.2',
    requestedAt: '2024-04-03 09:00', requestedBy: '이부서', requestedByDept: '관리팀',
    dueDate: '2024-04-10', urgency: 'normal',
    status: '승인',
    currentStepIndex: 2,
    requestComment: '2024년 내부심사 계획 반영을 위한 절차 개정',
    docDescription: '내부 품질심사 계획·실행·결과 처리',
    steps: [
      { step: 1, role: '기안자',    approver: '이부서', dept: '관리팀', status: '승인', date: '2024-04-03', duration: 0 },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-04-04', comment: '내용 적합합니다', duration: 300 },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-04-05', duration: 90 },
    ],
  },
  {
    id: 1008,
    docId: 5, docNo: 'QMS-P-003', docName: '공급자 관리 절차', docType: '프로세스', docVer: 'Rev.3',
    requestedAt: '2024-03-08 10:00', requestedBy: '김영훈', requestedByDept: 'IT팀',
    dueDate: '2024-03-15', urgency: 'normal',
    status: '승인',
    currentStepIndex: 2,
    requestComment: '신규 공급자 평가 기준 강화 및 모니터링 체계 개선',
    docDescription: '공급자 평가 및 선정·관리 프로세스',
    steps: [
      { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인', date: '2024-03-08', duration: 0 },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-03-09', comment: '공급자 평가 기준 적정', duration: 200 },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-03-10', duration: 45 },
    ],
  },

  /* ── 반려 ───────────────────────────────────────────── */
  {
    id: 1009,
    docId: 9, docNo: 'QMS-S-003', docName: '시정 및 예방조치 절차', docType: '절차서', docVer: 'Rev.1',
    requestedAt: '2024-05-06 13:00', requestedBy: '홍길동', requestedByDept: '생산팀',
    dueDate: '2024-05-13', urgency: 'normal',
    status: '반려',
    currentStepIndex: 1,
    requestComment: '시정조치 프로세스 명확화 및 예방조치 기준 추가',
    docDescription: '부적합 발생 시 시정·예방조치 절차',
    steps: [
      { step: 1, role: '기안자',    approver: '홍길동', dept: '생산팀', status: '승인', date: '2024-05-06', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '반려', date: '2024-05-07', comment: '예방 조치 기준이 불명확합니다. 구체적 수치 기준(예: 불량률 X% 초과 시) 추가가 필요합니다. 재작성 후 재기안 바랍니다.', duration: 90 },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
      { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
  },
  {
    id: 1010,
    docId: 17, docNo: 'QMS-IN-001', docName: '수입검사 기준서', docType: '운영문서', docVer: 'Rev.1',
    requestedAt: '2024-05-08 09:00', requestedBy: '최감사', requestedByDept: '품질팀',
    dueDate: '2024-05-15', urgency: 'normal',
    status: '반려',
    currentStepIndex: 2,
    requestComment: '수입검사 기준 현행화 및 AQL 기준 개정',
    docDescription: '원자재·부품 수입 검사 기준 및 절차',
    steps: [
      { step: 1, role: '기안자',    approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-08', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '승인', date: '2024-05-09', comment: '검토 완료, 상위 확인 바랍니다', duration: 150 },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '반려', date: '2024-05-10', comment: 'AQL 기준이 업계 표준과 상이합니다. KS A ISO 2859-1 기준으로 재검토 필요', duration: 120 },
    ],
  },

  /* ── 보류 ───────────────────────────────────────────── */
  {
    id: 1011,
    docId: 20, docNo: 'QMS-F-001', docName: '내부심사 체크리스트', docType: '기록문서', docVer: 'Rev.0',
    requestedAt: '2024-05-07 10:00', requestedBy: '홍길동', requestedByDept: '생산팀',
    dueDate: '2024-05-28', urgency: 'normal',
    status: '보류',
    currentStepIndex: 1,
    requestComment: '2024년 내부심사 체크리스트 최초 제정',
    docDescription: '내부 심사 체크리스트 양식',
    steps: [
      { step: 1, role: '기안자',    approver: '홍길동', dept: '생산팀', status: '승인',  date: '2024-05-07', duration: 0 },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '보류',  date: '2024-05-08', comment: '내부심사 일정 확정 후 처리 예정 (5월 말 재검토)', duration: 60 },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 4. 헬퍼 함수
// ──────────────────────────────────────────────────────────────────────────

/** 처리 기한 초과 여부 */
export function isOverdue(dueDate: string, status: ApprovalItemStatus): boolean {
  if (status === '승인' || status === '반려') return false;
  return new Date(dueDate) < new Date();
}

/** 경과일 계산 */
export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

/** 남은 일 계산 (음수 = 초과) */
export function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

/** 통계 계산 */
export function calcApprovalStats(items: ApprovalItem[]): ApprovalStats {
  return {
    pending:      items.filter((i) => i.status === '결재 대기').length,
    reviewing:    items.filter((i) => i.status === '검토 중').length,
    approved:     items.filter((i) => i.status === '승인').length,
    rejected:     items.filter((i) => i.status === '반려').length,
    held:         items.filter((i) => i.status === '보류').length,
    overdueCount: items.filter((i) => isOverdue(i.dueDate, i.status)).length,
    avgProcessDays: 2.4, // 더미
  };
}
