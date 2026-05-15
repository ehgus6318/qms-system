// src/app/api/system/approval-settings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { steps, ...rest } = body;

    // 단계 교체 (있을 경우)
    if (Array.isArray(steps)) {
      await prisma.approvalTemplateStep.deleteMany({ where: { templateId: id } });
      await prisma.approvalTemplateStep.createMany({
        data: steps.map((s: { stepOrder: number; role: string; assigneeType?: string; assigneeId?: string; isRequired?: boolean }) => ({
          templateId: id,
          stepOrder: s.stepOrder,
          role: s.role,
          assigneeType: s.assigneeType ?? 'FREE',
          assigneeId: s.assigneeId ?? null,
          isRequired: s.isRequired ?? true,
        })),
      });
    }

    const template = await prisma.approvalTemplate.update({
      where: { id },
      data: {
        ...(rest.name !== undefined ? { name: rest.name.trim() } : {}),
        ...(rest.description !== undefined ? { description: rest.description?.trim() || null } : {}),
        ...(rest.isDefault !== undefined ? { isDefault: rest.isDefault } : {}),
        ...(rest.allowFreeSelection !== undefined ? { allowFreeSelection: rest.allowFreeSelection } : {}),
        ...(rest.allowSelfApproval !== undefined ? { allowSelfApproval: rest.allowSelfApproval } : {}),
        ...(rest.isActive !== undefined ? { isActive: rest.isActive } : {}),
      },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    return NextResponse.json(template);
  } catch (e) {
    console.error('[PATCH /api/system/approval-settings/[id]]', e);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}
