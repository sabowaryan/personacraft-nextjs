import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stackServerApp } from '@/stack';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier les permissions
    const userWithRole = await prisma.user.findUnique({
      where: { stackId: user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    const hasAssignRolePermission = userWithRole?.role?.permissions.some(
      (rp: any) => rp.permission.name === 'assign_role'
    );

    if (!hasAssignRolePermission) {
      return NextResponse.json({ error: 'Permission insuffisante' }, { status: 403 });
    }

    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json(
        { error: 'ID du rôle requis' },
        { status: 400 }
      );
    }

    // Vérifier que le rôle existe
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return NextResponse.json(
        { error: 'Rôle non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le rôle de l'utilisateur
    const resolvedParams = await params;
    const updatedUser = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: { roleId },
      include: {
        role: true,
        plan: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}