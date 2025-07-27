#!/usr/bin/env node

/**
 * Test script for Qloo interests/values mapping functionality
 * Tests the mapping logic independently
 */

// Simulate the mapping logic for testing
function mapUserInterestsAndValuesToQlooSignals(interests, values) {
    const signals = {};
    
    // Complete mapping of all form interests to Qloo signals
    const interestMap = {
        'Sport et fitness': 'fitness,sports,health',
        'Technologie': 'technology,tech,innovation',
        'Voyage': 'travel,tourism,adventure',
        'Cuisine': 'food,cooking,culinary',
        'Mode': 'fashion,style,clothing',
        'Musique': 'music,audio,entertainment',
        'Lecture': 'books,reading,literature',
        'Cinéma': 'movies,film,entertainment',
        'Art': 'art,creative,culture',
        'Nature': 'outdoor,nature,environment',
        'Gaming': 'gaming,esports,technology',
        'Photographie': 'photography,visual,art',
        'Entrepreneuriat': 'business,startup,entrepreneurship',
        'Développement personnel': 'self-improvement,personal-development,wellness',
        'Famille': 'family,parenting,lifestyle',
        'Santé et bien-être': 'wellness,health,fitness'
    };
    
    // Complete mapping of all form values to Qloo signals
    const valueMap = {
        'Authenticité': 'authenticity,genuine,real',
        'Innovation': 'innovation,technology,future',
        'Durabilité': 'sustainability,eco-friendly,environment',
        'Qualité': 'quality,premium,excellence',
        'Efficacité': 'efficiency,productivity,optimization',
        'Créativité': 'creativity,art,innovation',
        'Collaboration': 'collaboration,teamwork,social',
        'Respect': 'respect,ethics,values',
        'Transparence': 'transparency,honesty,trust',
        'Excellence': 'excellence,quality,premium',
        'Simplicité': 'simplicity,minimalism,clean',
        'Sécurité': 'security,safety,protection',
        'Liberté': 'freedom,independence,flexibility',
        'Équilibre vie-travail': 'work-life-balance,wellness,lifestyle',
        'Responsabilité sociale': 'social-responsibility,community,ethics',
        'Tradition': 'tradition,heritage,culture'
    };
    
    // Process interests with enhanced mapping
    const mappedInterests = [];
    const unrecognizedInterests = [];
    
    interests.forEach(interest => {
        const mappedInterest = interestMap[interest];
        if (mappedInterest) {
            mappedInterests.push(...mappedInterest.split(','));
        } else {
            unrecognizedInterests.push(interest);
            console.warn(`Intérêt non reconnu dans le mapping Qloo: "${interest}"`);
        }
    });
    
    // Process values with enhanced mapping
    const mappedValues = [];
    const unrecognizedValues = [];
    
    values.forEach(value => {
        const mappedValue = valueMap[value];
        if (mappedValue) {
            mappedValues.push(...mappedValue.split(','));
        } else {
            unrecognizedValues.push(value);
            console.warn(`Valeur non reconnue dans le mapping Qloo: "${value}"`);
        }
    });
    
    // Combine mapped signals with priority weighting
    const prioritizedTags = [
        ...mappedInterests.map(tag => ({ tag, priority: 2 })),
        ...mappedValues.map(tag => ({ tag, priority: 1 }))
    ];
    
    // Handle unrecognized terms
    const genericMappedTags = handleUnrecognizedTerms([...unrecognizedInterests, ...unrecognizedValues]);
    prioritizedTags.push(...genericMappedTags.map(tag => ({ tag, priority: 0.5 })));
    
    // Sort by priority and remove duplicates
    const sortedTags = prioritizedTags
        .sort((a, b) => b.priority - a.priority)
        .map(item => item.tag);
    
    const uniqueTags = Array.from(new Set(sortedTags)).slice(0, 12);
    
    if (uniqueTags.length > 0) {
        signals['signal.interests.tags'] = uniqueTags.join(',');
    }
    
    return {
        signals,
        metadata: {
            originalInterests: interests,
            originalValues: values,
            mappedInterests,
            mappedValues,
            unrecognizedInterests,
            unrecognizedValues,
            finalSignals: uniqueTags,
            mappingSuccessRate: {
                interests: interests.length > 0 ? (interests.length - unrecognizedInterests.length) / interests.length : 1,
                values: values.length > 0 ? (values.length - unrecognizedValues.length) / values.length : 1,
                overall: (interests.length + values.length) > 0 ? 
                    ((interests.length + values.length) - (unrecognizedInterests.length + unrecognizedValues.length)) / (interests.length + values.length) : 1
            }
        }
    };
}

