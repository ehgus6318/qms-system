import PageLayout from '@/components/layout/PageLayout';
import ApprovalsListClient from '@/components/approvals/ApprovalsListClient';

export const metadata = {
  title: 'DMS - 결재관리',
  description: '결재 대기, 검토 중, 승인 완료, 반려 문서 관리',
};

export default function ApprovalsPage() {
  return (
    <PageLayout
      title="결재관리"
      breadcrumb="DMS 홈 > 결재관리 > 결재 대기"
    >
      <ApprovalsListClient />
    </PageLayout>
  );
}
