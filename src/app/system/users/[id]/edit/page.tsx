import PageLayout from '@/components/layout/PageLayout';
import UserFormClient from '@/components/system/UserFormClient';
import { USERS } from '@/lib/usersData';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const user = USERS.find((u) => u.id === id);
  return {
    title: user ? `QMS - ${user.name} 사용자 수정` : 'QMS - 사용자 수정',
    description: user ? `${user.name}의 계정 정보 및 권한 수정` : '사용자 수정',
  };
}

export default async function UserEditPage({ params }: Props) {
  const { id } = await params;
  const user = USERS.find((u) => u.id === id);

  return (
    <PageLayout
      title={user ? `${user.name} 수정` : '사용자 수정'}
      breadcrumb={`QMS 홈 > 시스템관리 > 사용자 관리 > ${user?.name ?? id} 수정`}
    >
      <UserFormClient mode="edit" userId={id} />
    </PageLayout>
  );
}
