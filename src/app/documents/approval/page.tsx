import PageLayout from '@/components/layout/PageLayout';
import ApprovalInboxClient from '@/components/documents/ApprovalInboxClient';

export const metadata = {
  title: 'QMS - 결재문서함',
  description: '결재 대기, 요청, 완료 문서 관리',
};

export default function ApprovalPage() {
  return (
    <PageLayout
      title="결재문서함"
      breadcrumb="QMS 홈 > 문서관리 > 결재문서함"
    >
      <ApprovalInboxClient />
    </PageLayout>
  );
}
