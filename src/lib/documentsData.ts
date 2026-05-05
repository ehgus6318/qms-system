export interface Document {
  id: number;
  no: string;
  name: string;
  type: string;
  ver: string;
  status: string;
  author: string;
  dept: string;
  date: string;
  description: string;
  fileSize: string;
}

export interface RevisionRecord {
  ver: string;
  date: string;
  author: string;
  reason: string;
  changes: string;
}

export interface ApprovalStep {
  step: number;
  role: string;
  approver: string;
  dept: string;
  status: '승인' | '반려' | '대기' | '검토 중';
  date?: string;
  comment?: string;
}

export interface ApprovalRequest {
  id: number;
  docId: number;
  docNo: string;
  docName: string;
  docType: string;
  requestedAt: string;
  requestedBy: string;
  requestedByDept: string;
  steps: ApprovalStep[];
  status: '결재 대기' | '검토 중' | '승인' | '반려' | '완료';
  urgency?: 'normal' | 'urgent';
  comment?: string;
}

export const DOC_TYPES = [
  '전체', '품질메뉴얼', '프로세스', '절차서', '지침서',
  '작업표준서', '검사기준서', '기록문서', '외부문서',
] as const;

export const DOC_STATUSES = ['전체', '승인', '검토 중', '반려', '초안'] as const;

