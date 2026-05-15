'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';

// ── 타입 ─────────────────────────────────────────────────────────────────────

interface Dept {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  parent: { id: string; name: string; code: string } | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  _count: { children: number; users: number };
}

const EMPTY_FORM = { name: '', code: '', parentId: '', order: 0, isActive: true };
type FormState = typeof EMPTY_FORM;

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const selectCls = 'w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function OrganizationsPage() {
  const [depts, setDepts] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<null | 'new' | 'edit'>(null);
  const [editTarget, setEditTarget] = useState<Dept | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchDepts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (includeInactive) params.set('includeInactive', 'true');
    if (q) params.set('q', q);
    const res = await fetch(`/api/system/organizations?${params}`);
    if (res.ok) setDepts(await res.json());
    setLoading(false);
  }, [includeInactive, q]);

  useEffect(() => { void fetchDepts(); }, [fetchDepts]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditTarget(null);
    setModal('new');
  };

  const openEdit = (d: Dept) => {
    setForm({ name: d.name, code: d.code, parentId: d.parentId ?? '', order: d.order, isActive: d.isActive });
    setEditTarget(d);
    setError('');
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, parentId: form.parentId || null };
      const url = modal === 'edit' ? `/api/system/organizations/${editTarget!.id}` : '/api/system/organizations';
      const method = modal === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '저장 실패'); return; }
      setModal(null);
      await fetchDepts();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d: Dept) => {
    await fetch(`/api/system/organizations/${d.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !d.isActive }),
    });
    await fetchDepts();
  };

  const activeDepts = depts.filter((d) => d.isActive);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="조직 관리" breadcrumb="DMS 홈 > 시스템설정 > 조직 관리" />

      <div className="flex-1 overflow-auto p-6">
        {/* 상단 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '전체 부서', value: depts.length, color: 'text-blue-600' },
            { label: '활성 부서', value: activeDepts.length, color: 'text-green-600' },
            { label: '비활성', value: depts.length - activeDepts.length, color: 'text-gray-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* 툴바 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="search"
                placeholder="부서명 검색..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-56 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">비활성 포함</span>
              </label>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              부서 추가
            </button>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['부서코드', '부서명', '상위부서', '사용자', '순서', '상태', '관리'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">불러오는 중...</td></tr>
                ) : depts.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">데이터가 없습니다</td></tr>
                ) : depts.map((d) => (
                  <tr key={d.id} className={`hover:bg-gray-50 transition-colors ${!d.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{d.code}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {d.parentId && <span className="mr-1 text-gray-300">└</span>}
                      {d.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{d.parent?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{d._count.users}명</td>
                    <td className="px-4 py-3 text-gray-500">{d.order}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${d.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {d.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(d)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">수정</button>
                        <button onClick={() => toggleActive(d)} className={`text-xs font-medium ${d.isActive ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:text-green-800'}`}>
                          {d.isActive ? '비활성화' : '활성화'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 추가/수정 모달 */}
      {modal && (
        <Modal title={modal === 'new' ? '부서 추가' : '부서 수정'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">부서명 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 품질관리팀" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">부서코드 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="예: D01, QUAL" />
              <p className="text-[11px] text-gray-400 mt-1">영문 대문자, 숫자, 하이픈만 사용 가능</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">상위부서</label>
              <select className={selectCls} value={form.parentId} onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}>
                <option value="">— 최상위 부서 —</option>
                {depts.filter((d) => d.id !== editTarget?.id && d.isActive).map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
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
              <button onClick={() => setModal(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
