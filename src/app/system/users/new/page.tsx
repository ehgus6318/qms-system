import PageLayout from '@/components/layout/PageLayout';
import UserFormClient from '@/components/system/UserFormClient';

export const metadata = {
  title: 'QMS - 신규 사용자 등록',
  description: '새로운 시스템 사용자 계정 등록',
};

export default function UserNewPage() {
  return (
    <PageLayout
      title="신규 사용자 등록"
      breadcrumb="QMS 홈 > 시스템관리 > 사용자 관리 > 신규 등록"
    >
      <UserFormClient mode="new" />
    </PageLayout>
  );
}
