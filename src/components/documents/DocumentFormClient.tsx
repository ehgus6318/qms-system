'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadZone from '@/components/documents/FileUploadZone';
import {
  DOC_TYPES,
  DOC_CATEGORIES,
  DEPARTMENTS,
  ACCESS_LEVEL_META,
  type Document,
  type AccessLevel,
  type DocCategory,
} from '@/lib/documentsData';
import { getApprovalCandidates } from '@/lib/authUtils';
import { USERS } from '@/lib/usersData';

interface DocumentFormClientProps {
  mode: 'new' | 'edit';
  initialData?: Partial<Document>;
  docId?: number;
}

const APPROVAL_CANDIDATES = getApprovalCandidates(USERS);
const RETENTION_OPTIONS = ['1년', '3년', '5년', '10년', '영구'];
const DEPT_OPTIONS = DEPARTMENTS.filter((d) => d.id !== 'D08');

/* ── 분류 트리 렌더러 ──────────────────────────────────────────────────── */
function CategoryTree({
  nodes,
  selected,
  onSelect,
}: {
  nodes: DocCategory[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [openIds, setOpenIds] = useState<string[]>(['C1', 'C2']);

  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isOpen = openIds.includes(node.id);
        const isSelected = selected === node.id;

        return (
          <li key={node.id}>
            <div
              className={[
                'flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer select-none text-xs transition-colors',
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700',
              ].join(' ')}
              onClick={() => {
                if (hasChildren) toggle(node.id);
                else onSelect(node.id);
              }}
            >
              {hasChildren ? (
                <svg
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ml-1 ${isSelected ? 'bg-white' : 'bg-gray-400'}`} />
              )}
              <span className={`font-medium ${hasChildren ? '' : 'font-normal'}`}>{node.label}</span>
              {isSelected && !hasChildren && (
                <svg className="w-3 h-3 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {hasChildren && isOpen && (
              <div className="ml-4 mt-0.5">
                <CategoryTree nodes={node.children!} selected={selected} onSelect={onSelect} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── 섹션 헤더 ─────────────────────────────────────────────────────────── */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
    </div>
  );
}

/* ── 폼 필드 레이블 ────────────────────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

/* ════════════════════════════════════════════════════════════════════════ */
export default function DocumentFormClient({ mode, initialData, docId }: DocumentFormClientProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    no:              initialData?.no              ?? '',
    name:            initialData?.name            ?? '',
    type:            initialData?.type            ?? '절차서',
    categoryId:      initialData?.categoryId      ?? '',
    ver:             initialData?.ver             ?? 'Rev.1',
    dept:            initialData?.dept            ?? 'IT팀',
    description:     initialData?.description     ?? '',
    relatedStandard: initialData?.relatedStandard ?? '',
    retentionPeriod: initialData?.retentionPeriod ?? '5년',
    effectiveDate:   initialData?.effectiveDate   ?? '',
    accessLevel:     (initialData?.accessLevel    ?? 'internal') as AccessLevel,
    approver1:       APPROVAL_CANDIDATES[0]?.id ?? '',
    approver2:       APPROVAL_CANDIDATES[1]?.id ?? '',
    approver3:       APPROVAL_CANDIDATES[2]?.id ?? '',
  });

  /* 적용부서 체크박스 */
  const initApplied = new Set(initialData?.appliedDepts?.map((d) => d.deptId) ?? ['D01']);
  const [appliedDepts, setAppliedDepts] = useState<Set<string>>(initApplied);

  /* 회람 부서 체크박스 */
  const initCirc = new Set(initialData?.circulationList?.map((c) => c.deptId) ?? []);
  const [circDepts, setCircDepts] = useState<Set<string>>(initCirc);

  const [submitting, setSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const toggleSet = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setter(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    if (isEdit && docId) router.push(`/documents/${docId}`);
    else router.push('/documents');
  };

  /* 분류 라벨 찾기 */
  const findCategoryLabel = (id: string): string => {
    for (const cat of DOC_CATEGORIES) {
      if (cat.id === id) return cat.label;
      for (const child of cat.children ?? []) {
        if (child.id === id) return `${cat.label} > ${child.label}`;
      }
    }
    return '';
  };

  const formTypes = DOC_TYPES.filter((t) => t !== '전체');

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-w-5xl">

      {/* ── 1. 기본 정보 ── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          title="기본 정보"
        />
        <div className="p-5 grid grid-cols-2 gap-x-5 gap-y-4">
          {/* 문서번호 */}
          <div>
            <FieldLabel required>문서번호</FieldLabel>
            <input type="text" required value={form.no} onChange={(e) => update('no', e.target.value)}
              placeholder="예: QMS-S-005" className={inputCls} />
          </div>

          {/* 문서유형 */}
          <div>
            <FieldLabel required>문서유형</FieldLabel>
            <select value={form.type} onChange={(e) => update('type', e.target.value)} className={inputCls}>
              {formTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* 문서명 */}
          <div className="col-span-2">
            <FieldLabel required>문서명</FieldLabel>
            <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
              placeholder="문서 제목을 입력하세요" className={inputCls} />
          </div>

          {/* 분류체계 */}
          <div className="col-span-2">
            <FieldLabel>분류체계</FieldLabel>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className={`${inputCls} text-left flex items-center justify-between`}
              >
                <span className={form.categoryId ? 'text-gray-800' : 'text-gray-400'}>
                  {form.categoryId ? findCategoryLabel(form.categoryId) : '분류를 선택하세요'}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCategoryPicker ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryPicker && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-h-56 overflow-y-auto">
                  <CategoryTree
                    nodes={DOC_CATEGORIES}
                    selected={form.categoryId}
                    onSelect={(id) => { update('categoryId', id); setShowCategoryPicker(false); }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 버전 */}
          <div>
            <FieldLabel>버전</FieldLabel>
            <input type="text" value={form.ver} onChange={(e) => update('ver', e.target.value)}
              placeholder="예: Rev.1" className={inputCls} />
          </div>

          {/* 작성 부서 */}
          <div>
            <FieldLabel>작성 부서</FieldLabel>
            <select value={form.dept} onChange={(e) => update('dept', e.target.value)} className={inputCls}>
              {DEPT_OPTIONS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          {/* 관련 표준 */}
          <div>
            <FieldLabel>관련 표준</FieldLabel>
            <input type="text" value={form.relatedStandard}
              onChange={(e) => update('relatedStandard', e.target.value)}
              placeholder="예: ISO 9001:2015 7.5" className={inputCls} />
          </div>

          {/* 보존 기간 */}
          <div>
            <FieldLabel>보존 기간</FieldLabel>
            <select value={form.retentionPeriod} onChange={(e) => update('retentionPeriod', e.target.value)} className={inputCls}>
              {RETENTION_OPTIONS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* 시행 예정일 */}
          <div>
            <FieldLabel>시행 예정일</FieldLabel>
            <input type="date" value={form.effectiveDate}
              onChange={(e) => update('effectiveDate', e.target.value)} className={inputCls} />
          </div>

          {/* 문서 요약 */}
          <div className="col-span-2">
            <FieldLabel>문서 요약</FieldLabel>
            <textarea rows={3} value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="문서의 목적 및 주요 내용을 간략히 기술하세요."
              className={`${inputCls} resize-none`} />
          </div>
        </div>
      </section>

      {/* ── 2. 문서 권한 ── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          title="문서 권한"
        />
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(ACCESS_LEVEL_META) as [AccessLevel, typeof ACCESS_LEVEL_META[AccessLevel]][]).map(([key, meta]) => (
              <label
                key={key}
                className={[
                  'flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all',
                  form.accessLevel === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="accessLevel"
                  value={key}
                  checked={form.accessLevel === key}
                  onChange={() => update('accessLevel', key)}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${meta.color}`}>
                    {meta.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{meta.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 적용부서 ── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          title="적용부서"
        />
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-3">이 문서가 적용되는 부서를 선택하세요. 선택된 부서는 문서 열람 권한을 갖습니다.</p>
          <div className="grid grid-cols-4 gap-2">
            {DEPT_OPTIONS.map((dept) => {
              const checked = appliedDepts.has(dept.id);
              return (
                <label
                  key={dept.id}
                  className={[
                    'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm',
                    checked
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSet(appliedDepts, dept.id, setAppliedDepts)}
                    className="accent-blue-600"
                  />
                  <span className="font-medium text-xs">{dept.name}</span>
                  {checked && (
                    <span className="ml-auto text-[10px] text-blue-600 font-medium">적용</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. 회람 대상 ── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>}
          title="회람 대상"
        />
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-3">승인 후 회람 알림을 받을 부서를 선택하세요. 회람 대상자는 문서 확인 후 열람 완료 처리가 필요합니다.</p>
          <div className="grid grid-cols-4 gap-2">
            {DEPT_OPTIONS.map((dept) => {
              const checked = circDepts.has(dept.id);
              return (
                <label
                  key={dept.id}
                  className={[
                    'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm',
                    checked
                      ? 'border-teal-400 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSet(circDepts, dept.id, setCircDepts)}
                    className="accent-teal-600"
                  />
                  <span className="font-medium text-xs">{dept.name}</span>
                  {checked && (
                    <span className="ml-auto text-[10px] text-teal-600 font-medium">회람</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. 첨부파일 ── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
          title="첨부파일"
        />
        <div className="p-5">
          <FileUploadZone label="" maxFiles={10} />
        </div>
      </section>

      {/* ── 6. 결재선 ── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          title="결재선 설정"
        />
        <div className="p-5">
          <div className="flex items-stretch gap-2">
            {/* 기안자 */}
            <div className="flex-1 text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">김</span>
              </div>
              <p className="text-xs font-semibold text-gray-800">김영훈</p>
              <p className="text-[10px] text-gray-400 mt-0.5">IT팀</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 mt-2">기안</span>
            </div>

            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>

            {/* 검토자 1 */}
            <div className="flex-1 text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-dashed border-yellow-400 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <select value={form.approver1} onChange={(e) => update('approver1', e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white mb-1">
                {APPROVAL_CANDIDATES.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.departmentName} · {u.position})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400">팀장 검토</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700 mt-2">검토</span>
            </div>

            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>

            {/* 검토자 2 */}
            <div className="flex-1 text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-dashed border-yellow-400 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <select value={form.approver2} onChange={(e) => update('approver2', e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white mb-1">
                {APPROVAL_CANDIDATES.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.departmentName} · {u.position})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400">품질 검토</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700 mt-2">검토</span>
            </div>

            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>

            {/* 최종 승인자 */}
            <div className="flex-1 text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-dashed border-green-400 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <select value={form.approver3} onChange={(e) => update('approver3', e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white mb-1">
                {APPROVAL_CANDIDATES.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.departmentName} · {u.position})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400">최종 승인</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 mt-2">승인</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 하단 버튼 ── */}
      <div className="flex items-center justify-between pb-2">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          취소
        </button>
        <div className="flex gap-2">
          <button type="button"
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            임시저장
          </button>
          <button type="submit" disabled={submitting}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-1.5">
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                저장 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {isEdit ? '수정 저장' : '결재 요청'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
