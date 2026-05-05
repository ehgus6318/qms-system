'use client';

import { useState, useMemo } from 'react';
import { getStatusStyle } from '@/lib/qmsColors';

const DOC_TYPE_COLORS: Record<string, string> = {
  품질메뉴얼: 'text-blue-600 bg-blue-50',
  프로세스:   'text-green-600 bg-green-50',
  절차서:     'text-purple-600 bg-purple-50',
  지침서:     'text-amber-600 bg-amber-50',
  작업표준서: 'text-teal-600 bg-teal-50',
  검사기준서: 'text-red-600 bg-red-50',
  기록문서:   'text-indigo-600 bg-indigo-50',
};

type Row = {
  no: string; name: string; type: string;
  ver: string; status: string; date: string; author: string;
};
type ColKey = keyof Row;

const documents: Row[] = [
  { no: 'QMS-M-001',  name: '품질메뉴얼',                type: '품질메뉴얼', ver: 'Rev.3', status: '승인',   date: '2024-05-20', author: '김영훈' },
  { no: 'QMS-P-001',  name: '프로세스 관리 절차',         type: '프로세스',   ver: 'Rev.2', status: '승인',   date: '2024-05-15', author: '이부서 부장' },
  { no: 'QMS-S-001',  name: '문서 및 기록 관리 절차',     type: '절차서',     ver: 'Rev.4', status: '검토 중', date: '2024-05-18', author: '김영훈' },
  { no: 'QMS-I-001',  name: '내부심사지침서',             type: '지침서',     ver: 'Rev.1', status: '승인',   date: '2024-05-10', author: '이부서 부장' },
  { no: 'QMS-WI-001', name: '제품 감사 작업표준서',       type: '작업표준서', ver: 'Rev.2', status: '승인',   date: '2024-05-09', author: '박작업 반장' },
  { no: 'QMS-IN-001', name: '수입검사 기준서',            type: '검사기준서', ver: 'Rev.1', status: '반려',   date: '2024-05-08', author: '최감사 대리' },
  { no: 'QMS-F-001',  name: '내부심사 체크리스트',        type: '기록문서',   ver: 'Rev.0', status: '초안',   date: '2024-05-07', author: '홍길동' },
];

const COLUMNS: { key: ColKey; label: string; sortable: boolean; className?: string }[] = [
  { key: 'no',     label: '문서번호',   sortable: true,  className: 'whitespace-nowrap' },
  { key: 'name',   label: '문서명',     sortable: true  },
  { key: 'type',   label: '문서구분',   sortable: true,  className: 'whitespace-nowrap' },
  { key: 'ver',    label: '버전',       sortable: true,  className: 'whitespace-nowrap' },
  { key: 'status', label: '상태',       sortable: true,  className: 'whitespace-nowrap' },
  { key: 'date',   label: '최종수정일', sortable: true,  className: 'whitespace-nowrap' },
  { key: 'author', label: '최종수정자', sortable: true,  className: 'whitespace-nowrap' },
];

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) {
    return (
      <span className="ml-1 opacity-30 text-gray-400">
        <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </span>
    );
  }
  return dir === 'asc' ? (
    <svg className="w-3 h-3 inline ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3 h-3 inline ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function RecentDocuments() {
  const [sortCol, setSortCol] = useState<ColKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSort = (col: ColKey) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    return [...documents].sort((a, b) => {
      const av = a[sortCol] ?? '';
      const bv = b[sortCol] ?? '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortCol, sortDir]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">최근 문서 목록</h3>
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
            {documents.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">
            정렬: <span className="font-medium text-gray-600">{COLUMNS.find(c => c.key === sortCol)?.label}</span>
          </span>
          <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            전체보기 →
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-3 py-2.5 text-left font-semibold text-gray-500 select-none',
                    col.className ?? '',
                    col.sortable ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors group' : '',
                  ].join(' ')}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && (
                    <SortIcon active={sortCol === col.key} dir={sortDir} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((doc) => {
              const st = getStatusStyle(doc.status);
              const typeStyle = DOC_TYPE_COLORS[doc.type] ?? 'text-gray-600';
              const isHovered = hoveredRow === doc.no;

              return (
                <tr
                  key={doc.no}
                  className="border-b border-gray-50 cursor-pointer transition-all duration-100 table-row-hover"
                  onMouseEnter={() => setHoveredRow(doc.no)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => {/* 상세 페이지 이동 */}}
                  style={isHovered ? { backgroundColor: '#eff6ff' } : undefined}
                >
                  {/* 문서번호 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-mono text-blue-600 font-semibold hover:underline">
                      {doc.no}
                    </span>
                  </td>

                  {/* 문서명 */}
                  <td className="px-3 py-2 max-w-[170px]">
                    <span
                      className="text-gray-800 font-medium truncate block hover:text-blue-700 transition-colors"
                      title={doc.name}
                    >
                      {doc.name}
                    </span>
                  </td>

                  {/* 문서구분 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeStyle}`}>
                      {doc.type}
                    </span>
                  </td>

                  {/* 버전 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-gray-500 font-mono text-[11px]">{doc.ver}</span>
                  </td>

                  {/* 상태 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} flex-shrink-0`} />
                      {doc.status}
                    </span>
                  </td>

                  {/* 최종수정일 */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500 tabular-nums">
                    {doc.date}
                  </td>

                  {/* 최종수정자 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold text-slate-600">{doc.author[0]}</span>
                      </div>
                      <span className="text-gray-600">{doc.author}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 푸터 */}
      <div className="px-4 py-2 border-t border-gray-50 flex-shrink-0 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          최근 {documents.length}개 표시 중 · 전체 <strong className="text-gray-600">1,248</strong>건
        </span>
        <button className="text-[10px] text-blue-500 hover:text-blue-700 font-medium transition-colors">
          더 보기 +
        </button>
      </div>
    </div>
  );
}
