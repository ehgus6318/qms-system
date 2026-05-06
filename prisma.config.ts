// ─────────────────────────────────────────────────────────────────────────────
// prisma.config.ts
// Prisma v7 구성 파일
//
// [Prisma CLI 실행 순서]
// 1. 이 파일이 평가되기 전에 .env를 명시적으로 로드
// 2. defineConfig()에서 datasource.url로 DATABASE_URL 전달
// 3. prisma migrate dev / prisma db push 등 실행
//
// [주의] migrate.adapter API는 Prisma v7에서 제거됨
//       runtime 어댑터는 src/lib/prisma.ts 에서만 사용
// ─────────────────────────────────────────────────────────────────────────────

import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

// Prisma CLI가 .env를 자동 로드하지 않을 경우를 대비해 명시적으로 로드
loadEnv({ path: resolve(process.cwd(), '.env') });

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',

  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
