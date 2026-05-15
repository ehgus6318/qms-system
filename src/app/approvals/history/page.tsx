import PageLayout from '@/components/layout/PageLayout';
import ApprovalsListClient from '@/components/approvals/ApprovalsListClient';

export const metadata = {
  title: 'DMS - 승인 이력',
  description: '내가 승인·반려 처리한 문서 이력',
};

export default function ApprovalsHistoryPage() {
  return (
    <PageLayout
      title="승인 이력"
      breadcrumb="DMS 홈 > 결재관리 > 승인 이력"
    >
      <ApprovalsListClient initialTab="history" />
    </PageLayout>
  );
}
