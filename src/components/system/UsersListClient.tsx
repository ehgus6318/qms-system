'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/components/system/UsersListClient.tsx
// 사용자 관리 목록 화면
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  USERS,
  USER_DEPARTMENTS,
  PERMISSION_META,
  ROLE_LABELS,
  ROLE_COLORS,
  type User,
  type UserRole,
} from '@/lib/usersData';
import { useAuth } from '@/context/AuthContext';
import { canManageUsers } from '@/lib/authUtils';

// ── 통계 카드 ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-sm">{value}</span>
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

// ── 권한 뱃지 요약 ─────────────────────────────────────────────────────────────

function PermissionSummary({ permissions }: { permissions: string[] }) {
  const keyPerms = [
    { key: 'DOCUMENT_APPROVE', label: '결재', color: 'bg-blue-100 text-blue-700' },
    { key: 'REVISION_APPROVE', label: '개정', color: 'bg-indigo-100 text-indigo-700' },
    { key: 'APPROVAL_PROCESS', label: '승인처리', color: 'bg-emerald-100 text-emerald-700' },
    { key: 'SYSTEM_MANAGE',   label: '시스템', color: 'bg-red-100 text-red-700' },
    { key: 'USER_MANAGE',     label: '사용자관리', color: 'bg-orange-100 text-orange-700' },
  ];
  const active = keyPerms.filter((p) => permissions.includes(p.key));
  return (
    <div className="flex flex-wrap gap-1">
      {active.map((p) => (
        <span key={p.key} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${p.color}`}>
          {p.label}
        </span>
      ))}
      {active.length === 0 && (
        <span className="text-[10px] text-gray-400">기본 조회</span>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function UsersListClient() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const canManage = canManageUsers(currentUser);

  // ── 필터링 ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.departmentName.includes(q) ||
        u.position.includes(q) ||
        u.jobTitle.includes(q);
      const matchDept = deptFilter === 'all' || u.departmentId === deptFilter;
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.isActive) ||
        (statusFilter === 'inactive' && !u.isActive);
      return matchSearch && matchDept && matchRole && matchStatus;
    });
  }, [search, deptFilter, roleFilter, statusFilter]);

  // ── 통계 ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    USERS.length,
    active:   USERS.filter((u) => u.isActive).length,
    inactive: USERS.filter((u) => !u.isActive).length,
    admins:   USERS.filter((u) => u.role === 'admin' || u.role === 'manager').length,
  }), []);

  const roles: { value: 'all' | UserRole; label: string }[] = [
    { value: 'all',      label: '전체 역할' },
    { value: 'admin',    label: '시스템 관리자' },
    { value: 'manager',  label: '관리자' },
    { value: 'approver', label: '결재자' },
    { value: 'user',     label: '일반 사용자' },
    { value: 'viewer',   label: '조회자' },
  ];

  return (
    <div className="px-6 py-5 space-y-5">

      {/* ── 통계 카드 ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="전체 사용자" value={stats.total}    color="bg-blue-500" />
        <StatCard label="활성 계정"   value={stats.active}   color="bg-green-500" sub={`비활성: ${stats.inactive}명`} />
        <StatCard label="관리자급"    value={stats.admins}   color="bg-purple-500" sub="admin + manager" />
        <StatCard label="권한 그룹"   value={5}              color="bg-orange-400" sub="역할 유형" />
      </div>

      {/* ── 툴바 ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* 검색 */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 부서 검색..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 부서 필터 */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 부서</option>
          {USER_DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        {/* 역할 필터 */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {/* 상태 필터 */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {(['all', 'active', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                statusFilter === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100',
              ].join(' ')}
            >
              {s === 'all' ? '전체' : s === 'active' ? '활성' : '비활성'}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* 신규 등록 버튼 */}
        {canManage && (
          <button
            onClick={() => router.push('/system/users/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            신규 사용자 등록
          </button>
        )}
      </div>

      {/* ── 결과 수 ── */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          총 <strong className="text-gray-800">{filtered.length}</strong>명
          {filtered.length !== USERS.length && ` / 전체 ${USERS.length}명`}
        </span>
      </div>

      {/* ── 테이블 ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">사용자</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">부서 / 직급</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">역할</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">권한 요약</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">가입일</th>
              {canManage && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">작업</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="px-4 py-16 text-center text-gray-400">
                  <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm">검색 결과가 없습니다</p>
                </td>
              </tr>
            ) : (
              filtered.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition-colors ${!user.isActive ? 'opacity-60' : ''}`}
                >
                  {/* 번호 */}
                  <td className="px-4 py-3.5 text-xs text-gray-400">{idx + 1}</td>

                  {/* 사용자 */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <span className="text-white text-xs font-bold">{user.avatarInitials}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                          {user.id === currentUser?.id && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 font-medium px-1.5 py-0.5 rounded">나</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* 부서/직급 */}
                  <td className="px-4 py-3.5">
                    <div className="text-sm text-gray-800">{user.departmentName}</div>
                    <div className="text-xs text-gray-400">{user.position} · {user.jobTitle}</div>
                  </td>

                  {/* 역할 */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>

                  {/* 권한 요약 */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <PermissionSummary permissions={user.permissions} />
                      <span className="text-[10px] text-gray-300 ml-1">{user.permissions.length}개</span>
                    </div>
                  </td>

                  {/* 상태 */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={`text-xs font-medium ${user.isActive ? 'text-green-700' : 'text-gray-400'}`}>
                        {user.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  </td>

                  {/* 가입일 */}
                  <td className="px-4 py-3.5 text-xs text-gray-500">{user.joinedAt ?? '-'}</td>

                  {/* 작업 버튼 */}
                  {canManage && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/system/users/${user.id}/edit`)}
                          className="px-2.5 py-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                          수정
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="px-2.5 py-1.5 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                          >
                            비활성화
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── 권한 범례 ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">권한 유형 안내</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PERMISSION_META.filter((p) => !p.dangerous).map((p) => (
            <div key={p.key} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-gray-700">{p.label}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{p.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            위험 권한 (시스템 관리, 사용자 관리, 문서 삭제)은 관리자 계정에만 부여하세요.
          </p>
        </div>
      </div>

      {/* ── 비활성화 확인 모달 ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">계정 비활성화</h3>
                <p className="text-xs text-gray-500">해당 사용자가 시스템에 접근할 수 없게 됩니다</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3.5 mb-5">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${deleteTarget.avatarColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{deleteTarget.avatarInitials}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{deleteTarget.name}</div>
                  <div className="text-xs text-gray-500">{deleteTarget.email}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                비활성화 (Mock)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
