import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DocumentListClient from '@/components/documents/DocumentListClient';

export const metadata = {
  title: 'QMS - 문서 목록',
  description: '품질관리 문서 목록 및 검색',
};

export default function DocumentsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title="문서관리"
          breadcrumb="QMS 홈 > 문서관리 > 문서 목록"
        />
        <main className="flex-1 overflow-y-auto">
          <DocumentListClient />
        </main>
      </div>
    </div>
  );
}
