// src/app/api/system/organizations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, code, parentId, order, isActive } = body;

    const dept = await prisma.department.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(code !== undefined ? { code: code.trim().toUpperCase() } : {}),
        ...(parentId !== undefined ? { parentId: parentId || null } : {}),
        ...(order !== undefined ? { order } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    return NextResponse.json(dept);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 부서코드입니다' }, { status: 409 });
    }
    console.error('[PATCH /api/system/organizations/[id]]', e);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}
