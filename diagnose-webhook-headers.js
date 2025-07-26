/**
 * Diagnostic des en-têtes webhook manquants
 */

require('dotenv').config();

async function diagnoseWebhookHeaders() {
  console.log('🔍 Diagnostic des en-têtes webhook manquants\n');

  console.log('1. Analyse des logs:');
  console.log('   ✅ Endpoint webhook accessible');
  console.log('   ✅ Requête POST reçue');
  console.log('   ❌ En-têtes Svix manquants (svix-id, svix-timestamp, svix-signature)');
  console.log('   ❌ Erreur 400 - Signature invalide\n');

  console.log('2. Cause probable:');
  console.log('   🔍 L\'appel ne vient PAS de Stack Auth');
  console.log('   🔍 Soit le webhook n\'est pas configuré');
  console.log('   🔍 Soit l\'URL est incorrecte dans Stack Auth\n');

  console.log('3. Vérification dans Stack Auth Dashboard:');
  console.log('   📋 Étapes à vérifier:');
  console.log('   1. Allez sur https://app.stack-auth.com/');
  console.log(`   2. Projet: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
  console.log('   3. Menu "Webhooks"');
  console.log('   4. Vérifiez qu\'il y a bien UN webhook avec:');
  console.log('      - URL: http://localhost:3000/api/webhooks/stack');
  console.log('      - Events: user.created, user.updated, user.deleted');
  console.log('      - Status: Enabled/Active\n');

  console.log('4. Si le webhook n\'existe pas:');
  console.log('   ➕ Cliquez sur "Add Webhook"');
  console.log('   ➕ URL: http://localhost:3000/api/webhooks/stack');
  console.log('   ➕ Events: user.created, user.updated, user.deleted');
  console.log('   ➕ Copiez le secret généré dans votre .env\n');

  console.log('5. Si le webhook existe mais ne fonctionne pas:');
  console.log('   🔧 Vérifiez l\'URL exacte');
  console.log('   🔧 Vérifiez que les events sont cochés');
  console.log('   🔧 Testez avec le bouton "Test" dans Stack Auth\n');

  console.log('6. Test de connectivité:');
  console.log('   💡 Stack Auth doit pouvoir atteindre votre localhost');
  console.log('   💡 Si vous êtes derrière un firewall/VPN, cela peut bloquer');
  console.log('   💡 Alternative: utilisez ngrok pour exposer votre localhost\n');

  console.log('7. Solution temporaire - ngrok:');
  console.log('   Si localhost ne fonctionne pas:');
  console.log('   a) Installez ngrok: npm install -g ngrok');
  console.log('   b) Exposez votre port: ngrok http 3000');
  console.log('   c) Utilisez l\'URL ngrok dans Stack Auth');
  console.log('   d) Format: https://abc123.ngrok.io/api/webhooks/stack\n');

  console.log('8. Prochaines étapes:');
  console.log('   1. Vérifiez/créez le webhook dans Stack Auth');
  console.log('   2. Testez avec un nouveau compte');
  console.log('   3. Si ça ne marche toujours pas, essayez ngrok');
  console.log('   4. Ou utilisez la synchronisation manuelle\n');

  console.log('🎯 Que voulez-vous faire ?');
  console.log('   A) Vérifier la configuration Stack Auth');
  console.log('   B) Essayer avec ngrok');
  console.log('   C) Synchronisation manuelle de l\'utilisateur récent');
}

diagnoseWebhookHeaders();