// ─────────────────────────────────────────────────────────────────────────────
// src/lib/userApi.ts
// 사용자 관리 API 공유 타입 + 클라이언트 fetch 헬퍼
// ─────────────────────────────────────────────────────────────────────────────

// ── 클라이언트가 받는 사용자 DTO ──────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  departmentName: string;
  position: string;
  jobTitle: string;
  /** lowercase: 'admin' | 'manager' | 'approver' | 'user' | 'viewer' */
  role: string;
  /** DB UserStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' */
  status: string;
  /** status === 'ACTIVE' */
  isActive: boolean;
  isAdmin: boolean;
  canSelfApprove: boolean;
  avatarInitials: string;
  avatarColor: string;
  phone: string | null;
  joinedAt: string | null;
  createdAt: string;
}

// ── POST 등록 body ─────────────────────────────────────────────────────────────

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;        // 평문 — 서버에서 mock hash 처리
  departmentId: string;
  position: string;
  jobTitle: string;
  role: string;            // lowercase
  isAdmin: boolean;
  canSelfApprove: boolean;
  avatarColor: string;
  phone?: string;
}

// ── PATCH 수정 body ────────────────────────────────────────────────────────────

export interface UpdateUserBody {
  name?: string;
  email?: string;
  departmentId?: string;
  position?: string;
  jobTitle?: string;
  role?: string;           // lowercase
  isActive?: boolean;
  isAdmin?: boolean;
  canSelfApprove?: boolean;
  avatarColor?: string;
  phone?: string | null;
}

// ── 에러 응답 ─────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;           // 'EMAIL_DUPLICATE' | 'NOT_FOUND' | ...
}

// ── 클라이언트 fetch 헬퍼 ─────────────────────────────────────────────────────

const BASE = '/api/users';

/** 사용자 목록 조회 */
export async function fetchUsers(params?: {
  search?: string;
  departmentId?: string;
  role?: string;
  isActive?: boolean;
}): Promise<ApiUser[]> {
  const qs = new URLSearchParams();
  if (params?.search)       qs.set('search', params.search);
  if (params?.departmentId) qs.set('departmentId', params.departmentId);
  if (params?.role)         qs.set('role', params.role);
  if (params?.isActive !== undefined) qs.set('isActive', String(params.isActive));

  const res = await fetch(`${BASE}?${qs.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

/** 단일 사용자 조회 */
export async function fetchUser(id: string): Promise<ApiUser | null> {
  const res = await fetch(`${BASE}/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

/** 사용자 등록 */
export async function createUser(
  body: CreateUserBody,
): Promise<{ data?: ApiUser; error?: string; code?: string }> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return { error: json.error ?? '등록 실패', code: json.code };
  return { data: json };
}

/** 사용자 수정 */
export async function updateUser(
  id: string,
  body: UpdateUserBody,
): Promise<{ data?: ApiUser; error?: string; code?: string }> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return { error: json.error ?? '수정 실패', code: json.code };
  return { data: json };
}
