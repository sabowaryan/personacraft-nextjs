// Test pour vérifier si l'API retourne bien les données culturelles
const fetch = require('node-fetch');

async function testCulturalDataAPI() {
  console.log('=== TEST API DONNÉES CULTURELLES ===\n');
  
  const baseUrl = 'http://localhost:3000';
  const testBrief = 'Application mobile de fitness pour jeunes professionnels urbains';
  
  try {
    console.log('1. Test de l\'API Gemini seule:');
    const geminiResponse = await fetch(`${baseUrl}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brief: testBrief
      })
    });
    
    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      console.log('   ✅ API Gemini répond');
      console.log('   Nombre de personas:', geminiData.personas?.length || 0);
      
      if (geminiData.personas && geminiData.personas.length > 0) {
        const firstPersona = geminiData.personas[0];
        console.log('   Premier persona:', firstPersona.name);
        
        if (firstPersona.culturalData) {
          console.log('   ✅ culturalData présent dans la réponse Gemini');
          const culturalKeys = Object.keys(firstPersona.culturalData);
          culturalKeys.forEach(key => {
            const data = firstPersona.culturalData[key];
            if (Array.isArray(data) && data.length > 0) {
              console.log(`     - ${key}: ${data.length} éléments`);
            }
          });
        } else {
          console.log('   ❌ culturalData manquant dans la réponse Gemini');
        }
      }
    } else {
      console.log('   ❌ Erreur API Gemini:', geminiResponse.status);
    }
    
    console.log('\n2. Test de l\'API Qloo seule:');
    // Créer un persona de test pour Qloo
    const testPersona = {
      id: 'test-123',
      name: 'Test User',
      age: 28,
      occupation: 'Marketing Manager',
      location: 'Paris, France',
      psychographics: {
        interests: ['fitness', 'technology', 'travel']
      }
    };
    
    const qlooResponse = await fetch(`${baseUrl}/api/qloo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personas: [testPersona]
      })
    });
    
    if (qlooResponse.ok) {
      const qlooData = await qlooResponse.json();
      console.log('   ✅ API Qloo répond');
      console.log('   Nombre de personas enrichis:', qlooData.personas?.length || 0);
      
      if (qlooData.personas && qlooData.personas.length > 0) {
        const enrichedPersona = qlooData.personas[0];
        console.log('   Persona enrichi:', enrichedPersona.name);
        
        if (enrichedPersona.culturalData) {
          console.log('   ✅ culturalData ajouté par Qloo');
          const culturalKeys = Object.keys(enrichedPersona.culturalData);
          culturalKeys.forEach(key => {
            const data = enrichedPersona.culturalData[key];
            if (Array.isArray(data) && data.length > 0) {
              console.log(`     - ${key}: ${data.length} éléments - [${data.slice(0, 2).join(', ')}...]`);
            }
          });
        } else {
          console.log('   ❌ culturalData manquant après enrichissement Qloo');
        }
      }
    } else {
      console.log('   ❌ Erreur API Qloo:', qlooResponse.status);
      const errorText = await qlooResponse.text();
      console.log('   Détails:', errorText.substring(0, 200));
    }
    
    console.log('\n3. Test de l\'API complète generate-personas:');
    const generateResponse = await fetch(`${baseUrl}/api/generate-personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brief: testBrief
      })
    });
    
    if (generateResponse.ok) {
      const generateData = await generateResponse.json();
      console.log('   ✅ API generate-personas répond');
      console.log('   Nombre de personas finaux:', generateData.personas?.length || 0);
      console.log('   Sources utilisées:', JSON.stringify(generateData.sources));
      
      if (generateData.personas && generateData.personas.length > 0) {
        const finalPersona = generateData.personas[0];
        console.log('   Persona final:', finalPersona.name);
        
        if (finalPersona.culturalData) {
          console.log('   ✅ culturalData présent dans le résultat final');
          const culturalKeys = Object.keys(finalPersona.culturalData);
          let totalItems = 0;
          
          culturalKeys.forEach(key => {
            const data = finalPersona.culturalData[key];
            if (Array.isArray(data) && data.length > 0) {
              console.log(`     - ${key}: ${data.length} éléments`);
              totalItems += data.length;
            }
          });
          
          console.log(`   📊 Total d'éléments culturels: ${totalItems}`);
          
          if (totalItems === 0) {
            console.log('   ❌ PROBLÈME: Aucune donnée culturelle dans le résultat final !');
          }
          
        } else {
          console.log('   ❌ culturalData manquant dans le résultat final');
        }
        
        // Afficher la structure complète pour debug
        console.log('\n   Structure du persona final:');
        console.log('   Clés:', Object.keys(finalPersona).join(', '));
        
      }
    } else {
      console.log('   ❌ Erreur API generate-personas:', generateResponse.status);
      const errorText = await generateResponse.text();
      console.log('   Détails:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.log('❌ Erreur lors du test:', error.message);
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log('Ce test vérifie si les données culturelles sont:');
  console.log('1. Générées par Gemini');
  console.log('2. Enrichies par Qloo');
  console.log('3. Présentes dans la réponse finale');
  console.log('\nSi les données sont présentes dans l\'API mais pas dans l\'interface,');
  console.log('le problème est dans la sauvegarde ou l\'affichage côté client.');
}

// Exécuter le test
if (require.main === module) {
  testCulturalDataAPI().catch(console.error);
}

module.exports = { testCulturalDataAPI };