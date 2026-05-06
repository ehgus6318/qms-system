import PageLayout from '@/components/layout/PageLayout';
import DocumentFormClient from '@/components/documents/DocumentFormClient';

export const metadata = {
  title: 'QMS - 신규 문서 등록',
  description: '신규 품질관리 문서 등록',
};

export default function DocumentNewPage() {
  return (
    <PageLayout
      title="신규 문서 등록"
      breadcrumb="QMS 홈 > 문서관리 > 신규 문서 등록"
    >
      <DocumentFormClient mode="new" />
    </PageLayout>
  );
}
