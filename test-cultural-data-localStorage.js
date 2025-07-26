/**
 * Script de test pour vérifier si les données culturelles sont bien sauvegardées dans localStorage
 */

// Simuler un environnement de test avec localStorage
const localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Simuler window.localStorage
global.window = { localStorage };

// Importer les modules nécessaires
const { PersonaManager } = require('./src/lib/session.ts');

// Données de test avec données culturelles complètes
const testPersonaWithCulturalData = {
  id: 'test-persona-1',
  name: 'Marie Dubois',
  age: 28,
  occupation: 'Développeuse Frontend',
  location: 'Paris, France',
  demographics: {
    income: '45000-60000€',
    education: 'Master en Informatique',
    familyStatus: 'Célibataire'
  },
  psychographics: {
    personality: ['Créative', 'Analytique', 'Perfectionniste'],
    values: ['Innovation', 'Qualité', 'Apprentissage continu'],
    interests: ['Technologie', 'Design', 'Voyages'],
    lifestyle: 'Urbain actif'
  },
  culturalData: {
    music: ['Indie Pop', 'Electronic', 'Jazz moderne'],
    movies: ['Films indépendants', 'Documentaires', 'Comédies'],
    tv: ['Séries Netflix', 'Documentaires tech', 'Comédies'],
    books: ['Romans contemporains', 'Développement personnel', 'Biographies'],
    brands: ['Apple', 'Zara', 'Sephora', 'Airbnb'],
    restaurants: ['Restaurants bio', 'Cuisine fusion', 'Food trucks'],
    travel: ['Voyages éco-responsables', 'City breaks', 'Aventures outdoor'],
    fashion: ['Mode durable', 'Streetwear', 'Vintage'],
    beauty: ['Cosmétiques naturels', 'Skincare coréenne', 'Maquillage minimaliste'],
    food: ['Cuisine végétarienne', 'Superfoods', 'Cuisine locale'],
    socialMedia: ['Instagram', 'LinkedIn', 'TikTok', 'GitHub', 'Reddit'],
    podcasts: ['True Crime', 'Tech Talk', 'Développement personnel'],
    videoGames: ['Jeux indépendants', 'RPG', 'Jeux de stratégie'],
    influencers: ['Influenceurs lifestyle', 'Experts tech', 'Créateurs de contenu']
  },
  painPoints: ['Manque de temps', 'Pression des deadlines', 'Équilibre vie pro/perso'],
  goals: ['Évoluer vers un poste de lead', 'Améliorer ses compétences', 'Voyager plus'],
  marketingInsights: {
    preferredChannels: ['LinkedIn', 'Instagram', 'Email'],
    messagingTone: 'Professionnel mais accessible',
    buyingBehavior: 'Recherche approfondie avant achat'
  },
  qualityScore: 85,
  createdAt: new Date().toISOString()
};

console.log('🧪 TEST: Sauvegarde et récupération des données culturelles\n');

// Test 1: Sauvegarder un persona avec données culturelles
console.log('1️⃣ Test de sauvegarde...');
try {
  PersonaManager.addPersona(testPersonaWithCulturalData);
  console.log('✅ Persona sauvegardé avec succès');
} catch (error) {
  console.error('❌ Erreur lors de la sauvegarde:', error.message);
}

// Test 2: Récupérer les personas et vérifier les données culturelles
console.log('\n2️⃣ Test de récupération...');
try {
  const personas = PersonaManager.getPersonas();
  console.log(`✅ ${personas.length} persona(s) récupéré(s)`);
  
  if (personas.length > 0) {
    const persona = personas[0];
    console.log(`📋 Persona: ${persona.name}`);
    
    // Vérifier la présence des données culturelles
    if (persona.culturalData) {
      console.log('✅ Données culturelles présentes');
      
      // Vérifier chaque catégorie
      const categories = [
        'music', 'movies', 'tv', 'books', 'brands', 'restaurants',
        'travel', 'fashion', 'beauty', 'food', 'socialMedia',
        'podcasts', 'videoGames', 'influencers'
      ];
      
      console.log('\n📊 Détail des données culturelles:');
      categories.forEach(category => {
        const data = persona.culturalData[category];
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`  ✅ ${category}: ${data.length} éléments - ${data.slice(0, 2).join(', ')}${data.length > 2 ? '...' : ''}`);
        } else {
          console.log(`  ❌ ${category}: manquant ou vide`);
        }
      });
    } else {
      console.log('❌ Données culturelles manquantes');
    }
  }
} catch (error) {
  console.error('❌ Erreur lors de la récupération:', error.message);
}