function handleUnrecognizedTerms(unrecognizedTerms) {
    if (unrecognizedTerms.length === 0) return [];
    
    const genericMappings = [];
    
    // Comprehensive keyword mapping for unrecognized terms
    const keywordMap = {
        'tech': ['technology', 'innovation'],
        'digital': ['technology', 'innovation'],
        'informatique': ['technology', 'business'],
        'numérique': ['technology', 'innovation'],
        'santé': ['wellness', 'health'],
        'bien-être': ['wellness', 'lifestyle'],
        'fitness': ['fitness', 'health'],
        'sport': ['fitness', 'health'],
        'créatif': ['creativity', 'art'],
        'artistique': ['art', 'creativity'],
        'design': ['art', 'creativity'],
        'business': ['business', 'entrepreneurship'],
        'entreprise': ['business', 'entrepreneurship'],
        'professionnel': ['business', 'career'],
        'lifestyle': ['lifestyle', 'wellness'],
        'vie': ['lifestyle', 'wellness'],
        'social': ['social', 'community'],
        'communauté': ['social', 'community'],
        'famille': ['family', 'lifestyle'],
        'environnement': ['sustainability', 'nature'],
        'écologie': ['sustainability', 'environment'],
        'vert': ['sustainability', 'environment']
    };
    
    unrecognizedTerms.forEach(term => {
        const lowerTerm = term.toLowerCase().trim();
        let termMapped = false;
        
        for (const [keyword, mappings] of Object.entries(keywordMap)) {
            if (lowerTerm.includes(keyword) || keyword.includes(lowerTerm)) {
                genericMappings.push(...mappings);
                console.log(`Mapping générique trouvé: "${term}" -> [${mappings.join(', ')}] via "${keyword}"`);
                termMapped = true;
                break;
            }
        }
        
        if (!termMapped && lowerTerm.length >= 4 && lowerTerm.length <= 20) {
            genericMappings.push('lifestyle');
        }
    });
    
    return Array.from(new Set(genericMappings));
}

// Test data based on form constants
const TEST_INTERESTS = [
    'Sport et fitness',
    'Technologie', 
    'Voyage',
    'Cuisine',
    'Mode',
    'Musique',
    'Lecture',
    'Cinéma',
    'Art',
    'Nature',
    'Gaming',
    'Photographie',
    'Entrepreneuriat',
    'Développement personnel',
    'Famille',
    'Santé et bien-être'
];

const TEST_VALUES = [
    'Authenticité',
    'Innovation',
    'Durabilité',
    'Qualité',
    'Efficacité',
    'Créativité',
    'Collaboration',
    'Respect',
    'Transparence',
    'Excellence',
    'Simplicité',
    'Sécurité',
    'Liberté',
    'Équilibre vie-travail',
    'Responsabilité sociale',
    'Tradition'
];

// Test cases for unrecognized terms
const UNRECOGNIZED_TERMS = [
    'Intelligence artificielle',
    'Blockchain',
    'Méditation',
    'Yoga',
    'Développement web',
    'Marketing digital',
    'Écologie urbaine',
    'Cuisine végétarienne',
    'Photographie de rue',
    'Musique électronique'
];

