import PageLayout from '@/components/layout/PageLayout';
import RevisionDetailClient from '@/components/revisions/RevisionDetailClient';
import { REVISION_ITEMS } from '@/lib/revisionsData';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = REVISION_ITEMS.find((r) => r.id === Number(id));
  return {
    title: item ? `DMS - ${item.docName} 개정 상세` : 'DMS - 개정 상세',
    description: item?.changeSummary ?? '개정 상세 조회',
  };
}

export default async function RevisionDetailPage({ params }: Props) {
  const { id } = await params;
  const revisionId = Number(id);
  const item = REVISION_ITEMS.find((r) => r.id === revisionId);

  return (
    <PageLayout
      title={item ? `${item.docName} 개정 상세` : '개정 상세'}
      breadcrumb={`DMS 홈 > 개정관리 > ${item?.docName ?? '상세'} (${item?.currentVer} → ${item?.newVer})`}
    >
      <RevisionDetailClient revisionId={revisionId} />
    </PageLayout>
  );
}
