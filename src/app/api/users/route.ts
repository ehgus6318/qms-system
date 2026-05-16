// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/users/route.ts
// GET  /api/users  — 사용자 목록 조회 (검색·필터)
// POST /api/users  — 신규 사용자 등록
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, UserRole, UserStatus } from '@prisma/client';

// ── 공통: DB 행 → 클라이언트 DTO 변환 ────────────────────────────────────────

function toDto(user: Prisma.UserGetPayload<{ include: { department: true } }>) {
  return {
    id:             user.id,
    name:           user.name,
    email:          user.email,
    departmentId:   user.departmentId,
    departmentName: user.department.name,
    position:       user.position,
    jobTitle:       user.jobTitle,
    role:           user.role.toLowerCase(),          // ADMIN → admin
    status:         user.status,                       // ACTIVE / INACTIVE / SUSPENDED
    isActive:       user.status === UserStatus.ACTIVE,
    isAdmin:        user.isAdmin,
    canSelfApprove: user.canSelfApprove,
    avatarInitials: user.avatarInitials,
    avatarColor:    user.avatarColor,
    phone:          user.phone ?? null,
    joinedAt:       user.joinedAt?.toISOString().slice(0, 10) ?? null,
    createdAt:      user.createdAt.toISOString(),
  };
}

// ── 공통: 소문자 role → DB UserRole enum ─────────────────────────────────────

function toDbRole(role: string): UserRole {
  const map: Record<string, UserRole> = {
    admin:    UserRole.ADMIN,
    manager:  UserRole.MANAGER,
    approver: UserRole.APPROVER,
    user:     UserRole.USER,
    viewer:   UserRole.VIEWER,
  };
  return map[role.toLowerCase()] ?? UserRole.USER;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/users
// Query: search, departmentId, role, isActive
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search       = searchParams.get('search')?.trim() ?? '';
  const departmentId = searchParams.get('departmentId') ?? '';
  const role         = searchParams.get('role') ?? '';
  const isActiveRaw  = searchParams.get('isActive');

  const where: Prisma.UserWhereInput = {};

  // 검색 (이름, 이메일, 직급, 직책)
  if (search) {
    where.OR = [
      { name:     { contains: search, mode: 'insensitive' } },
      { email:    { contains: search, mode: 'insensitive' } },
      { position: { contains: search, mode: 'insensitive' } },
      { jobTitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  // 부서 필터
  if (departmentId) where.departmentId = departmentId;

  // 역할 필터
  if (role && role !== 'all') where.role = toDbRole(role);

  // 활성 상태 필터
  if (isActiveRaw === 'true')  where.status = UserStatus.ACTIVE;
  if (isActiveRaw === 'false') where.status = { not: UserStatus.ACTIVE };

  try {
    const users = await prisma.user.findMany({
      where,
      include: { department: true },
      orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(users.map(toDto));
  } catch (e) {
    console.error('[GET /api/users]', e);
    return NextResponse.json({ error: '사용자 목록 조회 실패' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/users
// Body: { name, email, password, departmentId, position, jobTitle,
//         role, isAdmin, canSelfApprove, avatarColor, phone? }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다' }, { status: 400 });
  }

  const { name, email, password, departmentId, position, jobTitle,
          role, isAdmin, canSelfApprove, avatarColor, phone } = body;

  // 필수값 검증
  if (!name || !email || !password || !departmentId || !position || !jobTitle) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다' }, { status: 400 });
  }

  // 이메일 형식 검증
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다' }, { status: 400 });
  }

  // 아바타 이니셜 자동 생성
  const avatarInitials = String(name).charAt(0);

  // 비밀번호 해시 (MVP: mock hash — 실제 운영 시 bcrypt 교체 필요)
  const passwordHash = `$2b$12$MOCK_${Buffer.from(String(password)).toString('base64').slice(0, 20)}`;

  try {
    const created = await prisma.user.create({
      data: {
        name:           String(name),
        email:          String(email).toLowerCase(),
        passwordHash,
        departmentId:   String(departmentId),
        position:       String(position),
        jobTitle:       String(jobTitle),
        role:           toDbRole(String(role ?? 'user')),
        status:         UserStatus.ACTIVE,
        isAdmin:        Boolean(isAdmin ?? false),
        canSelfApprove: Boolean(canSelfApprove ?? false),
        avatarInitials,
        avatarColor:    String(avatarColor ?? 'bg-blue-600'),
        phone:          phone ? String(phone) : null,
        joinedAt:       new Date(),
      },
      include: { department: true },
    });
    return NextResponse.json(toDto(created), { status: 201 });
  } catch (e: unknown) {
    // Prisma 유니크 제약 위반 (이메일 중복)
    if (
      e instanceof Error &&
      (e as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다', code: 'EMAIL_DUPLICATE' },
        { status: 409 },
      );
    }
    console.error('[POST /api/users]', e);
    return NextResponse.json({ error: '사용자 등록 실패' }, { status: 500 });
  }
}
