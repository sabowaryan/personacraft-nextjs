/**
 * Diagnostic du problème de webhook Stack Auth
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugWebhookIssue() {
  console.log('🔍 Diagnostic du problème de webhook\n');

  try {
    // 1. Vérifier l'état des utilisateurs
    console.log('1. État actuel des utilisateurs:');
    
    const users = await prisma.user.findMany({
      include: {
        plan: true,
        roles: {
          include: {
            role: true
          }
        },
        preferences: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`   Total utilisateurs dans notre DB: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.id}`);
      console.log(`      Email: ${user.email || 'Non défini'}`);
      console.log(`      Nom: ${user.name || 'Non défini'}`);
      console.log(`      Plan: ${user.plan?.name || 'Aucun'}`);
      console.log(`      Rôles: ${user.roles.map(ur => ur.role.name).join(', ') || 'Aucun'}`);
      console.log(`      Créé: ${user.createdAt}`);
      console.log('');
    });

    // 2. Vérifier les logs du serveur
    console.log('2. Vérification des logs webhook:');
    console.log('   💡 Regardez dans votre terminal où tourne `npm run dev`');
    console.log('   💡 Cherchez des messages comme "webhook_received" ou erreurs');
    console.log('   💡 Si aucun log → le webhook n\'a pas été appelé\n');

    // 3. Problème probable
    console.log('3. Problème identifié:');
    console.log('   ❌ Le webhook n\'est PAS configuré dans Stack Auth');
    console.log('   ❌ Stack Auth ne sait pas qu\'il doit appeler notre endpoint');
    console.log('   ❌ Seule la table d\'auth Stack Auth est remplie\n');

    // 4. Solution
    console.log('4. Solution - Configurer le webhook:');
    console.log('   📋 Étapes OBLIGATOIRES:');
    console.log('   1. Allez sur https://app.stack-auth.com/');
    console.log(`   2. Sélectionnez votre projet: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
    console.log('   3. Dans le menu de gauche, cliquez sur "Webhooks"');
    console.log('   4. Cliquez sur "Add Webhook" ou "Create Webhook"');
    console.log('   5. Configurez:');
    console.log('      - Endpoint URL: http://localhost:3000/api/webhooks/stack');
    console.log('      - Events à sélectionner:');
    console.log('        ✅ user.created');
    console.log('        ✅ user.updated');
    console.log('        ✅ user.deleted');
    console.log('   6. Cliquez sur "Save" ou "Create"');
    console.log('   7. Copiez le "Signing Secret" généré');
    console.log('   8. Mettez à jour votre .env avec ce nouveau secret\n');

    // 5. Test après configuration
    console.log('5. Après configuration du webhook:');
    console.log('   1. Créez un NOUVEAU compte avec un email différent');
    console.log('   2. Le webhook devrait être appelé automatiquement');
    console.log('   3. L\'utilisateur apparaîtra dans notre table User');
    console.log('   4. Il aura un plan "Gratuit" et le rôle "free_user"\n');

    // 6. Alternative temporaire
    console.log('6. Solution temporaire (si webhook impossible):');
    console.log('   💡 Je peux créer un script pour synchroniser manuellement');
    console.log('   💡 Mais le webhook est la solution recommandée\n');

    console.log('🎯 Action requise: Configurez le webhook dans Stack Auth dashboard');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugWebhookIssue();