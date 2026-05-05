'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStatusStyle } from '@/lib/qmsColors';
import { DUMMY_DOCUMENTS, DOC_TYPES, DOC_STATUSES, type Document } from '@/lib/documentsData';

/* ───────────────────────── 타입 ───────────────────────── */
type SortKey = keyof Pick<Document, 'no' | 'name' | 'type' | 'ver' | 'status' | 'author' | 'date'>;
type SortDir = 'asc' | 'desc';

/* ───────────────────────── 상수 ───────────────────────── */
const PER_PAGE = 10;

const DOC_TYPE_BADGE: Record<string, string> = {
  품질메뉴얼: 'text-blue-700 bg-blue-50 border-blue-200',
  프로세스:   'text-green-700 bg-green-50 border-green-200',
  절차서:     'text-purple-700 bg-purple-50 border-purple-200',
  지침서:     'text-amber-700 bg-amber-50 border-amber-200',
  작업표준서: 'text-teal-700 bg-teal-50 border-teal-200',
  검사기준서: 'text-red-700 bg-red-50 border-red-200',
  기록문서:   'text-indigo-700 bg-indigo-50 border-indigo-200',
  외부문서:   'text-gray-700 bg-gray-50 border-gray-200',
};

const STATUS_CHIP_ACTIVE: Record<string, string> = {
  '전체':    'bg-slate-700 text-white border-slate-700',
  '승인':    'bg-green-600 text-white border-green-600',
  '검토 중': 'bg-blue-600 text-white border-blue-600',
  '반려':    'bg-red-600 text-white border-red-600',
  '초안':    'bg-gray-500 text-white border-gray-500',
};

const COLUMNS: { key: SortKey; label: string; width?: string }[] = [
  { key: 'no',     label: '문서번호',   width: 'w-[130px]' },
  { key: 'name',   label: '문서명' },
  { key: 'type',   label: '문서구분',   width: 'w-[110px]' },
  { key: 'ver',    label: '버전',       width: 'w-[70px]' },
  { key: 'status', label: '상태',       width: 'w-[90px]' },
  { key: 'author', label: '작성자',     width: 'w-[110px]' },
  { key: 'date',   label: '최종수정일', width: 'w-[110px]' },
];

/* ───────────────────────── 서브 컴포넌트 ───────────────── */
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return (
    <svg className="w-3 h-3 inline ml-0.5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
  return dir === 'asc'
    ? <svg className="w-3 h-3 inline ml-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
    : <svg className="w-3 h-3 inline ml-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;
}

