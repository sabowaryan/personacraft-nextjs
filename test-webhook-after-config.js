/**
 * Test du webhook après configuration du deuxième endpoint
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testWebhookAfterConfig() {
  console.log('🧪 Test du webhook après configuration\n');

  try {
    // 1. Vérifier l'état initial
    console.log('1. État initial de la base de données:');
    const initialCount = await prisma.user.count();
    console.log(`   Utilisateurs actuels: ${initialCount}`);

    const recentUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    console.log('   Utilisateurs récents:');
    recentUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email || 'Pas d\'email'} (${user.createdAt.toLocaleString()})`);
    });

    // 2. Vérifier la configuration webhook
    console.log('\n2. Vérification de la configuration:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
    console.log(`   Webhook Secret: ${process.env.STACK_WEBHOOK_SECRET ? 'Configuré ✅' : 'Manquant ❌'}`);
    
    // 3. Test de l'endpoint
    console.log('\n3. Test de l\'endpoint webhook:');
    try {
      const response = await fetch('http://localhost:3000/api/webhooks/stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });

      if (response.status === 400) {
        console.log('   ✅ Endpoint accessible (erreur 400 normale sans headers Svix)');
      } else {
        console.log(`   ⚠️  Réponse inattendue: ${response.status}`);
      }
    } catch (error) {
      console.log('   ❌ Endpoint non accessible');
      console.log('   💡 Vérifiez que votre serveur Next.js est démarré');
    }

    // 4. Instructions pour le test
    console.log('\n4. Instructions pour tester:');
    console.log('   a) Ouvrez http://localhost:3000/auth/signup dans un nouvel onglet');
    console.log('   b) Créez un compte avec un email UNIQUE (ex: test-webhook-2@example.com)');
    console.log('   c) Surveillez les logs de votre serveur Next.js');
    console.log('   d) Revenez ici et appuyez sur Entrée pour vérifier\n');

    // 5. Attendre l'input utilisateur
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise((resolve) => {
      rl.question('   ⏳ Créez votre compte puis appuyez sur Entrée...', () => {
        rl.close();
        resolve();
      });
    });

    // 6. Vérifier les résultats
    console.log('\n5. Vérification des résultats:');
    const finalCount = await prisma.user.count();
    console.log(`   Utilisateurs maintenant: ${finalCount}`);

    if (finalCount > initialCount) {
      const newUsersCount = finalCount - initialCount;
      console.log(`   ✅ ${newUsersCount} nouvel(s) utilisateur(s) créé(s) !`);

      // Afficher les nouveaux utilisateurs
      const newUsers = await prisma.user.findMany({
        include: {
          plan: true,
          roles: {
            include: {
              role: true
            }
          },
          preferences: true
        },
        orderBy: { createdAt: 'desc' },
        take: newUsersCount
      });

      console.log('\n   📋 Détails des nouveaux utilisateurs:');
      newUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. Utilisateur: ${user.id}`);
        console.log(`      Email: ${user.email || 'Non défini'}`);
        console.log(`      Nom: ${user.name || 'Non défini'}`);
        console.log(`      Plan: ${user.plan?.name || 'Aucun'}`);
        console.log(`      Rôles: ${user.roles.map(ur => ur.role.name).join(', ') || 'Aucun'}`);
        console.log(`      Préférences: ${user.preferences ? 'Créées ✅' : 'Manquantes ❌'}`);
        console.log(`      Créé: ${user.createdAt.toLocaleString()}`);
        console.log('');
      });

      console.log('   🎉 Webhook configuré et fonctionnel !');
      console.log('   💡 Les nouveaux utilisateurs seront automatiquement synchronisés');

    } else {
      console.log('   ❌ Aucun nouvel utilisateur détecté');
      console.log('\n   🔍 Vérifications à faire:');
      console.log('   1. Le webhook est-il bien configuré dans Stack Auth ?');
      console.log('   2. L\'URL est-elle correcte: http://localhost:3000/api/webhooks/stack ?');
      console.log('   3. Les events sont-ils cochés (user.created, user.updated, user.deleted) ?');
      console.log('   4. Le secret webhook est-il correct dans votre .env ?');
      console.log('   5. Votre serveur Next.js est-il démarré ?');
      console.log('\n   💡 Consultez les logs de votre serveur pour plus d\'infos');
    }

    // 7. Logs à surveiller
    console.log('\n6. Logs à surveiller dans votre serveur:');
    console.log('   ✅ "webhook_received" - Le webhook a été appelé');
    console.log('   ✅ "user_created" - L\'utilisateur a été créé');
    console.log('   ❌ Erreurs de validation ou de base de données');

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhookAfterConfig();