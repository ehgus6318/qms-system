'use client';

import { useState } from 'react';
import type { ChangeItem } from '@/lib/revisionsData';

interface RevisionComparePanelProps {
  currentVer: string;
  newVer: string;
  beforeContent?: string;
  afterContent?: string;
  changeItems: ChangeItem[];
}

type ViewMode = 'diff' | 'side' | 'list';

const CHANGE_TYPE_CONFIG = {
  added:    { label: '추가',    bg: 'bg-green-50',  border: 'border-l-4 border-green-400', text: 'text-green-700',  badge: 'bg-green-100 text-green-700' },
  modified: { label: '변경',    bg: 'bg-yellow-50', border: 'border-l-4 border-yellow-400', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  removed:  { label: '삭제',    bg: 'bg-red-50',    border: 'border-l-4 border-red-400',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700' },
};

export default function RevisionComparePanel({
  currentVer, newVer, beforeContent, afterContent, changeItems,
}: RevisionComparePanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="space-y-3">
      {/* 뷰 모드 전환 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{currentVer}</span>
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{newVer}</span>
          <span className="ml-2 text-xs text-gray-500">{changeItems.length}개 변경사항</span>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {([
            { id: 'list', label: '변경 목록' },
            { id: 'side', label: '좌우 비교' },
            { id: 'diff', label: '통합 보기' },
          ] as { id: ViewMode; label: string }[]).map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                viewMode === m.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─ 변경 목록 뷰 ─ */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {changeItems.map((item, i) => {
            const cfg = CHANGE_TYPE_CONFIG[item.type];
            return (
              <div key={i} className={`rounded-lg p-3.5 ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                    {item.section}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-gray-600">{item.description}</span>
                </div>

                {item.type === 'modified' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-red-500 mb-1">변경 전</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{item.before}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-green-600 mb-1">변경 후</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{item.after}</p>
                    </div>
                  </div>
                )}
                {item.type === 'added' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mt-2">
                    <p className="text-[10px] font-semibold text-green-600 mb-1">추가 내용</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{item.after}</p>
                  </div>
                )}
                {item.type === 'removed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mt-2">
                    <p className="text-[10px] font-semibold text-red-500 mb-1">삭제된 내용</p>
                    <p className="text-xs text-gray-700 leading-relaxed line-through opacity-60">{item.before}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─ 좌우 비교 뷰 ─ */}
      {viewMode === 'side' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-red-100 border-b border-red-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs font-semibold text-red-700">{currentVer} (현재)</span>
            </div>
            <div className="p-4">
              {beforeContent ? (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {beforeContent}
                </pre>
              ) : (
                <p className="text-xs text-gray-400 text-center py-8">미리보기 내용 없음</p>
              )}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-green-100 border-b border-green-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-700">{newVer} (개정)</span>
            </div>
            <div className="p-4">
              {afterContent ? (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {afterContent}
                </pre>
              ) : (
                <p className="text-xs text-gray-400 text-center py-8">미리보기 내용 없음</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─ 통합 보기 (unified diff 스타일) ─ */}
      {viewMode === 'diff' && (
        <div className="bg-gray-900 rounded-xl overflow-hidden font-mono text-xs">
          <div className="px-4 py-2.5 bg-gray-800 text-gray-400 text-[11px] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2">변경 사항 diff</span>
          </div>
          <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
            {changeItems.map((item, i) => (
              <div key={i} className="space-y-0.5">
                <div className="text-purple-400 text-[10px] mt-2">@@ {item.section} — {item.description} @@</div>
                {item.before && (
                  <div className="text-red-400 bg-red-900/20 px-2 py-0.5 rounded">
                    <span className="mr-2 select-none">-</span>{item.before}
                  </div>
                )}
                {item.after && (
                  <div className="text-green-400 bg-green-900/20 px-2 py-0.5 rounded">
                    <span className="mr-2 select-none">+</span>{item.after}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
