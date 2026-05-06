/* ═══════════════════════════════════════════════════════════════════════════
   개정관리 (Revision Management) 데이터 구조 및 더미 데이터
   ── DB/API 연결 시 이 interface 를 그대로 활용합니다.
   ═══════════════════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────────────────────
// 1. Types / Enums
// ──────────────────────────────────────────────────────────────────────────

export type RevisionStatus =
  | '개정 대기'     // 개정 요청 접수, 결재 시작 전
  | '개정 진행 중'  // 결재 프로세스 진행 중
  | '개정 완료'     // 최종 승인 완료
  | '개정 반려';    // 반려됨

export type RevisionReason =
  | '정기 개정'
  | '심사 지적사항 반영'
  | '법규/표준 변경'
  | '업무 프로세스 변경'
  | '오류 수정'
  | '고객 요구사항 반영'
  | '기타';

// ──────────────────────────────────────────────────────────────────────────
// 2. Interfaces
// ──────────────────────────────────────────────────────────────────────────

/** 변경 항목 (라인별 diff 표현) */
export interface ChangeItem {
  section: string;        // 조항/섹션 번호 예: '3.2', '5.1항'
  type: 'added' | 'modified' | 'removed';
  before?: string;        // 변경 전 내용
  after?: string;         // 변경 후 내용
  description: string;   // 변경 설명
}

/** 첨부파일 변경 정보 */
export interface AttachmentChange {
  fileName: string;
  fileSize: string;
  changeType: 'added' | 'replaced' | 'removed' | 'unchanged';
}

/** 개정 이력 항목 */
export interface RevisionHistoryEntry {
  ver: string;
  date: string;
  author: string;
  reason: RevisionReason | string;
  summary: string;
}

/** 개정 결재 단계 */
export interface RevisionApprovalStep {
  step: number;
  role: string;
  approver: string;
  approverId?: string;
  dept: string;
  status: '승인' | '반려' | '검토 중' | '대기';
  date?: string;
  comment?: string;
}

/** 개정 항목 */
export interface RevisionItem {
  id: number;
  docId: number;
  docNo: string;
  docName: string;
  docType: string;
  categoryId?: string;

  currentVer: string;
  newVer: string;

  reason: RevisionReason | string;
  reasonDetail?: string;         // 기타 사유 상세
  changeSummary: string;         // 변경 내용 한줄 요약

  changeItems: ChangeItem[];     // 상세 변경 목록

  beforeContent?: string;        // 변경 전 본문 (미리보기용)
  afterContent?: string;         // 변경 후 본문

  attachmentChanges: AttachmentChange[];

  requestedAt: string;
  requestedBy: string;
  requestedByDept: string;
  requesterId?: string;

  effectiveDate?: string;        // 시행 예정일

  status: RevisionStatus;
  approvalStatus?: string;       // 결재 진행 상태 (검토 중, 승인 등)
  approvalSteps: RevisionApprovalStep[];

  history: RevisionHistoryEntry[]; // 해당 문서의 개정 이력 전체
}

/** 개정 통계 */
export interface RevisionStats {
  waiting: number;
  inProgress: number;
  completed: number;
  rejected: number;
  totalThisYear: number;
}

// ──────────────────────────────────────────────────────────────────────────
// 3. 더미 데이터
// ──────────────────────────────────────────────────────────────────────────