// Test 3: Vérifier le contenu brut du localStorage
console.log('\n3️⃣ Test du localStorage brut...');
try {
  const rawData = localStorage.getItem('personacraft_personas');
  if (rawData) {
    const parsed = JSON.parse(rawData);
    console.log('✅ Données brutes récupérées');
    
    if (parsed.length > 0 && parsed[0].culturalData) {
      console.log('✅ Données culturelles présentes dans le localStorage');
      
      // Compter les éléments dans chaque catégorie
      const culturalData = parsed[0].culturalData;
      let totalElements = 0;
      Object.keys(culturalData).forEach(key => {
        if (Array.isArray(culturalData[key])) {
          totalElements += culturalData[key].length;
        }
      });
      
      console.log(`📊 Total d'éléments culturels: ${totalElements}`);
    } else {
      console.log('❌ Données culturelles manquantes dans le localStorage');
    }
  } else {
    console.log('❌ Aucune donnée dans le localStorage');
  }
} catch (error) {
  console.error('❌ Erreur lors de la lecture du localStorage:', error.message);
}

// Test 4: Simuler une génération complète
console.log('\n4️⃣ Test de génération complète simulée...');

// Simuler la réponse de l'API avec données culturelles enrichies
const simulatedApiResponse = {
  success: true,
  personas: [
    {
      ...testPersonaWithCulturalData,
      id: 'generated-persona-1',
      name: 'Sophie Martin',
      // Les données culturelles sont enrichies par Qloo
      culturalData: {
        music: ['Dua Lipa', 'The Weeknd', 'Billie Eilish'],
        movies: ['Parasite', 'La La Land', 'Inception'],
        tv: ['Stranger Things', 'The Crown', 'Black Mirror'],
        books: ['Atomic Habits', 'Sapiens', 'The Alchemist'],
        brands: ['Nike', 'Apple', 'Netflix', 'Spotify'],
        restaurants: ['Le Comptoir du Relais', 'Breizh Café', 'Pink Mamma'],
        travel: ['Tokyo', 'New York', 'Bali'],
        fashion: ['Zara', 'COS', 'Arket'],
        beauty: ['Glossier', 'Fenty Beauty', 'The Ordinary'],
        food: ['Avocado Toast', 'Poke Bowl', 'Matcha Latte'],
        socialMedia: ['Instagram', 'TikTok', 'LinkedIn', 'Pinterest'],
        podcasts: ['Serial', 'The Daily', 'How I Built This'],
        videoGames: ['Among Us', 'Animal Crossing', 'Valorant'],
        influencers: ['Emma Chamberlain', 'Casey Neistat', 'Marques Brownlee']
      }
    }
  ],
  timestamp: new Date().toISOString(),
  sources: {
    gemini: true,
    qloo: true
  }
};

// Simuler l'ajout du persona généré
try {
  const generatedPersona = simulatedApiResponse.personas[0];
  PersonaManager.addPersona(generatedPersona);
  console.log('✅ Persona généré ajouté avec succès');
  
  // Vérifier que les données culturelles sont bien sauvegardées
  const allPersonas = PersonaManager.getPersonas();
  const addedPersona = allPersonas.find(p => p.id === 'generated-persona-1');
  
  if (addedPersona && addedPersona.culturalData) {
    console.log('✅ Données culturelles du persona généré sauvegardées');
    
    // Vérifier quelques catégories spécifiques
    const musicCount = addedPersona.culturalData.music?.length || 0;
    const moviesCount = addedPersona.culturalData.movies?.length || 0;
    const brandsCount = addedPersona.culturalData.brands?.length || 0;
    
    console.log(`📊 Musique: ${musicCount} éléments`);
    console.log(`📊 Films: ${moviesCount} éléments`);
    console.log(`📊 Marques: ${brandsCount} éléments`);
    
    if (musicCount > 0 && moviesCount > 0 && brandsCount > 0) {
      console.log('🎉 SUCCÈS: Les données culturelles sont correctement sauvegardées !');
    } else {
      console.log('⚠️ ATTENTION: Certaines données culturelles sont manquantes');
    }
  } else {
    console.log('❌ ÉCHEC: Données culturelles manquantes après génération');
  }
} catch (error) {
  console.error('❌ Erreur lors du test de génération:', error.message);
}

console.log('\n🏁 Tests terminés');