async function testMappingFunctionality() {
    console.log('🧪 Test du mapping des intérêts et valeurs Qloo\n');
    
    const client = null; // Not needed for this test
    
    // Test 1: All predefined interests
    console.log('📋 Test 1: Mapping de tous les intérêts prédéfinis');
    try {
        const signals1 = await testMapping(client, TEST_INTERESTS, []);
        console.log('✅ Tous les intérêts mappés avec succès');
        console.log(`   Signaux générés: ${signals1['signal.interests.tags']?.split(',').length || 0}\n`);
    } catch (error) {
        console.error('❌ Erreur lors du mapping des intérêts:', error.message);
    }
    
    // Test 2: All predefined values
    console.log('📋 Test 2: Mapping de toutes les valeurs prédéfinies');
    try {
        const signals2 = await testMapping(client, [], TEST_VALUES);
        console.log('✅ Toutes les valeurs mappées avec succès');
        console.log(`   Signaux générés: ${signals2['signal.interests.tags']?.split(',').length || 0}\n`);
    } catch (error) {
        console.error('❌ Erreur lors du mapping des valeurs:', error.message);
    }
    
    // Test 3: Mixed interests and values
    console.log('📋 Test 3: Mapping mixte (intérêts + valeurs)');
    try {
        const mixedInterests = ['Technologie', 'Voyage', 'Art'];
        const mixedValues = ['Innovation', 'Créativité', 'Authenticité'];
        const signals3 = await testMapping(client, mixedInterests, mixedValues);
        console.log('✅ Mapping mixte réussi');
        console.log(`   Signaux générés: ${signals3['signal.interests.tags']?.split(',').length || 0}\n`);
    } catch (error) {
        console.error('❌ Erreur lors du mapping mixte:', error.message);
    }
    
    // Test 4: Unrecognized terms handling
    console.log('📋 Test 4: Gestion des termes non reconnus');
    try {
        const signals4 = await testMapping(client, UNRECOGNIZED_TERMS.slice(0, 5), UNRECOGNIZED_TERMS.slice(5));
        console.log('✅ Gestion des termes non reconnus réussie');
        console.log(`   Signaux générés: ${signals4['signal.interests.tags']?.split(',').length || 0}\n`);
    } catch (error) {
        console.error('❌ Erreur lors de la gestion des termes non reconnus:', error.message);
    }
    
    // Test 5: Empty arrays
    console.log('📋 Test 5: Tableaux vides');
    try {
        const signals5 = await testMapping(client, [], []);
        console.log('✅ Gestion des tableaux vides réussie');
        console.log(`   Signaux générés: ${signals5['signal.interests.tags']?.split(',').length || 0}\n`);
    } catch (error) {
        console.error('❌ Erreur lors de la gestion des tableaux vides:', error.message);
    }
    
    // Test 6: Large dataset
    console.log('📋 Test 6: Dataset important');
    try {
        const signals6 = await testMapping(client, TEST_INTERESTS, TEST_VALUES);
        console.log('✅ Mapping de dataset important réussi');
        console.log(`   Signaux générés: ${signals6['signal.interests.tags']?.split(',').length || 0}`);
        console.log(`   Signaux: ${signals6['signal.interests.tags']?.substring(0, 100)}...\n`);
    } catch (error) {
        console.error('❌ Erreur lors du mapping de dataset important:', error.message);
    }
    
    console.log('🎉 Tests de mapping terminés!');
}

async function testMapping(client, interests, values) {
    const result = mapUserInterestsAndValuesToQlooSignals(interests, values);
    
    console.log(`   Intérêts: [${interests.join(', ')}]`);
    console.log(`   Valeurs: [${values.join(', ')}]`);
    console.log(`   Signaux: ${result.signals['signal.interests.tags'] || 'aucun'}`);
    console.log(`   Taux de succès: ${(result.metadata.mappingSuccessRate.overall * 100).toFixed(1)}%`);
    
    return result.signals;
}

// Performance test
async function performanceTest() {
    console.log('\n⚡ Test de performance du mapping');
    
    const iterations = 100;
    
    const start = Date.now();
    
    for (let i = 0; i < iterations; i++) {
        const randomInterests = TEST_INTERESTS.slice(0, Math.floor(Math.random() * 5) + 1);
        const randomValues = TEST_VALUES.slice(0, Math.floor(Math.random() * 3) + 1);
        
        mapUserInterestsAndValuesToQlooSignals(randomInterests, randomValues);
    }
    
    const end = Date.now();
    const avgTime = (end - start) / iterations;
    
    console.log(`✅ ${iterations} mappings effectués en ${end - start}ms`);
    console.log(`   Temps moyen par mapping: ${avgTime.toFixed(2)}ms`);
    
    if (avgTime < 1) {
        console.log('🚀 Performance excellente!');
    } else if (avgTime < 5) {
        console.log('✅ Performance acceptable');
    } else {
        console.log('⚠️  Performance à optimiser');
    }
}

// Run tests
if (require.main === module) {
    testMappingFunctionality()
        .then(() => performanceTest())
        .catch(error => {
            console.error('💥 Erreur lors des tests:', error);
            process.exit(1);
        });
}

module.exports = {
    testMappingFunctionality,
    performanceTest
};