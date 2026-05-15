// ─────────────────────────────────────────────────────────────────────────────
// src/lib/usersData.ts
// 사용자 / 권한 데이터 (Mock)
// 향후 NextAuth session.user + Prisma User 모델로 교체 예정
// ─────────────────────────────────────────────────────────────────────────────

export type Permission =
  | 'DOCUMENT_VIEW'       // 문서 조회
  | 'DOCUMENT_CREATE'     // 문서 등록
  | 'DOCUMENT_EDIT'       // 문서 수정
  | 'DOCUMENT_DELETE'     // 문서 삭제
  | 'DOCUMENT_APPROVE'    // 문서 결재(승인)
  | 'REVISION_VIEW'       // 개정 조회
  | 'REVISION_CREATE'     // 개정 요청
  | 'REVISION_APPROVE'    // 개정 승인
  | 'APPROVAL_VIEW'       // 승인관리 조회
  | 'APPROVAL_PROCESS'    // 결재 처리
  | 'TRAINING_VIEW'       // 교육훈련 조회
  | 'TRAINING_MANAGE'     // 교육훈련 관리
  | 'RECORDS_VIEW'        // 기록 조회
  | 'RECORDS_MANAGE'      // 기록 관리
  | 'INSPECTION_VIEW'     // 검사 조회
  | 'REPORTS_VIEW'        // 보고서 조회
  | 'SYSTEM_MANAGE'       // 시스템 관리
  | 'USER_MANAGE';        // 사용자 관리

export type UserRole = 'admin' | 'manager' | 'approver' | 'user' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  departmentName: string;
  position: string;       // 직급 (예: 사원, 대리, 과장, 부장)
  jobTitle: string;       // 직책 (예: DMS 관리자, 팀장)
  role: UserRole;
  isActive: boolean;
  isAdmin: boolean;         // 관리자 권한 (문서분류·사용자·시스템 설정 접근)
  canSelfApprove: boolean;  // 본인 작성 문서 본인 결재 허용
  permissions: Permission[];
  avatarInitials: string;
  avatarColor: string;    // Tailwind bg 클래스
  phone?: string;
  joinedAt?: string;
}

// ── 권한 메타데이터 (UI 렌더링용) ───────────────────────────────────────────────

export interface PermissionMeta {
  key: Permission;
  label: string;
  description: string;
  group: PermissionGroup;
  dangerous?: boolean; // 위험/관리자 전용 권한
}

export type PermissionGroup =
  | '문서관리'
  | '개정관리'
  | '결재관리'
  | '교육훈련'
  | '기록·검사'
  | '보고서'
  | '시스템';

export const PERMISSION_META: PermissionMeta[] = [
  // 문서관리
  { key: 'DOCUMENT_VIEW',    label: '문서 조회',       description: '문서 목록 및 상세 조회',        group: '문서관리' },
  { key: 'DOCUMENT_CREATE',  label: '문서 등록',       description: '신규 문서 등록 및 초안 작성',   group: '문서관리' },
  { key: 'DOCUMENT_EDIT',    label: '문서 수정',       description: '기존 문서 내용 수정',           group: '문서관리' },
  { key: 'DOCUMENT_DELETE',  label: '문서 삭제',       description: '문서 삭제 (관리자 전용)',       group: '문서관리', dangerous: true },
  { key: 'DOCUMENT_APPROVE', label: '문서 결재',       description: '문서 결재선에 결재자로 지정 가능', group: '문서관리' },
  // 개정관리
  { key: 'REVISION_VIEW',    label: '개정 조회',       description: '개정 목록 및 상세 조회',        group: '개정관리' },
  { key: 'REVISION_CREATE',  label: '개정 요청',       description: '개정 요청 및 변경사항 등록',    group: '개정관리' },
  { key: 'REVISION_APPROVE', label: '개정 승인',       description: '개정 요청 승인 처리',           group: '개정관리' },
  // 결재관리
  { key: 'APPROVAL_VIEW',    label: '결재관리 조회',   description: '결재 목록 및 상태 조회',        group: '결재관리' },
  { key: 'APPROVAL_PROCESS', label: '결재 처리',       description: '결재 승인/반려/보류 처리',      group: '결재관리' },
  // 교육훈련
  { key: 'TRAINING_VIEW',    label: '교육훈련 조회',   description: '교육훈련 계획 및 결과 조회',    group: '교육훈련' },
  { key: 'TRAINING_MANAGE',  label: '교육훈련 관리',   description: '교육훈련 계획 등록 및 관리',    group: '교육훈련' },
  // 기록·검사
  { key: 'RECORDS_VIEW',     label: '기록 조회',       description: '품질 기록 조회',                group: '기록·검사' },
  { key: 'RECORDS_MANAGE',   label: '기록 관리',       description: '품질 기록 등록 및 수정',        group: '기록·검사' },
  { key: 'INSPECTION_VIEW',  label: '검사 조회',       description: '검사 결과 및 이력 조회',        group: '기록·검사' },
  // 보고서
  { key: 'REPORTS_VIEW',     label: '보고서 조회',     description: '각종 품질 보고서 조회',         group: '보고서' },
  // 시스템
  { key: 'SYSTEM_MANAGE',    label: '시스템 관리',     description: '시스템 설정 및 전체 관리',      group: '시스템', dangerous: true },
  { key: 'USER_MANAGE',      label: '사용자 관리',     description: '사용자 계정 생성·수정·권한 부여', group: '시스템', dangerous: true },
];

