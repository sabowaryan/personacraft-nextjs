/**
 * Test de validation de la correction du bug des données culturelles
 */

// Import de la fonction corrigée
const { validateAndCleanPersona } = require('./src/lib/persona-utils.ts');

console.log('🧪 TEST: Validation de la correction des données culturelles\n');

// Test avec un persona enrichi par Qloo (simulation)
const personaWithQlooData = {
  id: 'test-1',
  name: 'Persona Test',
  age: 30,
  occupation: 'Designer',
  location: 'Paris',
  bio: 'Test bio',
  quote: 'Test quote',
  culturalData: {
    // Données de base
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
    socialMedia: ['Instagram', 'LinkedIn', 'TikTok'],
    
    // Données supplémentaires que Qloo pourrait ajouter
    podcasts: ['Podcast 1', 'Podcast 2'],
    videoGames: ['Game 1', 'Game 2', 'Game 3'],
    influencers: ['Influencer 1'],
    sports: ['Football', 'Tennis'],
    technology: ['iPhone', 'MacBook'],
    automotive: ['Tesla', 'BMW']
  },
  painPoints: ['Point 1', 'Point 2'],
  goals: ['Goal 1', 'Goal 2'],
  psychographics: {
    personality: ['Créatif', 'Analytique'],
    values: ['Innovation', 'Qualité'],
    interests: ['Design', 'Technologie'],
    lifestyle: 'Urbain moderne'
  },
  demographics: {
    income: '50-70k€',
    education: 'Master',
    familyStatus: 'Célibataire'
  },
  marketingInsights: {
    preferredChannels: ['Instagram', 'Email'],
    messagingTone: 'Moderne et créatif',
    buyingBehavior: 'Recherche approfondie'
  }
};

console.log('📥 AVANT validation:');
console.log(`   Catégories culturelles: ${Object.keys(personaWithQlooData.culturalData).length}`);
console.log(`   Total éléments: ${Object.values(personaWithQlooData.culturalData).flat().length}`);

// Test de la fonction corrigée
const validatedPersona = validateAndCleanPersona(personaWithQlooData);

console.log('\n📤 APRÈS validation:');
console.log(`   Catégories culturelles: ${Object.keys(validatedPersona.culturalData).length}`);
console.log(`   Total éléments: ${Object.values(validatedPersona.culturalData).flat().length}`);

// Vérification détaillée
console.log('\n🔍 DÉTAIL des catégories préservées:');
Object.entries(validatedPersona.culturalData).forEach(([category, items]) => {
  if (Array.isArray(items) && items.length > 0) {
    console.log(`   ✅ ${category}: ${items.length} éléments (${items.slice(0, 2).join(', ')}${items.length > 2 ? '...' : ''})`);
  } else if (Array.isArray(items)) {
    console.log(`   ❌ ${category}: vide`);
  } else {
    console.log(`   ⚠️  ${category}: non-array (${typeof items})`);
  }
});

// Test des catégories spéciales ajoutées par Qloo
const specialCategories = ['podcasts', 'videoGames', 'influencers', 'sports', 'technology', 'automotive'];
console.log('\n🎯 CATÉGORIES SPÉCIALES (ajoutées par Qloo):');
specialCategories.forEach(category => {
  const items = validatedPersona.culturalData[category];
  if (items && items.length > 0) {
    console.log(`   ✅ ${category}: ${items.length} éléments préservés`);
  } else {
    console.log(`   ❌ ${category}: perdue`);
  }
});

// Calcul du score de qualité
console.log(`\n📊 Score de qualité: ${validatedPersona.qualityScore || 'Non calculé'}`);

console.log('\n🎉 RÉSULTAT:');
const originalCount = Object.values(personaWithQlooData.culturalData).flat().length;
const validatedCount = Object.values(validatedPersona.culturalData).flat().length;

if (validatedCount >= originalCount) {
  console.log('✅ SUCCÈS: Toutes les données culturelles ont été préservées !');
} else {
  console.log(`❌ ÉCHEC: ${originalCount - validatedCount} éléments perdus`);
}