// src/app/api/system/document-categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cat = await prisma.documentCategory.update({
      where: { id },
      data: {
        ...(body.label !== undefined ? { label: body.label.trim() } : {}),
        ...(body.code !== undefined ? { code: body.code?.trim().toUpperCase() || null } : {}),
        ...(body.parentId !== undefined ? { parentId: body.parentId || null } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    return NextResponse.json(cat);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 분류코드입니다' }, { status: 409 });
    }
    console.error('[PATCH /api/system/document-categories/[id]]', e);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}
