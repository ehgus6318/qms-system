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

/** 현재 사용자가 특정 결재 단계를 처리할 수 있는지 확인 */
export function canApproveStep(
  user: User | null | undefined,
  step: ApprovalStep | undefined,
): boolean {
  if (!user || !step) return false;
  if (!hasPermission(user, 'APPROVAL_PROCESS')) return false;
  if (step.approverId && step.approverId !== user.id) return false;
  const processableStatuses: string[] = ['대기', '검토 중'];
  return processableStatuses.includes(step.status);
}

/** 결재 요청 가능 여부 */
export function canRequestApproval(user: User | null | undefined): boolean {
  return hasAnyPermission(user, ['DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'REVISION_CREATE']);
}

// ── 결재자 후보 조회 ─────────────────────────────────────────────────────────

/** DOCUMENT_APPROVE 또는 APPROVAL_PROCESS 권한을 보유한 사용자 목록 */
export function getApprovalCandidates(users?: User[]): User[] {
  const source = users ?? USERS;
  return source.filter(
    (u) =>
      u.isActive &&
      (u.permissions.includes('DOCUMENT_APPROVE') || u.permissions.includes('APPROVAL_PROCESS')),
  );
}

/** 특정 부서의 결재 가능 사용자 */
export function getApprovalCandidatesByDept(departmentId: string, users?: User[]): User[] {
  return getApprovalCandidates(users).filter((u) => u.departmentId === departmentId);
}

// ── 사이드바 메뉴 접근 권한 ────────────────────────────────────────────────────

export interface MenuPermissionConfig {
  documentView: boolean;
  documentCreate: boolean;
  documentApprovalInbox: boolean;
  revisionView: boolean;
  approvalView: boolean;
  trainingView: boolean;
  recordsView: boolean;
  reportsView: boolean;
  systemManage: boolean;
  userManage: boolean;
}

/** 사용자 권한에 따른 메뉴 접근 가능 여부 맵 */
export function getMenuPermissions(user: User | null | undefined): MenuPermissionConfig {
  return {
    documentView:           hasPermission(user, 'DOCUMENT_VIEW'),
    documentCreate:         hasPermission(user, 'DOCUMENT_CREATE'),
    documentApprovalInbox:  hasAnyPermission(user, ['DOCUMENT_APPROVE', 'APPROVAL_PROCESS']),
    revisionView:           hasPermission(user, 'REVISION_VIEW'),
    approvalView:           hasPermission(user, 'APPROVAL_VIEW'),
    trainingView:           hasPermission(user, 'TRAINING_VIEW'),
    recordsView:            hasPermission(user, 'RECORDS_VIEW'),
    reportsView:            hasPermission(user, 'REPORTS_VIEW'),
    systemManage:           hasAnyPermission(user, ['SYSTEM_MANAGE', 'USER_MANAGE']),
    userManage:             hasAnyPermission(user, ['USER_MANAGE', 'SYSTEM_MANAGE']),
  };
}

// ── 관리자 여부 ───────────────────────────────────────────────────────────────

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === 'admin';
}

export function isApprover(user: User | null | undefined): boolean {
  return user?.role === 'admin' || user?.role === 'approver' || user?.role === 'manager';
}
