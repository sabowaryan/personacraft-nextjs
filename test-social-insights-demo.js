// Simple demo script to showcase enhanced social media insights
console.log('🚀 Demo des insights sociaux enrichis avec Qloo\n');

// Simulate the enhanced insights data structure
const mockInsights = {
    audienceMatches: [
        {
            name: 'Teliana Pereira',
            relevanceFactors: ['Tech alignment'],
            estimatedFollowingOverlap: 35
        },
        {
            name: 'Brandon Turner',
            relevanceFactors: ['Professional alignment'],
            estimatedFollowingOverlap: 28
        }
    ],
    brandInfluence: [
        {
            brand: 'Apple',
            category: 'Technology',
            platforms: ['Instagram', 'Twitter', 'YouTube'],
            relevanceScore: 85
        },
        {
            brand: 'Zara',
            category: 'Fashion & Lifestyle',
            platforms: ['Instagram', 'TikTok', 'Pinterest'],
            relevanceScore: 65
        },
        {
            brand: 'Sephora',
            category: 'Beauty & Cosmetics',
            platforms: ['Instagram', 'TikTok', 'YouTube', 'Pinterest'],
            relevanceScore: 45
        }
    ],
    contentPreferences: [
        'Video content (Teliana Pereira)',
        'Professional networking (Brandon Turner)',
        'Electronic music content (Upper Class Trash)',
        'Contemporary music content (Ana Paula da Silva)'
    ],
    demographicAlignment: [
        {
            ageGroup: 'millennials',
            primaryPlatforms: ['Instagram', 'TikTok', 'Twitter'],
            engagementStyle: 'Balanced content consumption, story-driven'
        }
    ]
};

const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Pinterest'];

function displayPersonaInsights(personaName, age, occupation, location) {
    console.log(`🎯 === ANALYSE COMPLÈTE: ${personaName.toUpperCase()} ===`);
    console.log(`👤 Profil: ${age} ans, ${occupation}, ${location}\n`);
    
    // Display platforms
    console.log('📱 PLATEFORMES RECOMMANDÉES:');
    platforms.forEach((platform, index) => {
        const icons = {
            'Instagram': '📸',
            'TikTok': '🎵',
            'YouTube': '📺',
            'Twitter': '🐦',
            'LinkedIn': '💼',
            'Pinterest': '📌'
        };
        console.log(`  ${index + 1}. ${icons[platform] || '📱'} ${platform}`);
    });
    
    // Display brand influence
    console.log('\n💼 INFLUENCE DES MARQUES:');
    mockInsights.brandInfluence
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .forEach(brand => {
            const relevanceEmoji = brand.relevanceScore >= 80 ? '🟢' : 
                                  brand.relevanceScore >= 60 ? '🟡' : '🔴';
            console.log(`  ${relevanceEmoji} ${brand.brand} (${brand.category})`);
            console.log(`     Relevance: ${brand.relevanceScore}%`);
            console.log(`     Plateformes: ${brand.platforms.join(', ')}`);
        });
    
    // Display content preferences
    console.log('\n🎨 PRÉFÉRENCES DE CONTENU:');
    mockInsights.contentPreferences.forEach(pref => {
        console.log(`  • ${pref}`);
    });
    
    // Display demographic alignment
    console.log('\n👥 ALIGNEMENT DÉMOGRAPHIQUE:');
    const demo = mockInsights.demographicAlignment[0];
    console.log(`  🎯 Groupe d'âge: ${demo.ageGroup}`);
    console.log(`  📈 Plateformes primaires: ${demo.primaryPlatforms.join(', ')}`);
    console.log(`  💬 Style d'engagement: ${demo.engagementStyle}`);
    
    // Display audience matches
    console.log('\n🎭 CORRESPONDANCES D\'AUDIENCE:');
    mockInsights.audienceMatches.forEach(match => {
        if (match.relevanceFactors.length > 0) {
            console.log(`  👤 ${match.name}`);
            console.log(`     Facteurs: ${match.relevanceFactors.join(', ')}`);
            console.log(`     Overlap estimé: ${match.estimatedFollowingOverlap}%`);
        }
    });
    
    console.log('\n✅ Analyse terminée avec succès');
    console.log('\n' + '='.repeat(60));
}

// Demo different personas
const testPersonas = [
    {
        name: 'Alex Tech',
        age: 28,
        occupation: 'Développeur Full-Stack',
        location: 'Paris'
    },
    {
        name: 'Sophie Marketing',
        age: 32,
        occupation: 'Responsable Marketing Digital',
        location: 'Lyon'
    },
    {
        name: 'Emma GenZ',
        age: 22,
        occupation: 'Étudiante en Design',
        location: 'Toulouse'
    }
];

testPersonas.forEach(persona => {
    displayPersonaInsights(persona.name, persona.age, persona.occupation, persona.location);
});

console.log('\n🎉 Demo des insights sociaux enrichis terminé!');
console.log('\n💡 Points forts pour la démo:');
console.log('  ✨ Mapping intelligent audience → plateformes');
console.log('  📊 Scores de relevance des marques avec code couleur');
console.log('  🎯 Analyse démographique détaillée');
console.log('  🎨 Préférences de contenu personnalisées');
console.log('  🤝 Correspondances d\'influenceurs avec overlap estimé');
console.log('  📱 Interface visuelle avec icônes et badges');
console.log('\n🏆 Différenciation Qloo:');
console.log('  • Données culturelles réelles vs données génériques');
console.log('  • Insights basés sur des comportements d\'audience réels');
console.log('  • Recommandations de plateformes justifiées par les données');
console.log('  • Scores de relevance calculés dynamiquement');