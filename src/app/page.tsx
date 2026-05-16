import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import KPICards from '@/components/dashboard/KPICards';
import RecentDocuments from '@/components/dashboard/RecentDocuments';
import QuickAccess from '@/components/dashboard/QuickAccess';
import MyApprovalList from '@/components/dashboard/MyApprovalList';
import StatusCharts from '@/components/dashboard/StatusCharts';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import RecentActivity from '@/components/dashboard/RecentActivity';

// 미사용 (삭제 아님 — 재활성화 가능)
// import DocumentTree      from '@/components/dashboard/DocumentTree';
// import ApprovalProgress  from '@/components/dashboard/ApprovalProgress';
// import FavoriteDocuments from '@/components/dashboard/FavoriteDocuments';
// import QuickSearch       from '@/components/dashboard/QuickSearch';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="대시보드" breadcrumb="DMS 홈 > 대시보드" />

        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">

          {/* ① KPI 카드 */}
          <KPICards />

          {/* ② 최근 문서 목록(메인) + 빠른 작업 / 내 결재 대기
               grid stretch로 양 열 높이 자동 일치 */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-9">
              <RecentDocuments />
            </div>
            <div className="col-span-3 flex flex-col gap-3">
              <QuickAccess />
              <MyApprovalList />
            </div>
          </div>

          {/* ③ 결재 현황 | 개정 현황 | 문서 상태 현황 | 유형별 현황 */}
          <StatusCharts />

          {/* ④ 공지사항 | 최근 활동 — h-[350px] 고정으로 높이 균등 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-[350px]">
              <NoticeBoard />
            </div>
            <div className="h-[350px]">
              <RecentActivity />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
