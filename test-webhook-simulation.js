/**
 * Script pour tester le webhook Stack Auth localement
 * Simule un appel webhook pour vérifier que tout fonctionne
 */

const crypto = require('crypto');

async function simulateWebhook() {
  console.log('🧪 Test de simulation du webhook Stack Auth\n');

  const webhookSecret = process.env.STACK_WEBHOOK_SECRET || 'whsec_r3HoDpHE60i+iK+fPNjOKzK1uWDpcqLI';
  const webhookUrl = 'http://localhost:3000/api/webhooks/stack';

  // Données de test pour un nouvel utilisateur
  const testEvent = {
    type: 'user.created',
    data: {
      id: 'test-webhook-' + Date.now(),
      primary_email: 'webhook-test@example.com',
      display_name: 'Webhook Test User',
      created_at_millis: Date.now(),
      updated_at_millis: Date.now(),
    }
  };

  const payload = JSON.stringify(testEvent);
  console.log('📤 Payload à envoyer:', payload);

  // Générer les en-têtes Svix
  const timestamp = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  
  // Créer la signature (format Svix pour Stack Auth)
  const signedPayload = `${id}.${timestamp}.${payload}`;
  
  // Pour les secrets whsec_, on utilise directement la chaîne
  const secretKey = webhookSecret.startsWith('whsec_') 
    ? webhookSecret.slice(6) // Enlever le préfixe whsec_
    : webhookSecret;
    
  const signature = crypto
    .createHmac('sha256', Buffer.from(secretKey, 'base64'))
    .update(signedPayload)
    .digest('base64');

  const headers = {
    'Content-Type': 'application/json',
    'svix-id': id,
    'svix-timestamp': timestamp.toString(),
    'svix-signature': `v1,${signature}`,
  };

  console.log('📋 En-têtes générés:', headers);

  try {
    console.log('\n🚀 Envoi de la requête webhook...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: payload,
    });

    console.log('📊 Statut de la réponse:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Réponse:', responseText);

    if (response.ok) {
      console.log('✅ Webhook traité avec succès !');
      
      // Vérifier si l'utilisateur a été créé
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      try {
        const createdUser = await prisma.user.findUnique({
          where: { id: testEvent.data.id },
          include: {
            plan: true,
            roles: {
              include: {
                role: true,
              },
            },
            preferences: true,
          },
        });

        if (createdUser) {
          console.log('🎉 Utilisateur créé avec succès:');
          console.log('   ID:', createdUser.id);
          console.log('   Email:', createdUser.email);
          console.log('   Nom:', createdUser.name);
          console.log('   Plan:', createdUser.plan?.name);
          console.log('   Rôles:', createdUser.roles.map(ur => ur.role.name).join(', '));
          console.log('   Préférences:', createdUser.preferences ? 'Créées' : 'Non créées');
        } else {
          console.log('❌ Utilisateur non trouvé dans la base de données');
        }
      } finally {
        await prisma.$disconnect();
      }
    } else {
      console.log('❌ Erreur lors du traitement du webhook');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du webhook:', error.message);
  }
}

// Vérifier que l'application Next.js est démarrée
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/stack', {
      method: 'GET',
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Serveur Next.js non accessible sur http://localhost:3000');
    console.log('   Démarrez votre application avec: npm run dev');
    return;
  }

  await simulateWebhook();
}

main();