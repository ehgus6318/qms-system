import PageLayout from '@/components/layout/PageLayout';
import UsersListClient from '@/components/system/UsersListClient';

export const metadata = {
  title: 'DMS - 사용자 관리',
  description: '시스템 사용자 계정 및 권한 관리',
};

export default function UsersPage() {
  return (
    <PageLayout
      title="사용자 관리"
      breadcrumb="DMS 홈 > 사용자관리 > 사용자 목록"
    >
      <UsersListClient />
    </PageLayout>
  );
}
