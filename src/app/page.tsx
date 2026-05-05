import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import KPICards from '@/components/dashboard/KPICards';
import DocumentTree from '@/components/dashboard/DocumentTree';
import RecentDocuments from '@/components/dashboard/RecentDocuments';
import QuickAccess from '@/components/dashboard/QuickAccess';
import MyApprovalList from '@/components/dashboard/MyApprovalList';
import StatusCharts from '@/components/dashboard/StatusCharts';
import ApprovalProgress from '@/components/dashboard/ApprovalProgress';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import TrainingSchedule from '@/components/dashboard/TrainingSchedule';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickSearch from '@/components/dashboard/QuickSearch';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">

          {/* ① KPI 카드 - 결재 대기 강조 */}
          <KPICards />

          {/* ② 문서 분류 | 최근 문서 목록 | 업무 바로가기 + 내 결재 대기 */}
          <div className="grid grid-cols-12 gap-3">
            {/* 문서 분류 트리 */}
            <div className="col-span-3">
              <DocumentTree />
            </div>

            {/* 최근 문서 목록 (정렬 가능 테이블) */}
            <div className="col-span-6">
              <RecentDocuments />
            </div>

            {/* 업무 바로가기 + 내 결재 대기 목록 */}
            <div className="col-span-3 flex flex-col gap-3">
              <QuickAccess />
              <MyApprovalList />
            </div>
          </div>

          {/* ③ 결재 현황(강조) | 개정 현황 | 문서 상태 현황 | 유형별 차트 */}
          <StatusCharts />

          {/* ④ 결재 진행(강조) | 공지사항 | 교육 일정 | 최근 활동 */}
          <div className="grid grid-cols-4 gap-3">
            <ApprovalProgress />
            <NoticeBoard />
            <TrainingSchedule />
            <RecentActivity />
          </div>

          {/* ⑤ 빠른 검색 + 즐겨찾기 */}
          <QuickSearch />

        </main>
      </div>
    </div>
  );
}
