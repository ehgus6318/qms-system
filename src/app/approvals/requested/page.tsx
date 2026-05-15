import PageLayout from '@/components/layout/PageLayout';
import ApprovalsListClient from '@/components/approvals/ApprovalsListClient';

export const metadata = {
  title: 'DMS - 요청 문서',
  description: '내가 결재 요청한 문서 목록',
};

export default function ApprovalsRequestedPage() {
  return (
    <PageLayout
      title="요청 문서"
      breadcrumb="DMS 홈 > 결재관리 > 요청 문서"
    >
      <ApprovalsListClient initialTab="requested" />
    </PageLayout>
  );
}
