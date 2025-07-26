/**
 * Guide pour ajouter un deuxième webhook Stack Auth
 */

require('dotenv').config();

async function addSecondWebhook() {
  console.log('🔗 Ajout d\'un deuxième webhook Stack Auth\n');

  console.log('1. Pourquoi ajouter un deuxième webhook ?');
  console.log('   ✅ Garder l\'intégration Neon existante');
  console.log('   ✅ Ajouter la synchronisation vers votre app');
  console.log('   ✅ Pas de conflit entre les deux systèmes\n');

  console.log('2. Configuration dans Stack Auth Dashboard:');
  console.log('   a) Allez sur https://app.stack-auth.com/');
  console.log(`   b) Sélectionnez votre projet: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
  console.log('   c) Dans le menu de gauche, cliquez sur "Webhooks"');
  console.log('   d) Vous devriez voir le webhook Neon existant');
  console.log('   e) Cliquez sur "Add Webhook" ou "Create Webhook"\n');

  console.log('3. Configuration du nouveau webhook:');
  console.log('   📋 Paramètres à configurer:');
  console.log('   ┌─────────────────────────────────────────────────────┐');
  console.log('   │ Endpoint URL: http://localhost:3000/api/webhooks/stack │');
  console.log('   │                                                     │');
  console.log('   │ Events à sélectionner:                              │');
  console.log('   │ ✅ user.created                                     │');
  console.log('   │ ✅ user.updated                                     │');
  console.log('   │ ✅ user.deleted                                     │');
  console.log('   │                                                     │');
  console.log('   │ Description (optionnel):                            │');
  console.log('   │ "PersonaCraft App Sync"                             │');
  console.log('   └─────────────────────────────────────────────────────┘\n');

  console.log('4. Après création:');
  console.log('   a) Stack Auth génère un nouveau "Signing Secret"');
  console.log('   b) Copiez ce secret (format: whsec_...)');
  console.log('   c) Mettez à jour votre fichier .env\n');

  console.log('5. Mise à jour du fichier .env:');
  console.log('   Remplacez la ligne actuelle:');
  console.log(`   STACK_WEBHOOK_SECRET='${process.env.STACK_WEBHOOK_SECRET}'`);
  console.log('   ');
  console.log('   Par le nouveau secret:');
  console.log('   STACK_WEBHOOK_SECRET=\'whsec_NOUVEAU_SECRET_ICI\'\n');

  console.log('6. Vérification:');
  console.log('   Après configuration, vous devriez avoir:');
  console.log('   ✅ Webhook 1: Neon Console (existant)');
  console.log('   ✅ Webhook 2: Votre app locale (nouveau)');
  console.log('   ✅ Les deux recevront les événements utilisateur\n');

  console.log('7. Test:');
  console.log('   a) Redémarrez votre serveur: npm run dev');
  console.log('   b) Créez un nouveau compte avec un email différent');
  console.log('   c) Vérifiez les logs de votre serveur');
  console.log('   d) L\'utilisateur devrait apparaître dans votre table User\n');

  console.log('8. Avantages de cette approche:');
  console.log('   ✅ Pas de conflit avec l\'intégration Neon');
  console.log('   ✅ Synchronisation automatique des nouveaux utilisateurs');
  console.log('   ✅ Facile à désactiver si nécessaire');
  console.log('   ✅ Logs détaillés pour le debugging\n');

  console.log('🎯 Prochaines étapes:');
  console.log('   1. Configurez le deuxième webhook dans Stack Auth');
  console.log('   2. Mettez à jour votre .env avec le nouveau secret');
  console.log('   3. Redémarrez votre serveur');
  console.log('   4. Testez avec un nouveau compte');
  console.log('   5. Exécutez: node test-webhook-after-config.js\n');

  console.log('💡 Besoin d\'aide ? Dites-moi quand vous avez configuré le webhook !');
}

addSecondWebhook();