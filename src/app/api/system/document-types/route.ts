// src/app/api/system/document-types/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const q = searchParams.get('q') ?? '';

    const types = await prisma.documentType.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(types);
  } catch (e) {
    console.error('[GET /api/system/document-types]', e);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, description, prefix, order, isActive } = body;

    if (!name?.trim()) return NextResponse.json({ error: '유형명은 필수입니다' }, { status: 400 });
    if (!code?.trim()) return NextResponse.json({ error: '유형코드는 필수입니다' }, { status: 400 });

    const docType = await prisma.documentType.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description?.trim() || null,
        prefix: prefix?.trim().toUpperCase() || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(docType, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 유형코드입니다' }, { status: 409 });
    }
    console.error('[POST /api/system/document-types]', e);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
