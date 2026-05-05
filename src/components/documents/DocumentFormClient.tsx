'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadZone from '@/components/documents/FileUploadZone';
import { DOC_TYPES, type Document } from '@/lib/documentsData';

interface DocumentFormClientProps {
  mode: 'new' | 'edit';
  initialData?: Partial<Document>;
  docId?: number;
}

const APPROVER_OPTIONS = ['이팀장', '최감사', '박대표', '김영훈', '이부서'];

export default function DocumentFormClient({ mode, initialData, docId }: DocumentFormClientProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    no: initialData?.no ?? '',
    name: initialData?.name ?? '',
    type: initialData?.type ?? '절차서',
    ver: initialData?.ver ?? 'Rev.1',
    description: initialData?.description ?? '',
    dept: initialData?.dept ?? 'IT팀',
    relatedStandard: '',
    retentionPeriod: '5년',
    effectiveDate: '',
    approver1: '이팀장',
    approver2: '최감사',
    approver3: '박대표',
  });

  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    if (isEdit && docId) {
      router.push(`/documents/${docId}`);
    } else {
      router.push('/documents');
    }
  };

  const formTypes = DOC_TYPES.filter((t) => t !== '전체');

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
      {/* ─── 기본 정보 ─── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">기본 정보</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-5">
          {/* 문서번호 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              문서번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.no}
              onChange={(e) => update('no', e.target.value)}
              placeholder="예: QMS-S-005"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          {/* 문서유형 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              문서유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {formTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {/* 문서명 */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              문서명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="문서 제목을 입력하세요"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          {/* 버전 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">버전</label>
            <input
              type="text"
              value={form.ver}
              onChange={(e) => update('ver', e.target.value)}
              placeholder="예: Rev.1"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          {/* 작성 부서 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">작성 부서</label>
            <select
              value={form.dept}
              onChange={(e) => update('dept', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {['IT팀', '관리팀', '생산팀', '품질팀', '영업팀', '연구소'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {/* 관련 표준 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">관련 표준</label>
            <input
              type="text"
              value={form.relatedStandard}
              onChange={(e) => update('relatedStandard', e.target.value)}
              placeholder="예: ISO 9001:2015 7.5"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          {/* 보존 기간 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">보존 기간</label>
            <select
              value={form.retentionPeriod}
              onChange={(e) => update('retentionPeriod', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {['1년', '3년', '5년', '10년', '영구'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {/* 시행일자 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">시행 예정일</label>
            <input
              type="date"
              value={form.effectiveDate}
              onChange={(e) => update('effectiveDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          {/* 요약/설명 */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">문서 요약</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="문서의 목적 및 주요 내용을 간략히 기술하세요."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
            />
          </div>
        </div>
      </section>

      {/* ─── 첨부파일 ─── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">첨부파일</h2>
        </div>
        <div className="p-5">
          <FileUploadZone label="" maxFiles={10} />
        </div>
      </section>

      {/* ─── 결재선 ─── */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">결재선 설정</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            {/* 기안자 */}
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                <span className="text-blue-700 text-sm font-bold">김</span>
              </div>
              <p className="text-xs font-medium text-gray-800">김영훈</p>
              <p className="text-[10px] text-gray-400">기안자</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 mt-1">기안</span>
            </div>

            <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>

            {/* 검토자 1 */}
            <div className="flex-1 text-center">
              <select
                value={form.approver1}
                onChange={(e) => update('approver1', e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {APPROVER_OPTIONS.map((a) => <option key={a}>{a}</option>)}
              </select>
              <p className="text-[10px] text-gray-400">팀장 검토</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-700 mt-1">검토</span>
            </div>

            <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>

            {/* 검토자 2 */}
            <div className="flex-1 text-center">
              <select
                value={form.approver2}
                onChange={(e) => update('approver2', e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {APPROVER_OPTIONS.map((a) => <option key={a}>{a}</option>)}
              </select>
              <p className="text-[10px] text-gray-400">품질 검토</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-700 mt-1">검토</span>
            </div>

            <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>

            {/* 최종 승인자 */}
            <div className="flex-1 text-center">
              <select
                value={form.approver3}
                onChange={(e) => update('approver3', e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {APPROVER_OPTIONS.map((a) => <option key={a}>{a}</option>)}
              </select>
              <p className="text-[10px] text-gray-400">최종 승인</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 mt-1">승인</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 하단 버튼 ─── */}
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            미리보기
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 100 20v-4l-3 3 3 3v-2a10 10 0 01-8-10z" />
                </svg>
                저장 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isEdit ? '수정 저장' : '결재 요청'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
