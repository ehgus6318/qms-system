import PageLayout from '@/components/layout/PageLayout';
import DocumentDetailClient from '@/components/documents/DocumentDetailClient';
import { DUMMY_DOCUMENTS } from '@/lib/documentsData';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === Number(id));
  return {
    title: doc ? `QMS - ${doc.name}` : 'QMS - 문서 상세',
    description: doc?.description ?? '품질관리 문서 상세 조회',
  };
}

export default async function DocumentDetailPage({ params }: Props) {
  const { id } = await params;
  const docId = Number(id);
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === docId);

  const breadcrumb = doc
    ? `QMS 홈 > 문서관리 > 문서 목록 > ${doc.name}`
    : 'QMS 홈 > 문서관리 > 문서 상세';

  return (
    <PageLayout
      title={doc?.name ?? '문서 상세'}
      breadcrumb={breadcrumb}
    >
      <DocumentDetailClient docId={docId} />
    </PageLayout>
  );
}
