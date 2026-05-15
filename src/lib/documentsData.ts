/* ═══════════════════════════════════════════════════════════════════════════
   QMS/DCC 문서관리 데이터 구조 및 더미 데이터
   ── DB/API 연결 시 이 파일의 interface/type 을 그대로 활용합니다.
   ═══════════════════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────────────────────
// 1. 공통 Enum / Literal Types
// ──────────────────────────────────────────────────────────────────────────

/** 문서 권한 등급 */
export type AccessLevel = 'public' | 'internal' | 'confidential';

/** 결재 단계 상태 */
export type ApprovalStepStatus = '승인' | '반려' | '대기' | '검토 중';

/** 결재 요청 전체 상태 */
export type ApprovalStatus = '결재 대기' | '검토 중' | '승인' | '반려' | '완료';

/** 회람 상태 */
export type CirculationStatus = 'pending' | 'read' | 'confirmed';

/** 부서 접근 권한 */
export type DeptPermission = 'full' | 'read' | 'none';

/** 문서 상태 */
export type DocStatus = '승인' | '검토 중' | '반려' | '초안' | '개정 중' | '폐기';

// ──────────────────────────────────────────────────────────────────────────
// 2. 기본 엔티티 Interfaces
// ──────────────────────────────────────────────────────────────────────────

/** 부서 */
export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
}

/** 문서 분류 카테고리 (트리 구조) */
export interface DocCategory {
  id: string;
  label: string;
  parentId?: string | null;
  children?: DocCategory[];
}

/** 개별 문서 */
export interface Document {
  id: number;
  no: string;
  name: string;
  type: string;
  categoryId?: string;         // 분류체계 연결
  ver: string;
  status: DocStatus | string;
  accessLevel: AccessLevel;   // 문서 권한 등급
  author: string;
  authorId?: string;
  dept: string;
  deptId?: string;
  date: string;
  description: string;
  fileSize: string;
  appliedDepts?: AppliedDept[];    // 적용부서
  circulationList?: CirculationItem[]; // 회람 목록
  keywords?: string[];
  retentionPeriod?: string;
  relatedStandard?: string;
  effectiveDate?: string;
}

/** 개정 이력 레코드 */
export interface RevisionRecord {
  ver: string;
  date: string;
  author: string;
  reason: string;
  changes: string;
}

/** 결재 단계 */
export interface ApprovalStep {
  step: number;
  role: string;
  approver: string;
  approverId?: string;
  dept: string;
  status: ApprovalStepStatus;
  date?: string;
  comment?: string;
}

/** 결재 요청 */
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
  status: ApprovalStatus;
  urgency?: 'normal' | 'urgent';
  comment?: string;
}

/** 적용부서 (문서 적용 범위) */
export interface AppliedDept {
  deptId: string;
  deptName: string;
  permission: DeptPermission; // full=전체 / read=열람만 / none=접근 불가
}

/** 회람 항목 */
export interface CirculationItem {
  deptId: string;
  deptName: string;
  representative: string;       // 회람 담당자
  status: CirculationStatus;
  readAt?: string;
  confirmedAt?: string;
}

// ──────────────────────────────────────────────────────────────────────────
// 3. 상수 (필터용)
// ──────────────────────────────────────────────────────────────────────────

export const DOC_TYPES = [
  '전체', '매뉴얼', '프로세스', '절차서', '지침서',
  '운영문서', '서식', '기록문서', '외부문서',
] as const;

export const DOC_STATUSES = ['전체', '승인', '검토 중', '반려', '초안'] as const;

export const ACCESS_LEVEL_META: Record<AccessLevel, { label: string; color: string; desc: string }> = {
  public:       { label: '일반문서',   color: 'text-green-700 bg-green-100',  desc: '전 직원 열람 가능' },
  internal:     { label: '내부용',     color: 'text-blue-700 bg-blue-100',    desc: '임직원 한정 열람' },
  confidential: { label: '보안문서',   color: 'text-red-700 bg-red-100',      desc: '지정 부서/인원만 열람 가능' },
};

