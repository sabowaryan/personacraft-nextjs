import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Récupérer le secret du webhook depuis les variables d'environnement
    const webhookSecret = process.env.STACK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STACK_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Récupérer les headers et le body
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    const body = await req.text();

    // Vérifier la signature du webhook
    const wh = new Webhook(webhookSecret);
    let evt;

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Traiter l'événement
    const { type, data } = evt as { type: string; data: any };

    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleUserCreated(userData: any) {
  try {
    console.log('User created:', userData);

    // Créer l'utilisateur dans notre base de données
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        email: userData.primary_email_address,
        name: userData.display_name || userData.primary_email_address,
      },
      create: {
        id: userData.id,
        email: userData.primary_email_address,
        name: userData.display_name || userData.primary_email_address,
      },
    });

    // Récupérer le plan gratuit par défaut
    const freePlan = await prisma.plan.findUnique({
      where: { id: 'free' }
    });

    if (!freePlan) {
      console.error('Free plan not found');
      return;
    }

    // Récupérer le rôle utilisateur gratuit par défaut
    const freeUserRole = await prisma.role.findUnique({
      where: { name: 'free_user' }
    });

    if (!freeUserRole) {
      console.error('Free user role not found');
      return;
    }

    // Attribuer le rôle par défaut à l'utilisateur
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: freeUserRole.id,
      },
    });

    // Attribuer le plan par défaut à l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planId: freePlan.id,
      },
    });

    console.log(`Assigned free_user role and free plan to user ${user.id}`);

  } catch (error) {
    console.error('Error handling user created:', error);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    console.log('User updated:', userData);
    // Logique pour gérer la mise à jour d'un utilisateur
    await prisma.user.update({
      where: { id: userData.id },
      data: {
        email: userData.primary_email_address,
        name: userData.display_name || userData.primary_email_address,
      },
    });
  } catch (error) {
    console.error('Error handling user updated:', error);
  }
}

async function handleUserDeleted(userData: any) {
  try {
    console.log('User deleted:', userData);
    
    // Supprimer les rôles de l'utilisateur
    await prisma.userRole.deleteMany({
      where: { userId: userData.id }
    });

    // Supprimer l'utilisateur de notre base de données
    await prisma.user.delete({
      where: { id: userData.id }
    });

    console.log(`Removed user ${userData.id} and all associated roles`);
  } catch (error) {
    console.error('Error handling user deleted:', error);
  }
}

