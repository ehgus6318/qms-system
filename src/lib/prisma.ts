// ─────────────────────────────────────────────────────────────────────────────
// src/lib/prisma.ts
// Prisma Client 싱글턴 (Next.js Hot Reload 대응)
//
// [Prisma v7 Driver Adapter 방식]
//   - 마이그레이션:  prisma.config.ts → datasource.url 사용
//   - 런타임 쿼리:  이 파일 → PrismaPg adapter 사용
//   - Next.js는 .env를 자동으로 로드하므로 dotenv 불필요
//
// 사용 예시 (Server Action / Route Handler):
//   import { prisma } from '@/lib/prisma';
//   const users = await prisma.user.findMany();
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// ── 싱글턴 패턴 (Next.js HMR에서 중복 연결 방지) ──────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env['DATABASE_URL'];

  if (!connectionString) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[prisma] ⚠️  DATABASE_URL이 설정되지 않았습니다.\n' +
        '           현재 Mock 데이터로 동작 중입니다.\n' +
        '           DB 쿼리 호출 시 런타임 오류가 발생합니다.',
      );
    }
    // DATABASE_URL 없이 인스턴스 생성 (빌드 통과용)
    // 실제 쿼리 호출 시 런타임 오류 발생
    return new PrismaClient({ log: ['error'] });
  }

  // Prisma v7: Driver Adapter 방식으로 연결
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  } as never);
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// ── 타입 재export (API Route에서 편리하게 사용) ───────────────────────────────
export type {
  User,
  Department,
  UserPermission,
  Document,
  DocumentCategory,
  DocumentVersion,
  DocumentFile,
  DocumentAppliedDept,
  ApprovalRequest,
  ApprovalStep,
  RevisionRequest,
  RevisionChangeItem,
  RevisionAttachmentChange,
  Circulation,
  TrainingRecord,
  AuditLog,
  Notification,
  // Enums
  UserStatus,
  UserRole,
  PermissionCode,
  DocumentStatus,
  AccessLevel,
  DeptDocPermission,
  ApprovalStatus,
  ApprovalStepStatus,
  RevisionStatus,
  ChangeItemType,
  FileChangeType,
  CirculationStatus,
  Urgency,
  AuditAction,
  NotificationType,
} from '@prisma/client';