export const DUMMY_DOCUMENTS: Document[] = [
  /* ─ 품질메뉴얼 ─ */
  { id:  1, no: 'QMS-M-001',  name: '품질메뉴얼',                    type: '품질메뉴얼', ver: 'Rev.3', status: '승인',   author: '김영훈',   dept: 'IT팀',   date: '2024-05-20', description: 'ISO 9001 기반 통합 품질 메뉴얼',       fileSize: '2.4 MB' },
  { id:  2, no: 'QMS-M-002',  name: '품질방침 및 목표',              type: '품질메뉴얼', ver: 'Rev.2', status: '승인',   author: '이부서',   dept: '관리팀', date: '2024-04-15', description: '연간 품질 방침 및 목표 수립 문서',     fileSize: '1.1 MB' },

  /* ─ 프로세스 ─ */
  { id:  3, no: 'QMS-P-001',  name: '프로세스 관리 절차',            type: '프로세스',   ver: 'Rev.2', status: '검토 중', author: '박작업',   dept: '생산팀', date: '2024-05-15', description: '핵심 프로세스 식별 및 관리 절차',     fileSize: '0.9 MB' },
  { id:  4, no: 'QMS-P-002',  name: '설계 및 개발 관리 절차',        type: '프로세스',   ver: 'Rev.1', status: '승인',   author: '최감사',   dept: '품질팀', date: '2024-04-20', description: '설계·개발 단계별 검토 및 승인 절차', fileSize: '1.5 MB' },
  { id:  5, no: 'QMS-P-003',  name: '공급자 관리 절차',              type: '프로세스',   ver: 'Rev.3', status: '승인',   author: '김영훈',   dept: 'IT팀',   date: '2024-03-10', description: '공급자 평가 및 선정·관리 프로세스',   fileSize: '1.2 MB' },
  { id:  6, no: 'QMS-P-004',  name: '생산 계획 및 관리 절차',        type: '프로세스',   ver: 'Rev.1', status: '초안',   author: '홍길동',   dept: '생산팀', date: '2024-05-06', description: '월별 생산 계획 수립 및 진도 관리',    fileSize: '0.7 MB' },

  /* ─ 절차서 ─ */
  { id:  7, no: 'QMS-S-001',  name: '문서 및 기록 관리 절차',        type: '절차서',     ver: 'Rev.4', status: '승인',   author: '김영훈',   dept: 'IT팀',   date: '2024-05-18', description: '품질 문서 작성·검토·승인·보관 절차', fileSize: '1.8 MB' },
  { id:  8, no: 'QMS-S-002',  name: '내부심사 절차',                 type: '절차서',     ver: 'Rev.2', status: '승인',   author: '이부서',   dept: '관리팀', date: '2024-04-05', description: '내부 품질심사 계획·실행·결과 처리',  fileSize: '1.3 MB' },
  { id:  9, no: 'QMS-S-003',  name: '시정 및 예방조치 절차',         type: '절차서',     ver: 'Rev.1', status: '반려',   author: '홍길동',   dept: '생산팀', date: '2024-05-07', description: '부적합 발생 시 시정·예방조치 절차',  fileSize: '0.8 MB' },
  { id: 10, no: 'QMS-S-004',  name: '고객만족 관리 절차',            type: '절차서',     ver: 'Rev.2', status: '검토 중', author: '박작업',   dept: '생산팀', date: '2024-05-01', description: '고객 불만 접수·처리·피드백 절차',    fileSize: '0.6 MB' },

  /* ─ 지침서 ─ */
  { id: 11, no: 'QMS-I-001',  name: '내부심사지침서',                type: '지침서',     ver: 'Rev.1', status: '승인',   author: '이부서',   dept: '관리팀', date: '2024-05-10', description: '내부심사 수행 기준 및 체크리스트',   fileSize: '2.0 MB' },
  { id: 12, no: 'QMS-I-002',  name: '품질기록 관리지침',             type: '지침서',     ver: 'Rev.2', status: '검토 중', author: '최감사',   dept: '품질팀', date: '2024-05-12', description: '품질 기록 식별·보관·처분 지침',      fileSize: '0.9 MB' },
  { id: 13, no: 'QMS-I-003',  name: '측정장비 관리지침',             type: '지침서',     ver: 'Rev.1', status: '승인',   author: '김영훈',   dept: 'IT팀',   date: '2024-03-22', description: '측정장비 교정·유지 관리 지침',       fileSize: '1.4 MB' },

  /* ─ 작업표준서 ─ */
  { id: 14, no: 'QMS-WI-001', name: '제품 감사 작업표준서',          type: '작업표준서', ver: 'Rev.2', status: '승인',   author: '박작업',   dept: '생산팀', date: '2024-05-09', description: '완성품 감사 기준 및 방법 표준서',    fileSize: '3.1 MB' },
  { id: 15, no: 'QMS-WI-002', name: '용접 작업 표준서',              type: '작업표준서', ver: 'Rev.3', status: '승인',   author: '이부서',   dept: '관리팀', date: '2024-04-28', description: '용접 공정 작업 방법 및 검사 기준',   fileSize: '2.7 MB' },
  { id: 16, no: 'QMS-WI-003', name: '도장 공정 작업표준서',          type: '작업표준서', ver: 'Rev.1', status: '초안',   author: '홍길동',   dept: '생산팀', date: '2024-05-06', description: '도장 공정 조건 및 품질 기준 표준서', fileSize: '1.9 MB' },

  /* ─ 검사기준서 ─ */
  { id: 17, no: 'QMS-IN-001', name: '수입검사 기준서',               type: '검사기준서', ver: 'Rev.1', status: '반려',   author: '최감사',   dept: '품질팀', date: '2024-05-08', description: '원자재·부품 수입 검사 기준 및 절차', fileSize: '1.0 MB' },
  { id: 18, no: 'QMS-IN-002', name: '공정검사 기준서',               type: '검사기준서', ver: 'Rev.2', status: '승인',   author: '박작업',   dept: '생산팀', date: '2024-04-17', description: '공정별 품질 검사 기준 및 샘플링 방법',fileSize: '1.6 MB' },
  { id: 19, no: 'QMS-IN-003', name: '완제품 검사 기준서',            type: '검사기준서', ver: 'Rev.2', status: '검토 중', author: '최감사',   dept: '품질팀', date: '2024-05-14', description: '완제품 최종 검사 항목 및 합부 기준',  fileSize: '2.2 MB' },

  /* ─ 기록문서 ─ */
  { id: 20, no: 'QMS-F-001',  name: '내부심사 체크리스트',           type: '기록문서',   ver: 'Rev.0', status: '초안',   author: '홍길동',   dept: '생산팀', date: '2024-05-07', description: '내부 심사 체크리스트 양식',          fileSize: '0.3 MB' },
  { id: 21, no: 'QMS-F-002',  name: '품질회의록',                    type: '기록문서',   ver: 'Rev.1', status: '승인',   author: '김영훈',   dept: 'IT팀',   date: '2024-05-05', description: '월간 품질회의 회의록 양식',          fileSize: '0.2 MB' },
  { id: 22, no: 'QMS-F-003',  name: '불량 현황 보고서',              type: '기록문서',   ver: 'Rev.2', status: '승인',   author: '박작업',   dept: '생산팀', date: '2024-04-30', description: '월별 불량 유형 및 발생 현황 보고서',  fileSize: '0.5 MB' },
  { id: 23, no: 'QMS-F-004',  name: '시정조치 요구서',               type: '기록문서',   ver: 'Rev.1', status: '검토 중', author: '이부서',   dept: '관리팀', date: '2024-05-11', description: '부적합 시정조치 요구 및 결과 기록',   fileSize: '0.4 MB' },

  /* ─ 외부문서 ─ */
  { id: 24, no: 'QMS-EXT-001',name: 'ISO 9001:2015 국제 표준',       type: '외부문서',   ver: '2015',  status: '승인',   author: '김영훈',   dept: 'IT팀',   date: '2023-11-01', description: 'ISO 9001:2015 품질경영시스템 요구사항',fileSize: '4.8 MB' },
  { id: 25, no: 'QMS-EXT-002',name: 'KS Q ISO 9001 한국산업표준',    type: '외부문서',   ver: '2015',  status: '승인',   author: '이부서',   dept: '관리팀', date: '2023-12-15', description: '한국산업표준 품질경영 시스템 규격',    fileSize: '5.2 MB' },
];

