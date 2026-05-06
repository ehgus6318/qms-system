import PageLayout from '@/components/layout/PageLayout';
import ApprovalsListClient from '@/components/approvals/ApprovalsListClient';

export const metadata = {
  title: 'QMS - 승인관리',
  description: '결재 대기, 검토 중, 승인 완료, 반려 문서 관리',
};

export default function ApprovalsPage() {
  return (
    <PageLayout
      title="승인관리"
      breadcrumb="QMS 홈 > 승인관리"
    >
      <ApprovalsListClient />
    </PageLayout>
  );
}
