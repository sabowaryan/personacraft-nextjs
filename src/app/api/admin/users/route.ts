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

    const hasReadUserPermission = userWithRole?.role?.permissions.some(
      (rp: any) => rp.permission.name === 'read_user'
    );

    if (!hasReadUserPermission) {
      return NextResponse.json({ error: 'Permission insuffisante' }, { status: 403 });
    }

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      include: {
        role: true,
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const hasCreateUserPermission = userWithRole?.role?.permissions.some(
      (rp: any) => rp.permission.name === 'create_user'
    );

    if (!hasCreateUserPermission) {
      return NextResponse.json({ error: 'Permission insuffisante' }, { status: 403 });
    }

    const { email, roleId, planId } = await request.json();

    if (!email || !roleId) {
      return NextResponse.json(
        { error: 'Email et rôle requis' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur dans Stack Auth
    const stackUser = await stackServerApp.createUser({
      primaryEmail: email,
      password: undefined // L'utilisateur devra définir son mot de passe
    });

    // Créer l'utilisateur dans notre base de données
    const newUser = await prisma.user.create({
      data: {
        stackId: stackUser.id,
        email: email,
        roleId: roleId,
        planId: planId || null
      },
      include: {
        role: true,
        plan: true
      }
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}