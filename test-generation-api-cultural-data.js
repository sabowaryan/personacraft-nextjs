/**
 * Script de test pour vérifier que l'API de génération retourne bien les données culturelles
 */

const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000';
const TEST_BRIEF = {
  brief: "Créer des personas pour une application de fitness destinée aux jeunes professionnels urbains de 25-35 ans qui cherchent à maintenir un mode de vie sain malgré un emploi du temps chargé."
};

async function testGenerationAPI() {
  console.log('🧪 TEST: API de génération des personas avec données culturelles\n');
  
  try {
    console.log('📤 Envoi de la requête à l\'API...');
    console.log('Brief:', TEST_BRIEF.brief);
    
    const response = await fetch(`${API_URL}/api/generate-personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_BRIEF)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Réponse reçue avec succès');
    
    // Analyser la réponse
    console.log('\n📊 Analyse de la réponse:');
    console.log(`- Succès: ${data.success}`);
    console.log(`- Nombre de personas: ${data.personas?.length || 0}`);
    console.log(`- Sources: Gemini=${data.sources?.gemini}, Qloo=${data.sources?.qloo}`);
    console.log(`- Timestamp: ${data.timestamp}`);
    
    if (data.personas && data.personas.length > 0) {
      console.log('\n🔍 Analyse des personas générées:');
      
      data.personas.forEach((persona, index) => {
        console.log(`\n👤 Persona ${index + 1}: ${persona.name}`);
        console.log(`   - Âge: ${persona.age}`);
        console.log(`   - Profession: ${persona.occupation}`);
        console.log(`   - Localisation: ${persona.location}`);
        
        // Vérifier les données culturelles
        if (persona.culturalData) {
          console.log('   ✅ Données culturelles présentes:');
          
          const categories = [
            'music', 'movies', 'tv', 'books', 'brands', 'restaurants',
            'travel', 'fashion', 'beauty', 'food', 'socialMedia'
          ];
          
          let totalCulturalElements = 0;
          let categoriesWithData = 0;
          
          categories.forEach(category => {
            const data = persona.culturalData[category];
            if (data && Array.isArray(data) && data.length > 0) {
              console.log(`     - ${category}: ${data.length} éléments (${data.slice(0, 2).join(', ')}${data.length > 2 ? '...' : ''})`);
              totalCulturalElements += data.length;
              categoriesWithData++;
            } else {
              console.log(`     - ${category}: ❌ manquant ou vide`);
            }
          });
          
          console.log(`   📊 Total: ${totalCulturalElements} éléments culturels dans ${categoriesWithData}/${categories.length} catégories`);
          
          // Évaluer la qualité des données culturelles
          if (categoriesWithData >= 8 && totalCulturalElements >= 20) {
            console.log('   🎉 EXCELLENT: Données culturelles riches et complètes');
          } else if (categoriesWithData >= 5 && totalCulturalElements >= 10) {
            console.log('   ✅ BON: Données culturelles suffisantes');
          } else if (categoriesWithData >= 3) {
            console.log('   ⚠️ MOYEN: Données culturelles partielles');
          } else {
            console.log('   ❌ FAIBLE: Données culturelles insuffisantes');
          }
        } else {
          console.log('   ❌ Aucune donnée culturelle');
        }
        
        // Vérifier d'autres champs importants
        console.log(`   - Points de douleur: ${persona.painPoints?.length || 0} éléments`);
        console.log(`   - Objectifs: ${persona.goals?.length || 0} éléments`);
        console.log(`   - Score qualité: ${persona.qualityScore || 'N/A'}`);
      });
      
      // Résumé global
      const totalPersonas = data.personas.length;
      const personasWithCulturalData = data.personas.filter(p => p.culturalData && Object.keys(p.culturalData).length > 0).length;
      
      console.log('\n📈 RÉSUMÉ GLOBAL:');
      console.log(`- Personas générées: ${totalPersonas}`);
      console.log(`- Personas avec données culturelles: ${personasWithCulturalData}/${totalPersonas}`);
      
      if (personasWithCulturalData === totalPersonas) {
        console.log('🎉 SUCCÈS: Toutes les personas ont des données culturelles !');
      } else if (personasWithCulturalData > 0) {
        console.log('⚠️ PARTIEL: Certaines personas manquent de données culturelles');
      } else {
        console.log('❌ ÉCHEC: Aucune persona n\'a de données culturelles');
      }
      
    } else {
      console.log('❌ Aucune persona générée');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Suggestion: Assurez-vous que le serveur Next.js est démarré (npm run dev)');
    }
  }
}

// Test des APIs individuelles
async function testIndividualAPIs() {
  console.log('\n🔧 TEST: APIs individuelles\n');
  
  // Test Gemini API
  try {
    console.log('📤 Test de l\'API Gemini...');
    const geminiResponse = await fetch(`${API_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_BRIEF)
    });
    
    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      console.log(`✅ Gemini: ${geminiData.personas?.length || 0} personas générées`);
    } else {
      console.log(`❌ Gemini: Erreur ${geminiResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Gemini: ${error.message}`);
  }
  
  // Test Qloo API avec des personas de test
  try {
    console.log('📤 Test de l\'API Qloo...');
    const testPersonas = [
      {
        name: 'Test User',
        age: 28,
        occupation: 'Développeur',
        location: 'Paris'
      }
    ];
    
    const qlooResponse = await fetch(`${API_URL}/api/qloo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personas: testPersonas })
    });
    
    if (qlooResponse.ok) {
      const qlooData = await qlooResponse.json();
      console.log(`✅ Qloo: ${qlooData.personas?.length || 0} personas enrichies`);
      
      if (qlooData.personas?.[0]?.culturalData) {
        const culturalCategories = Object.keys(qlooData.personas[0].culturalData).length;
        console.log(`   - ${culturalCategories} catégories culturelles ajoutées`);
      }
    } else {
      console.log(`❌ Qloo: Erreur ${qlooResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Qloo: ${error.message}`);
  }
}

// Exécuter les tests
async function runAllTests() {
  await testGenerationAPI();
  await testIndividualAPIs();
  console.log('\n🏁 Tous les tests terminés');
}

runAllTests();