/**
 * Test de la configuration du webhook Stack Auth
 */

const { PrismaClient } = require('@prisma/client');

async function testWebhookConfig() {
  console.log('🔍 Test de la configuration du webhook Stack Auth\n');

  // 1. Vérifier les variables d'environnement
  console.log('1. Variables d\'environnement:');
  console.log('   STACK_WEBHOOK_SECRET:', process.env.STACK_WEBHOOK_SECRET ? 'DÉFINI' : 'NON DÉFINI');
  console.log('   STACK_SECRET_SERVER_KEY:', process.env.STACK_SECRET_SERVER_KEY ? 'DÉFINI' : 'NON DÉFINI');
  console.log('   NEXT_PUBLIC_STACK_PROJECT_ID:', process.env.NEXT_PUBLIC_STACK_PROJECT_ID ? 'DÉFINI' : 'NON DÉFINI');

  if (process.env.STACK_WEBHOOK_SECRET) {
    console.log('   Format du secret:', process.env.STACK_WEBHOOK_SECRET.substring(0, 10) + '...');
  }

  // 2. Vérifier la base de données
  const prisma = new PrismaClient();
  
  try {
    console.log('\n2. État de la base de données:');
    
    const planCount = await prisma.plan.count();
    const roleCount = await prisma.role.count();
    const userCount = await prisma.user.count();
    
    console.log(`   Plans: ${planCount}`);
    console.log(`   Rôles: ${roleCount}`);
    console.log(`   Utilisateurs: ${userCount}`);

    // Vérifier le plan gratuit
    const freePlan = await prisma.plan.findFirst({
      where: { name: 'Gratuit' }
    });
    console.log('   Plan gratuit:', freePlan ? '✅ TROUVÉ' : '❌ MANQUANT');

    // Vérifier le rôle free_user
    const freeRole = await prisma.role.findUnique({
      where: { name: 'free_user' }
    });
    console.log('   Rôle free_user:', freeRole ? '✅ TROUVÉ' : '❌ MANQUANT');

  } catch (error) {
    console.error('   ❌ Erreur base de données:', error.message);
  } finally {
    await prisma.$disconnect();
  }

  // 3. Tester l'endpoint webhook
  console.log('\n3. Test de l\'endpoint webhook:');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/stack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true })
    });

    console.log('   Statut de réponse:', response.status);
    
    if (response.status === 400) {
      console.log('   ✅ Endpoint accessible (erreur 400 attendue sans en-têtes Svix)');
    } else {
      console.log('   ⚠️  Réponse inattendue');
    }

  } catch (error) {
    console.log('   ❌ Endpoint non accessible:', error.message);
    console.log('   💡 Assurez-vous que votre serveur Next.js est démarré (npm run dev)');
  }

  // 4. Instructions
  console.log('\n4. Instructions pour configurer Stack Auth:');
  console.log('   a) Allez sur https://app.stack-auth.com/');
  console.log('   b) Sélectionnez votre projet');
  console.log('   c) Allez dans "Settings" > "Webhooks"');
  console.log('   d) Créez un nouveau webhook avec:');
  console.log('      - URL: http://localhost:3000/api/webhooks/stack');
  console.log('      - Événements: user.created, user.updated, user.deleted');
  console.log('   e) Copiez le secret généré et mettez-le dans STACK_WEBHOOK_SECRET');
  console.log('\n   💡 Le secret doit commencer par "whsec_" pour être valide');
}

testWebhookConfig();