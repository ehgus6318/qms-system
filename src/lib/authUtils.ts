// ─────────────────────────────────────────────────────────────────────────────
// src/lib/authUtils.ts
// 권한 유틸리티 함수 (Mock)
// 향후 NextAuth + Prisma 연동 시 이 파일만 교체
// ─────────────────────────────────────────────────────────────────────────────

import { type User, type Permission, USERS } from '@/lib/usersData';
import type { ApprovalStep } from '@/lib/approvalsData';

// ── 기본 권한 확인 ─────────────────────────────────────────────────────────────

/** 사용자가 특정 권한을 보유하는지 확인 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user || !user.isActive) return false;
  return user.permissions.includes(permission);
}

/** 사용자가 여러 권한 중 하나라도 보유하는지 확인 */
export function hasAnyPermission(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user || !user.isActive) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

/** 사용자가 모든 권한을 보유하는지 확인 */
export function hasAllPermissions(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user || !user.isActive) return false;
  return permissions.every((p) => user.permissions.includes(p));
}

// ── 도메인별 권한 함수 ─────────────────────────────────────────────────────────

/** 문서 등록 가능 여부 */
export function canCreateDocument(user: User | null | undefined): boolean {
  return hasPermission(user, 'DOCUMENT_CREATE');
}

/** 문서 수정 가능 여부 */
export function canUpdateDocument(user: User | null | undefined, authorId?: string): boolean {
  if (!user) return false;
  if (hasPermission(user, 'SYSTEM_MANAGE')) return true;
  if (!hasPermission(user, 'DOCUMENT_EDIT')) return false;
  if (authorId && authorId !== user.id) return false;
  return true;
}

/** 문서 삭제 가능 여부 */
export function canDeleteDocument(user: User | null | undefined): boolean {
  return hasPermission(user, 'DOCUMENT_DELETE');
}

/** 개정 요청 가능 여부 */
export function canReviseDocument(user: User | null | undefined): boolean {
  return hasAnyPermission(user, ['REVISION_CREATE', 'DOCUMENT_APPROVE']);
}

/** 시스템 관리 가능 여부 */
export function canManageSystem(user: User | null | undefined): boolean {
  return hasPermission(user, 'SYSTEM_MANAGE');
}

/** 사용자 관리 가능 여부 */
export function canManageUsers(user: User | null | undefined): boolean {
  return hasAnyPermission(user, ['USER_MANAGE', 'SYSTEM_MANAGE']);
}

// ── 결재 관련 ─────────────────────────────────────────────────────────────────

/**
 * 현재 사용자가 특정 결재 단계를 처리할 수 있는지 확인
 *
 * @param documentAuthorId  문서 작성자 ID (본인 결재 허용 여부 체크에 사용)
 */
export function canApproveStep(
  user: User | null | undefined,
  step: ApprovalStep | undefined,
  documentAuthorId?: string,
): boolean {
  if (!user || !step) return false;
  if (!user.isActive) return false;
  // 다른 결재자가 지정된 단계는 해당 결재자만 처리 가능
  if (step.approverId && step.approverId !== user.id) return false;
  // 본인 결재 체크
  if (documentAuthorId && documentAuthorId === user.id && !user.canSelfApprove) return false;
  const processableStatuses: string[] = ['대기', '검토 중'];
  return processableStatuses.includes(step.status);
}

/** 결재 요청 가능 여부 */
export function canRequestApproval(user: User | null | undefined): boolean {
  return hasAnyPermission(user, ['DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'REVISION_CREATE']);
}

// ── 결재자 후보 조회 ─────────────────────────────────────────────────────────

/**
 * 결재자 후보 목록 반환 — 모든 활성 사용자
 *
 * @param users      사용자 목록 (미지정 시 전체 USERS)
 * @param options
 *   excludeAuthorId  — 이 ID 의 사용자를 제외 대상으로 검토
 *   allowSelfApproval — true: 항상 포함 / false: 항상 제외 / undefined: user.canSelfApprove 사용
 */
export function getApprovalCandidates(
  users?: User[],
  options?: { excludeAuthorId?: string; allowSelfApproval?: boolean },
): User[] {
  const source = users ?? USERS;
  return source.filter((u) => {
    if (!u.isActive) return false;
    if (options?.excludeAuthorId && u.id === options.excludeAuthorId) {
      if (options.allowSelfApproval === true)  return true;
      if (options.allowSelfApproval === false) return false;
      return u.canSelfApprove; // undefined → 개인 설정 따름
    }
    return true;
  });
}

/** 특정 부서의 결재 가능 사용자 */
export function getApprovalCandidatesByDept(departmentId: string, users?: User[]): User[] {
  return getApprovalCandidates(users).filter((u) => u.departmentId === departmentId);
}

// ── 사이드바 메뉴 접근 권한 ────────────────────────────────────────────────────

export interface MenuPermissionConfig {
  documentView: boolean;
  documentCreate: boolean;
  documentDelete: boolean;
  documentApprovalInbox: boolean;
  revisionView: boolean;
  approvalView: boolean;
  categoryView: boolean;
  systemManage: boolean;
  userManage: boolean;
}

/**
 * 사용자 권한에 따른 메뉴 접근 가능 여부 맵
 *
 * 단순화된 정책:
 *  - 활성 사용자 = 문서/결재/개정 메뉴 전체 접근
 *  - 관리자(isAdmin) = 추가로 문서분류·사용자관리·시스템설정 접근
 */
export function getMenuPermissions(user: User | null | undefined): MenuPermissionConfig {
  const active = !!user?.isActive;
  const admin  = !!user?.isAdmin;
  return {
    documentView:          active,
    documentCreate:        active,
    documentDelete:        admin,
    documentApprovalInbox: active,
    revisionView:          active,
    approvalView:          active,
    categoryView:          admin,
    systemManage:          admin,
    userManage:            admin,
  };
}

// ── 관리자 여부 ───────────────────────────────────────────────────────────────

export function isAdmin(user: User | null | undefined): boolean {
  return !!user?.isAdmin;
}

export function isApprover(user: User | null | undefined): boolean {
  return user?.role === 'admin' || user?.role === 'approver' || user?.role === 'manager';
}