/* ───────────────────────── 메인 컴포넌트 ───────────────── */
export default function DocumentListClient() {
  const router = useRouter();

  /* ── state ── */
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter]     = useState('전체');
  const [sortKey, setSortKey]           = useState<SortKey>('date');
  const [sortDir, setSortDir]           = useState<SortDir>('desc');
  const [page, setPage]                 = useState(1);
  const [selectedIds, setSelectedIds]   = useState<Set<number>>(new Set());

  /* ── 전체 통계 (필터 독립) ── */
  const stats = useMemo(() => ({
    total:     DUMMY_DOCUMENTS.length,
    approved:  DUMMY_DOCUMENTS.filter(d => d.status === '승인').length,
    reviewing: DUMMY_DOCUMENTS.filter(d => d.status === '검토 중').length,
    rejected:  DUMMY_DOCUMENTS.filter(d => d.status === '반려').length,
    draft:     DUMMY_DOCUMENTS.filter(d => d.status === '초안').length,
  }), []);

  /* ── 필터 적용 ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DUMMY_DOCUMENTS.filter(doc => {
      const matchSearch = !q || [doc.no, doc.name, doc.type, doc.author, doc.dept]
        .some(v => v.toLowerCase().includes(q));
      const matchStatus = statusFilter === '전체' || doc.status === statusFilter;
      const matchType   = typeFilter   === '전체' || doc.type   === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  /* ── 정렬 ── */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  /* ── 페이지네이션 ── */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  /* ── 핸들러 ── */
  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
      else { setSortDir('asc'); }
      return key;
    });
    setPage(1);
  }, []);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleStatus = (s: string)   => { setStatusFilter(s); setPage(1); };
  const handleType   = (t: string)   => { setTypeFilter(t); setPage(1); };

  const handleReset = () => {
    setSearch(''); setStatusFilter('전체'); setTypeFilter('전체'); setPage(1); setSelectedIds(new Set());
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length && paginated.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map(d => d.id)));
    }
  };

  const allSelected = paginated.length > 0 && selectedIds.size === paginated.length;

  /* ── 페이지 번호 배열 ── */
  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: (number | '...')[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  }, [totalPages, currentPage]);

  /* ── 렌더 ── */
  return (
    <div className="p-5 space-y-4">

      {/* ① 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">문서 목록</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            전체 <strong className="text-gray-700">{stats.total}</strong>건의 문서가 등록되어 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 내보내기 */}
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel 내보내기
          </button>
          {/* 신규 등록 */}
          <a
            href="/documents/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-blue-200 btn-ripple"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            신규 문서 등록
          </a>
        </div>
      </div>

      {/* ② 현황 통계 카드 */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: '전체 문서',  value: stats.total,     bg: 'bg-slate-50',  border: 'border-slate-200', text: 'text-slate-700',  dot: 'bg-slate-400' },
          { label: '승인',       value: stats.approved,  bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  dot: 'bg-green-500' },
          { label: '검토 중',    value: stats.reviewing, bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',   dot: 'bg-blue-500' },
          { label: '반려',       value: stats.rejected,  bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    dot: 'bg-red-500' },
          { label: '초안',       value: stats.draft,     bg: 'bg-gray-50',   border: 'border-gray-200',  text: 'text-gray-700',   dot: 'bg-gray-400' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} px-4 py-3 flex items-center gap-3 card-lift cursor-pointer`}
            onClick={() => handleStatus(s.label === '전체 문서' ? '전체' : s.label)}>
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 font-medium">{s.label}</p>
              <p className={`text-xl font-extrabold leading-tight ${s.text}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ③ 필터 바 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        {/* 행 1: 검색 + 문서구분 + 초기화 */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="문서번호, 문서명, 작성자로 검색..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
            />
            {search && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 문서구분 */}
          <select
            value={typeFilter}
            onChange={e => handleType(e.target.value)}
            className="py-2 px-3 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
          >
            {DOC_TYPES.map(t => <option key={t} value={t}>{t === '전체' ? '문서구분 전체' : t}</option>)}
          </select>

          <div className="flex-1" />

          {/* 필터 초기화 */}
          {(search || statusFilter !== '전체' || typeFilter !== '전체') && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              초기화
            </button>
          )}
        </div>

        {/* 행 2: 상태 필터 칩 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-500 font-medium flex-shrink-0">상태:</span>
          {DOC_STATUSES.map(s => {
            const isOn = statusFilter === s;
            const cnt = s === '전체'
              ? DUMMY_DOCUMENTS.length
              : DUMMY_DOCUMENTS.filter(d => d.status === s).length;
            return (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-150 active:scale-95',
                  isOn
                    ? STATUS_CHIP_ACTIVE[s] ?? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
                ].join(' ')}
              >
                {s}
                <span className={`text-[10px] font-bold px-1 rounded-full ${isOn ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {cnt}
                </span>
              </button>
            );
          })}

          <div className="flex-1" />

          {/* 필터 적용 결과 */}
          <span className="text-[11px] text-gray-400">
            {filtered.length !== DUMMY_DOCUMENTS.length
              ? <><strong className="text-blue-600">{filtered.length}</strong>건 필터됨 / 전체 {DUMMY_DOCUMENTS.length}건</>
              : <>전체 {DUMMY_DOCUMENTS.length}건</>
            }
          </span>
        </div>
      </div>

      {/* ④ 선택 항목 액션 바 (선택 시만 표시) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-xs font-semibold text-blue-700">
            {selectedIds.size}건 선택됨
          </span>
          <div className="h-4 w-px bg-blue-200" />
          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            다운로드
          </button>
          <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            삭제
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">취소</button>
        </div>
      )}

      {/* ⑤ 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            {/* 헤더 */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {/* 체크박스 */}
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                  />
                </th>
                {/* 순번 */}
                <th className="w-10 px-2 py-3 text-center text-gray-400 font-semibold">#</th>
                {/* 컬럼 헤더 */}
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={[
                      'px-3 py-3 text-left font-semibold text-gray-500 cursor-pointer select-none',
                      'hover:bg-gray-100 hover:text-gray-700 transition-colors whitespace-nowrap',
                      col.width ?? '',
                    ].join(' ')}
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </th>
                ))}
                {/* 작업 */}
                <th className="w-[90px] px-3 py-3 text-center text-gray-400 font-semibold">작업</th>
              </tr>
            </thead>

            {/* 바디 */}
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 3} className="text-center py-16 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">검색 결과가 없습니다</p>
                    <p className="text-xs mt-1">다른 검색어나 필터를 시도해보세요.</p>
                    <button onClick={handleReset} className="mt-3 text-xs text-blue-600 hover:underline">필터 초기화</button>
                  </td>
                </tr>
              ) : (
                paginated.map((doc, idx) => {
                  const st = getStatusStyle(doc.status);
                  const typeBadge = DOC_TYPE_BADGE[doc.type] ?? 'text-gray-600 bg-gray-50 border-gray-200';
                  const isSelected = selectedIds.has(doc.id);
                  const rowNum = (currentPage - 1) * PER_PAGE + idx + 1;

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => router.push(`/documents/${doc.id}`)}
                      className={[
                        'border-b border-gray-50 cursor-pointer transition-all duration-100 group table-row-hover',
                        isSelected ? 'bg-blue-50/70' : '',
                      ].join(' ')}
                    >
                      {/* 체크박스 */}
                      <td
                        className="px-4 py-2.5"
                        onClick={e => { e.stopPropagation(); toggleSelect(doc.id); }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(doc.id)}
                          className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                          onClick={e => e.stopPropagation()}
                        />
                      </td>

                      {/* 순번 */}
                      <td className="px-2 py-2.5 text-center text-gray-400 tabular-nums">{rowNum}</td>

                      {/* 문서번호 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="font-mono text-blue-600 font-semibold group-hover:underline">
                          {doc.no}
                        </span>
                      </td>

                      {/* 문서명 */}
                      <td className="px-3 py-2.5">
                        <div className="max-w-[220px]">
                          <p className="text-gray-800 font-semibold truncate group-hover:text-blue-700 transition-colors" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-gray-400 text-[10px] truncate mt-0.5" title={doc.description}>
                            {doc.description}
                          </p>
                        </div>
                      </td>

                      {/* 문서구분 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${typeBadge}`}>
                          {doc.type}
                        </span>
                      </td>

                      {/* 버전 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-gray-500 font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">
                          {doc.ver}
                        </span>
                      </td>

                      {/* 상태 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                          {doc.status}
                        </span>
                      </td>

                      {/* 작성자 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-[8px] font-bold text-slate-600">{doc.author[0]}</span>
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium leading-tight">{doc.author}</p>
                            <p className="text-gray-400 text-[9px] leading-tight">{doc.dept}</p>
                          </div>
                        </div>
                      </td>

                      {/* 최종수정일 */}
                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-500 tabular-nums">
                        {doc.date}
                      </td>

                      {/* 작업 버튼 */}
                      <td
                        className="px-3 py-2.5 whitespace-nowrap"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          {/* 보기 */}
                          <button
                            onClick={() => router.push(`/documents/${doc.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="상세 보기"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {/* 수정 */}
                          <button
                            onClick={() => router.push(`/documents/${doc.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="문서 수정"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* 다운로드 */}
                          <button
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="다운로드"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ⑥ 테이블 푸터 / 페이지네이션 */}
        {sorted.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            {/* 좌측: 표시 정보 */}
            <p className="text-[11px] text-gray-500">
              전체 <strong className="text-gray-700">{sorted.length}</strong>건 중{' '}
              <strong className="text-gray-700">
                {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, sorted.length)}
              </strong>번 표시
            </p>

            {/* 우측: 페이지 버튼 */}
            <div className="flex items-center gap-1">
              {/* 이전 */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹ 이전
              </button>

              {/* 번호 */}
              {pageNumbers.map((n, i) =>
                n === '...'
                  ? <span key={`dot-${i}`} className="px-1 text-gray-400 text-xs">…</span>
                  : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={[
                        'w-7 h-7 text-xs rounded-md border transition-colors font-medium',
                        currentPage === n
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50',
                      ].join(' ')}
                    >
                      {n}
                    </button>
                  )
              )}

              {/* 다음 */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                다음 ›
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
