const { getQlooClient } = require('./src/lib/api/qloo.ts');

async function testEnhancedSocialMedia() {
    console.log('🧪 Test de l\'enrichissement des réseaux sociaux avec Qloo\n');
    
    const qlooClient = getQlooClient();
    
    // Test personas avec différents profils
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
        },
        {
            name: 'Pierre Senior',
            age: 55,
            occupation: 'Directeur Commercial',
            location: 'Marseille'
        }
    ];

    for (const persona of testPersonas) {
        console.log(`\n=== Test pour ${persona.name} ===`);
        console.log(`Profil: ${persona.age} ans, ${persona.occupation}, ${persona.location}`);
        
        try {
            // Test de l'enrichissement complet
            const enrichedPersonas = await qlooClient.enrichPersonas([persona]);
            const enrichedPersona = enrichedPersonas[0];
            
            console.log('\n📱 Réseaux sociaux enrichis:');
            if (enrichedPersona.culturalData?.socialMedia) {
                enrichedPersona.culturalData.socialMedia.forEach((platform, index) => {
                    console.log(`  ${index + 1}. ${platform}`);
                });
            } else {
                console.log('  ❌ Aucune donnée de réseaux sociaux');
            }
            
            // Afficher aussi les autres données culturelles pour contexte
            console.log('\n🎵 Musique:', enrichedPersona.culturalData?.music?.slice(0, 2) || []);
            console.log('🏢 Marques:', enrichedPersona.culturalData?.brands?.slice(0, 2) || []);
            
        } catch (error) {
            console.error(`❌ Erreur pour ${persona.name}:`, error.message);
        }
    }
    
    // Test de la fonction locale seule
    console.log('\n\n=== Test de la logique locale seule ===');
    testPersonas.forEach(persona => {
        console.log(`\n${persona.name}:`);
        const localSocialMedia = qlooClient.getSocialMediaByProfile(persona.age, persona.occupation);
        localSocialMedia.forEach((platform, index) => {
            console.log(`  ${index + 1}. ${platform}`);
        });
    });
}

// Test de connexion d'abord
async function runTests() {
    const qlooClient = getQlooClient();
    
    console.log('🔍 Test de connexion Qloo...');
    const connectionTest = await qlooClient.testConnection();
    
    if (connectionTest.success) {
        console.log('✅ Connexion Qloo réussie\n');
        await testEnhancedSocialMedia();
    } else {
        console.log(`❌ Connexion Qloo échouée: ${connectionTest.error}`);
        console.log('🔄 Test avec données de fallback uniquement...\n');
        
        // Test avec fallback uniquement
        const qlooClient = getQlooClient();
        const testPersona = {
            name: 'Test Fallback',
            age: 30,
            occupation: 'Designer',
            location: 'Paris'
        };
        
        const localSocialMedia = qlooClient.getSocialMediaByProfile(testPersona.age, testPersona.occupation);
        console.log('📱 Réseaux sociaux (logique locale):');
        localSocialMedia.forEach((platform, index) => {
            console.log(`  ${index + 1}. ${platform}`);
        });
    }
}

runTests().catch(console.error);