export const PERMISSION_GROUPS: PermissionGroup[] = [
  '문서관리', '개정관리', '결재관리', '교육훈련', '기록·검사', '보고서', '시스템',
];

export function getPermissionsByGroup(group: PermissionGroup): PermissionMeta[] {
  return PERMISSION_META.filter((p) => p.group === group);
}

// ── 권한 프리셋 ────────────────────────────────────────────────────────────────

export const ALL_PERMISSIONS: Permission[] = [
  'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'DOCUMENT_DELETE', 'DOCUMENT_APPROVE',
  'REVISION_VIEW', 'REVISION_CREATE', 'REVISION_APPROVE',
  'APPROVAL_VIEW', 'APPROVAL_PROCESS',
  'TRAINING_VIEW', 'TRAINING_MANAGE',
  'RECORDS_VIEW', 'RECORDS_MANAGE', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
  'SYSTEM_MANAGE', 'USER_MANAGE',
];

export const STANDARD_USER_PERMISSIONS: Permission[] = [
  'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT',
  'REVISION_VIEW', 'REVISION_CREATE',
  'APPROVAL_VIEW',
  'TRAINING_VIEW',
  'RECORDS_VIEW', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
];

export const APPROVER_PERMISSIONS: Permission[] = [
  'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'DOCUMENT_APPROVE',
  'REVISION_VIEW', 'REVISION_CREATE', 'REVISION_APPROVE',
  'APPROVAL_VIEW', 'APPROVAL_PROCESS',
  'TRAINING_VIEW',
  'RECORDS_VIEW', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
];

export const VIEWER_PERMISSIONS: Permission[] = [
  'DOCUMENT_VIEW',
  'REVISION_VIEW',
  'APPROVAL_VIEW',
  'TRAINING_VIEW',
  'RECORDS_VIEW', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
];

// ── 역할 프리셋 맵 ────────────────────────────────────────────────────────────

export const ROLE_PERMISSION_PRESET: Record<UserRole, Permission[]> = {
  admin:    ALL_PERMISSIONS,
  manager:  APPROVER_PERMISSIONS,
  approver: APPROVER_PERMISSIONS,
  user:     STANDARD_USER_PERMISSIONS,
  viewer:   VIEWER_PERMISSIONS,
};

// ── 부서 목록 (usersData 자체 관리) ──────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
}

export const USER_DEPARTMENTS: Department[] = [
  { id: 'D01', name: '품질관리팀' },
  { id: 'D02', name: '생산관리팀' },
  { id: 'D03', name: '연구개발팀' },
  { id: 'D04', name: '영업팀' },
  { id: 'D05', name: '구매자재팀' },
  { id: 'D06', name: '인사총무팀' },
  { id: 'D07', name: '경영기획팀' },
  { id: 'D08', name: '외부/협력사' },
];

// ── 아바타 색상 팔레트 (신규 사용자 등록 시 선택) ────────────────────────────

export const AVATAR_COLORS = [
  { value: 'bg-blue-600',   label: '파랑' },
  { value: 'bg-emerald-600', label: '초록' },
  { value: 'bg-violet-600', label: '보라' },
  { value: 'bg-orange-500', label: '주황' },
  { value: 'bg-pink-600',   label: '분홍' },
  { value: 'bg-teal-600',   label: '청록' },
  { value: 'bg-gray-500',   label: '회색' },
  { value: 'bg-red-600',    label: '빨강' },
  { value: 'bg-amber-500',  label: '황금' },
  { value: 'bg-cyan-600',   label: '하늘' },
];

