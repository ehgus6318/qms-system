// src/app/api/system/document-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const q = searchParams.get('q') ?? '';

    const categories = await prisma.documentCategory.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(q ? {
          OR: [
            { label: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: {
        parent: { select: { id: true, label: true, code: true } },
        _count: { select: { children: true, documents: true } },
      },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.error('[GET /api/system/document-categories]', e);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, code, parentId, description, order, isActive } = body;

    if (!label?.trim()) return NextResponse.json({ error: '분류명은 필수입니다' }, { status: 400 });

    const cat = await prisma.documentCategory.create({
      data: {
        label: label.trim(),
        code: code?.trim().toUpperCase() || null,
        parentId: parentId || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(cat, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 분류코드입니다' }, { status: 409 });
    }
    console.error('[POST /api/system/document-categories]', e);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
