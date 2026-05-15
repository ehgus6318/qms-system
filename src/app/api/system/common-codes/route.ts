// src/app/api/system/common-codes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const groupCode = searchParams.get('group') ?? '';

    const groups = await prisma.commonCodeGroup.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(groupCode ? { code: groupCode } : {}),
      },
      include: {
        codes: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: [{ order: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(groups);
  } catch (e) {
    console.error('[GET /api/system/common-codes]', e);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'group') {
      // 그룹 생성
      const { code, name, description } = body;
      if (!code?.trim()) return NextResponse.json({ error: '그룹코드는 필수입니다' }, { status: 400 });
      if (!name?.trim()) return NextResponse.json({ error: '그룹명은 필수입니다' }, { status: 400 });

      const group = await prisma.commonCodeGroup.create({
        data: {
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description?.trim() || null,
          isActive: true,
        },
      });
      return NextResponse.json(group, { status: 201 });
    } else {
      // 코드값 생성
      const { groupId, code, name, description, order, extra } = body;
      if (!groupId) return NextResponse.json({ error: '그룹ID는 필수입니다' }, { status: 400 });
      if (!code?.trim()) return NextResponse.json({ error: '코드값은 필수입니다' }, { status: 400 });
      if (!name?.trim()) return NextResponse.json({ error: '표시명은 필수입니다' }, { status: 400 });

      const codeObj = await prisma.commonCode.create({
        data: {
          groupId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description?.trim() || null,
          order: order ?? 0,
          isActive: true,
          extra: extra ?? null,
        },
      });
      return NextResponse.json(codeObj, { status: 201 });
    }
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: '이미 사용 중인 코드입니다' }, { status: 409 });
    }
    console.error('[POST /api/system/common-codes]', e);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
