/**
 * Guide pour trouver l'ID utilisateur Stack Auth
 */

require('dotenv').config();

async function findStackUserId() {
  console.log('🔍 Comment trouver l\'ID de votre utilisateur Stack Auth\n');

  console.log('1. Via le Dashboard Stack Auth:');
  console.log('   a) Allez sur https://app.stack-auth.com/');
  console.log(`   b) Sélectionnez votre projet: ${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}`);
  console.log('   c) Cliquez sur "Users" dans le menu de gauche');
  console.log('   d) Trouvez votre utilisateur récent');
  console.log('   e) Cliquez dessus pour voir les détails');
  console.log('   f) Copiez l\'ID (format UUID)\n');

  console.log('2. Via la console Neon (alternative):');
  console.log('   a) Allez sur https://console.neon.tech/');
  console.log('   b) Sélectionnez votre projet');
  console.log('   c) Allez dans "SQL Editor"');
  console.log('   d) Exécutez cette requête:');
  console.log('      SELECT id, email, display_name, created_at_millis');
  console.log('      FROM stack_users');
  console.log('      ORDER BY created_at_millis DESC');
  console.log('      LIMIT 5;');
  console.log('   e) L\'utilisateur le plus récent sera en haut\n');

  console.log('3. Format attendu:');
  console.log('   ✅ ID: format UUID (ex: 123e4567-e89b-12d3-a456-426614174000)');
  console.log('   ✅ Email: votre email d\'inscription');
  console.log('   ✅ Nom: nom affiché (optionnel)\n');

  console.log('4. Une fois que vous avez ces informations:');
  console.log('   Exécutez: node sync-stack-users.js');
  console.log('   Et entrez les informations demandées\n');

  console.log('💡 Astuce: Gardez les deux onglets ouverts (Stack Auth + ce terminal)');
}

findStackUserId();