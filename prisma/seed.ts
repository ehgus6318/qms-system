// ─────────────────────────────────────────────────────────────────────────────
// prisma/seed.ts
// QMS/DCC 초기 시드 데이터
//
// 실행 방법:
//   npm run db:seed
//   (또는) npx prisma db seed
//
// 사전 조건:
//   1. PostgreSQL 실행 중
//   2. .env 파일에 DATABASE_URL 설정
//   3. npm run db:migrate 실행 완료
// ─────────────────────────────────────────────────────────────────────────────

// ── .env 로드 (tsx로 직접 실행 시 Prisma CLI가 없으므로 명시적 로드) ──────────
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(process.cwd(), '.env') });

import { PrismaClient, UserRole, UserStatus, PermissionCode } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// ── Prisma Client 초기화 ──────────────────────────────────────────────────────
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  console.error('❌ DATABASE_URL 환경변수가 설정되지 않았습니다.');
  console.error('   프로젝트 루트에 .env 파일을 생성하고 DATABASE_URL을 설정하세요.');
  console.error('   예시: DATABASE_URL="postgresql://user:pass@localhost:5432/qms_db"');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as never);

// ── 권한 프리셋 ───────────────────────────────────────────────────────────────
const ALL_PERMISSIONS: PermissionCode[] = [
  'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'DOCUMENT_DELETE', 'DOCUMENT_APPROVE',
  'REVISION_VIEW', 'REVISION_CREATE', 'REVISION_APPROVE',
  'APPROVAL_VIEW', 'APPROVAL_PROCESS',
  'TRAINING_VIEW', 'TRAINING_MANAGE',
  'RECORDS_VIEW', 'RECORDS_MANAGE', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
  'SYSTEM_MANAGE', 'USER_MANAGE',
];

const APPROVER_PERMISSIONS: PermissionCode[] = [
  'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'DOCUMENT_APPROVE',
  'REVISION_VIEW', 'REVISION_CREATE', 'REVISION_APPROVE',
  'APPROVAL_VIEW', 'APPROVAL_PROCESS',
  'TRAINING_VIEW',
  'RECORDS_VIEW', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
];

const USER_PERMISSIONS: PermissionCode[] = [
  'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT',
  'REVISION_VIEW', 'REVISION_CREATE',
  'APPROVAL_VIEW',
  'TRAINING_VIEW',
  'RECORDS_VIEW', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
];

const VIEWER_PERMISSIONS: PermissionCode[] = [
  'DOCUMENT_VIEW',
  'REVISION_VIEW',
  'APPROVAL_VIEW',
  'TRAINING_VIEW',
  'RECORDS_VIEW', 'INSPECTION_VIEW',
  'REPORTS_VIEW',
];

