import PageLayout from '@/components/layout/PageLayout';
import RevisionsListClient from '@/components/revisions/RevisionsListClient';

export const metadata = {
  title: 'DMS - 개정 이력',
  description: '전체 개정 이력 조회',
};

export default function RevisionsHistoryPage() {
  return (
    <PageLayout
      title="개정 이력"
      breadcrumb="DMS 홈 > 개정관리 > 개정 이력"
    >
      <RevisionsListClient initialStatus="이력" />
    </PageLayout>
  );
}
