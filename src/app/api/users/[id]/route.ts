// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/users/[id]/route.ts
// GET   /api/users/[id]  — 단일 사용자 조회
// PATCH /api/users/[id]  — 사용자 정보 수정
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
    role:           user.role.toLowerCase(),
    status:         user.status,
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

interface Ctx { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/users/[id]
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
    }
    return NextResponse.json(toDto(user));
  } catch (e) {
    console.error(`[GET /api/users/${id}]`, e);
    return NextResponse.json({ error: '사용자 조회 실패' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/users/[id]
// Body: Partial<{ name, email, departmentId, position, jobTitle,
//                 role, isActive, isAdmin, canSelfApprove, avatarColor, phone }>
// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다' }, { status: 400 });
  }

  // 수정 가능한 필드만 추출
  const data: Prisma.UserUpdateInput = {};

  if (body.name         !== undefined) data.name         = String(body.name);
  if (body.email        !== undefined) data.email         = String(body.email).toLowerCase();
  if (body.position     !== undefined) data.position      = String(body.position);
  if (body.jobTitle     !== undefined) data.jobTitle      = String(body.jobTitle);
  if (body.avatarColor  !== undefined) data.avatarColor   = String(body.avatarColor);
  if (body.phone        !== undefined) data.phone         = body.phone ? String(body.phone) : null;
  if (body.isAdmin      !== undefined) data.isAdmin       = Boolean(body.isAdmin);
  if (body.canSelfApprove !== undefined) data.canSelfApprove = Boolean(body.canSelfApprove);

  // 역할 변경
  if (body.role !== undefined) data.role = toDbRole(String(body.role));

  // 활성 상태 변경
  if (body.isActive !== undefined) {
    data.status = Boolean(body.isActive) ? UserStatus.ACTIVE : UserStatus.INACTIVE;
  }

  // 부서 변경
  if (body.departmentId !== undefined) {
    data.department = { connect: { id: String(body.departmentId) } };
  }

  // 변경 이니셜 동기화 (이름 변경 시)
  if (body.name !== undefined) {
    data.avatarInitials = String(body.name).charAt(0);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: '수정할 항목이 없습니다' }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      include: { department: true },
    });
    return NextResponse.json(toDto(updated));
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
    }
    if ((e as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다', code: 'EMAIL_DUPLICATE' },
        { status: 409 },
      );
    }
    console.error(`[PATCH /api/users/${id}]`, e);
    return NextResponse.json({ error: '사용자 수정 실패' }, { status: 500 });
  }
}