export const REVISION_ITEMS: RevisionItem[] = [
  /* ── 개정 대기 ──────────────────────────────────────── */
  {
    id: 2001,
    docId: 6, docNo: 'QMS-P-004', docName: '생산 계획 및 관리 절차', docType: '프로세스',
    currentVer: 'Rev.1', newVer: 'Rev.2',
    reason: '업무 프로세스 변경',
    changeSummary: 'ERP 시스템 연동에 따른 생산계획 수립 프로세스 업데이트',
    changeItems: [
      { section: '4.1', type: 'modified', before: '생산계획은 주 단위로 수립한다.', after: 'ERP 시스템을 통해 생산계획을 수립하며, 일 단위 모니터링을 원칙으로 한다.', description: 'ERP 연동 방식으로 변경' },
      { section: '4.3', type: 'added',    after: '시스템 오류 발생 시 수동 계획 수립 절차를 따른다.', description: '비상 절차 추가' },
      { section: '별표 A', type: 'modified', before: '생산계획서 양식 (수기)', after: '생산계획서 양식 (ERP 출력본)', description: '양식 업데이트' },
    ],
    beforeContent: `1. 목적\n본 절차는 월별 생산 계획을 수립하고 진도를 관리하기 위한 기준을 제공한다.\n\n2. 적용범위\n생산팀의 모든 생산 계획 수립 및 관리 활동에 적용한다.\n\n3. 책임과 권한\n- 생산팀장: 월간 생산계획 승인\n- 생산관리자: 주간 생산계획 수립 및 보고`,
    afterContent: `1. 목적\n본 절차는 ERP 시스템 연동 기반으로 생산 계획을 수립하고 실시간 진도를 관리하기 위한 기준을 제공한다.\n\n2. 적용범위\n생산팀의 모든 생산 계획 수립 및 관리 활동에 적용한다.\n\n3. 책임과 권한\n- 생산팀장: 월간/주간 생산계획 승인\n- 생산관리자: 일간 생산계획 수립 및 ERP 입력`,
    attachmentChanges: [
      { fileName: 'QMS-P-004_Rev1.pdf', fileSize: '0.7 MB', changeType: 'replaced' },
      { fileName: 'QMS-P-004_Rev2_ERP연동가이드.pdf', fileSize: '1.2 MB', changeType: 'added' },
    ],
    requestedAt: '2024-05-20 09:00', requestedBy: '홍길동', requestedByDept: '생산팀',
    effectiveDate: '2024-06-01',
    status: '개정 대기',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '홍길동', dept: '생산팀', status: '대기' },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '대기' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
    history: [
      { ver: 'Rev.1', date: '2024-05-06', author: '홍길동', reason: '정기 개정', summary: '최초 제정' },
    ],
  },
  {
    id: 2002,
    docId: 16, docNo: 'QMS-WI-003', docName: '도장 공정 작업표준서', docType: '작업표준서',
    currentVer: 'Rev.1', newVer: 'Rev.2',
    reason: '심사 지적사항 반영',
    changeSummary: '내부심사 지적사항: 도장 두께 검사 주기 및 기준 불명확 → 명확화',
    changeItems: [
      { section: '5.2', type: 'modified', before: '도장 두께는 주기적으로 검사한다.', after: '도장 두께는 로트별 5개 샘플링 검사를 실시하며, 기준치는 60±10μm로 한다.', description: '검사 주기 및 기준 수치 명확화' },
      { section: '5.4', type: 'added',    after: '기준 초과 시 전수 검사 및 불합격 처리 절차를 따른다.', description: '불합격 처리 절차 추가' },
    ],
    attachmentChanges: [
      { fileName: 'QMS-WI-003_Rev1.pdf', fileSize: '1.9 MB', changeType: 'replaced' },
    ],
    requestedAt: '2024-05-18 14:00', requestedBy: '박작업', requestedByDept: '생산팀',
    effectiveDate: '2024-06-15',
    status: '개정 대기',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '박작업', dept: '생산팀', status: '대기' },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '대기' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    ],
    history: [
      { ver: 'Rev.1', date: '2024-05-06', author: '홍길동', reason: '정기 개정', summary: '최초 제정' },
    ],
  },

  /* ── 개정 진행 중 ──────────────────────────────────── */
  {
    id: 2003,
    docId: 3, docNo: 'QMS-P-001', docName: '프로세스 관리 절차', docType: '프로세스',
    currentVer: 'Rev.1', newVer: 'Rev.2',
    reason: '업무 프로세스 변경',
    changeSummary: '린(Lean) 방법론 적용, 사이클 타임 측정 항목 추가',
    changeItems: [
      { section: '3.1', type: 'modified', before: '프로세스는 PDCA 사이클로 관리한다.', after: '프로세스는 린(Lean) 방법론 및 PDCA 사이클을 결합하여 관리한다.', description: '린 방법론 추가' },
      { section: '4.2', type: 'added',    after: '각 프로세스별 사이클 타임을 측정하고 KPI로 관리한다.', description: '사이클 타임 KPI 추가' },
      { section: '5.1', type: 'modified', before: '월간 프로세스 성과 보고', after: '주간/월간 프로세스 성과 보고 (사이클 타임, 불량률 포함)', description: '보고 주기 및 항목 추가' },
    ],
    beforeContent: `1. 목적\n핵심 프로세스를 식별하고 체계적으로 관리한다.\n\n2. 프로세스 관리 방법\n- PDCA 사이클 적용\n- 월간 성과 측정 및 보고\n- 프로세스 지도 작성 및 유지`,
    afterContent: `1. 목적\n핵심 프로세스를 린(Lean) 방법론으로 식별하고 체계적으로 관리한다.\n\n2. 프로세스 관리 방법\n- 린(Lean) + PDCA 사이클 적용\n- 주간 사이클 타임 측정 및 KPI 관리\n- 월간 성과 보고 (불량률, 리드타임 포함)\n- 프로세스 지도 작성 및 유지`,
    attachmentChanges: [
      { fileName: 'QMS-P-001_Rev1.pdf', fileSize: '0.9 MB', changeType: 'replaced' },
      { fileName: 'QMS-P-001_Rev2_린방법론참조.pdf', fileSize: '0.4 MB', changeType: 'added' },
    ],
    requestedAt: '2024-05-15 09:30', requestedBy: '박작업', requestedByDept: '생산팀',
    effectiveDate: '2024-06-01',
    status: '개정 진행 중',
    approvalStatus: '검토 중',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '박작업', dept: '생산팀', status: '승인',   date: '2024-05-14', comment: '린 방법론 적용 개정 요청' },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '승인',   date: '2024-05-15', comment: '현장 적용성 검토 완료' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '검토 중' },
      { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
    history: [
      { ver: 'Rev.1', date: '2023-08-10', author: '최감사', reason: '정기 개정', summary: '최초 제정' },
    ],
  },
  {
    id: 2004,
    docId: 7, docNo: 'QMS-S-001', docName: '문서 및 기록 관리 절차', docType: '절차서',
    currentVer: 'Rev.3', newVer: 'Rev.4',
    reason: '업무 프로세스 변경',
    changeSummary: '전자결재 시스템 도입에 따른 문서 배포·관리 방법 업데이트',
    changeItems: [
      { section: '4.1', type: 'modified', before: '문서는 종이 또는 전자 파일로 관리한다.', after: '문서는 QMS 전자결재 시스템을 통해 관리한다. 종이 출력본은 비공식 사본으로 간주한다.', description: '전자결재 시스템 기준으로 변경' },
      { section: '4.3', type: 'modified', before: '문서 배포는 관리본 스탬프를 날인한 출력본으로 한다.', after: '문서 배포는 시스템 내 전자 배포를 원칙으로 하며, 필요 시 "배포용" 워터마크 출력본을 사용한다.', description: '전자 배포 원칙으로 변경' },
      { section: '5.2', type: 'added',    after: '시스템 장애 시 비상 절차에 따라 종이 배포를 허용한다.', description: '비상 배포 절차 추가' },
    ],
    requestedAt: '2024-05-17 09:00', requestedBy: '김영훈', requestedByDept: 'IT팀',
    effectiveDate: '2024-06-01',
    status: '개정 진행 중',
    approvalStatus: '검토 중',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인', date: '2024-05-17', comment: '전자결재 시스템 반영 개정' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀',   status: '승인', date: '2024-05-17', comment: '내용 적정' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '검토 중' },
    ],
    attachmentChanges: [
      { fileName: 'QMS-S-001_Rev3.pdf', fileSize: '1.8 MB', changeType: 'replaced' },
    ],
    history: [
      { ver: 'Rev.3', date: '2023-10-05', author: '박작업', reason: '정기 개정',           summary: '기록 보존 기간 수정, 외부 문서 관리 절차 추가' },
      { ver: 'Rev.2', date: '2023-01-20', author: '이부서', reason: '심사 지적사항 반영',   summary: '배포 목록 관리 방법 명확화' },
      { ver: 'Rev.1', date: '2022-06-01', author: '김영훈', reason: '정기 개정',           summary: '최초 제정' },
    ],
  },

  /* ── 개정 완료 ──────────────────────────────────────── */
  {
    id: 2005,
    docId: 1, docNo: 'QMS-M-001', docName: '품질메뉴얼', docType: '품질메뉴얼',
    currentVer: 'Rev.2', newVer: 'Rev.3',
    reason: '정기 개정',
    changeSummary: 'ISO 9001:2015 7.5조 요구사항 반영, 문서 보존 기간 명확화',
    changeItems: [
      { section: '7.5.1', type: 'modified', before: '문서화된 정보는 조직이 정한 기간 동안 보관한다.', after: '문서화된 정보는 유형별로 보존 기간을 지정하며, 최소 5년 이상 보관한다.', description: '보존 기간 최소 기준 명확화' },
      { section: '7.5.3', type: 'added',    after: '전자 문서의 백업 주기는 주 1회 이상으로 한다.', description: '전자 문서 백업 기준 추가' },
    ],
    attachmentChanges: [
      { fileName: 'QMS-M-001_Rev2.pdf', fileSize: '2.1 MB', changeType: 'replaced' },
      { fileName: 'QMS-M-001_Rev3.pdf', fileSize: '2.4 MB', changeType: 'added' },
    ],
    requestedAt: '2024-05-19 08:30', requestedBy: '김영훈', requestedByDept: 'IT팀',
    effectiveDate: '2024-06-01',
    status: '개정 완료',
    approvalStatus: '승인',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인', date: '2024-05-19', comment: '정기 개정 사유 명확' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀',   status: '승인', date: '2024-05-19', comment: '내용 검토 완료' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-20', comment: 'ISO 요구사항 부합' },
      { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-05-20', comment: '승인합니다' },
    ],
    history: [
      { ver: 'Rev.2', date: '2023-11-10', author: '이부서', reason: '심사 지적사항 반영', summary: '4.1조 조직 상황 분석 내용 보강' },
      { ver: 'Rev.1', date: '2023-02-15', author: '김영훈', reason: '정기 개정',          summary: '최초 제정' },
    ],
  },
  {
    id: 2006,
    docId: 5, docNo: 'QMS-P-003', docName: '공급자 관리 절차', docType: '프로세스',
    currentVer: 'Rev.2', newVer: 'Rev.3',
    reason: '법규/표준 변경',
    changeSummary: 'ISO 9001:2015 8.4조 개정판 반영, 공급자 평가 기준 강화',
    changeItems: [
      { section: '4.1', type: 'modified', before: '공급자 평가는 연 1회 실시한다.', after: '공급자 평가는 연 2회 이상 실시하며, 위험도 높은 공급자는 분기별로 평가한다.', description: '평가 주기 강화' },
      { section: '4.4', type: 'added',    after: '신규 공급자 인증 프로세스를 별도 규정에 따라 시행한다.', description: '신규 공급자 인증 절차 추가' },
    ],
    attachmentChanges: [
      { fileName: 'QMS-P-003_Rev2.pdf', fileSize: '1.0 MB', changeType: 'replaced' },
      { fileName: 'QMS-P-003_Rev3.pdf', fileSize: '1.2 MB', changeType: 'added' },
    ],
    requestedAt: '2024-03-08 10:00', requestedBy: '김영훈', requestedByDept: 'IT팀',
    effectiveDate: '2024-04-01',
    status: '개정 완료',
    approvalStatus: '승인',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인', date: '2024-03-08' },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-03-09', comment: '공급자 평가 기준 적정' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-03-10' },
    ],
    history: [
      { ver: 'Rev.2', date: '2023-05-10', author: '이부서', reason: '정기 개정',          summary: '공급자 등록 절차 추가' },
      { ver: 'Rev.1', date: '2022-09-01', author: '김영훈', reason: '정기 개정',          summary: '최초 제정' },
    ],
  },

  /* ── 개정 반려 ──────────────────────────────────────── */
  {
    id: 2007,
    docId: 17, docNo: 'QMS-IN-001', docName: '수입검사 기준서', docType: '검사기준서',
    currentVer: 'Rev.0', newVer: 'Rev.1',
    reason: '심사 지적사항 반영',
    changeSummary: 'AQL 기준 개정 및 수입검사 절차 현행화',
    changeItems: [
      { section: '3.1', type: 'modified', before: '불량률 허용 기준: 1.5%', after: '불량률 허용 기준: AQL 1.0 (KS A ISO 2859-1 기준)', description: 'AQL 기준 변경' },
    ],
    attachmentChanges: [
      { fileName: 'QMS-IN-001_Rev1.pdf', fileSize: '1.0 MB', changeType: 'added' },
    ],
    requestedAt: '2024-05-08 09:00', requestedBy: '최감사', requestedByDept: '품질팀',
    status: '개정 반려',
    approvalSteps: [
      { step: 1, role: '기안자',    approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-08' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '승인', date: '2024-05-09' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '반려', date: '2024-05-10', comment: 'AQL 기준이 업계 표준과 상이합니다. KS A ISO 2859-1 기준으로 재검토 필요. 구체적 샘플 크기 및 허용 불량 개수 표 첨부 필요.' },
    ],
    history: [],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 4. 헬퍼 함수
// ──────────────────────────────────────────────────────────────────────────

export function calcRevisionStats(items: RevisionItem[]): RevisionStats {
  return {
    waiting:     items.filter((i) => i.status === '개정 대기').length,
    inProgress:  items.filter((i) => i.status === '개정 진행 중').length,
    completed:   items.filter((i) => i.status === '개정 완료').length,
    rejected:    items.filter((i) => i.status === '개정 반려').length,
    totalThisYear: items.length,
  };
}

export interface RevisionStats {
  waiting: number;
  inProgress: number;
  completed: number;
  rejected: number;
  totalThisYear: number;
}
