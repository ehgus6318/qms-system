'use client';

import { useState, useRef } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface FileUploadZoneProps {
  label?: string;
  maxFiles?: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return { icon: 'PDF', bg: 'bg-red-100', text: 'text-red-600' };
  if (['doc', 'docx'].includes(ext)) return { icon: 'DOC', bg: 'bg-blue-100', text: 'text-blue-600' };
  if (['xls', 'xlsx'].includes(ext)) return { icon: 'XLS', bg: 'bg-green-100', text: 'text-green-600' };
  if (['ppt', 'pptx'].includes(ext)) return { icon: 'PPT', bg: 'bg-orange-100', text: 'text-orange-600' };
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return { icon: 'IMG', bg: 'bg-purple-100', text: 'text-purple-600' };
  return { icon: 'FILE', bg: 'bg-gray-100', text: 'text-gray-600' };
}

export default function FileUploadZone({ label = '첨부파일', maxFiles = 10 }: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: formatBytes(f.size),
      type: f.type,
    }));
    setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={[
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
          dragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.344 11.082" />
        </svg>
        <p className="text-sm text-gray-600 font-medium">파일을 이곳에 끌어다 놓거나 클릭하여 업로드</p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOC, XLS, PPT, 이미지 등 최대 {maxFiles}개</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {files.map((f) => {
            const { icon, bg, text } = getFileIcon(f.name);
            return (
              <li
                key={f.id}
                className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 group"
              >
                <span className={`w-9 h-9 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${bg} ${text}`}>
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{f.name}</p>
                  <p className="text-[11px] text-gray-400">{f.size}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
