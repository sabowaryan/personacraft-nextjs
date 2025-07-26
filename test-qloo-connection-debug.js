/**
 * Script pour tester la connexion Qloo et voir les détails de l'API
 */

async function testQlooConnection() {
  console.log('🔍 Test de connexion Qloo');
  console.log('========================\n');

  try {
    const response = await fetch('http://localhost:3000/api/qloo', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('📊 STATUT DE LA CONNEXION QLOO:');
    console.log('===============================');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error.message);
  }
}

// Exécuter le test
testQlooConnection();