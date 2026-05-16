'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/RecentDocuments.tsx
// 최근 문서 목록 — 대시보드 메인 영역 (7행 compact, 우측 열과 높이 일치)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { getStatusStyle } from '@/lib/qmsColors';

const DOC_TYPE_COLORS: Record<string, string> = {
  매뉴얼:   'text-blue-700 bg-blue-50 border border-blue-100',
  프로세스: 'text-green-700 bg-green-50 border border-green-100',
  절차서:   'text-purple-700 bg-purple-50 border border-purple-100',
  지침서:   'text-amber-700 bg-amber-50 border border-amber-100',
  운영문서: 'text-teal-700 bg-teal-50 border border-teal-100',
  서식:     'text-red-700 bg-red-50 border border-red-100',
  기록문서: 'text-indigo-700 bg-indigo-50 border border-indigo-100',
};

type Row = {
  no: string; name: string; type: string;
  ver: string; status: string; date: string; author: string; dept: string;
};
type ColKey = keyof Row;

const ALL_DOCUMENTS: Row[] = [
  { no: 'DOC-M-001',  name: '경영 매뉴얼',             type: '매뉴얼',   ver: 'Rev.3', status: '승인',    date: '2024-05-20', author: '김영훈', dept: '품질관리팀' },
  { no: 'DOC-P-001',  name: '프로세스 관리 절차',       type: '프로세스', ver: 'Rev.2', status: '승인',    date: '2024-05-15', author: '이수진', dept: '기획팀' },
  { no: 'DOC-S-001',  name: '문서 및 기록 관리 절차',   type: '절차서',   ver: 'Rev.4', status: '검토 중', date: '2024-05-18', author: '김영훈', dept: '품질관리팀' },
  { no: 'DOC-I-001',  name: '내부심사지침서',           type: '지침서',   ver: 'Rev.1', status: '승인',    date: '2024-05-10', author: '박준혁', dept: '심사팀' },
  { no: 'DOC-WI-001', name: '제품 운영 작업표준서',     type: '운영문서', ver: 'Rev.2', status: '승인',    date: '2024-05-09', author: '한상우', dept: '생산팀' },
  { no: 'DOC-IN-001', name: '수입검사 지침서',          type: '지침서',   ver: 'Rev.1', status: '반려',    date: '2024-05-08', author: '최민지', dept: '품질관리팀' },
  { no: 'DOC-F-001',  name: '심사 체크리스트',          type: '서식',     ver: 'Rev.0', status: '초안',    date: '2024-05-07', author: '정다영', dept: '심사팀' },
  { no: 'DOC-R-001',  name: '품질 기록 관리대장',       type: '기록문서', ver: 'Rev.2', status: '승인',    date: '2024-05-06', author: '이수진', dept: '기획팀' },
  { no: 'DOC-P-002',  name: '구매 관리 절차서',         type: '프로세스', ver: 'Rev.1', status: '검토 중', date: '2024-05-05', author: '박준혁', dept: '구매팀' },
  { no: 'DOC-I-002',  name: '시정조치 관리 지침서',     type: '지침서',   ver: 'Rev.3', status: '승인',    date: '2024-05-04', author: '한상우', dept: '품질관리팀' },
];

// ★ 표시 행 수: 7개
const VISIBLE_ROWS = 7;

const COLUMNS: { key: ColKey; label: string; sortable: boolean; className?: string }[] = [
  { key: 'no',     label: '문서번호',   sortable: true, className: 'whitespace-nowrap' },
  { key: 'name',   label: '문서명',     sortable: true },
  { key: 'type',   label: '구분',       sortable: true, className: 'whitespace-nowrap' },
  { key: 'dept',   label: '부서',       sortable: true, className: 'whitespace-nowrap' },
  { key: 'ver',    label: '버전',       sortable: true, className: 'whitespace-nowrap' },
  { key: 'status', label: '상태',       sortable: true, className: 'whitespace-nowrap' },
  { key: 'date',   label: '수정일',     sortable: true, className: 'whitespace-nowrap' },
  { key: 'author', label: '수정자',     sortable: true, className: 'whitespace-nowrap' },
];

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) {
    return (
      <svg className="w-2.5 h-2.5 inline ml-0.5 opacity-25 text-gray-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return dir === 'asc' ? (
    <svg className="w-2.5 h-2.5 inline ml-0.5 text-blue-500"
      fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-2.5 h-2.5 inline ml-0.5 text-blue-500"
      fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const ALL_TYPES = ['전체', ...Array.from(new Set(ALL_DOCUMENTS.map((d) => d.type)))];

export default function RecentDocuments() {
  const [sortCol, setSortCol]    = useState<ColKey>('date');
  const [sortDir, setSortDir]    = useState<'asc' | 'desc'>('desc');
  const [hoveredRow, setHovered] = useState<string | null>(null);
  const [typeFilter, setType]    = useState('전체');
  const [search, setSearch]      = useState('');

  const handleSort = (col: ColKey) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const rows = useMemo(() => {
    return ALL_DOCUMENTS
      .filter((d) => {
        if (typeFilter !== '전체' && d.type !== typeFilter) return false;
        if (search && !d.name.includes(search) && !d.no.includes(search) && !d.author.includes(search)) return false;
        return true;
      })
      .sort((a, b) => {
        const av = a[sortCol] ?? '';
        const bv = b[sortCol] ?? '';
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      })
      .slice(0, VISIBLE_ROWS);       // ★ 7행만 표시
  }, [sortCol, sortDir, typeFilter, search]);

  return (
    /* h-full + flex flex-col → 그리드 stretch로 우측 열과 높이 일치 */
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 leading-tight">최근 문서 목록</h3>
            <p className="text-[10px] text-gray-400 leading-tight">
              {VISIBLE_ROWS}건 표시 · 전체 <strong className="text-gray-600">1,248</strong>건
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 인라인 검색 */}
          <div className="relative">
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="문서명 · 번호 · 수정자"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-6 pr-2.5 py-1 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-40 bg-gray-50 placeholder-gray-400 transition-shadow"
            />
          </div>
          <a href="/documents"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 transition-colors whitespace-nowrap">
            전체보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── 유형 필터 탭 ── */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={[
              'flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors',
              typeFilter === t
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── 테이블 (flex-1로 남은 높이 채움) ── */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-3 py-2 text-left text-[10px] font-semibold text-gray-500 select-none',
                    col.className ?? '',
                    col.sortable
                      ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors'
                      : '',
                  ].join(' ')}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon active={sortCol === col.key} dir={sortDir} />}
                </th>
              ))}
              <th className="px-3 py-2 text-[10px] font-semibold text-gray-400 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-xs text-gray-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
            {rows.map((doc) => {
              const st        = getStatusStyle(doc.status);
              const typeStyle = DOC_TYPE_COLORS[doc.type] ?? 'text-gray-600 bg-gray-50';
              const isHovered = hoveredRow === doc.no;

              return (
                <tr
                  key={doc.no}
                  className="border-b border-gray-50 cursor-pointer transition-colors duration-100"
                  onMouseEnter={() => setHovered(doc.no)}
                  onMouseLeave={() => setHovered(null)}
                  style={isHovered ? { backgroundColor: '#eff6ff' } : undefined}
                >
                  {/* 문서번호 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-mono text-blue-600 font-semibold text-[10px]">{doc.no}</span>
                  </td>
                  {/* 문서명 */}
                  <td className="px-3 py-2">
                    <span className="text-[11px] text-gray-800 font-medium truncate block max-w-[180px]"
                      title={doc.name}>{doc.name}</span>
                  </td>
                  {/* 구분 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${typeStyle}`}>{doc.type}</span>
                  </td>
                  {/* 부서 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-[10px] text-gray-500">{doc.dept}</span>
                  </td>
                  {/* 버전 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-[10px] text-gray-400 font-mono">{doc.ver}</span>
                  </td>
                  {/* 상태 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${st.badge}`}>
                      <span className={`w-1 h-1 rounded-full ${st.dot} flex-shrink-0`} />
                      {doc.status}
                    </span>
                  </td>
                  {/* 수정일 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-[10px] text-gray-400 tabular-nums">{doc.date}</span>
                  </td>
                  {/* 수정자 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-[7px] font-bold text-slate-600">{doc.author[0]}</span>
                      </div>
                      <span className="text-[10px] text-gray-600">{doc.author}</span>
                    </div>
                  </td>
                  {/* 액션 */}
                  <td className="px-2 py-2 whitespace-nowrap">
                    <a href={`/documents/${doc.no}`}
                      className="text-[9px] text-gray-400 hover:text-blue-600 font-medium transition-colors px-1.5 py-0.5 rounded hover:bg-blue-50"
                      onClick={(e) => e.stopPropagation()}>
                      상세
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 푸터 ── */}
      <div className="px-4 py-2 border-t border-gray-100 flex-shrink-0 flex items-center justify-between bg-gray-50/50 rounded-b-xl">
        <span className="text-[10px] text-gray-400">최근 수정일 기준 · 상위 {VISIBLE_ROWS}건</span>
        <a href="/documents/new"
          className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-semibold transition-colors">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          신규 등록
        </a>
      </div>
    </div>
  );
}
