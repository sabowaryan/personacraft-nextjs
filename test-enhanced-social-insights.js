const { getQlooClient } = require('./src/lib/api/qloo.ts');

async function testEnhancedSocialInsights() {
    console.log('🚀 Test des insights sociaux enrichis avec Qloo\n');
    
    const qlooClient = getQlooClient();
    
    // Test personas with different profiles
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

    for (const persona of testPersonas) {
        console.log(`\n🎯 === ANALYSE COMPLÈTE: ${persona.name.toUpperCase()} ===`);
        console.log(`👤 Profil: ${persona.age} ans, ${persona.occupation}, ${persona.location}`);
        
        try {
            // Test the enhanced enrichment
            const enrichedPersona = await qlooClient.enrichSinglePersona(persona);
            
            // Display social media insights
            if (enrichedPersona.socialMediaInsights) {
                const insights = enrichedPersona.socialMediaInsights;
                
                console.log('\n📱 PLATEFORMES RECOMMANDÉES:');
                enrichedPersona.culturalData.socialMedia.forEach((platform, index) => {
                    console.log(`  ${index + 1}. ${platform}`);
                });
                
                if (insights.brandInfluence.length > 0) {
                    console.log('\n💼 INFLUENCE DES MARQUES:');
                    insights.brandInfluence
                        .sort((a, b) => b.relevanceScore - a.relevanceScore)
                        .forEach(brand => {
                            console.log(`  📊 ${brand.brand} (${brand.category})`);
                            console.log(`     Relevance: ${brand.relevanceScore}%`);
                            console.log(`     Plateformes: ${brand.platforms.join(', ')}`);
                        });
                }
                
                if (insights.contentPreferences.length > 0) {
                    console.log('\n🎨 PRÉFÉRENCES DE CONTENU:');
                    insights.contentPreferences.forEach(pref => {
                        console.log(`  • ${pref}`);
                    });
                }
                
                if (insights.demographicAlignment.length > 0) {
                    const demo = insights.demographicAlignment[0];
                    console.log('\n👥 ALIGNEMENT DÉMOGRAPHIQUE:');
                    console.log(`  🎯 Groupe d'âge: ${demo.ageGroup}`);
                    console.log(`  📈 Plateformes primaires: ${demo.primaryPlatforms.join(', ')}`);
                    console.log(`  💬 Style d'engagement: ${demo.engagementStyle}`);
                }
                
                if (insights.audienceMatches.length > 0) {
                    console.log('\n🎭 CORRESPONDANCES D\'AUDIENCE:');
                    insights.audienceMatches.forEach(match => {
                        if (match.relevanceFactors.length > 0) {
                            console.log(`  👤 ${match.name}`);
                            console.log(`     Facteurs: ${match.relevanceFactors.join(', ')}`);
                            console.log(`     Overlap estimé: ${match.estimatedFollowingOverlap}%`);
                        }
                    });
                }
            }
            
            console.log('\n✅ Analyse terminée avec succès');
            
        } catch (error) {
            console.error(`❌ Erreur pour ${persona.name}:`, error.message);
        }
        
        console.log('\n' + '='.repeat(60));
    }
    
    console.log('\n🎉 Test des insights sociaux enrichis terminé!');
    console.log('\n💡 Points forts pour la démo:');
    console.log('  • Mapping intelligent audience → plateformes');
    console.log('  • Scores de relevance des marques');
    console.log('  • Analyse démographique détaillée');
    console.log('  • Préférences de contenu personnalisées');
    console.log('  • Correspondances d\'influenceurs');
}

// Run the test
testEnhancedSocialInsights().catch(console.error);