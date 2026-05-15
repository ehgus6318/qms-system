// src/app/api/system/common-codes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type } = body;

    if (type === 'group') {
      const group = await prisma.commonCodeGroup.update({
        where: { id },
        data: {
          ...(body.name !== undefined ? { name: body.name.trim() } : {}),
          ...(body.description !== undefined ? { description: body.description?.trim() || null } : {}),
          ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        },
      });
      return NextResponse.json(group);
    } else {
      const codeObj = await prisma.commonCode.update({
        where: { id },
        data: {
          ...(body.name !== undefined ? { name: body.name.trim() } : {}),
          ...(body.code !== undefined ? { code: body.code.trim().toUpperCase() } : {}),
          ...(body.description !== undefined ? { description: body.description?.trim() || null } : {}),
          ...(body.order !== undefined ? { order: body.order } : {}),
          ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
          ...(body.extra !== undefined ? { extra: body.extra } : {}),
        },
      });
      return NextResponse.json(codeObj);
    }
  } catch (e) {
    console.error('[PATCH /api/system/common-codes/[id]]', e);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}