/* ─── 개정 이력 (문서별) ─── */
export const REVISION_HISTORIES: Record<number, RevisionRecord[]> = {
  1: [
    { ver: 'Rev.3', date: '2024-05-20', author: '김영훈', reason: '정기 개정', changes: 'ISO 9001:2015 7.5조 요구사항 반영, 문서 보존 기간 명확화' },
    { ver: 'Rev.2', date: '2023-11-10', author: '이부서', reason: '심사 지적사항 반영', changes: '4.1조 조직 상황 분석 내용 보강, 용어 정의 추가' },
    { ver: 'Rev.1', date: '2023-02-15', author: '김영훈', reason: '최초 제정', changes: '최초 발행' },
  ],
  7: [
    { ver: 'Rev.4', date: '2024-05-18', author: '김영훈', reason: '전자결재 시스템 반영', changes: '전자결재 프로세스 추가, 배포 방법 업데이트' },
    { ver: 'Rev.3', date: '2023-10-05', author: '박작업', reason: '정기 개정', changes: '기록 보존 기간 수정, 외부 문서 관리 절차 추가' },
    { ver: 'Rev.2', date: '2023-01-20', author: '이부서', reason: '심사 지적사항', changes: '배포 목록 관리 방법 명확화' },
    { ver: 'Rev.1', date: '2022-06-01', author: '김영훈', reason: '최초 제정', changes: '최초 발행' },
  ],
  3: [
    { ver: 'Rev.2', date: '2024-05-15', author: '박작업', reason: '프로세스 재설계', changes: '린(Lean) 방법론 적용, 사이클 타임 측정 항목 추가' },
    { ver: 'Rev.1', date: '2023-08-10', author: '최감사', reason: '최초 제정', changes: '최초 발행' },
  ],
};

