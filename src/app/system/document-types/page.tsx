'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';

interface DocType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  prefix: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const EMPTY_FORM = { name: '', code: '', description: '', prefix: '', order: 0, isActive: true };
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

export default function DocumentTypesPage() {
  const [types, setTypes] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<null | 'new' | 'edit'>(null);
  const [editTarget, setEditTarget] = useState<DocType | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (includeInactive) params.set('includeInactive', 'true');
    if (q) params.set('q', q);
    const res = await fetch(`/api/system/document-types?${params}`);
    if (res.ok) setTypes(await res.json());
    setLoading(false);
  }, [includeInactive, q]);

  useEffect(() => { void fetchTypes(); }, [fetchTypes]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditTarget(null);
    setModal('new');
  };

  const openEdit = (t: DocType) => {
    setForm({ name: t.name, code: t.code, description: t.description ?? '', prefix: t.prefix ?? '', order: t.order, isActive: t.isActive });
    setEditTarget(t);
    setError('');
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = modal === 'edit' ? `/api/system/document-types/${editTarget!.id}` : '/api/system/document-types';
      const method = modal === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '저장 실패'); return; }
      setModal(null);
      await fetchTypes();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (t: DocType) => {
    await fetch(`/api/system/document-types/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    await fetchTypes();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="문서유형 관리" breadcrumb="DMS 홈 > 시스템설정 > 문서유형 관리" />

      <div className="flex-1 overflow-auto p-6">
        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '전체 유형', value: types.length, color: 'text-blue-600' },
            { label: '활성', value: types.filter((t) => t.isActive).length, color: 'text-green-600' },
            { label: '비활성', value: types.filter((t) => !t.isActive).length, color: 'text-gray-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* 참고: 하드코딩 대비 안내 */}
        <div className="mb-4 flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <span>여기서 등록된 문서유형은 문서 등록 화면의 드롭다운(<code>/api/system/document-types</code>)과 연동됩니다. <strong>문서번호 Prefix</strong>는 자동번호 채번 시 앞자리로 사용됩니다.</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <input type="search" placeholder="유형명 / 코드 검색..." value={q} onChange={(e) => setQ(e.target.value)} className="w-56 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">비활성 포함</span>
              </label>
            </div>
            <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              유형 추가
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['유형코드', '유형명', '문서번호 Prefix', '설명', '순서', '상태', '관리'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">불러오는 중...</td></tr>
              ) : types.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">등록된 문서유형이 없습니다</td></tr>
              ) : types.map((t) => (
                <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${!t.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{t.code}</span></td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.name}</td>
                  <td className="px-4 py-3">{t.prefix ? <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{t.prefix}</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{t.description ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{t.order}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {t.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">수정</button>
                      <button onClick={() => toggleActive(t)} className={`text-xs font-medium ${t.isActive ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:text-green-800'}`}>
                        {t.isActive ? '비활성화' : '활성화'}
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
        <Modal title={modal === 'new' ? '문서유형 추가' : '문서유형 수정'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">유형명 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 매뉴얼, 절차서" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">유형코드 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="예: MANUAL, PROC" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">문서번호 Prefix</label>
              <input className={inputCls} value={form.prefix} onChange={(e) => setForm((p) => ({ ...p, prefix: e.target.value.toUpperCase() }))} placeholder="예: MAN, PROC, WI" />
              <p className="text-[11px] text-gray-400 mt-1">문서번호 자동생성 시 앞자리로 사용됩니다</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">설명</label>
              <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="유형에 대한 간단한 설명" />
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
