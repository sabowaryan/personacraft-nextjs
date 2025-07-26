/**
 * Script de test pour tracer le flux complet des données culturelles
 * De la génération Gemini → enrichissement Qloo → sauvegarde localStorage
 */

const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000';
const TEST_BRIEF = {
  brief: "Créer 2 personas pour une startup de livraison de repas healthy destinée aux jeunes actifs parisiens de 25-35 ans."
};

// Fonction pour analyser les données culturelles d'un persona
function analyzeCulturalData(persona, source = '') {
  const prefix = source ? `[${source}] ` : '';
  
  if (!persona.culturalData) {
    console.log(`${prefix}❌ Aucune donnée culturelle pour ${persona.name}`);
    return { hasData: false, totalElements: 0, categories: 0 };
  }
  
  const categories = [
    'music', 'movies', 'tv', 'books', 'brands', 'restaurants',
    'travel', 'fashion', 'beauty', 'food', 'socialMedia'
  ];
  
  let totalElements = 0;
  let categoriesWithData = 0;
  
  console.log(`${prefix}🎭 Données culturelles pour ${persona.name}:`);
  
  categories.forEach(category => {
    const data = persona.culturalData[category];
    if (data && Array.isArray(data) && data.length > 0) {
      console.log(`${prefix}  ✅ ${category}: ${data.length} éléments (${data.slice(0, 2).join(', ')}${data.length > 2 ? '...' : ''})`);
      totalElements += data.length;
      categoriesWithData++;
    } else {
      console.log(`${prefix}  ❌ ${category}: ${data ? 'vide' : 'manquant'}`);
    }
  });
  
  console.log(`${prefix}📊 Total: ${totalElements} éléments dans ${categoriesWithData}/${categories.length} catégories\n`);
  
  return {
    hasData: totalElements > 0,
    totalElements,
    categories: categoriesWithData
  };
}

// Test du flux complet
async function testCompleteFlow() {
  console.log('🔄 TEST: Flux complet des données culturelles\n');
  
  try {
    // ÉTAPE 1: Test de l'API Gemini seule
    console.log('1️⃣ ÉTAPE 1: Génération Gemini');
    console.log('📤 Appel de l\'API Gemini...');
    
    const geminiResponse = await fetch(`${API_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_BRIEF)
    });
    
    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }
    
    const geminiData = await geminiResponse.json();
    console.log(`✅ Gemini: ${geminiData.personas?.length || 0} personas générées`);
    
    if (geminiData.personas && geminiData.personas.length > 0) {
      geminiData.personas.forEach(persona => {
        analyzeCulturalData(persona, 'GEMINI');
      });
    }
    
    // ÉTAPE 2: Test de l'enrichissement Qloo
    console.log('2️⃣ ÉTAPE 2: Enrichissement Qloo');
    console.log('📤 Appel de l\'API Qloo...');
    
    const qlooResponse = await fetch(`${API_URL}/api/qloo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personas: geminiData.personas })
    });
    
    let enrichedPersonas = geminiData.personas;
    
    if (qlooResponse.ok) {
      const qlooData = await qlooResponse.json();
      console.log(`✅ Qloo: ${qlooData.personas?.length || 0} personas enrichies`);
      enrichedPersonas = qlooData.personas;
      
      if (qlooData.personas && qlooData.personas.length > 0) {
        qlooData.personas.forEach(persona => {
          analyzeCulturalData(persona, 'QLOO');
        });
      }
    } else {
      console.log(`⚠️ Qloo: Erreur ${qlooResponse.status}, utilisation des données Gemini`);
    }
    
    // ÉTAPE 3: Test de l'API complète
    console.log('3️⃣ ÉTAPE 3: API complète de génération');
    console.log('📤 Appel de l\'API generate-personas...');
    
    const completeResponse = await fetch(`${API_URL}/api/generate-personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_BRIEF)
    });
    
    if (!completeResponse.ok) {
      throw new Error(`Generate API error: ${completeResponse.status}`);
    }
    
    const completeData = await completeResponse.json();
    console.log(`✅ API complète: ${completeData.personas?.length || 0} personas générées`);
    console.log(`📊 Sources: Gemini=${completeData.sources?.gemini}, Qloo=${completeData.sources?.qloo}`);
    
    if (completeData.personas && completeData.personas.length > 0) {
      console.log('\n🔍 ANALYSE FINALE:');
      completeData.personas.forEach((persona, index) => {
        const analysis = analyzeCulturalData(persona, 'FINAL');
        
        // Évaluation de la qualité
        if (analysis.totalElements >= 20 && analysis.categories >= 8) {
          console.log(`🎉 Persona ${index + 1}: EXCELLENT (${analysis.totalElements} éléments)`);
        } else if (analysis.totalElements >= 10 && analysis.categories >= 5) {
          console.log(`✅ Persona ${index + 1}: BON (${analysis.totalElements} éléments)`);
        } else if (analysis.totalElements > 0) {
          console.log(`⚠️ Persona ${index + 1}: INSUFFISANT (${analysis.totalElements} éléments)`);
        } else {
          console.log(`❌ Persona ${index + 1}: AUCUNE DONNÉE CULTURELLE`);
        }
      });
      
      // Comparaison avec les étapes précédentes
      console.log('\n📊 COMPARAISON DES ÉTAPES:');
      
      const geminiStats = geminiData.personas?.reduce((acc, p) => {
        const analysis = analyzeCulturalData(p);
        return { total: acc.total + analysis.totalElements, count: acc.count + 1 };
      }, { total: 0, count: 0 }) || { total: 0, count: 0 };
      
      const finalStats = completeData.personas.reduce((acc, p) => {
        const analysis = analyzeCulturalData(p);
        return { total: acc.total + analysis.totalElements, count: acc.count + 1 };
      }, { total: 0, count: 0 });
      
      console.log(`- Gemini seul: ${geminiStats.total} éléments culturels (moyenne: ${Math.round(geminiStats.total / geminiStats.count)} par persona)`);
      console.log(`- API complète: ${finalStats.total} éléments culturels (moyenne: ${Math.round(finalStats.total / finalStats.count)} par persona)`);
      console.log(`- Amélioration: +${finalStats.total - geminiStats.total} éléments (${Math.round(((finalStats.total - geminiStats.total) / geminiStats.total) * 100)}%)`);
      
      // Test de sauvegarde simulée
      console.log('\n4️⃣ ÉTAPE 4: Simulation de sauvegarde');
      
      // Simuler le processus de sauvegarde
      const simulatedLocalStorage = {
        data: {},
        setItem(key, value) { this.data[key] = value; },
        getItem(key) { return this.data[key] || null; }
      };
      
      // Simuler la sauvegarde
      simulatedLocalStorage.setItem('personacraft_personas', JSON.stringify(completeData.personas));
      
      // Vérifier la récupération
      const savedData = simulatedLocalStorage.getItem('personacraft_personas');
      if (savedData) {
        const parsedPersonas = JSON.parse(savedData);
        console.log(`✅ Sauvegarde simulée: ${parsedPersonas.length} personas`);
        
        parsedPersonas.forEach((persona, index) => {
          const analysis = analyzeCulturalData(persona, 'SAVED');
          if (analysis.hasData) {
            console.log(`✅ Persona ${index + 1} sauvegardée avec ${analysis.totalElements} éléments culturels`);
          } else {
            console.log(`❌ Persona ${index + 1} sauvegardée SANS données culturelles`);
          }
        });
      } else {
        console.log('❌ Échec de la sauvegarde simulée');
      }
    }
    
    console.log('\n🏁 Test du flux complet terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Suggestion: Démarrez le serveur avec "npm run dev"');
    }
  }
}

// Test de validation des données
async function testDataValidation() {
  console.log('\n🔍 TEST: Validation des données culturelles\n');
  
  // Créer un persona de test avec différents types de données culturelles
  const testPersonas = [
    {
      name: 'Test Complet',
      age: 28,
      occupation: 'Designer',
      location: 'Paris',
      culturalData: {
        music: ['Artist 1', 'Artist 2', 'Artist 3'],
        movies: ['Movie 1', 'Movie 2'],
        tv: ['Show 1', 'Show 2', 'Show 3'],
        books: ['Book 1'],
        brands: ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'],
        restaurants: ['Restaurant 1', 'Restaurant 2'],
        travel: ['Destination 1', 'Destination 2', 'Destination 3'],
        fashion: ['Fashion 1', 'Fashion 2'],
        beauty: ['Beauty 1', 'Beauty 2', 'Beauty 3'],
        food: ['Food 1', 'Food 2'],
        socialMedia: ['Instagram', 'LinkedIn', 'TikTok']
      }
    },
    {
      name: 'Test Partiel',
      age: 32,
      occupation: 'Manager',
      location: 'Lyon',
      culturalData: {
        music: ['Artist A'],
        movies: [],
        brands: ['Brand A', 'Brand B'],
        socialMedia: ['LinkedIn']
      }
    },
    {
      name: 'Test Vide',
      age: 25,
      occupation: 'Étudiant',
      location: 'Marseille',
      culturalData: {}
    },
    {
      name: 'Test Sans Données',
      age: 30,
      occupation: 'Consultant',
      location: 'Nice'
      // Pas de culturalData
    }
  ];
  
  testPersonas.forEach((persona, index) => {
    console.log(`🧪 Test persona ${index + 1}:`);
    analyzeCulturalData(persona, 'TEST');
  });
}

// Exécuter tous les tests
async function runAllTests() {
  await testCompleteFlow();
  await testDataValidation();
  console.log('\n🎯 CONCLUSION:');
  console.log('Si les données culturelles sont présentes dans les étapes Gemini et Qloo');
  console.log('mais manquent dans le localStorage, le problème est dans la sauvegarde côté client.');
  console.log('Si elles manquent dès l\'étape Qloo, le problème est dans l\'enrichissement.');
  console.log('Si elles manquent dès Gemini, le problème est dans la génération initiale.');
}

runAllTests();