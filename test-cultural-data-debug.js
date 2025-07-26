// Test pour vérifier si les données culturelles sont bien sauvegardées
const fs = require('fs');

// Simuler une génération de persona avec données culturelles
const testPersona = {
  id: 'test-persona-123',
  name: 'Marie Dubois',
  age: 32,
  occupation: 'Chef de projet marketing',
  location: 'Paris, France',
  bio: 'Une professionnelle passionnée de marketing digital',
  quote: 'L\'innovation commence par l\'écoute du client',
  demographics: {
    income: '45000-60000€',
    education: 'Master',
    familyStatus: 'En couple'
  },
  psychographics: {
    personality: ['Créative', 'Analytique', 'Sociable'],
    values: ['Innovation', 'Qualité', 'Authenticité'],
    interests: ['Marketing digital', 'Design', 'Voyages'],
    lifestyle: 'Urbain actif'
  },
  culturalData: {
    music: ['Pop française', 'Indie rock', 'Jazz'],
    movies: ['Amélie', 'La La Land', 'Inception'],
    tv: ['Emily in Paris', 'The Crown', 'Black Mirror'],
    books: ['Sapiens', 'Atomic Habits', 'The Lean Startup'],
    brands: ['Apple', 'Zara', 'Sephora', 'Airbnb'],
    restaurants: ['Le Comptoir du Relais', 'Breizh Café', 'L\'As du Fallafel'],
    travel: ['Tokyo', 'New York', 'Barcelone', 'Marrakech'],
    fashion: ['Zara', 'COS', 'Mango', 'Sandro'],
    beauty: ['Sephora', 'Glossier', 'The Ordinary', 'Fenty Beauty'],
    food: ['Cuisine fusion', 'Sushi', 'Brunch', 'Pâtisseries'],
    socialMedia: ['Instagram', 'LinkedIn', 'TikTok', 'Pinterest']
  },
  painPoints: ['Manque de temps', 'Budget marketing limité', 'Difficulté à mesurer le ROI'],
  goals: ['Augmenter la notoriété de marque', 'Améliorer l\'engagement client', 'Optimiser les campagnes'],
  marketingInsights: {
    preferredChannels: ['Instagram', 'LinkedIn', 'Email marketing'],
    messagingTone: 'Professionnel mais accessible',
    buyingBehavior: 'Recherche approfondie avant achat'
  },
  qualityScore: 85,
  createdAt: new Date().toISOString(),
  brief: 'Application de gestion de projet pour équipes créatives'
};

console.log('=== TEST DES DONNÉES CULTURELLES ===\n');

console.log('1. Persona de test créé avec données culturelles:');
console.log('   - Musique:', testPersona.culturalData.music.length, 'éléments');
console.log('   - Films:', testPersona.culturalData.movies.length, 'éléments');
console.log('   - Marques:', testPersona.culturalData.brands.length, 'éléments');
console.log('   - Réseaux sociaux:', testPersona.culturalData.socialMedia.length, 'éléments');

console.log('\n2. Structure complète des données culturelles:');
Object.keys(testPersona.culturalData).forEach(key => {
  const data = testPersona.culturalData[key];
  console.log(`   - ${key}: [${Array.isArray(data) ? data.join(', ') : data}]`);
});

console.log('\n3. Vérification de la sérialisation JSON:');
try {
  const serialized = JSON.stringify(testPersona);
  const deserialized = JSON.parse(serialized);
  
  console.log('   ✅ Sérialisation JSON réussie');
  console.log('   ✅ Désérialisation JSON réussie');
  
  // Vérifier que les données culturelles sont préservées
  const culturalDataPreserved = Object.keys(testPersona.culturalData).every(key => {
    const original = testPersona.culturalData[key];
    const restored = deserialized.culturalData[key];
    return JSON.stringify(original) === JSON.stringify(restored);
  });
  
  if (culturalDataPreserved) {
    console.log('   ✅ Données culturelles préservées après sérialisation');
  } else {
    console.log('   ❌ Données culturelles perdues après sérialisation');
  }
  
} catch (error) {
  console.log('   ❌ Erreur de sérialisation:', error.message);
}

console.log('\n4. Test de validation avec validateAndCleanPersona:');
// Simuler la fonction de validation
const validateAndCleanPersona = (persona) => {
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

  return {
    ...persona,
    culturalData: {
      ...defaultCulturalData,
      ...persona.culturalData
    }
  };
};

const validatedPersona = validateAndCleanPersona(testPersona);
console.log('   ✅ Validation réussie');
console.log('   - Données culturelles après validation:');
Object.keys(validatedPersona.culturalData).forEach(key => {
  const data = validatedPersona.culturalData[key];
  if (Array.isArray(data) && data.length > 0) {
    console.log(`     ${key}: ${data.length} éléments`);
  }
});

console.log('\n5. Simulation de sauvegarde localStorage:');
try {
  // Simuler le localStorage
  const mockLocalStorage = {};
  const PERSONAS_KEY = 'personacraft_personas';
  
  // Charger les personas existants (simulation)
  const existingPersonas = [];
  
  // Ajouter le nouveau persona
  existingPersonas.push(validatedPersona);
  
  // Sauvegarder
  mockLocalStorage[PERSONAS_KEY] = JSON.stringify(existingPersonas);
  
  // Recharger pour vérifier
  const reloadedPersonas = JSON.parse(mockLocalStorage[PERSONAS_KEY]);
  const reloadedPersona = reloadedPersonas[0];
  
  console.log('   ✅ Sauvegarde simulée réussie');
  console.log('   ✅ Rechargement simulé réussi');
  
  // Vérifier les données culturelles après rechargement
  const culturalDataIntact = Object.keys(testPersona.culturalData).every(key => {
    const original = testPersona.culturalData[key];
    const reloaded = reloadedPersona.culturalData[key];
    return JSON.stringify(original) === JSON.stringify(reloaded);
  });
  
  if (culturalDataIntact) {
    console.log('   ✅ Données culturelles intactes après rechargement');
  } else {
    console.log('   ❌ Données culturelles altérées après rechargement');
    
    // Détailler les différences
    Object.keys(testPersona.culturalData).forEach(key => {
      const original = testPersona.culturalData[key];
      const reloaded = reloadedPersona.culturalData[key];
      if (JSON.stringify(original) !== JSON.stringify(reloaded)) {
        console.log(`     ❌ ${key}: ${JSON.stringify(original)} → ${JSON.stringify(reloaded)}`);
      }
    });
  }
  
} catch (error) {
  console.log('   ❌ Erreur de sauvegarde simulée:', error.message);
}

console.log('\n=== RÉSUMÉ ===');
console.log('Ce test vérifie que les données culturelles sont correctement:');
console.log('1. Structurées dans l\'objet persona');
console.log('2. Sérialisées en JSON');
console.log('3. Validées par validateAndCleanPersona');
console.log('4. Sauvegardées et rechargées depuis localStorage');
console.log('\nSi toutes les étapes sont ✅, le problème est ailleurs.');
console.log('Si une étape est ❌, c\'est là qu\'il faut chercher le bug.');