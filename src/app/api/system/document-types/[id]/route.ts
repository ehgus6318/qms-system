// src/app/api/system/document-types/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const docType = await prisma.documentType.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.code !== undefined ? { code: body.code.trim().toUpperCase() } : {}),
        ...(body.description !== undefined ? { description: body.description?.trim() || null } : {}),
        ...(body.prefix !== undefined ? { prefix: body.prefix?.trim().toUpperCase() || null } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    return NextResponse.json(docType);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 유형코드입니다' }, { status: 409 });
    }
    console.error('[PATCH /api/system/document-types/[id]]', e);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}
