'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/components/system/UserFormClient.tsx
// 사용자 등록 / 수정 공용 폼
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  USERS,
  USER_DEPARTMENTS,
  PERMISSION_META,
  PERMISSION_GROUPS,
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_PERMISSION_PRESET,
  AVATAR_COLORS,
  generateNextUserId,
  type User,
  type UserRole,
  type Permission,
  type PermissionGroup,
} from '@/lib/usersData';

// ── 폼 상태 타입 ──────────────────────────────────────────────────────────────

interface UserFormState {
  name: string;
  email: string;
  tempPassword: string;
  departmentId: string;
  position: string;        // 직급
  jobTitle: string;        // 직책
  role: UserRole;
  isActive: boolean;
  permissions: Permission[];
  avatarColor: string;
  phone: string;
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────────────────

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
    </div>
  );
}

// ── 폼 필드 ──────────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow placeholder-gray-300';

const selectCls =
  'w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

// ── 권한 그룹 패널 ─────────────────────────────────────────────────────────────

function PermissionGroupPanel({
  group,
  permissions,
  onChange,
}: {
  group: PermissionGroup;
  permissions: Permission[];
  onChange: (perm: Permission, checked: boolean) => void;
}) {
  const items = PERMISSION_META.filter((p) => p.group === group);
  const activeCount = items.filter((p) => permissions.includes(p.key)).length;

  const groupColors: Record<PermissionGroup, string> = {
    '문서관리': 'bg-blue-50 border-blue-200',
    '개정관리': 'bg-indigo-50 border-indigo-200',
    '승인관리': 'bg-emerald-50 border-emerald-200',
    '교육훈련': 'bg-amber-50 border-amber-200',
    '기록·검사': 'bg-teal-50 border-teal-200',
    '보고서':   'bg-gray-50 border-gray-200',
    '시스템':   'bg-red-50 border-red-200',
  };

  const groupBadge: Record<PermissionGroup, string> = {
    '문서관리': 'bg-blue-100 text-blue-700',
    '개정관리': 'bg-indigo-100 text-indigo-700',
    '승인관리': 'bg-emerald-100 text-emerald-700',
    '교육훈련': 'bg-amber-100 text-amber-700',
    '기록·검사': 'bg-teal-100 text-teal-700',
    '보고서':   'bg-gray-100 text-gray-600',
    '시스템':   'bg-red-100 text-red-700',
  };

  return (
    <div className={`rounded-xl border p-4 ${groupColors[group]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-gray-700">{group}</h4>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${groupBadge[group]}`}>
            {activeCount}/{items.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const allActive = items.every((p) => permissions.includes(p.key));
            items.forEach((p) => onChange(p.key, !allActive));
          }}
          className="text-[10px] text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          {items.every((p) => permissions.includes(p.key)) ? '전체 해제' : '전체 선택'}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((perm) => {
          const checked = permissions.includes(perm.key);
          return (
            <label
              key={perm.key}
              className={[
                'flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors',
                checked ? 'bg-white shadow-sm' : 'hover:bg-white/60',
              ].join(' ')}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(perm.key, e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${checked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {perm.label}
                  </span>
                  {perm.dangerous && (
                    <span className="text-[9px] font-bold px-1 py-px rounded bg-red-100 text-red-600 uppercase">위험</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">{perm.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

interface Props {
  mode: 'new' | 'edit';
  userId?: string;
}

export default function UserFormClient({ mode, userId }: Props) {
  const router = useRouter();

  // 수정 모드면 기존 사용자 데이터 로드
  const existingUser = mode === 'edit' ? USERS.find((u) => u.id === userId) : undefined;

  const [form, setForm] = useState<UserFormState>({
    name:         existingUser?.name         ?? '',
    email:        existingUser?.email        ?? '',
    tempPassword: '',
    departmentId: existingUser?.departmentId ?? 'D01',
    position:     existingUser?.position     ?? '',
    jobTitle:     existingUser?.jobTitle     ?? '',
    role:         existingUser?.role         ?? 'user',
    isActive:     existingUser?.isActive     ?? true,
    permissions:  existingUser?.permissions  ?? [...ROLE_PERMISSION_PRESET['user']],
    avatarColor:  existingUser?.avatarColor  ?? 'bg-blue-600',
    phone:        existingUser?.phone        ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormState, string>>>({});

  // 파생 값
  const dept = USER_DEPARTMENTS.find((d) => d.id === form.departmentId);

  const update = useCallback(<K extends keyof UserFormState>(key: K, value: UserFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  // 역할 변경 시 권한 프리셋 자동 적용
  const handleRoleChange = (role: UserRole) => {
    update('role', role);
    setForm((prev) => ({ ...prev, role, permissions: [...ROLE_PERMISSION_PRESET[role]] }));
  };

  // 개별 권한 토글
  const togglePermission = useCallback((perm: Permission, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, perm]
        : prev.permissions.filter((p) => p !== perm),
    }));
  }, []);

  // 유효성 검사
  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = '이름을 입력하세요';
    if (!form.email.trim()) errs.email = '이메일을 입력하세요';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '올바른 이메일 형식이 아닙니다';
    if (mode === 'new' && !form.tempPassword) errs.tempPassword = '임시 비밀번호를 입력하세요';
    if (!form.position.trim()) errs.position = '직급을 입력하세요';
    if (!form.jobTitle.trim()) errs.jobTitle = '직책을 입력하세요';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // Mock API 딜레이

    // ── TODO: 실제 저장 (향후 API 연동 포인트) ──────────────────────────
    // const payload = {
    //   name: form.name, email: form.email, departmentId: form.departmentId,
    //   position: form.position, jobTitle: form.jobTitle, role: form.role,
    //   isActive: form.isActive, permissions: form.permissions,
    //   ...(mode === 'new' ? { tempPassword: form.tempPassword, id: generateNextUserId() } : { id: userId }),
    // };
    // await fetch(`/api/users${mode === 'edit' ? `/${userId}` : ''}`, {
    //   method: mode === 'new' ? 'POST' : 'PATCH',
    //   body: JSON.stringify(payload),
    // });
    // ────────────────────────────────────────────────────────────────────

    setSaving(false);
    setSaved(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push('/system/users');
  };

  if (mode === 'edit' && !existingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p className="text-sm">사용자를 찾을 수 없습니다</p>
        <button onClick={() => router.push('/system/users')} className="mt-3 text-xs text-blue-600 hover:underline">목록으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="px-6 py-5">
      {/* 저장 완료 토스트 */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-xl shadow-xl">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">
            {mode === 'new' ? '사용자가 등록되었습니다 (Mock)' : '수정이 완료되었습니다 (Mock)'}
          </span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-5">
        {/* ── 상단 액션바 ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/system/users')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            사용자 목록으로
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/system/users')}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors shadow-sm"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  저장 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {mode === 'new' ? '사용자 등록' : '변경 저장'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 items-start">
          {/* ── 왼쪽: 기본 정보 + 계정 설정 ── */}
          <div className="col-span-1 space-y-5">

            {/* 아바타 프리뷰 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <SectionHeader title="아바타" />
              <div className="p-5 flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${form.avatarColor} flex items-center justify-center shadow-md`}>
                  <span className="text-white text-xl font-bold">
                    {form.name ? form.name.charAt(0) : '?'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 w-full">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => update('avatarColor', c.value)}
                      className={[
                        'w-8 h-8 rounded-full mx-auto transition-transform',
                        c.value,
                        form.avatarColor === c.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 계정 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <SectionHeader title="계정 설정" />
              <div className="p-5 space-y-4">
                {/* 역할 */}
                <Field label="시스템 역할" required>
                  <div className="space-y-1.5">
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                      <label
                        key={r}
                        className={[
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors',
                          form.role === r
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r}
                          checked={form.role === r}
                          onChange={() => handleRoleChange(r)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${ROLE_COLORS[r]}`}>
                            {ROLE_LABELS[r]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">역할 선택 시 권한이 자동으로 적용됩니다</p>
                </Field>

                {/* 계정 상태 */}
                <Field label="계정 상태">
                  <label className={[
                    'flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-colors',
                    form.isActive ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50',
                  ].join(' ')}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${form.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className={`text-sm font-medium ${form.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                        {form.isActive ? '활성 계정' : '비활성 계정'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => update('isActive', !form.isActive)}
                      className={[
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                        form.isActive ? 'bg-green-500' : 'bg-gray-300',
                      ].join(' ')}
                    >
                      <span className={[
                        'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                        form.isActive ? 'translate-x-4.5' : 'translate-x-0.5',
                      ].join(' ')} />
                    </button>
                  </label>
                </Field>

                {/* Mock 안내 */}
                <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[11px] text-amber-700">Mock 모드: 실제로 저장되지 않으며 새로고침 시 초기화됩니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 오른쪽: 2칸 ── */}
          <div className="col-span-2 space-y-5">

            {/* 기본 정보 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <SectionHeader title="기본 정보" desc="사용자 식별 및 연락처 정보" />
              <div className="p-5 grid grid-cols-2 gap-4">
                <Field label="이름" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="홍길동"
                    className={inputCls + (errors.name ? ' border-red-400 ring-1 ring-red-300' : '')}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </Field>

                <Field label="이메일" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="user@dh2.co.kr"
                    className={inputCls + (errors.email ? ' border-red-400 ring-1 ring-red-300' : '')}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </Field>

                {mode === 'new' && (
                  <Field label="임시 비밀번호" required hint="최초 로그인 후 변경을 안내하세요">
                    <input
                      type="password"
                      value={form.tempPassword}
                      onChange={(e) => update('tempPassword', e.target.value)}
                      placeholder="임시 비밀번호"
                      className={inputCls + (errors.tempPassword ? ' border-red-400 ring-1 ring-red-300' : '')}
                    />
                    {errors.tempPassword && <p className="text-xs text-red-500 mt-1">{errors.tempPassword}</p>}
                  </Field>
                )}

                <Field label="연락처">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="010-0000-0000"
                    className={inputCls}
                  />
                </Field>

                <Field label="부서" required>
                  <select
                    value={form.departmentId}
                    onChange={(e) => update('departmentId', e.target.value)}
                    className={selectCls}
                  >
                    {USER_DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="직급" required hint="예: 사원, 대리, 과장, 차장, 부장, 이사">
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => update('position', e.target.value)}
                    placeholder="예: 과장"
                    className={inputCls + (errors.position ? ' border-red-400 ring-1 ring-red-300' : '')}
                  />
                  {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
                </Field>

                <Field label="직책" required hint="예: QMS 담당, 팀장, 품질관리 담당">
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => update('jobTitle', e.target.value)}
                    placeholder="예: 품질관리 담당"
                    className={inputCls + (errors.jobTitle ? ' border-red-400 ring-1 ring-red-300' : '')}
                  />
                  {errors.jobTitle && <p className="text-xs text-red-500 mt-1">{errors.jobTitle}</p>}
                </Field>
              </div>

              {/* 프리뷰 */}
              <div className="mx-5 mb-5 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-wide">미리보기</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${form.avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{form.name ? form.name.charAt(0) : '?'}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{form.name || '이름 미입력'}</div>
                    <div className="text-xs text-gray-400">
                      {dept?.name ?? '-'} · {form.position || '직급'} · {form.jobTitle || '직책'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 권한 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <SectionHeader
                title="권한 설정"
                desc="역할 선택 시 자동으로 적용되며, 개별 권한을 직접 조정할 수 있습니다"
              />
              <div className="p-5">
                {/* 선택된 권한 수 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{form.permissions.length}</span>
                    <span className="text-sm text-gray-500">/ {PERMISSION_META.length}개 권한 선택됨</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, permissions: PERMISSION_META.map((m) => m.key) }))}
                      className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
                    >
                      전체 선택
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, permissions: [] }))}
                      className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
                    >
                      전체 해제
                    </button>
                  </div>
                </div>

                {/* 권한 그룹 */}
                <div className="grid grid-cols-2 gap-3">
                  {PERMISSION_GROUPS.map((group) => (
                    <PermissionGroupPanel
                      key={group}
                      group={group}
                      permissions={form.permissions}
                      onChange={togglePermission}
                    />
                  ))}
                </div>

                {/* 시스템 권한 경고 */}
                {(form.permissions.includes('SYSTEM_MANAGE') || form.permissions.includes('USER_MANAGE')) && (
                  <div className="mt-4 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-red-700">위험 권한이 포함되어 있습니다</p>
                      <p className="text-[11px] text-red-600 mt-0.5">시스템 관리 또는 사용자 관리 권한은 신뢰할 수 있는 담당자에게만 부여하세요.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 수정 시: 변경 이력 안내 */}
            {mode === 'edit' && existingUser && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <SectionHeader title="변경 전 정보 (참고용)" desc="수정 전 원본 데이터" />
                <div className="p-5 grid grid-cols-2 gap-3 text-xs">
                  {[
                    ['이름', existingUser.name],
                    ['이메일', existingUser.email],
                    ['부서', existingUser.departmentName],
                    ['직급 / 직책', `${existingUser.position} / ${existingUser.jobTitle}`],
                    ['역할', ROLE_LABELS[existingUser.role]],
                    ['상태', existingUser.isActive ? '활성' : '비활성'],
                    ['권한 수', `${existingUser.permissions.length}개`],
                    ['가입일', existingUser.joinedAt ?? '-'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-400 font-medium">{label}</span>
                      <span className="text-gray-700 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="flex items-center justify-end gap-2 pt-2 pb-6">
          <button
            onClick={() => router.push('/system/users')}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors shadow-sm"
          >
            {saving ? '저장 중...' : mode === 'new' ? '사용자 등록' : '변경 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
