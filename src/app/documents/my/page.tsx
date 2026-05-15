import PageLayout from '@/components/layout/PageLayout';
import MyDocumentsClient from '@/components/documents/MyDocumentsClient';

export const metadata = {
  title: 'DMS - 내 문서함',
  description: '내가 작성한 문서, 최근 조회, 즐겨찾기',
};

export default function MyDocumentsPage() {
  return (
    <PageLayout
      title="내 문서함"
      breadcrumb="DMS 홈 > 문서관리 > 내 문서함"
    >
      <MyDocumentsClient />
    </PageLayout>
  );
}
