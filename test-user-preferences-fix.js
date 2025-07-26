// Test pour identifier le problème exact avec les données culturelles
const fetch = require('node-fetch');

async function testUserPreferencesFix() {
  console.log('=== DIAGNOSTIC COMPLET DONNÉES CULTURELLES ===\n');
  
  const baseUrl = 'http://localhost:3000';
  const testBrief = 'Application de fitness pour jeunes professionnels parisiens';
  
  try {
    console.log('🔍 Étape 1: Test de l\'API Qloo directement');
    
    // Test avec un persona simple
    const testPersona = {
      id: 'test-persona-123',
      name: 'Marie Dubois',
      age: 28,
      occupation: 'Marketing Manager',
      location: 'Paris, France',
      psychographics: {
        interests: ['fitness', 'wellness', 'technology', 'travel'],
        values: ['health', 'productivity', 'work-life balance'],
        lifestyle: 'Urban professional'
      }
    };
    
    console.log('   Persona de test:', testPersona.name);
    console.log('   Intérêts:', testPersona.psychographics.interests.join(', '));
    
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
      console.log('   ✅ API Qloo répond correctement');
      
      if (qlooData.personas && qlooData.personas.length > 0) {
        const enrichedPersona = qlooData.personas[0];
        console.log('   ✅ Persona enrichi reçu');
        
        // Analyser les données culturelles en détail
        if (enrichedPersona.culturalData) {
          console.log('   ✅ Objet culturalData présent');
          
          const categories = [
            'music', 'movies', 'tv', 'books', 'brands', 
            'restaurants', 'travel', 'fashion', 'beauty', 'food', 'socialMedia'
          ];
          
          let totalItems = 0;
          let populatedCategories = 0;
          
          categories.forEach(category => {
            const data = enrichedPersona.culturalData[category];
            if (Array.isArray(data) && data.length > 0) {
              console.log(`     ✅ ${category}: ${data.length} éléments - [${data.slice(0, 3).join(', ')}${data.length > 3 ? '...' : ''}]`);
              totalItems += data.length;
              populatedCategories++;
            } else {
              console.log(`     ⚠️  ${category}: vide ou manquant`);
            }
          });
          
          console.log(`   📊 Résumé: ${populatedCategories}/${categories.length} catégories remplies, ${totalItems} éléments au total`);
          
          if (totalItems === 0) {
            console.log('   ❌ PROBLÈME CRITIQUE: Aucune donnée culturelle générée par Qloo !');
          }
          
        } else {
          console.log('   ❌ PROBLÈME: Objet culturalData manquant dans la réponse Qloo');
        }
        
        // Sauvegarder le résultat pour inspection
        console.log('\n   📝 Structure complète du persona enrichi:');
        console.log('   Clés principales:', Object.keys(enrichedPersona).join(', '));
        
      } else {
        console.log('   ❌ Aucun persona dans la réponse Qloo');
      }
      
    } else {
      console.log('   ❌ Erreur API Qloo:', qlooResponse.status);
      const errorText = await qlooResponse.text();
      console.log('   Détails erreur:', errorText.substring(0, 300));
    }
    
    console.log('\n🔍 Étape 2: Test de l\'API complète generate-personas');
    
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
      console.log('   Sources utilisées:', JSON.stringify(generateData.sources));
      
      if (generateData.personas && generateData.personas.length > 0) {
        const finalPersona = generateData.personas[0];
        console.log('   ✅ Persona final reçu:', finalPersona.name);
        
        // Vérifier les données culturelles dans le résultat final
        if (finalPersona.culturalData) {
          console.log('   ✅ culturalData présent dans le résultat final');
          
          const categories = Object.keys(finalPersona.culturalData);
          let finalTotalItems = 0;
          let finalPopulatedCategories = 0;
          
          categories.forEach(category => {
            const data = finalPersona.culturalData[category];
            if (Array.isArray(data) && data.length > 0) {
              console.log(`     ✅ ${category}: ${data.length} éléments`);
              finalTotalItems += data.length;
              finalPopulatedCategories++;
            }
          });
          
          console.log(`   📊 Résultat final: ${finalPopulatedCategories}/${categories.length} catégories, ${finalTotalItems} éléments`);
          
          if (finalTotalItems === 0) {
            console.log('   ❌ PROBLÈME: Données culturelles perdues dans le pipeline !');
          } else {
            console.log('   ✅ Données culturelles préservées dans le pipeline');
          }
          
        } else {
          console.log('   ❌ culturalData manquant dans le résultat final');
        }
        
      }
    } else {
      console.log('   ❌ Erreur API generate-personas:', generateResponse.status);
    }
    
    console.log('\n🔍 Étape 3: Simulation de sauvegarde localStorage');
    
    // Simuler le processus de sauvegarde comme dans l'application
    const mockPersonas = [];
    
    // Simuler l'ajout d'un persona avec données culturelles
    const personaWithCulturalData = {
      id: 'test-123',
      name: 'Test User',
      age: 30,
      occupation: 'Developer',
      location: 'Paris',
      culturalData: {
        music: ['Pop', 'Rock', 'Jazz'],
        movies: ['Inception', 'Matrix', 'Interstellar'],
        brands: ['Apple', 'Nike', 'Spotify'],
        socialMedia: ['Instagram', 'LinkedIn', 'Twitter']
      }
    };
    
    // Simuler validateAndCleanPersona
    const defaultCulturalData = {
      music: [],
      movies: [],
      tv: [],
      books: [],
      brands: [],
      restaurants: [],
      travel: [],
      fashion: [],
      beauty: [],
      food: [],
      socialMedia: []
    };
    
    const cleanedPersona = {
      ...personaWithCulturalData,
      culturalData: {
        ...defaultCulturalData,
        ...personaWithCulturalData.culturalData
      }
    };
    
    mockPersonas.push(cleanedPersona);
    
    // Simuler la sérialisation/désérialisation
    const serialized = JSON.stringify(mockPersonas);
    const deserialized = JSON.parse(serialized);
    const retrievedPersona = deserialized[0];
    
    console.log('   ✅ Simulation de sauvegarde réussie');
    console.log('   Données culturelles après sauvegarde:');
    
    Object.keys(retrievedPersona.culturalData).forEach(key => {
      const data = retrievedPersona.culturalData[key];
      if (Array.isArray(data) && data.length > 0) {
        console.log(`     ✅ ${key}: ${data.length} éléments`);
      }
    });
    
  } catch (error) {
    console.log('❌ Erreur lors du diagnostic:', error.message);
    console.log('Stack:', error.stack);
  }
  
  console.log('\n=== PLAN D\'ACTION ===');
  console.log('1. Si Qloo ne génère pas de données → Vérifier la configuration Qloo');
  console.log('2. Si les données sont perdues dans le pipeline → Vérifier validateAndCleanPersona');
  console.log('3. Si les données sont sauvegardées mais pas affichées → Vérifier l\'interface');
  console.log('4. Utiliser debug-localStorage-personas.js dans le navigateur pour vérifier le localStorage');
}

// Exécuter le diagnostic
if (require.main === module) {
  testUserPreferencesFix().catch(console.error);
}

module.exports = { testUserPreferencesFix };