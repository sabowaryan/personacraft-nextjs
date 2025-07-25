import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Webhook secret from Stack Auth dashboard
const WEBHOOK_SECRET = process.env.STACK_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Get the headers
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Get the body
    const body = await req.text();

    // Verify the webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let event;

    try {
      event = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUserCreated(userData: any) {
  try {
    // Create user in our database
    await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.primary_email,
        displayName: userData.display_name,
        profileImageUrl: userData.profile_image_url,
        createdAt: new Date(userData.created_at_millis),
        updatedAt: new Date(userData.updated_at_millis),
      },
    });

    console.log(`User created: ${userData.id}`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    // Update user in our database
    await prisma.user.update({
      where: { id: userData.id },
      data: {
        email: userData.primary_email,
        displayName: userData.display_name,
        profileImageUrl: userData.profile_image_url,
        updatedAt: new Date(userData.updated_at_millis),
      },
    });

    console.log(`User updated: ${userData.id}`);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

async function handleUserDeleted(userData: any) {
  try {
    // Delete user from our database
    await prisma.user.delete({
      where: { id: userData.id },
    });

    console.log(`User deleted: ${userData.id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