// ── 사용자 목록 ────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: 'U001',
    name: '김영훈',
    email: 'yhkim@dh2.co.kr',
    departmentId: 'D01',
    departmentName: '품질관리팀',
    position: '팀장',
    jobTitle: 'DMS 시스템 관리자',
    role: 'admin',
    isActive: true,
    isAdmin: true,
    canSelfApprove: true,
    permissions: ALL_PERMISSIONS,
    avatarInitials: '김',
    avatarColor: 'bg-blue-600',
    phone: '010-1234-5678',
    joinedAt: '2019-03-01',
  },
  {
    id: 'U002',
    name: '이수진',
    email: 'sjlee@dh2.co.kr',
    departmentId: 'D01',
    departmentName: '품질관리팀',
    position: '과장',
    jobTitle: '품질관리 담당',
    role: 'approver',
    isActive: true,
    isAdmin: false,
    canSelfApprove: false,
    permissions: APPROVER_PERMISSIONS,
    avatarInitials: '이',
    avatarColor: 'bg-emerald-600',
    phone: '010-2345-6789',
    joinedAt: '2020-05-15',
  },
  {
    id: 'U003',
    name: '박준혁',
    email: 'jhpark@dh2.co.kr',
    departmentId: 'D02',
    departmentName: '생산관리팀',
    position: '팀장',
    jobTitle: '생산 관리자',
    role: 'approver',
    isActive: true,
    isAdmin: false,
    canSelfApprove: false,
    permissions: APPROVER_PERMISSIONS,
    avatarInitials: '박',
    avatarColor: 'bg-violet-600',
    phone: '010-3456-7890',
    joinedAt: '2018-11-01',
  },
  {
    id: 'U004',
    name: '최민지',
    email: 'mjchoi@dh2.co.kr',
    departmentId: 'D03',
    departmentName: '연구개발팀',
    position: '사원',
    jobTitle: '연구개발 담당',
    role: 'user',
    isActive: true,
    isAdmin: false,
    canSelfApprove: false,
    permissions: STANDARD_USER_PERMISSIONS,
    avatarInitials: '최',
    avatarColor: 'bg-orange-500',
    phone: '010-4567-8901',
    joinedAt: '2022-08-01',
  },
  {
    id: 'U005',
    name: '정다영',
    email: 'dyjeong@dh2.co.kr',
    departmentId: 'D04',
    departmentName: '영업팀',
    position: '대리',
    jobTitle: '영업 담당',
    role: 'user',
    isActive: true,
    isAdmin: false,
    canSelfApprove: false,
    permissions: STANDARD_USER_PERMISSIONS,
    avatarInitials: '정',
    avatarColor: 'bg-pink-600',
    phone: '010-5678-9012',
    joinedAt: '2021-04-01',
  },
  {
    id: 'U006',
    name: '한상우',
    email: 'swhan@dh2.co.kr',
    departmentId: 'D05',
    departmentName: '구매자재팀',
    position: '부장',
    jobTitle: '구매 총괄',
    role: 'manager',
    isActive: true,
    isAdmin: false,
    canSelfApprove: true,
    permissions: APPROVER_PERMISSIONS,
    avatarInitials: '한',
    avatarColor: 'bg-teal-600',
    phone: '010-6789-0123',
    joinedAt: '2016-02-01',
  },
  {
    id: 'U007',
    name: '오지현',
    email: 'jhoh@dh2.co.kr',
    departmentId: 'D06',
    departmentName: '인사총무팀',
    position: '사원',
    jobTitle: '인사 담당',
    role: 'viewer',
    isActive: false,  // 비활성 계정 예시
    isAdmin: false,
    canSelfApprove: false,
    permissions: VIEWER_PERMISSIONS,
    avatarInitials: '오',
    avatarColor: 'bg-gray-500',
    phone: '010-7890-1234',
    joinedAt: '2023-01-02',
  },
];

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

export function getUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return USERS.find((u) => u.email === email);
}

export function getActiveUsers(): User[] {
  return USERS.filter((u) => u.isActive);
}

/** 역할 표시 레이블 */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin:    '시스템 관리자',
  manager:  '관리자',
  approver: '결재자',
  user:     '일반 사용자',
  viewer:   '조회자',
};

/** 역할 뱃지 색상 (배경+텍스트) */
export const ROLE_COLORS: Record<UserRole, string> = {
  admin:    'bg-red-100 text-red-700 border-red-200',
  manager:  'bg-purple-100 text-purple-700 border-purple-200',
  approver: 'bg-blue-100 text-blue-700 border-blue-200',
  user:     'bg-gray-100 text-gray-700 border-gray-200',
  viewer:   'bg-slate-100 text-slate-500 border-slate-200',
};

/** 다음 사용자 ID 생성 (Mock) — 실제로는 DB auto-increment */
export function generateNextUserId(): string {
  const maxId = USERS.reduce((max, u) => {
    const num = parseInt(u.id.replace('U', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `U${String(maxId + 1).padStart(3, '0')}`;
}