// ── 메인 시드 함수 ────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 QMS 시드 데이터 초기화 시작...\n');

  // ── 1. 부서 생성 ─────────────────────────────────────────────────────────
  console.log('📂 부서 생성 중...');
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: 'D01' },
      update: {},
      create: { name: '품질관리팀', code: 'D01', order: 1 },
    }),
    prisma.department.upsert({
      where: { code: 'D02' },
      update: {},
      create: { name: '생산관리팀', code: 'D02', order: 2 },
    }),
    prisma.department.upsert({
      where: { code: 'D03' },
      update: {},
      create: { name: '연구개발팀', code: 'D03', order: 3 },
    }),
    prisma.department.upsert({
      where: { code: 'D04' },
      update: {},
      create: { name: '영업팀', code: 'D04', order: 4 },
    }),
    prisma.department.upsert({
      where: { code: 'D05' },
      update: {},
      create: { name: '구매자재팀', code: 'D05', order: 5 },
    }),
    prisma.department.upsert({
      where: { code: 'D06' },
      update: {},
      create: { name: '인사총무팀', code: 'D06', order: 6 },
    }),
    prisma.department.upsert({
      where: { code: 'D07' },
      update: {},
      create: { name: '경영기획팀', code: 'D07', order: 7 },
    }),
    prisma.department.upsert({
      where: { code: 'D08' },
      update: {},
      create: { name: '외부/협력사', code: 'D08', order: 8 },
    }),
  ]);
  const [deptQuality, deptProduction, deptRnD, deptSales, deptPurchase, deptHR, deptPlanning] = departments;
  console.log(`   ✓ ${departments.length}개 부서 생성 완료`);

  // ── 2. 사용자 생성 ──────────────────────────────────────────────────────
  console.log('👤 사용자 생성 중...');

  // 실제 운영 시 bcrypt로 해시 처리:
  // const hash = await bcrypt.hash('password123', 12);
  const MOCK_HASH = '$2b$12$MOCK_HASH_REPLACE_WITH_BCRYPT_IN_PRODUCTION';

  const userKim = await prisma.user.upsert({
    where: { email: 'yhkim@dh2.co.kr' },
    update: {},
    create: {
      name: '김영훈',
      email: 'yhkim@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptQuality.id,
      position: '팀장',
      jobTitle: 'QMS 시스템 관리자',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      avatarInitials: '김',
      avatarColor: 'bg-blue-600',
      phone: '010-1234-5678',
      joinedAt: new Date('2019-03-01'),
    },
  });

  const userLee = await prisma.user.upsert({
    where: { email: 'sjlee@dh2.co.kr' },
    update: {},
    create: {
      name: '이수진',
      email: 'sjlee@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptQuality.id,
      position: '과장',
      jobTitle: '품질관리 담당',
      role: UserRole.APPROVER,
      status: UserStatus.ACTIVE,
      avatarInitials: '이',
      avatarColor: 'bg-emerald-600',
      phone: '010-2345-6789',
      joinedAt: new Date('2020-05-15'),
    },
  });

  const userPark = await prisma.user.upsert({
    where: { email: 'jhpark@dh2.co.kr' },
    update: {},
    create: {
      name: '박준혁',
      email: 'jhpark@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptProduction.id,
      position: '팀장',
      jobTitle: '생산 관리자',
      role: UserRole.APPROVER,
      status: UserStatus.ACTIVE,
      avatarInitials: '박',
      avatarColor: 'bg-violet-600',
      phone: '010-3456-7890',
      joinedAt: new Date('2018-11-01'),
    },
  });

  const userChoi = await prisma.user.upsert({
    where: { email: 'mjchoi@dh2.co.kr' },
    update: {},
    create: {
      name: '최민지',
      email: 'mjchoi@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptRnD.id,
      position: '사원',
      jobTitle: '연구개발 담당',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      avatarInitials: '최',
      avatarColor: 'bg-orange-500',
      phone: '010-4567-8901',
      joinedAt: new Date('2022-08-01'),
    },
  });

  const userJeong = await prisma.user.upsert({
    where: { email: 'dyjeong@dh2.co.kr' },
    update: {},
    create: {
      name: '정다영',
      email: 'dyjeong@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptSales.id,
      position: '대리',
      jobTitle: '영업 담당',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      avatarInitials: '정',
      avatarColor: 'bg-pink-600',
      phone: '010-5678-9012',
      joinedAt: new Date('2021-04-01'),
    },
  });

  const userHan = await prisma.user.upsert({
    where: { email: 'swhan@dh2.co.kr' },
    update: {},
    create: {
      name: '한상우',
      email: 'swhan@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptPurchase.id,
      position: '부장',
      jobTitle: '구매 총괄',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      avatarInitials: '한',
      avatarColor: 'bg-teal-600',
      phone: '010-6789-0123',
      joinedAt: new Date('2016-02-01'),
    },
  });

  const userOh = await prisma.user.upsert({
    where: { email: 'jhoh@dh2.co.kr' },
    update: {},
    create: {
      name: '오지현',
      email: 'jhoh@dh2.co.kr',
      passwordHash: MOCK_HASH,
      departmentId: deptHR.id,
      position: '사원',
      jobTitle: '인사 담당',
      role: UserRole.VIEWER,
      status: UserStatus.INACTIVE,
      avatarInitials: '오',
      avatarColor: 'bg-gray-500',
      phone: '010-7890-1234',
      joinedAt: new Date('2023-01-02'),
    },
  });

  const allUsers = [userKim, userLee, userPark, userChoi, userJeong, userHan, userOh];
  console.log(`   ✓ ${allUsers.length}명 사용자 생성 완료`);

  // ── 3. 권한 매핑 ─────────────────────────────────────────────────────────
  console.log('🔑 사용자 권한 설정 중...');

  const permissionSeed: { user: typeof userKim; perms: PermissionCode[] }[] = [
    { user: userKim,   perms: ALL_PERMISSIONS },
    { user: userLee,   perms: APPROVER_PERMISSIONS },
    { user: userPark,  perms: APPROVER_PERMISSIONS },
    { user: userChoi,  perms: USER_PERMISSIONS },
    { user: userJeong, perms: USER_PERMISSIONS },
    { user: userHan,   perms: APPROVER_PERMISSIONS },
    { user: userOh,    perms: VIEWER_PERMISSIONS },
  ];

  for (const { user, perms } of permissionSeed) {
    // 기존 권한 삭제 후 재등록
    await prisma.userPermission.deleteMany({ where: { userId: user.id } });
    await prisma.userPermission.createMany({
      data: perms.map((perm) => ({
        userId: user.id,
        permission: perm,
        grantedById: userKim.id,
      })),
      skipDuplicates: true,
    });
  }
  console.log('   ✓ 권한 설정 완료');

  // ── 4. 문서 분류 카테고리 ─────────────────────────────────────────────────
  console.log('📁 문서 분류 생성 중...');

  const catQP = await prisma.documentCategory.upsert({
    where: { code: 'QP' },
    update: {},
    create: { label: '품질절차서', code: 'QP', order: 1 },
  });
  const catWI = await prisma.documentCategory.upsert({
    where: { code: 'WI' },
    update: {},
    create: { label: '작업지침서', code: 'WI', order: 2 },
  });
  const catFORM = await prisma.documentCategory.upsert({
    where: { code: 'FORM' },
    update: {},
    create: { label: '기록서식', code: 'FORM', order: 3 },
  });
  const catREG = await prisma.documentCategory.upsert({
    where: { code: 'REG' },
    update: {},
    create: { label: '규정', code: 'REG', order: 4 },
  });

  // 하위 분류
  await Promise.all([
    prisma.documentCategory.upsert({
      where: { code: 'QP-QUAL' },
      update: {},
      create: { label: '품질관리', code: 'QP-QUAL', parentId: catQP.id, order: 1 },
    }),
    prisma.documentCategory.upsert({
      where: { code: 'QP-PROD' },
      update: {},
      create: { label: '생산관리', code: 'QP-PROD', parentId: catQP.id, order: 2 },
    }),
    prisma.documentCategory.upsert({
      where: { code: 'WI-INSPECT' },
      update: {},
      create: { label: '검사지침', code: 'WI-INSPECT', parentId: catWI.id, order: 1 },
    }),
    prisma.documentCategory.upsert({
      where: { code: 'WI-EQUIP' },
      update: {},
      create: { label: '설비지침', code: 'WI-EQUIP', parentId: catWI.id, order: 2 },
    }),
  ]);
  console.log('   ✓ 문서 분류 생성 완료');

  // ── 5. 샘플 문서 ─────────────────────────────────────────────────────────
  console.log('📄 샘플 문서 생성 중...');

  const doc1 = await prisma.document.upsert({
    where: { no: 'QP-2024-001' },
    update: {},
    create: {
      no: 'QP-2024-001',
      name: '품질경영 시스템 운영 절차서',
      type: '품질절차서',
      categoryId: catQP.id,
      currentVersion: 'v3.1',
      status: 'APPROVED',
      accessLevel: 'INTERNAL',
      authorId: userKim.id,
      departmentId: deptQuality.id,
      description: 'QMS 전반의 운영 절차를 정의하는 최상위 절차서',
      keywords: ['QMS', '품질경영', '절차서', 'ISO 9001'],
      retentionPeriod: '영구',
      relatedStandard: 'ISO 9001:2015',
      effectiveDate: new Date('2024-01-15'),
    },
  });

  const doc2 = await prisma.document.upsert({
    where: { no: 'QP-2024-002' },
    update: {},
    create: {
      no: 'QP-2024-002',
      name: '문서 및 기록 관리 절차서',
      type: '품질절차서',
      categoryId: catQP.id,
      currentVersion: 'v2.0',
      status: 'APPROVED',
      accessLevel: 'INTERNAL',
      authorId: userKim.id,
      departmentId: deptQuality.id,
      description: '문서 생성, 검토, 승인, 배포, 폐기에 관한 절차',
      keywords: ['문서관리', '기록관리', 'DCC'],
      retentionPeriod: '영구',
      relatedStandard: 'ISO 9001:2015 7.5',
      effectiveDate: new Date('2024-02-01'),
    },
  });

  const doc3 = await prisma.document.upsert({
    where: { no: 'WI-2024-001' },
    update: {},
    create: {
      no: 'WI-2024-001',
      name: '수입검사 작업지침서',
      type: '작업지침서',
      categoryId: catWI.id,
      currentVersion: 'v1.2',
      status: 'IN_REVIEW',
      accessLevel: 'INTERNAL',
      authorId: userLee.id,
      departmentId: deptQuality.id,
      description: '원자재 및 부품 수입 시 검사 기준 및 방법',
      keywords: ['수입검사', '검사기준', '품질'],
      retentionPeriod: '5년',
      relatedStandard: 'ISO 9001:2015 8.4',
      effectiveDate: new Date('2024-03-01'),
    },
  });

  console.log(`   ✓ 샘플 문서 3건 생성 완료`);

  // ── 6. 샘플 결재 요청 ─────────────────────────────────────────────────────
  console.log('✅ 샘플 결재 요청 생성 중...');

  const approval1 = await prisma.approvalRequest.create({
    data: {
      documentId: doc3.id,
      docVer: 'v1.2',
      requestedById: userLee.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      urgency: 'NORMAL',
      status: 'IN_REVIEW',
      requestComment: '수입검사 기준 강화에 따른 개정본 결재 요청드립니다.',
      currentStepIdx: 1,
      steps: {
        create: [
          {
            stepOrder: 1,
            role: '팀장 검토',
            approverId: userKim.id,
            departmentId: deptQuality.id,
            status: 'APPROVED',
            comment: '검토 완료. 기준이 명확히 정리되었습니다.',
            decidedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            stepOrder: 2,
            role: '품질 검토',
            approverId: userLee.id,
            departmentId: deptQuality.id,
            status: 'IN_REVIEW',
          },
          {
            stepOrder: 3,
            role: '최종 승인',
            approverId: userHan.id,
            departmentId: deptPurchase.id,
            status: 'PENDING',
          },
        ],
      },
    },
  });

  console.log(`   ✓ 샘플 결재 1건 생성 완료`);

  // ── 7. 감사 로그 초기화 ──────────────────────────────────────────────────
  console.log('📋 초기 감사 로그 생성 중...');

  await prisma.auditLog.createMany({
    data: [
      {
        userId: userKim.id,
        action: 'LOGIN',
        entityType: 'System',
        description: '시드 데이터 초기화 — 관리자 최초 로그인 기록',
      },
      {
        userId: userKim.id,
        action: 'CREATE',
        entityType: 'Document',
        entityId: doc1.id,
        description: `문서 생성: ${doc1.no} ${doc1.name}`,
        newValues: { no: doc1.no, name: doc1.name, status: 'APPROVED' },
      },
      {
        userId: userKim.id,
        action: 'CREATE',
        entityType: 'Document',
        entityId: doc2.id,
        description: `문서 생성: ${doc2.no} ${doc2.name}`,
        newValues: { no: doc2.no, name: doc2.name, status: 'APPROVED' },
      },
    ],
  });
  console.log('   ✓ 감사 로그 생성 완료');

  // ── 완료 ────────────────────────────────────────────────────────────────
  console.log('\n✅ 시드 데이터 초기화 완료!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   부서: ${departments.length}개`);
  console.log(`   사용자: ${allUsers.length}명`);
  console.log('   문서 분류: 8개 (4 상위 + 4 하위)');
  console.log('   샘플 문서: 3건');
  console.log('   샘플 결재: 1건');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📌 다음 단계:');
  console.log('   1. npm run db:studio  → Prisma Studio에서 데이터 확인');
  console.log('   2. API Route 구현 후 UI와 연결');
  console.log('   ※  비밀번호 해시는 반드시 bcrypt 처리 후 교체하세요!');
}

// ── 실행 ─────────────────────────────────────────────────────────────────────

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('\n❌ 시드 실행 실패:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
