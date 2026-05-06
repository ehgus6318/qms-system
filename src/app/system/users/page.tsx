import PageLayout from '@/components/layout/PageLayout';
import UsersListClient from '@/components/system/UsersListClient';

export const metadata = {
  title: 'QMS - 사용자 관리',
  description: '시스템 사용자 계정 및 권한 관리',
};

export default function UsersPage() {
  return (
    <PageLayout
      title="사용자 관리"
      breadcrumb="QMS 홈 > 시스템관리 > 사용자 관리"
    >
      <UsersListClient />
    </PageLayout>
  );
}
