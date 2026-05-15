import PageLayout from '@/components/layout/PageLayout';
import RevisionFormClient from '@/components/documents/RevisionFormClient';
import { DUMMY_DOCUMENTS } from '@/lib/documentsData';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === Number(id));
  return {
    title: doc ? `DMS - ${doc.name} 개정 등록` : 'DMS - 개정 등록',
  };
}

export default async function DocumentRevisionPage({ params }: Props) {
  const { id } = await params;
  const docId = Number(id);
  const doc = DUMMY_DOCUMENTS.find((d) => d.id === docId);

  return (
    <PageLayout
      title="개정 등록"
      breadcrumb={`DMS 홈 > 문서관리 > ${doc?.name ?? '문서'} > 개정 등록`}
    >
      <RevisionFormClient docId={docId} />
    </PageLayout>
  );
}
