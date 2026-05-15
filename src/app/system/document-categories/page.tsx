'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';

interface Category {
  id: string;
  label: string;
  code: string | null;
  parentId: string | null;
  parent: { id: string; label: string; code: string | null } | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  _count: { children: number; documents: number };
}

const EMPTY_FORM = { label: '', code: '', parentId: '', order: 0, isActive: true };
type FormState = typeof EMPTY_FORM;

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto">
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
const selectCls = 'w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

export default function DocumentCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<null | 'new' | 'edit'>(null);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCats = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (includeInactive) params.set('includeInactive', 'true');
    if (q) params.set('q', q);
    const res = await fetch(`/api/system/document-categories?${params}`);
    if (res.ok) setCats(await res.json());
    setLoading(false);
  }, [includeInactive, q]);

  useEffect(() => { void fetchCats(); }, [fetchCats]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditTarget(null);
    setModal('new');
  };

  const openEdit = (c: Category) => {
    setForm({ label: c.label, code: c.code ?? '', parentId: c.parentId ?? '', order: c.order, isActive: c.isActive });
    setEditTarget(c);
    setError('');
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, parentId: form.parentId || null, code: form.code || null };
      const url = modal === 'edit' ? `/api/system/document-categories/${editTarget!.id}` : '/api/system/document-categories';
      const method = modal === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '저장 실패'); return; }
      setModal(null);
      await fetchCats();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: Category) => {
    await fetch(`/api/system/document-categories/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    await fetchCats();
  };

  // 계층 표시를 위해 parentId 유무로 들여쓰기
  const sorted = [...cats].sort((a, b) => {
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;
    return a.order - b.order;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="문서분류 관리" breadcrumb="DMS 홈 > 시스템설정 > 문서분류 관리" />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '전체 분류', value: cats.length, color: 'text-indigo-600' },
            { label: '루트 분류', value: cats.filter((c) => !c.parentId).length, color: 'text-blue-600' },
            { label: '하위 분류', value: cats.filter((c) => !!c.parentId).length, color: 'text-violet-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <input type="search" placeholder="분류명 / 코드 검색..." value={q} onChange={(e) => setQ(e.target.value)} className="w-56 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">비활성 포함</span>
              </label>
            </div>
            <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              분류 추가
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['분류명', '분류코드', '상위분류', '연결문서', '하위분류', '상태', '관리'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">불러오는 중...</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">등록된 문서분류가 없습니다</td></tr>
              ) : sorted.map((c) => (
                <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${!c.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {c.parentId ? <span className="mr-1.5 text-gray-300 font-normal">└</span> : null}
                    {c.label}
                  </td>
                  <td className="px-4 py-3">{c.code ? <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{c.code}</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-500">{c.parent?.label ?? <span className="text-gray-300">루트</span>}</td>
                  <td className="px-4 py-3 text-gray-500">{c._count.documents}건</td>
                  <td className="px-4 py-3 text-gray-500">{c._count.children}개</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {c.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">수정</button>
                      <button onClick={() => toggleActive(c)} className={`text-xs font-medium ${c.isActive ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:text-green-800'}`}>
                        {c.isActive ? '비활성화' : '활성화'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'new' ? '문서분류 추가' : '문서분류 수정'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">분류명 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="예: 관리문서, 운영문서" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">분류코드</label>
              <input className={inputCls} value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="예: QP, WI, FORM (선택)" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">상위분류</label>
              <select className={selectCls} value={form.parentId} onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}>
                <option value="">— 루트 분류 —</option>
                {cats.filter((c) => c.id !== editTarget?.id && c.isActive && !c.parentId).map((c) => (
                  <option key={c.id} value={c.id}>{c.label}{c.code ? ` (${c.code})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">정렬 순서</label>
              <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">활성 상태</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
