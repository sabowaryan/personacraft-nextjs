const { QlooClient } = require('./src/lib/api/qloo.ts');

async function testLocationHandling() {
    console.log('🌍 Test de gestion des localisations Qloo...\n');
    
    const client = new QlooClient();
    
    // Test avec différents formats de localisation
    const locationTests = [
        { location: 'FR-75', description: 'Code ISO Paris' },
        { location: 'US-CA', description: 'Code ISO Californie' },
        { location: 'GB-LND', description: 'Code ISO Londres' },
        { location: 'Lyon', description: 'Nom de ville (peut échouer)' },
        { location: 'Paris', description: 'Nom de ville (peut échouer)' }
    ];
    
    for (const test of locationTests) {
        console.log(`\n📍 Test: ${test.description} (${test.location})`);
        
        try {
            const testPersona = {
                name: 'Test User',
                age: 30,
                occupation: 'marketing',
                location: test.location
            };
            
            // Test avec un seul type d'entité pour simplifier
            const musicData = await client.fetchData('music', testPersona.age, testPersona.occupation, testPersona.location, 2);
            
            if (musicData && musicData.length > 0) {
                console.log(`✅ Succès avec ${test.location}:`, musicData.slice(0, 2));
            } else {
                console.log(`⚠️  Aucune donnée retournée pour ${test.location}`);
            }
            
        } catch (error) {
            console.log(`❌ Erreur avec ${test.location}:`, error.message);
            
            if (error.message.includes('403')) {
                console.log('   → Format de localisation probablement non supporté');
            }
        }
        
        // Délai pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n💡 Recommandations:');
    console.log('- Utilisez des codes ISO-3166-2 (ex: FR-75, US-CA)');
    console.log('- Évitez les noms de villes en texte libre');
    console.log('- Consultez /v2/locations pour obtenir les IDs Qloo valides');
    
    console.log('\n🎯 Test de localisation terminé');
}

// Exécuter le test
testLocationHandling().catch(console.error);