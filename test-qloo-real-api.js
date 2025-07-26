/**
 * Test direct de l'API Qloo pour voir les données brutes
 */

const QLOO_API_KEY = '32_1GLe_0t05IQmBI7UqVYh2A0pT9oeOgQZtsuzL594';
const QLOO_BASE_URL = 'https://hackathon.api.qloo.com';

async function testDirectQlooCall() {
  console.log('🔍 Test direct de l\'API Qloo');
  console.log('============================\n');

  const testCases = [
    {
      name: 'Artistes pour millennials',
      url: `${QLOO_BASE_URL}/v2/insights?filter.type=urn:entity:artist&signal.demographics.audiences=millennials&take=5`
    },
    {
      name: 'Films pour millennials',
      url: `${QLOO_BASE_URL}/v2/insights?filter.type=urn:entity:movie&signal.demographics.audiences=millennials&take=5`
    },
    {
      name: 'Marques pour millennials',
      url: `${QLOO_BASE_URL}/v2/insights?filter.type=urn:entity:brand&signal.demographics.audiences=millennials&take=5`
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📊 ${testCase.name}`);
    console.log('─'.repeat(40));
    console.log(`URL: ${testCase.url}`);

    try {
      const response = await fetch(testCase.url, {
        method: 'GET',
        headers: {
          'X-API-Key': QLOO_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Succès !');
        
        if (data.results && data.results.entities) {
          console.log(`Nombre d'entités: ${data.results.entities.length}`);
          console.log('Échantillon des noms:');
          data.results.entities.slice(0, 3).forEach((entity, index) => {
            console.log(`  ${index + 1}. ${entity.name || entity.title || 'Sans nom'}`);
          });
        } else {
          console.log('Structure de données inattendue:', Object.keys(data));
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Échec');
        console.log('Erreur:', errorText.substring(0, 200));
      }
    } catch (error) {
      console.log('❌ Erreur réseau:', error.message);
    }
  }
}

// Exécuter le test
testDirectQlooCall();