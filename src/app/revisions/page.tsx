import PageLayout from '@/components/layout/PageLayout';
import RevisionsListClient from '@/components/revisions/RevisionsListClient';

export const metadata = {
  title: 'DMS - 개정관리',
  description: '개정 대기, 진행 중, 완료, 반려 문서 관리',
};

export default function RevisionsPage() {
  return (
    <PageLayout
      title="개정관리"
      breadcrumb="DMS 홈 > 개정관리 > 개정 대기"
    >
      <RevisionsListClient />
    </PageLayout>
  );
}
