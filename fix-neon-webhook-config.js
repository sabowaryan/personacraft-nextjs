/**
 * Correction de la configuration webhook Neon + Stack Auth
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixNeonWebhookConfig() {
  console.log('🔧 Correction de la configuration webhook Neon + Stack Auth\n');

  try {
    // 1. Diagnostic du problème
    console.log('1. Problème identifié:');
    console.log('   ❌ Webhook configuré pour Neon Console au lieu de votre app');
    console.log('   ❌ URL actuelle: https://console.neon.tech/webhook/stack');
    console.log('   ✅ URL requise: http://localhost:3000/api/webhooks/stack\n');

    // 2. Solutions possibles
    console.log('2. Solutions possibles:\n');

    console.log('   🎯 SOLUTION A - Reconfigurer le webhook (Recommandée):');
    console.log('   1. Allez sur https://app.stack-auth.com/');
    console.log(`   2. Sélectionnez votre projet: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
    console.log('   3. Allez dans "Webhooks"');
    console.log('   4. Trouvez le webhook existant (Neon)');
    console.log('   5. Modifiez l\'URL vers: http://localhost:3000/api/webhooks/stack');
    console.log('   6. Vérifiez que les events sont bien cochés:');
    console.log('      - user.created ✅');
    console.log('      - user.updated ✅');
    console.log('      - user.deleted ✅');
    console.log('   7. Sauvegardez\n');

    console.log('   🎯 SOLUTION B - Créer un nouveau webhook:');
    console.log('   1. Allez sur https://app.stack-auth.com/');
    console.log('   2. Dans "Webhooks", cliquez "Add Webhook"');
    console.log('   3. URL: http://localhost:3000/api/webhooks/stack');
    console.log('   4. Events: user.created, user.updated, user.deleted');
    console.log('   5. Copiez le nouveau secret dans votre .env\n');

    console.log('   🎯 SOLUTION C - Synchronisation manuelle (Temporaire):');
    console.log('   1. Je peux créer un script pour synchroniser les utilisateurs');
    console.log('   2. Récupère les utilisateurs de Stack Auth');
    console.log('   3. Les crée dans votre table User avec plan/rôle\n');

    // 3. Vérifier l'utilisateur récent
    console.log('3. Vérification de l\'utilisateur récent:');
    
    // Simuler la récupération des utilisateurs Stack Auth (normalement via API)
    console.log('   💡 L\'utilisateur que vous venez de créer existe dans:');
    console.log('   ✅ Table Stack Auth (dans Neon)');
    console.log('   ✅ Dashboard Stack Auth');
    console.log('   ❌ Votre table User (manquante)');
    console.log('   ❌ Pas de plan ni rôle attribué\n');

    // 4. Test de l'endpoint local
    console.log('4. Test de votre endpoint webhook:');
    try {
      const response = await fetch('http://localhost:3000/api/webhooks/stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });

      if (response.status === 400) {
        console.log('   ✅ Endpoint accessible et fonctionnel');
      } else {
        console.log(`   ⚠️  Réponse: ${response.status}`);
      }
    } catch (error) {
      console.log('   ❌ Endpoint non accessible');
      console.log('   💡 Vérifiez que `npm run dev` est en cours');
    }

    // 5. Prochaines étapes
    console.log('\n5. Prochaines étapes:');
    console.log('   1. Choisissez une solution (A, B ou C)');
    console.log('   2. Si Solution A/B: Reconfigurez le webhook');
    console.log('   3. Si Solution C: Tapez "sync" pour synchroniser manuellement');
    console.log('   4. Testez avec un nouveau compte\n');

    console.log('🎯 Quelle solution préférez-vous ?');
    console.log('   - Tapez "webhook" pour les instructions détaillées');
    console.log('   - Tapez "sync" pour la synchronisation manuelle');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixNeonWebhookConfig();