'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';

interface CodeItem {
  id: string;
  groupId: string;
  code: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

interface CodeGroup {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  codes: CodeItem[];
}

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

type ModalMode = null | 'new-group' | 'edit-group' | 'new-code' | 'edit-code';

export default function CommonCodesPage() {
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<{ group?: CodeGroup; code?: CodeItem } | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupForm, setGroupForm] = useState({ code: '', name: '', description: '' });
  const [codeForm, setCodeForm] = useState({ code: '', name: '', description: '', order: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (includeInactive) params.set('includeInactive', 'true');
    const res = await fetch(`/api/system/common-codes?${params}`);
    if (res.ok) setGroups(await res.json());
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => { void fetchGroups(); }, [fetchGroups]);

  const saveGroup = async () => {
    setSaving(true);
    setError('');
    try {
      const isEdit = modal === 'edit-group';
      const url = isEdit ? `/api/system/common-codes/${editTarget!.group!.id}` : '/api/system/common-codes';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'group', ...groupForm }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '저장 실패'); return; }
      setModal(null);
      await fetchGroups();
    } finally { setSaving(false); }
  };

  const saveCode = async () => {
    setSaving(true);
    setError('');
    try {
      const isEdit = modal === 'edit-code';
      const url = isEdit ? `/api/system/common-codes/${editTarget!.code!.id}` : '/api/system/common-codes';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'code', groupId: selectedGroupId, ...codeForm }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '저장 실패'); return; }
      setModal(null);
      await fetchGroups();
    } finally { setSaving(false); }
  };

  const toggleGroupActive = async (g: CodeGroup) => {
    await fetch(`/api/system/common-codes/${g.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'group', isActive: !g.isActive }),
    });
    await fetchGroups();
  };

  const toggleCodeActive = async (c: CodeItem) => {
    await fetch(`/api/system/common-codes/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'code', isActive: !c.isActive }),
    });
    await fetchGroups();
  };

  const openNewGroup = () => {
    setGroupForm({ code: '', name: '', description: '' });
    setEditTarget(null);
    setError('');
    setModal('new-group');
  };

  const openEditGroup = (g: CodeGroup) => {
    setGroupForm({ code: g.code, name: g.name, description: g.description ?? '' });
    setEditTarget({ group: g });
    setError('');
    setModal('edit-group');
  };

  const openNewCode = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCodeForm({ code: '', name: '', description: '', order: 0, isActive: true });
    setEditTarget(null);
    setError('');
    setModal('new-code');
  };

  const openEditCode = (c: CodeItem) => {
    setSelectedGroupId(c.groupId);
    setCodeForm({ code: c.code, name: c.name, description: c.description ?? '', order: c.order, isActive: c.isActive });
    setEditTarget({ code: c });
    setError('');
    setModal('edit-code');
  };

  const totalCodes = groups.reduce((sum, g) => sum + g.codes.length, 0);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="공통코드 관리" breadcrumb="DMS 홈 > 시스템설정 > 공통코드 관리" />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '코드 그룹', value: groups.length, color: 'text-teal-600' },
            { label: '전체 코드값', value: totalCodes, color: 'text-blue-600' },
            { label: '시스템 그룹', value: groups.filter((g) => g.isSystem).length, color: 'text-orange-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm text-gray-600">비활성 포함</span>
          </label>
          <button onClick={openNewGroup} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            그룹 추가
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">불러오는 중...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 text-gray-400">등록된 공통코드 그룹이 없습니다</div>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${!g.isActive ? 'opacity-60' : 'border-gray-200'}`}>
                {/* 그룹 헤더 */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setExpandedGroup(expandedGroup === g.id ? null : g.id)} className="text-gray-400 hover:text-gray-600">
                      <svg className={`w-4 h-4 transition-transform ${expandedGroup === g.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <span className="font-mono text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">{g.code}</span>
                    <span className="font-semibold text-sm text-gray-800">{g.name}</span>
                    {g.isSystem && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">시스템</span>}
                    <span className="text-xs text-gray-400">{g.codes.length}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openNewCode(g.id)} className="text-xs text-teal-600 hover:text-teal-800 font-medium border border-teal-200 px-2 py-0.5 rounded">+ 코드 추가</button>
                    {!g.isSystem && <button onClick={() => openEditGroup(g)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">수정</button>}
                    {!g.isSystem && (
                      <button onClick={() => toggleGroupActive(g)} className={`text-xs font-medium ${g.isActive ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:text-green-800'}`}>
                        {g.isActive ? '비활성화' : '활성화'}
                      </button>
                    )}
                  </div>
                </div>

                {/* 코드값 목록 */}
                {expandedGroup === g.id && (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        {['코드값', '표시명', '설명', '순서', '상태', '관리'].map((h) => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {g.codes.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-4 text-center text-xs text-gray-400">코드값이 없습니다</td></tr>
                      ) : g.codes.map((c) => (
                        <tr key={c.id} className={`hover:bg-gray-50 ${!c.isActive ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-2.5"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{c.code}</span></td>
                          <td className="px-4 py-2.5 font-medium text-gray-800">{c.name}</td>
                          <td className="px-4 py-2.5 text-gray-500 text-xs max-w-[200px] truncate">{c.description ?? '—'}</td>
                          <td className="px-4 py-2.5 text-gray-500">{c.order}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                              {c.isActive ? '활성' : '비활성'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditCode(c)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">수정</button>
                              <button onClick={() => toggleCodeActive(c)} className={`text-xs font-medium ${c.isActive ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:text-green-800'}`}>
                                {c.isActive ? '비활성화' : '활성화'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 그룹 모달 */}
      {(modal === 'new-group' || modal === 'edit-group') && (
        <Modal title={modal === 'new-group' ? '코드 그룹 추가' : '코드 그룹 수정'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">그룹코드 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={groupForm.code} onChange={(e) => setGroupForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="예: SECURITY_LEVEL, POSITION" disabled={modal === 'edit-group'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">그룹명 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={groupForm.name} onChange={(e) => setGroupForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 보안등급, 직급" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">설명</label>
              <textarea className={inputCls} rows={2} value={groupForm.description} onChange={(e) => setGroupForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={saveGroup} disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 rounded-lg">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 코드값 모달 */}
      {(modal === 'new-code' || modal === 'edit-code') && (
        <Modal title={modal === 'new-code' ? '코드값 추가' : '코드값 수정'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            {modal === 'new-code' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">그룹 <span className="text-red-500">*</span></label>
                <select className={selectCls} value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name} ({g.code})</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">코드값 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={codeForm.code} onChange={(e) => setCodeForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="예: CONFIDENTIAL, SUWON" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">표시명 <span className="text-red-500">*</span></label>
              <input className={inputCls} value={codeForm.name} onChange={(e) => setCodeForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 기밀, 수원" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">설명</label>
              <input className={inputCls} value={codeForm.description} onChange={(e) => setCodeForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">정렬 순서</label>
              <input type="number" className={inputCls} value={codeForm.order} onChange={(e) => setCodeForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={codeForm.isActive} onChange={(e) => setCodeForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">활성 상태</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={saveCode} disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
