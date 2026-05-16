import PageLayout from '@/components/layout/PageLayout';
import UserFormClient from '@/components/system/UserFormClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata() {
  return {
    title: 'DMS - 사용자 수정',
    description: '사용자 계정 정보 및 권한 수정',
  };
}

export default async function UserEditPage({ params }: Props) {
  const { id } = await params;

  return (
    <PageLayout
      title="사용자 수정"
      breadcrumb="DMS 홈 > 사용자관리 > 사용자 목록 > 수정"
    >
      <UserFormClient mode="edit" userId={id} />
    </PageLayout>
  );
}