// ──────────────────────────────────────────────────────────────────────────
// 4. 부서 마스터
// ──────────────────────────────────────────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  { id: 'D01', name: 'IT팀',   code: 'IT'  },
  { id: 'D02', name: '관리팀', code: 'MGT' },
  { id: 'D03', name: '생산팀', code: 'PRD' },
  { id: 'D04', name: '품질팀', code: 'QA'  },
  { id: 'D05', name: '영업팀', code: 'SLS' },
  { id: 'D06', name: '연구소', code: 'R&D' },
  { id: 'D07', name: '구매팀', code: 'PUR' },
  { id: 'D08', name: '경영진', code: 'EXC' },
];

// ──────────────────────────────────────────────────────────────────────────
// 5. 문서 분류 트리
// ──────────────────────────────────────────────────────────────────────────

export const DOC_CATEGORIES: DocCategory[] = [
  {
    id: 'C1', label: '관리문서', children: [
      { id: 'C1-1', label: '매뉴얼',   parentId: 'C1' },
      { id: 'C1-2', label: '프로세스', parentId: 'C1' },
      { id: 'C1-3', label: '절차서',   parentId: 'C1' },
      { id: 'C1-4', label: '지침서',   parentId: 'C1' },
    ],
  },
  {
    id: 'C2', label: '운영문서', children: [
      { id: 'C2-1', label: '운영문서',   parentId: 'C2' },
      { id: 'C2-2', label: '서식',       parentId: 'C2' },
      { id: 'C2-3', label: '공정기준',   parentId: 'C2' },
    ],
  },
  {
    id: 'C3', label: '기록문서', children: [
      { id: 'C3-1', label: '품질기록',     parentId: 'C3' },
      { id: 'C3-2', label: '생산기록',     parentId: 'C3' },
      { id: 'C3-3', label: '검사기록',     parentId: 'C3' },
    ],
  },
  {
    id: 'C4', label: '외부참조문서', children: [
      { id: 'C4-1', label: '국제표준',     parentId: 'C4' },
      { id: 'C4-2', label: '고객요구사항', parentId: 'C4' },
      { id: 'C4-3', label: '법규/규정',    parentId: 'C4' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 6. 더미 문서 목록
// ──────────────────────────────────────────────────────────────────────────

export const DUMMY_DOCUMENTS: Document[] = [
  /* ─ 매뉴얼 ─ */
  {
    id: 1, no: 'DOC-M-001', name: '경영 매뉴얼', type: '매뉴얼', categoryId: 'C1-1',
    ver: 'Rev.3', status: '승인', accessLevel: 'internal', author: '김영훈', dept: 'IT팀',
    date: '2024-05-20', description: 'ISO 9001 기반 통합 품질 메뉴얼', fileSize: '2.4 MB',
    keywords: ['ISO9001', '품질방침', '품질목표'],
    retentionPeriod: '영구', relatedStandard: 'ISO 9001:2015', effectiveDate: '2024-06-01',
    appliedDepts: [
      { deptId: 'D01', deptName: 'IT팀',   permission: 'full' },
      { deptId: 'D02', deptName: '관리팀', permission: 'full' },
      { deptId: 'D03', deptName: '생산팀', permission: 'read' },
      { deptId: 'D04', deptName: '품질팀', permission: 'full' },
    ],
    circulationList: [
      { deptId: 'D02', deptName: '관리팀', representative: '이부서', status: 'confirmed', readAt: '2024-05-21', confirmedAt: '2024-05-22' },
      { deptId: 'D03', deptName: '생산팀', representative: '박작업', status: 'read',      readAt: '2024-05-21' },
      { deptId: 'D04', deptName: '품질팀', representative: '최감사', status: 'confirmed', readAt: '2024-05-20', confirmedAt: '2024-05-21' },
    ],
  },
  {
    id: 2, no: 'QMS-M-002', name: '품질방침 및 목표', type: '매뉴얼', categoryId: 'C1-1',
    ver: 'Rev.2', status: '승인', accessLevel: 'internal', author: '이부서', dept: '관리팀',
    date: '2024-04-15', description: '연간 품질 방침 및 목표 수립 문서', fileSize: '1.1 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 6.2',
    appliedDepts: [
      { deptId: 'D01', deptName: 'IT팀',   permission: 'read' },
      { deptId: 'D02', deptName: '관리팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'full' },
    ],
    circulationList: [
      { deptId: 'D01', deptName: 'IT팀',   representative: '김영훈', status: 'confirmed', readAt: '2024-04-16', confirmedAt: '2024-04-17' },
      { deptId: 'D04', deptName: '품질팀', representative: '최감사', status: 'confirmed', readAt: '2024-04-16', confirmedAt: '2024-04-16' },
    ],
  },
  /* ─ 프로세스 ─ */
  {
    id: 3, no: 'QMS-P-001', name: '프로세스 관리 절차', type: '프로세스', categoryId: 'C1-2',
    ver: 'Rev.2', status: '검토 중', accessLevel: 'internal', author: '박작업', dept: '생산팀',
    date: '2024-05-15', description: '핵심 프로세스 식별 및 관리 절차', fileSize: '0.9 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 4.4',
    appliedDepts: [
      { deptId: 'D03', deptName: '생산팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
    ],
    circulationList: [],
  },
  {
    id: 4, no: 'QMS-P-002', name: '설계 및 개발 관리 절차', type: '프로세스', categoryId: 'C1-2',
    ver: 'Rev.1', status: '승인', accessLevel: 'internal', author: '최감사', dept: '품질팀',
    date: '2024-04-20', description: '설계·개발 단계별 검토 및 승인 절차', fileSize: '1.5 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 8.3',
    appliedDepts: [
      { deptId: 'D04', deptName: '품질팀', permission: 'full' },
      { deptId: 'D06', deptName: '연구소', permission: 'full' },
    ],
    circulationList: [
      { deptId: 'D06', deptName: '연구소', representative: '이연구', status: 'confirmed', readAt: '2024-04-21', confirmedAt: '2024-04-22' },
    ],
  },
  {
    id: 5, no: 'QMS-P-003', name: '공급자 관리 절차', type: '프로세스', categoryId: 'C1-2',
    ver: 'Rev.3', status: '승인', accessLevel: 'internal', author: '김영훈', dept: 'IT팀',
    date: '2024-03-10', description: '공급자 평가 및 선정·관리 프로세스', fileSize: '1.2 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 8.4',
    appliedDepts: [
      { deptId: 'D07', deptName: '구매팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
    ],
    circulationList: [
      { deptId: 'D07', deptName: '구매팀', representative: '이구매', status: 'confirmed', readAt: '2024-03-11', confirmedAt: '2024-03-12' },
    ],
  },
  {
    id: 6, no: 'QMS-P-004', name: '생산 계획 및 관리 절차', type: '프로세스', categoryId: 'C1-2',
    ver: 'Rev.1', status: '초안', accessLevel: 'internal', author: '홍길동', dept: '생산팀',
    date: '2024-05-06', description: '월별 생산 계획 수립 및 진도 관리', fileSize: '0.7 MB',
    retentionPeriod: '3년',
    appliedDepts: [{ deptId: 'D03', deptName: '생산팀', permission: 'full' }],
    circulationList: [],
  },
  /* ─ 절차서 ─ */
  {
    id: 7, no: 'QMS-S-001', name: '문서 및 기록 관리 절차', type: '절차서', categoryId: 'C1-3',
    ver: 'Rev.4', status: '승인', accessLevel: 'public', author: '김영훈', dept: 'IT팀',
    date: '2024-05-18', description: '품질 문서 작성·검토·승인·보관 절차', fileSize: '1.8 MB',
    keywords: ['문서관리', '기록관리', 'DCC'],
    retentionPeriod: '영구', relatedStandard: 'ISO 9001:2015 7.5',
    appliedDepts: [
      { deptId: 'D01', deptName: 'IT팀',   permission: 'full' },
      { deptId: 'D02', deptName: '관리팀', permission: 'read' },
      { deptId: 'D03', deptName: '생산팀', permission: 'read' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
    ],
    circulationList: [
      { deptId: 'D02', deptName: '관리팀', representative: '이부서', status: 'confirmed', readAt: '2024-05-19', confirmedAt: '2024-05-20' },
      { deptId: 'D03', deptName: '생산팀', representative: '박작업', status: 'confirmed', readAt: '2024-05-19', confirmedAt: '2024-05-19' },
      { deptId: 'D04', deptName: '품질팀', representative: '최감사', status: 'confirmed', readAt: '2024-05-18', confirmedAt: '2024-05-18' },
    ],
  },
  {
    id: 8, no: 'QMS-S-002', name: '내부심사 절차', type: '절차서', categoryId: 'C1-3',
    ver: 'Rev.2', status: '승인', accessLevel: 'internal', author: '이부서', dept: '관리팀',
    date: '2024-04-05', description: '내부 품질심사 계획·실행·결과 처리', fileSize: '1.3 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 9.2',
    appliedDepts: [
      { deptId: 'D02', deptName: '관리팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'full' },
    ],
    circulationList: [
      { deptId: 'D04', deptName: '품질팀', representative: '최감사', status: 'confirmed', readAt: '2024-04-06', confirmedAt: '2024-04-07' },
    ],
  },
  {
    id: 9, no: 'QMS-S-003', name: '시정 및 예방조치 절차', type: '절차서', categoryId: 'C1-3',
    ver: 'Rev.1', status: '반려', accessLevel: 'internal', author: '홍길동', dept: '생산팀',
    date: '2024-05-07', description: '부적합 발생 시 시정·예방조치 절차', fileSize: '0.8 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 10.2',
    appliedDepts: [{ deptId: 'D03', deptName: '생산팀', permission: 'full' }],
    circulationList: [],
  },
  {
    id: 10, no: 'QMS-S-004', name: '고객만족 관리 절차', type: '절차서', categoryId: 'C1-3',
    ver: 'Rev.2', status: '검토 중', accessLevel: 'internal', author: '박작업', dept: '생산팀',
    date: '2024-05-01', description: '고객 불만 접수·처리·피드백 절차', fileSize: '0.6 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 9.1.2',
    appliedDepts: [
      { deptId: 'D03', deptName: '생산팀', permission: 'full' },
      { deptId: 'D05', deptName: '영업팀', permission: 'read' },
    ],
    circulationList: [],
  },
  /* ─ 지침서 ─ */
  {
    id: 11, no: 'QMS-I-001', name: '내부심사지침서', type: '지침서', categoryId: 'C1-4',
    ver: 'Rev.1', status: '승인', accessLevel: 'internal', author: '이부서', dept: '관리팀',
    date: '2024-05-10', description: '내부심사 수행 기준 및 체크리스트', fileSize: '2.0 MB',
    retentionPeriod: '5년', relatedStandard: 'ISO 9001:2015 9.2',
    appliedDepts: [{ deptId: 'D02', deptName: '관리팀', permission: 'full' }],
    circulationList: [],
  },
  {
    id: 12, no: 'QMS-I-002', name: '품질기록 관리지침', type: '지침서', categoryId: 'C1-4',
    ver: 'Rev.2', status: '검토 중', accessLevel: 'internal', author: '최감사', dept: '품질팀',
    date: '2024-05-12', description: '품질 기록 식별·보관·처분 지침', fileSize: '0.9 MB',
    retentionPeriod: '5년',
    appliedDepts: [{ deptId: 'D04', deptName: '품질팀', permission: 'full' }],
    circulationList: [],
  },
  {
    id: 13, no: 'QMS-I-003', name: '측정장비 관리지침', type: '지침서', categoryId: 'C1-4',
    ver: 'Rev.1', status: '승인', accessLevel: 'internal', author: '김영훈', dept: 'IT팀',
    date: '2024-03-22', description: '측정장비 교정·유지 관리 지침', fileSize: '1.4 MB',
    retentionPeriod: '5년',
    appliedDepts: [
      { deptId: 'D03', deptName: '생산팀', permission: 'read' },
      { deptId: 'D04', deptName: '품질팀', permission: 'full' },
    ],
    circulationList: [],
  },
  /* ─ 작업표준서 ─ */
  {
    id: 14, no: 'QMS-WI-001', name: '제품 감사 작업표준서', type: '운영문서', categoryId: 'C2-1',
    ver: 'Rev.2', status: '승인', accessLevel: 'internal', author: '박작업', dept: '생산팀',
    date: '2024-05-09', description: '완성품 감사 기준 및 방법 표준서', fileSize: '3.1 MB',
    retentionPeriod: '5년',
    appliedDepts: [
      { deptId: 'D03', deptName: '생산팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
    ],
    circulationList: [],
  },
  {
    id: 15, no: 'QMS-WI-002', name: '용접 작업 표준서', type: '운영문서', categoryId: 'C2-1',
    ver: 'Rev.3', status: '승인', accessLevel: 'internal', author: '이부서', dept: '관리팀',
    date: '2024-04-28', description: '용접 공정 작업 방법 및 검사 기준', fileSize: '2.7 MB',
    retentionPeriod: '5년',
    appliedDepts: [{ deptId: 'D03', deptName: '생산팀', permission: 'full' }],
    circulationList: [],
  },
  {
    id: 16, no: 'QMS-WI-003', name: '도장 공정 작업표준서', type: '운영문서', categoryId: 'C2-1',
    ver: 'Rev.1', status: '초안', accessLevel: 'internal', author: '홍길동', dept: '생산팀',
    date: '2024-05-06', description: '도장 공정 조건 및 품질 기준 표준서', fileSize: '1.9 MB',
    retentionPeriod: '5년',
    appliedDepts: [{ deptId: 'D03', deptName: '생산팀', permission: 'full' }],
    circulationList: [],
  },
  /* ─ 검사기준서 ─ */
  {
    id: 17, no: 'QMS-IN-001', name: '수입검사 기준서', type: '운영문서', categoryId: 'C2-2',
    ver: 'Rev.1', status: '반려', accessLevel: 'internal', author: '최감사', dept: '품질팀',
    date: '2024-05-08', description: '원자재·부품 수입 검사 기준 및 절차', fileSize: '1.0 MB',
    retentionPeriod: '5년',
    appliedDepts: [{ deptId: 'D04', deptName: '품질팀', permission: 'full' }],
    circulationList: [],
  },
  {
    id: 18, no: 'QMS-IN-002', name: '공정검사 기준서', type: '운영문서', categoryId: 'C2-2',
    ver: 'Rev.2', status: '승인', accessLevel: 'internal', author: '박작업', dept: '생산팀',
    date: '2024-04-17', description: '공정별 품질 검사 기준 및 샘플링 방법', fileSize: '1.6 MB',
    retentionPeriod: '5년',
    appliedDepts: [
      { deptId: 'D03', deptName: '생산팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
    ],
    circulationList: [],
  },
  {
    id: 19, no: 'QMS-IN-003', name: '완제품 검사 기준서', type: '운영문서', categoryId: 'C2-2',
    ver: 'Rev.2', status: '검토 중', accessLevel: 'internal', author: '최감사', dept: '품질팀',
    date: '2024-05-14', description: '완제품 최종 검사 항목 및 합부 기준', fileSize: '2.2 MB',
    retentionPeriod: '5년',
    appliedDepts: [{ deptId: 'D04', deptName: '품질팀', permission: 'full' }],
    circulationList: [],
  },
  /* ─ 기록문서 ─ */
  {
    id: 20, no: 'QMS-F-001', name: '내부심사 체크리스트', type: '기록문서', categoryId: 'C3-1',
    ver: 'Rev.0', status: '초안', accessLevel: 'internal', author: '홍길동', dept: '생산팀',
    date: '2024-05-07', description: '내부 심사 체크리스트 양식', fileSize: '0.3 MB',
    retentionPeriod: '3년',
    appliedDepts: [{ deptId: 'D02', deptName: '관리팀', permission: 'full' }],
    circulationList: [],
  },
  {
    id: 21, no: 'QMS-F-002', name: '품질회의록', type: '기록문서', categoryId: 'C3-1',
    ver: 'Rev.1', status: '승인', accessLevel: 'public', author: '김영훈', dept: 'IT팀',
    date: '2024-05-05', description: '월간 품질회의 회의록 양식', fileSize: '0.2 MB',
    retentionPeriod: '3년',
    appliedDepts: [
      { deptId: 'D01', deptName: 'IT팀',   permission: 'full' },
      { deptId: 'D02', deptName: '관리팀', permission: 'read' },
    ],
    circulationList: [],
  },
  {
    id: 22, no: 'QMS-F-003', name: '불량 현황 보고서', type: '기록문서', categoryId: 'C3-3',
    ver: 'Rev.2', status: '승인', accessLevel: 'confidential', author: '박작업', dept: '생산팀',
    date: '2024-04-30', description: '월별 불량 유형 및 발생 현황 보고서', fileSize: '0.5 MB',
    retentionPeriod: '5년',
    appliedDepts: [
      { deptId: 'D03', deptName: '생산팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
      { deptId: 'D08', deptName: '경영진', permission: 'read' },
    ],
    circulationList: [],
  },
  {
    id: 23, no: 'QMS-F-004', name: '시정조치 요구서', type: '기록문서', categoryId: 'C3-1',
    ver: 'Rev.1', status: '검토 중', accessLevel: 'internal', author: '이부서', dept: '관리팀',
    date: '2024-05-11', description: '부적합 시정조치 요구 및 결과 기록', fileSize: '0.4 MB',
    retentionPeriod: '3년',
    appliedDepts: [{ deptId: 'D02', deptName: '관리팀', permission: 'full' }],
    circulationList: [],
  },
  /* ─ 외부문서 ─ */
  {
    id: 24, no: 'QMS-EXT-001', name: 'ISO 9001:2015 국제 표준', type: '외부문서', categoryId: 'C4-1',
    ver: '2015', status: '승인', accessLevel: 'public', author: '김영훈', dept: 'IT팀',
    date: '2023-11-01', description: 'ISO 9001:2015 품질경영시스템 요구사항', fileSize: '4.8 MB',
    retentionPeriod: '영구',
    appliedDepts: [
      { deptId: 'D01', deptName: 'IT팀',   permission: 'read' },
      { deptId: 'D02', deptName: '관리팀', permission: 'read' },
      { deptId: 'D04', deptName: '품질팀', permission: 'full' },
    ],
    circulationList: [],
  },
  {
    id: 25, no: 'QMS-EXT-002', name: 'KS Q ISO 9001 한국산업표준', type: '외부문서', categoryId: 'C4-1',
    ver: '2015', status: '승인', accessLevel: 'public', author: '이부서', dept: '관리팀',
    date: '2023-12-15', description: '한국산업표준 품질경영 시스템 규격', fileSize: '5.2 MB',
    retentionPeriod: '영구',
    appliedDepts: [
      { deptId: 'D02', deptName: '관리팀', permission: 'full' },
      { deptId: 'D04', deptName: '품질팀', permission: 'read' },
    ],
    circulationList: [],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 7. 개정 이력 (문서별)
// ──────────────────────────────────────────────────────────────────────────

export const REVISION_HISTORIES: Record<number, RevisionRecord[]> = {
  1: [
    { ver: 'Rev.3', date: '2024-05-20', author: '김영훈', reason: '정기 개정',           changes: 'ISO 9001:2015 7.5조 요구사항 반영, 문서 보존 기간 명확화' },
    { ver: 'Rev.2', date: '2023-11-10', author: '이부서', reason: '심사 지적사항 반영',   changes: '4.1조 조직 상황 분석 내용 보강, 용어 정의 추가' },
    { ver: 'Rev.1', date: '2023-02-15', author: '김영훈', reason: '최초 제정',           changes: '최초 발행' },
  ],
  7: [
    { ver: 'Rev.4', date: '2024-05-18', author: '김영훈', reason: '전자결재 시스템 반영', changes: '전자결재 프로세스 추가, 배포 방법 업데이트' },
    { ver: 'Rev.3', date: '2023-10-05', author: '박작업', reason: '정기 개정',           changes: '기록 보존 기간 수정, 외부 문서 관리 절차 추가' },
    { ver: 'Rev.2', date: '2023-01-20', author: '이부서', reason: '심사 지적사항',        changes: '배포 목록 관리 방법 명확화' },
    { ver: 'Rev.1', date: '2022-06-01', author: '김영훈', reason: '최초 제정',           changes: '최초 발행' },
  ],
  3: [
    { ver: 'Rev.2', date: '2024-05-15', author: '박작업', reason: '프로세스 재설계',     changes: '린(Lean) 방법론 적용, 사이클 타임 측정 항목 추가' },
    { ver: 'Rev.1', date: '2023-08-10', author: '최감사', reason: '최초 제정',           changes: '최초 발행' },
  ],
  9: [
    { ver: 'Rev.1', date: '2024-05-07', author: '홍길동', reason: '최초 제정',           changes: '최초 발행 (반려됨)' },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// 8. 결재 단계 (문서별)
// ──────────────────────────────────────────────────────────────────────────

export const APPROVAL_STEPS: Record<number, ApprovalStep[]> = {
  1: [
    { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인',   date: '2024-05-19', comment: '개정 사유 명확, 상위 결재 요청합니다.' },
    { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀',   status: '승인',   date: '2024-05-19', comment: '내용 검토 완료. 품질팀 확인 요청.' },
    { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인',   date: '2024-05-20', comment: 'ISO 요구사항 부합 확인.' },
    { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인',   date: '2024-05-20' },
  ],
  3: [
    { step: 1, role: '기안자',    approver: '박작업', dept: '생산팀', status: '승인',   date: '2024-05-14' },
    { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '승인',   date: '2024-05-15' },
    { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '검토 중' },
    { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
  ],
  9: [
    { step: 1, role: '기안자',    approver: '홍길동', dept: '생산팀', status: '승인',   date: '2024-05-06' },
    { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '반려',   date: '2024-05-07', comment: '예방 조치 기준이 불명확합니다. 구체적 수치 기준 추가 필요.' },
    { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    { step: 4, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
  ],
  7: [
    { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인',   date: '2024-05-17' },
    { step: 2, role: '팀장 검토', approver: '이팀장', dept: 'IT팀',   status: '승인',   date: '2024-05-17' },
    { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '검토 중' },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// 9. 결재 대기 목록 (내가 검토해야 할 문서)
// ──────────────────────────────────────────────────────────────────────────

export const PENDING_APPROVALS: ApprovalRequest[] = [
  {
    id: 101, docId: 3, docNo: 'QMS-P-001', docName: '프로세스 관리 절차', docType: '프로세스',
    requestedAt: '2024-05-15 09:30', requestedBy: '박작업', requestedByDept: '생산팀',
    steps: APPROVAL_STEPS[3], status: '검토 중', urgency: 'urgent',
    comment: '린 방법론 적용으로 인한 프로세스 재설계 반영 요청',
  },
  {
    id: 102, docId: 10, docNo: 'QMS-S-004', docName: '고객만족 관리 절차', docType: '절차서',
    requestedAt: '2024-05-01 14:00', requestedBy: '박작업', requestedByDept: '생산팀',
    steps: [
      { step: 1, role: '기안자',    approver: '박작업', dept: '생산팀', status: '승인', date: '2024-05-01' },
      { step: 2, role: '팀장 검토', approver: '김팀장', dept: '생산팀', status: '검토 중' },
      { step: 3, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '대기' },
    ],
    status: '검토 중', urgency: 'normal',
  },
  {
    id: 103, docId: 12, docNo: 'QMS-I-002', docName: '품질기록 관리지침', docType: '지침서',
    requestedAt: '2024-05-12 11:00', requestedBy: '최감사', requestedByDept: '품질팀',
    steps: [
      { step: 1, role: '기안자',    approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-12' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '검토 중' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '대기' },
    ],
    status: '검토 중', urgency: 'normal',
  },
  {
    id: 104, docId: 19, docNo: 'QMS-IN-003', docName: '완제품 검사 기준서', docType: '검사기준서',
    requestedAt: '2024-05-14 16:00', requestedBy: '최감사', requestedByDept: '품질팀',
    steps: [
      { step: 1, role: '기안자',    approver: '최감사', dept: '품질팀', status: '승인', date: '2024-05-14' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '대기' },
    ],
    status: '결재 대기', urgency: 'urgent',
  },
  {
    id: 105, docId: 23, docNo: 'QMS-F-004', docName: '시정조치 요구서', docType: '기록문서',
    requestedAt: '2024-05-11 10:30', requestedBy: '이부서', requestedByDept: '관리팀',
    steps: [
      { step: 1, role: '기안자',    approver: '이부서', dept: '관리팀', status: '승인', date: '2024-05-11' },
      { step: 2, role: '팀장 검토', approver: '이팀장', dept: '관리팀', status: '대기' },
    ],
    status: '결재 대기', urgency: 'normal',
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 10. 내가 요청한 결재
// ──────────────────────────────────────────────────────────────────────────

export const MY_REQUESTS: ApprovalRequest[] = [
  {
    id: 201, docId: 7, docNo: 'QMS-S-001', docName: '문서 및 기록 관리 절차', docType: '절차서',
    requestedAt: '2024-05-17 09:00', requestedBy: '김영훈', requestedByDept: 'IT팀',
    steps: APPROVAL_STEPS[7], status: '검토 중',
    comment: '전자결재 시스템 반영을 위한 개정',
  },
  {
    id: 202, docId: 1, docNo: 'QMS-M-001', docName: '품질메뉴얼', docType: '품질메뉴얼',
    requestedAt: '2024-05-19 08:30', requestedBy: '김영훈', requestedByDept: 'IT팀',
    steps: APPROVAL_STEPS[1], status: '완료',
    comment: 'ISO 9001:2015 7.5조 요구사항 정기 개정 반영',
  },
  {
    id: 203, docId: 5, docNo: 'QMS-P-003', docName: '공급자 관리 절차', docType: '프로세스',
    requestedAt: '2024-03-08 10:00', requestedBy: '김영훈', requestedByDept: 'IT팀',
    steps: [
      { step: 1, role: '기안자',    approver: '김영훈', dept: 'IT팀',   status: '승인', date: '2024-03-08' },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-03-09' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-03-10' },
    ],
    status: '완료',
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 11. 완료된 결재 (내가 처리한 것)
// ──────────────────────────────────────────────────────────────────────────

export const COMPLETED_APPROVALS: ApprovalRequest[] = [
  {
    id: 301, docId: 1, docNo: 'QMS-M-001', docName: '품질메뉴얼', docType: '품질메뉴얼',
    requestedAt: '2024-05-19 08:30', requestedBy: '김영훈', requestedByDept: 'IT팀',
    steps: APPROVAL_STEPS[1], status: '완료',
  },
  {
    id: 302, docId: 8, docNo: 'QMS-S-002', docName: '내부심사 절차', docType: '절차서',
    requestedAt: '2024-04-03 09:00', requestedBy: '이부서', requestedByDept: '관리팀',
    steps: [
      { step: 1, role: '기안자',    approver: '이부서', dept: '관리팀', status: '승인', date: '2024-04-03' },
      { step: 2, role: '품질 검토', approver: '최감사', dept: '품질팀', status: '승인', date: '2024-04-04', comment: '내용 적합합니다.' },
      { step: 3, role: '최종 승인', approver: '박대표', dept: '경영진', status: '승인', date: '2024-04-05' },
    ],
    status: '완료',
  },
  {
    id: 303, docId: 9, docNo: 'QMS-S-003', docName: '시정 및 예방조치 절차', docType: '절차서',
    requestedAt: '2024-05-06 13:00', requestedBy: '홍길동', requestedByDept: '생산팀',
    steps: APPROVAL_STEPS[9], status: '반려',
  },
];

// ──────────────────────────────────────────────────────────────────────────
// 12. 내 문서함 데이터
// ──────────────────────────────────────────────────────────────────────────

/** 최근 조회 문서 ID 순서 */
export const RECENT_VIEW_IDS = [1, 7, 3, 14, 18, 11, 22, 4];

/** 즐겨찾기 문서 ID */
export const FAVORITE_DOC_IDS = [1, 7, 14, 24, 18];

/** 내가 작성한 문서 ID (김영훈 기준) */
export const MY_AUTHORED_IDS = [1, 5, 7, 13, 21, 24];
