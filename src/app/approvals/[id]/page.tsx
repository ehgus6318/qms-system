import PageLayout from '@/components/layout/PageLayout';
import ApprovalDetailClient from '@/components/approvals/ApprovalDetailClient';
import { APPROVAL_ITEMS } from '@/lib/approvalsData';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = APPROVAL_ITEMS.find((a) => a.id === Number(id));
  return {
    title: item ? `QMS - ${item.docName} 결재` : 'QMS - 결재 상세',
    description: item?.requestComment ?? '결재 상세 처리',
  };
}

export default async function ApprovalDetailPage({ params }: Props) {
  const { id } = await params;
  const approvalId = Number(id);
  const item = APPROVAL_ITEMS.find((a) => a.id === approvalId);

  return (
    <PageLayout
      title={item ? `결재 처리: ${item.docName}` : '결재 상세'}
      breadcrumb={`QMS 홈 > 승인관리 > ${item?.docName ?? '상세'}`}
    >
      <ApprovalDetailClient approvalId={approvalId} />
    </PageLayout>
  );
}
