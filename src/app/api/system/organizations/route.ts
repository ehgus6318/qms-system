// src/app/api/system/organizations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const q = searchParams.get('q') ?? '';

    const depts = await prisma.department.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      },
      include: {
        parent: { select: { id: true, name: true, code: true } },
        _count: { select: { children: true, users: true } },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(depts);
  } catch (e) {
    console.error('[GET /api/system/organizations]', e);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, parentId, order, isActive } = body;

    if (!name?.trim()) return NextResponse.json({ error: '부서명은 필수입니다' }, { status: 400 });
    if (!code?.trim()) return NextResponse.json({ error: '부서코드는 필수입니다' }, { status: 400 });

    const dept = await prisma.department.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        parentId: parentId || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(dept, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 부서코드입니다' }, { status: 409 });
    }
    console.error('[POST /api/system/organizations]', e);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
