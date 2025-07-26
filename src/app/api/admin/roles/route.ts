import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stackServerApp } from '@/stack';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    const hasReadRolePermission = userWithRole?.role?.permissions.some(
      (rp: any) => rp.permission.name === 'read_role'
    );

    if (!hasReadRolePermission) {
      return NextResponse.json({ error: 'Permission insuffisante' }, { status: 403 });
    }

    // Récupérer tous les rôles avec leurs permissions
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Formater les données pour l'API
    const formattedRoles = roles.map((role: any) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      userCount: role._count.users,
      permissions: role.permissions.map((rp: any) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description
      }))
    }));

    return NextResponse.json({ roles: formattedRoles });
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}