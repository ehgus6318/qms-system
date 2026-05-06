'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadZone from '@/components/documents/FileUploadZone';
import { DUMMY_DOCUMENTS, REVISION_HISTORIES } from '@/lib/documentsData';
import { getStatusStyle } from '@/lib/qmsColors';

interface RevisionFormClientProps {
  docId: number;
}

const REVISION_REASONS = ['정기 개정', '심사 지적사항 반영', '법규/표준 변경', '업무 프로세스 변경', '오류 수정', '고객 요구사항 반영', '기타'];

function nextRevision(current: string): string {
  const match = current.match(/Rev\.(\d+)/);
  if (match) return `Rev.${parseInt(match[1]) + 1}`;
  const numMatch = current.match(/^(\d+)$/);
  if (numMatch) return String(parseInt(numMatch[1]) + 1);
  return current + '.1';
}

export default function RevisionFormClient({ docId }: RevisionFormClientProps) {
  const router = useRouter();
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === docId);
  const history = REVISION_HISTORIES[docId] ?? [];

  const [form, setForm] = useState({
    newVer:     doc ? nextRevision(doc.ver) : '',
    reason:     '정기 개정',
    reasonEtc:  '',
    changes:    '',
    approver1:  '이팀장',
    approver2:  '최감사',
    approver3:  '박대표',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        문서를 찾을 수 없습니다.
      </div>
    );
  }

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const statusStyle = getStatusStyle(doc.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    router.push(`/documents/${docId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-w-3xl">

      {/* 현재 문서 정보 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-[10px] font-semibold text-blue-600 mb-1.5 uppercase tracking-wider">개정 대상 문서</p>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">{doc.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 font-mono">{doc.no}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">{doc.type}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-semibold text-gray-700">{doc.ver}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${statusStyle.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            {doc.status}
          </span>
        </div>
      </div>

      {/* 개정 정보 */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">개정 정보</h2>
        </div>
        <div className="p-5 space-y-4">

          {/* 버전 변경 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              개정 버전 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500">현재</span>
                <span className="text-sm font-bold text-gray-700">{doc.ver}</span>
              </div>
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <input
                type="text"
                required
                value={form.newVer}
                onChange={(e) => update('newVer', e.target.value)}
                className="w-32 px-3 py-2 text-sm font-bold text-purple-700 border-2 border-purple-300 bg-purple-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-xs text-gray-400">(자동 제안, 직접 수정 가능)</span>
            </div>
          </div>

          {/* 개정 사유 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              개정 사유 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {REVISION_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => update('reason', reason)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    form.reason === reason
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-purple-300 hover:text-purple-600',
                  ].join(' ')}
                >
                  {reason}
                </button>
              ))}
            </div>
            {form.reason === '기타' && (
              <input
                type="text"
                value={form.reasonEtc}
                onChange={(e) => update('reasonEtc', e.target.value)}
                placeholder="개정 사유를 직접 입력하세요"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* 주요 변경 사항 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              주요 변경 사항 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.changes}
              onChange={(e) => update('changes', e.target.value)}
              placeholder={`변경된 내용을 구체적으로 기술하세요.\n예)\n- 3.2항 측정 기준 수치 변경 (±0.5 → ±0.3)\n- 5.1항 담당자 역할 재정의\n- 부록 A 체크리스트 항목 추가`}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-xs leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* 개정 이력 미리보기 */}
      {history.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-800">기존 개정 이력</h2>
          </div>
          <div className="p-5">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {['버전', '개정일', '작성자', '개정 사유'].map((h) => (
                    <th key={h} className="text-left py-1.5 pr-4 font-medium text-gray-500 text-[11px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <tr key={r.ver} className="border-b border-gray-50">
                    <td className={`py-2 pr-4 font-medium ${i === 0 ? 'text-blue-700' : 'text-gray-700'}`}>{r.ver}</td>
                    <td className="py-2 pr-4 text-gray-500">{r.date}</td>
                    <td className="py-2 pr-4 text-gray-500">{r.author}</td>
                    <td className="py-2 text-gray-500">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 첨부파일 */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">개정 문서 첨부</h2>
        </div>
        <div className="p-5">
          <FileUploadZone label="" maxFiles={5} />
        </div>
      </section>

      {/* 결재선 */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">결재선</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            {[
              { key: 'approver1', role: '팀장 검토' },
              { key: 'approver2', role: '품질 검토' },
              { key: 'approver3', role: '최종 승인' },
            ].map((a, idx) => (
              <div key={a.key} className="flex items-center gap-3 flex-1">
                <div className="flex-1 text-center">
                  <select
                    value={form[a.key as keyof typeof form]}
                    onChange={(e) => update(a.key, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['이팀장', '최감사', '박대표', '김영훈', '이부서'].map((ap) => (
                      <option key={ap}>{ap}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">{a.role}</p>
                </div>
                {idx < 2 && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pb-2">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          취소
        </button>
        <div className="flex gap-2">
          <button type="button"
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            임시저장
          </button>
          <button type="submit" disabled={submitting}
            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-60 transition-colors flex items-center gap-1.5">
            {submitting ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>저장 중...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>개정 결재 요청</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
