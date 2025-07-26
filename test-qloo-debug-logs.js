/**
 * Script de test pour déboguer les logs Qloo lors de la génération de personas
 */

const testPersonas = [
  {
    name: "Marie Dubois",
    age: 28,
    occupation: "Développeuse web",
    location: "Paris",
    culturalData: {}
  }
];

async function testQlooWithLogs() {
  console.log('🔍 Test de débogage Qloo avec logs détaillés');
  console.log('=====================================\n');

  try {
    const response = await fetch('http://localhost:3000/api/qloo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personas: testPersonas
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('\n📊 RÉSULTAT FINAL REÇU PAR LE CLIENT:');
    console.log('=====================================');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testQlooWithLogs();