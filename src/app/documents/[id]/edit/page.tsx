import PageLayout from '@/components/layout/PageLayout';
import DocumentFormClient from '@/components/documents/DocumentFormClient';
import { DUMMY_DOCUMENTS } from '@/lib/documentsData';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === Number(id));
  return {
    title: doc ? `QMS - ${doc.name} 수정` : 'QMS - 문서 수정',
  };
}

export default async function DocumentEditPage({ params }: Props) {
  const { id } = await params;
  const docId = Number(id);
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === docId);

  return (
    <PageLayout
      title={doc ? `${doc.name} 수정` : '문서 수정'}
      breadcrumb={`QMS 홈 > 문서관리 > ${doc?.name ?? '문서'} > 수정`}
    >
      <DocumentFormClient
        mode="edit"
        docId={docId}
        initialData={doc}
      />
    </PageLayout>
  );
}
