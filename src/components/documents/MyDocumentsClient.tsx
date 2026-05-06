'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DUMMY_DOCUMENTS,
  RECENT_VIEW_IDS,
  FAVORITE_DOC_IDS,
  MY_AUTHORED_IDS,
  ACCESS_LEVEL_META,
  type Document,
} from '@/lib/documentsData';
import { getStatusStyle } from '@/lib/qmsColors';

type TabId = 'authored' | 'recent' | 'favorites';

/* ── 상태 배지 ── */
function StatusBadge({ status }: { status: string }) {
  const s = getStatusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

/* ── 문서 카드 ── */
function DocCard({ doc, index, showRemoveBtn, onRemove }: {
  doc: Document;
  index?: number;
  showRemoveBtn?: boolean;
  onRemove?: () => void;
}) {
  const router = useRouter();
  const accessMeta = ACCESS_LEVEL_META[doc.accessLevel ?? 'internal'];

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer overflow-hidden"
      onClick={() => router.push(`/documents/${doc.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {index !== undefined && (
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
              )}
              <span className="text-[10px] font-mono text-gray-400">{doc.no}</span>
              <span className="text-gray-200">·</span>
              <span className="text-[10px] text-gray-400">{doc.type}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
              {doc.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StatusBadge status={doc.status} />
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${accessMeta.color}`}>{accessMeta.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {doc.author}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {doc.date}
            </span>
            <span>{doc.ver}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {showRemoveBtn && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="목록에서 제거"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/documents/${doc.id}/edit`); }}
              className="p-1 rounded text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              title="문서 수정"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function MyDocumentsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('authored');

  /* 즐겨찾기 제거 가능하도록 상태로 관리 */
  const [favIds, setFavIds] = useState<number[]>(FAVORITE_DOC_IDS);
  const [recentIds, setRecentIds] = useState<number[]>(RECENT_VIEW_IDS);

  const authoredDocs = DUMMY_DOCUMENTS.filter((d) => MY_AUTHORED_IDS.includes(d.id));
  const recentDocs   = recentIds.map((id) => DUMMY_DOCUMENTS.find((d) => d.id === id)).filter(Boolean) as Document[];
  const favDocs      = favIds.map((id) => DUMMY_DOCUMENTS.find((d) => d.id === id)).filter(Boolean) as Document[];

  const TABS = [
    { id: 'authored'  as TabId, label: '내가 작성한', count: authoredDocs.length,
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
    { id: 'recent'    as TabId, label: '최근 조회',   count: recentDocs.length,
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'favorites' as TabId, label: '즐겨찾기',    count: favDocs.length,
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  ];

  /* 내 작성 문서 통계 */
  const approvedCount  = authoredDocs.filter((d) => d.status === '승인').length;
  const reviewingCount = authoredDocs.filter((d) => d.status === '검토 중').length;
  const draftCount     = authoredDocs.filter((d) => d.status === '초안').length;

  return (
    <div className="px-6 py-5">
      {/* 요약 통계 */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: '총 작성 문서', value: authoredDocs.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { label: '승인 완료',    value: approvedCount,       color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: '검토 중',      value: reviewingCount,      color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
          { label: '즐겨찾기',     value: favDocs.length,       color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-4 ${s.bg}`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* 헤더 + 신규 등록 버튼 */}
      <div className="flex items-center justify-between mb-4">
        {/* 탭 */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push('/documents/new')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          신규 문서 등록
        </button>
      </div>

      {/* 탭: 내가 작성한 */}
      {activeTab === 'authored' && (
        authoredDocs.length === 0 ? (
          <EmptyState message="작성한 문서가 없습니다." onNew={() => router.push('/documents/new')} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {authoredDocs.map((doc) => <DocCard key={doc.id} doc={doc} />)}
          </div>
        )
      )}

      {/* 탭: 최근 조회 */}
      {activeTab === 'recent' && (
        recentDocs.length === 0 ? (
          <EmptyState message="최근 조회한 문서가 없습니다." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recentDocs.map((doc, i) => (
              <DocCard
                key={doc.id}
                doc={doc}
                index={i}
                showRemoveBtn
                onRemove={() => setRecentIds((prev) => prev.filter((id) => id !== doc.id))}
              />
            ))}
          </div>
        )
      )}

      {/* 탭: 즐겨찾기 */}
      {activeTab === 'favorites' && (
        favDocs.length === 0 ? (
          <EmptyState message="즐겨찾기한 문서가 없습니다." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favDocs.map((doc) => (
              <DocCard
                key={doc.id}
                doc={doc}
                showRemoveBtn
                onRemove={() => setFavIds((prev) => prev.filter((id) => id !== doc.id))}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function EmptyState({ message, onNew }: { message: string; onNew?: () => void }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-sm font-medium">{message}</p>
      {onNew && (
        <button onClick={onNew} className="mt-3 text-xs text-blue-600 hover:underline">
          + 신규 문서 등록하기
        </button>
      )}
    </div>
  );
}
