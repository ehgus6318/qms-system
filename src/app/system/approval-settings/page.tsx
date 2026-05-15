'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';

interface TemplateStep {
  id: string;
  templateId: string;
  stepOrder: number;
  role: string;
  assigneeType: string;
  assigneeId: string | null;
  isRequired: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  allowFreeSelection: boolean;
  allowSelfApproval: boolean;
  isActive: boolean;
  steps: TemplateStep[];
  createdAt: string;
}

interface StepForm {
  stepOrder: number;
  role: string;
  assigneeType: string;
  isRequired: boolean;
}

const EMPTY_STEP: StepForm = { stepOrder: 1, role: '', assigneeType: 'FREE', isRequired: true };

const EMPTY_FORM = {
  name: '',
  description: '',
  isDefault: false,
  allowFreeSelection: true,
  allowSelfApproval: false,
  steps: [{ ...EMPTY_STEP }] as StepForm[],
};

type FormState = typeof EMPTY_FORM;

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${wide ? 'w-[640px]' : 'w-[480px]'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const selectCls = 'px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

const ASSIGNEE_TYPE_LABELS: Record<string, string> = {
  FREE: '자유 선택',
  FIXED: '고정 지정',
  DEPT_HEAD: '부서장',
};

export default function ApprovalSettingsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [modal, setModal] = useState<null | 'new' | 'edit'>(null);
  const [editTarget, setEditTarget] = useState<Template | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (includeInactive) params.set('includeInactive', 'true');
    const res = await fetch(`/api/system/approval-settings?${params}`);
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => { void fetchTemplates(); }, [fetchTemplates]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, steps: [{ ...EMPTY_STEP }] });
    setEditTarget(null);
    setError('');
    setModal('new');
  };

  const openEdit = (t: Template) => {
    setForm({
      name: t.name,
      description: t.description ?? '',
      isDefault: t.isDefault,
      allowFreeSelection: t.allowFreeSelection,
      allowSelfApproval: t.allowSelfApproval,
      steps: t.steps.map((s) => ({ stepOrder: s.stepOrder, role: s.role, assigneeType: s.assigneeType, isRequired: s.isRequired })),
    });
    setEditTarget(t);
    setError('');
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = modal === 'edit' ? `/api/system/approval-settings/${editTarget!.id}` : '/api/system/approval-settings';
      const method = modal === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '저장 실패'); return; }
      setModal(null);
      await fetchTemplates();
    } finally { setSaving(false); }
  };

  const toggleActive = async (t: Template) => {
    await fetch(`/api/system/approval-settings/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    await fetchTemplates();
  };

  const addStep = () => {
    setForm((p) => ({
      ...p,
      steps: [...p.steps, { stepOrder: p.steps.length + 1, role: '', assigneeType: 'FREE', isRequired: true }],
    }));
  };

  const removeStep = (idx: number) => {
    setForm((p) => ({
      ...p,
      steps: p.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepOrder: i + 1 })),
    }));
  };

  const updateStep = (idx: number, key: keyof StepForm, value: string | number | boolean) => {
    setForm((p) => ({
      ...p,
      steps: p.steps.map((s, i) => i === idx ? { ...s, [key]: value } : s),
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="결재설정" breadcrumb="DMS 홈 > 시스템설정 > 결재설정" />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '전체 템플릿', value: templates.length, color: 'text-blue-600' },
            { label: '기본 템플릿', value: templates.filter((t) => t.isDefault).length, color: 'text-amber-600' },
            { label: '활성', value: templates.filter((t) => t.isActive).length, color: 'text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-600">비활성 포함</span>
            </label>
            <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              템플릿 추가
            </button>
          </div>

          {loading ? (
            <div className="px-4 py-12 text-center text-gray-400">불러오는 중...</div>
          ) : templates.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400">등록된 결재 템플릿이 없습니다</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {templates.map((t) => (
                <div key={t.id} className={`px-5 py-4 ${!t.isActive ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-gray-800">{t.name}</h4>
                      {t.isDefault && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">기본</span>}
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {t.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">수정</button>
                      <button onClick={() => toggleActive(t)} className={`text-xs font-medium ${t.isActive ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:text-green-800'}`}>
                        {t.isActive ? '비활성화' : '활성화'}
                      </button>
                    </div>
                  </div>
                  {t.description && <p className="text-xs text-gray-500 mb-2">{t.description}</p>}
                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded ${t.allowFreeSelection ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'}`}>
                      {t.allowFreeSelection ? '자유 결재선 허용' : '결재선 고정'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${t.allowSelfApproval ? 'bg-violet-50 text-violet-600' : 'bg-gray-100'}`}>
                      {t.allowSelfApproval ? '본인 결재 허용' : '본인 결재 불가'}
                    </span>
                  </div>
                  {/* 결재 단계 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {t.steps.map((s, i) => (
                      <div key={s.id} className="flex items-center gap-1.5">
                        {i > 0 && <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-gray-400">{s.stepOrder}단계</span>
                          <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{s.role}</span>
                          <span className="text-[9px] text-gray-400 mt-0.5">{ASSIGNEE_TYPE_LABELS[s.assigneeType] ?? s.assigneeType}</span>
                        </div>
                      </div>
                    ))}
                    {t.steps.length === 0 && <span className="text-xs text-gray-400">결재 단계 없음</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'new' ? '결재 템플릿 추가' : '결재 템플릿 수정'} onClose={() => setModal(null)} wide>
          <div className="space-y-5">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">템플릿명 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 기본 결재, 긴급 결재" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">설명</label>
              <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4 text-amber-500 rounded" />
                <span className="text-sm text-gray-700">기본 템플릿으로 설정</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.allowFreeSelection} onChange={(e) => setForm((p) => ({ ...p, allowFreeSelection: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">결재선 자유 선택 허용</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.allowSelfApproval} onChange={(e) => setForm((p) => ({ ...p, allowSelfApproval: e.target.checked }))} className="w-4 h-4 text-violet-600 rounded" />
                <span className="text-sm text-gray-700">본인 결재 허용</span>
              </label>
            </div>

            {/* 결재 단계 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600">결재 단계</label>
                <button onClick={addStep} className="text-xs text-blue-600 hover:text-blue-800 font-medium border border-blue-200 px-2 py-0.5 rounded">+ 단계 추가</button>
              </div>
              <div className="space-y-2">
                {form.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{s.stepOrder}</span>
                    <input
                      className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      value={s.role}
                      onChange={(e) => updateStep(i, 'role', e.target.value)}
                      placeholder="단계명 (예: 팀장 검토)"
                    />
                    <select className={selectCls} value={s.assigneeType} onChange={(e) => updateStep(i, 'assigneeType', e.target.value)}>
                      <option value="FREE">자유 선택</option>
                      <option value="DEPT_HEAD">부서장</option>
                      <option value="FIXED">고정 지정</option>
                    </select>
                    <label className="flex items-center gap-1 shrink-0">
                      <input type="checkbox" checked={s.isRequired} onChange={(e) => updateStep(i, 'isRequired', e.target.checked)} className="w-3.5 h-3.5 text-blue-600 rounded" />
                      <span className="text-[11px] text-gray-500">필수</span>
                    </label>
                    {form.steps.length > 1 && (
                      <button onClick={() => removeStep(i)} className="shrink-0 text-gray-300 hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
