import PageLayout from '@/components/layout/PageLayout';
import RevisionsListClient from '@/components/revisions/RevisionsListClient';

export const metadata = {
  title: 'DMS - 개정 진행중',
  description: '현재 개정이 진행 중인 문서 목록',
};

export default function RevisionsInProgressPage() {
  return (
    <PageLayout
      title="개정 진행중"
      breadcrumb="DMS 홈 > 개정관리 > 개정 진행중"
    >
      <RevisionsListClient initialStatus="진행중" />
    </PageLayout>
  );
}
