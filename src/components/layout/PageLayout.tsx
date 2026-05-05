import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

interface PageLayoutProps {
  title?: string;
  breadcrumb?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, breadcrumb, children }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
