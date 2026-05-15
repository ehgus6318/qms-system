import PageLayout from '@/components/layout/PageLayout';
import RevisionsListClient from '@/components/revisions/RevisionsListClient';

export const metadata = {
  title: 'DMS - 개정 완료',
  description: '개정이 완료된 문서 목록',
};

export default function RevisionsCompletedPage() {
  return (
    <PageLayout
      title="개정 완료"
      breadcrumb="DMS 홈 > 개정관리 > 개정 완료"
    >
      <RevisionsListClient initialStatus="완료" />
    </PageLayout>
  );
}
