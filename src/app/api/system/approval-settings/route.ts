// src/app/api/system/approval-settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const templates = await prisma.approvalTemplate.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        steps: { orderBy: { stepOrder: 'asc' } },
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });

    return NextResponse.json(templates);
  } catch (e) {
    console.error('[GET /api/system/approval-settings]', e);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isDefault, allowFreeSelection, allowSelfApproval, steps } = body;

    if (!name?.trim()) return NextResponse.json({ error: '템플릿명은 필수입니다' }, { status: 400 });

    const template = await prisma.approvalTemplate.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isDefault: isDefault ?? false,
        allowFreeSelection: allowFreeSelection ?? true,
        allowSelfApproval: allowSelfApproval ?? false,
        isActive: true,
        steps: {
          create: (steps ?? []).map((s: { stepOrder: number; role: string; assigneeType?: string; assigneeId?: string; isRequired?: boolean }) => ({
            stepOrder: s.stepOrder,
            role: s.role,
            assigneeType: s.assigneeType ?? 'FREE',
            assigneeId: s.assigneeId ?? null,
            isRequired: s.isRequired ?? true,
          })),
        },
      },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (e) {
    console.error('[POST /api/system/approval-settings]', e);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
