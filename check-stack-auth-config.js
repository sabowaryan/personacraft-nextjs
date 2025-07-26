/**
 * Vérification de la configuration Stack Auth
 */

// Charger les variables d'environnement
require('dotenv').config();

async function checkStackAuthConfig() {
  console.log('🔍 Vérification de la configuration Stack Auth\n');

  // 1. Vérifier les variables d'environnement
  console.log('1. Variables d\'environnement Stack Auth:');
  const requiredEnvVars = [
    'NEXT_PUBLIC_STACK_PROJECT_ID',
    'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY', 
    'STACK_SECRET_SERVER_KEY',
    'STACK_WEBHOOK_SECRET'
  ];

  let allEnvVarsSet = true;
  requiredEnvVars.forEach(varName => {
    const isSet = !!process.env[varName];
    console.log(`   ${varName}: ${isSet ? '✅ DÉFINI' : '❌ MANQUANT'}`);
    if (!isSet) allEnvVarsSet = false;
  });

  if (!allEnvVarsSet) {
    console.log('\n❌ Certaines variables d\'environnement sont manquantes !');
    return;
  }

  // 2. Tester l'API Stack Auth
  console.log('\n2. Test de connexion à l\'API Stack Auth:');
  
  try {
    // Tenter une requête simple à l'API Stack Auth
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
    const serverKey = process.env.STACK_SECRET_SERVER_KEY;

    console.log(`   Project ID: ${projectId}`);
    console.log(`   Server Key: ${serverKey.substring(0, 10)}...`);

    // Note: Stack Auth n'a pas d'endpoint public pour tester la connexion
    // mais on peut vérifier le format des clés
    const projectIdValid = projectId && projectId.length === 36; // UUID format
    const serverKeyValid = serverKey && serverKey.startsWith('ssk_');
    const webhookSecretValid = process.env.STACK_WEBHOOK_SECRET && 
                              process.env.STACK_WEBHOOK_SECRET.startsWith('whsec_');

    console.log(`   Format Project ID: ${projectIdValid ? '✅ VALIDE' : '❌ INVALIDE'}`);
    console.log(`   Format Server Key: ${serverKeyValid ? '✅ VALIDE' : '❌ INVALIDE'}`);
    console.log(`   Format Webhook Secret: ${webhookSecretValid ? '✅ VALIDE' : '❌ INVALIDE'}`);

  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }

  // 3. Instructions de configuration
  console.log('\n3. Configuration du webhook dans Stack Auth:');
  console.log('   📋 Étapes à suivre:');
  console.log('   1. Allez sur https://app.stack-auth.com/');
  console.log(`   2. Sélectionnez le projet: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
  console.log('   3. Allez dans "Settings" > "Webhooks"');
  console.log('   4. Cliquez sur "Add Webhook"');
  console.log('   5. Configurez:');
  console.log('      - URL: http://localhost:3000/api/webhooks/stack');
  console.log('      - Events: user.created, user.updated, user.deleted');
  console.log('      - Le secret sera généré automatiquement');
  console.log('   6. Copiez le secret généré dans votre .env');

  // 4. Test de l'endpoint local
  console.log('\n4. Test de l\'endpoint webhook local:');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/stack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });

    if (response.status === 400) {
      console.log('   ✅ Endpoint accessible (erreur 400 normale sans en-têtes Svix)');
    } else {
      console.log(`   ⚠️  Réponse inattendue: ${response.status}`);
    }
  } catch (error) {
    console.log('   ❌ Endpoint non accessible');
    console.log('   💡 Démarrez votre serveur avec: npm run dev');
  }

  // 5. Prochaines étapes
  console.log('\n5. Prochaines étapes:');
  console.log('   1. Configurez le webhook dans Stack Auth (si pas encore fait)');
  console.log('   2. Testez l\'inscription avec: node test-real-signup-flow.js');
  console.log('   3. Vérifiez les logs de votre serveur Next.js');
}

checkStackAuthConfig();