/* ─── 결재 단계 (문서별) ─── */
export const APPROVAL_STEPS: Record<number, ApprovalStep[]> = {
  1: [
    { step: 1, role: '기안자', approver: '김영훈', dept: 'IT팀', status: '승인', date: '2024-05-19', comment: '개정 사유 명확, 상위 결재 요청합니다.' },
    { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀', status: '승인', date: '2024-05-19', comment: '내용 검토 완료. 품질팀 확인 요청.' },
    { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-20', comment: 'ISO 요구사항 부합 확인.' },
    { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-05-20' },
  ],
  3: [
    { step: 1, role: '기안자', approver: '박작업', dept: '생산팀', status: '승인', date: '2024-05-14' },
    { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '승인', date: '2024-05-15' },
    { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '검토 중' },
    { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
  ],
  9: [
    { step: 1, role: '기안자', approver: '홍길동', dept: '생산팀', status: '승인', date: '2024-05-06' },
    { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '반려', date: '2024-05-07', comment: '예방 조치 기준이 불명확합니다. 구체적 수치 기준 추가 필요.' },
    { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
  ],
};

/* ─── 결재 대기 목록 ─── */
export const PENDING_APPROVALS: ApprovalRequest[] = [
  {
    id: 101,
    docId: 3,
    docNo: 'QMS-P-001',
    docName: '프로세스 관리 절차',
    docType: '프로세스',
    requestedAt: '2024-05-15 09:30',
    requestedBy: '박작업',
    requestedByDept: '생산팀',
    steps: APPROVAL_STEPS[3],
    status: '검토 중',
    urgency: 'urgent',
    comment: '린 방법론 적용으로 인한 프로세스 재설계 반영 요청',
  },
  {
    id: 102,
    docId: 10,
    docNo: 'QMS-S-004',
    docName: '고객만족 관리 절차',
    docType: '절차서',
    requestedAt: '2024-05-01 14:00',
    requestedBy: '박작업',
    requestedByDept: '생산팀',
    steps: [
      { step: 1, role: '기안자', approver: '박작업', dept: '생산팀', status: '승인', date: '2024-05-01' },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '검토 중' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    ],
    status: '검토 중',
    urgency: 'normal',
  },
  {
    id: 103,
    docId: 12,
    docNo: 'QMS-I-002',
    docName: '품질기록 관리지침',
    docType: '지침서',
    requestedAt: '2024-05-12 11:00',
    requestedBy: '최감사',
    requestedByDept: '품질팀',
    steps: [
      { step: 1, role: '기안자', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-12' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '검토 중' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
    status: '검토 중',
    urgency: 'normal',
  },
  {
    id: 104,
    docId: 19,
    docNo: 'QMS-IN-003',
    docName: '완제품 검사 기준서',
    docType: '검사기준서',
    requestedAt: '2024-05-14 16:00',
    requestedBy: '최감사',
    requestedByDept: '품질팀',
    steps: [
      { step: 1, role: '기안자', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-14' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '대기' },
    ],
    status: '결재 대기',
    urgency: 'urgent',
  },
  {
    id: 105,
    docId: 23,
    docNo: 'QMS-F-004',
    docName: '시정조치 요구서',
    docType: '기록문서',
    requestedAt: '2024-05-11 10:30',
    requestedBy: '이부서',
    requestedByDept: '관리팀',
    steps: [
      { step: 1, role: '기안자', approver: '이부서', dept: '관리팀', status: '승인', date: '2024-05-11' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '대기' },
    ],
    status: '결재 대기',
    urgency: 'normal',
  },
];

/* ─── 내가 요청한 결재 ─── */
export const MY_REQUESTS: ApprovalRequest[] = [
  {
    id: 201,
    docId: 1,
    docNo: 'QMS-M-001',
    docName: '품질메뉴얼',
    docType: '품질메뉴얼',
    requestedAt: '2024-05-19 08:30',
    requestedBy: '김영훈',
    requestedByDept: 'IT팀',
    steps: APPROVAL_STEPS[1],
    status: '완료',
    comment: 'ISO 9001:2015 7.5조 요구사항 정기 개정 반영',
  },
  {
    id: 202,
    docId: 7,
    docNo: 'QMS-S-001',
    docName: '문서 및 기록 관리 절차',
    docType: '절차서',
    requestedAt: '2024-05-17 09:00',
    requestedBy: '김영훈',
    requestedByDept: 'IT팀',
    steps: [
      { step: 1, role: '기안자', approver: '김영훈', dept: 'IT팀', status: '승인', date: '2024-05-17' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀', status: '승인', date: '2024-05-17' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '검토 중' },
    ],
    status: '검토 중',
    comment: '전자결재 시스템 반영을 위한 개정',
  },
  {
    id: 203,
    docId: 5,
    docNo: 'QMS-P-003',
    docName: '공급자 관리 절차',
    docType: '프로세스',
    requestedAt: '2024-03-08 10:00',
    requestedBy: '김영훈',
    requestedByDept: 'IT팀',
    steps: [
      { step: 1, role: '기안자', approver: '김영훈', dept: 'IT팀', status: '승인', date: '2024-03-08' },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-03-09' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-03-10' },
    ],
    status: '완료',
  },
];

/* ─── 완료된 결재 ─── */
export const COMPLETED_APPROVALS: ApprovalRequest[] = [
  {
    id: 301,
    docId: 1,
    docNo: 'QMS-M-001',
    docName: '품질메뉴얼',
    docType: '품질메뉴얼',
    requestedAt: '2024-05-19 08:30',
    requestedBy: '김영훈',
    requestedByDept: 'IT팀',
    steps: APPROVAL_STEPS[1],
    status: '완료',
  },
  {
    id: 302,
    docId: 8,
    docNo: 'QMS-S-002',
    docName: '내부심사 절차',
    docType: '절차서',
    requestedAt: '2024-04-03 09:00',
    requestedBy: '이부서',
    requestedByDept: '관리팀',
    steps: [
      { step: 1, role: '기안자', approver: '이부서', dept: '관리팀', status: '승인', date: '2024-04-03' },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-04-04', comment: '내용 적합합니다.' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-04-05' },
    ],
    status: '완료',
  },
  {
    id: 303,
    docId: 9,
    docNo: 'QMS-S-003',
    docName: '시정 및 예방조치 절차',
    docType: '절차서',
    requestedAt: '2024-05-06 13:00',
    requestedBy: '홍길동',
    requestedByDept: '생산팀',
    steps: APPROVAL_STEPS[9],
    status: '반려',
  },
];

/* ─── 최근 조회 문서 ID ─── */
export const RECENT_VIEW_IDS = [1, 7, 3, 14, 18, 11, 22, 4];

/* ─── 즐겨찾기 문서 ID ─── */
export const FAVORITE_DOC_IDS = [1, 7, 14, 24, 18];
