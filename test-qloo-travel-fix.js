const { QlooClient } = require('./src/lib/api/qloo.ts');

async function testTravelFix() {
    console.log('🧪 Test de la correction pour les requêtes de voyage...\n');
    
    const client = new QlooClient();
    
    // Test du statut de l'API
    console.log('📡 Test de connexion API...');
    const status = await client.testConnection();
    console.log('Statut:', status);
    
    if (!status.success) {
        console.log('❌ Connexion API échouée, test avec données de fallback uniquement');
        return;
    }
    
    console.log('\n✅ Connexion API réussie\n');
    
    // Test spécifique pour les données de voyage
    console.log('🌍 Test des requêtes de voyage...');
    
    const testPersona = {
        name: 'Test Voyageur',
        age: 30,
        occupation: 'Marketing Manager',
        location: 'Paris'
    };
    
    try {
        console.log('Enrichissement de la persona de test...');
        const enrichedPersonas = await client.enrichPersonas([testPersona]);
        
        if (enrichedPersonas && enrichedPersonas.length > 0) {
            const enriched = enrichedPersonas[0];
            console.log('\n✅ Enrichissement réussi !');
            console.log('Données de voyage:', enriched.culturalData?.travel || 'Aucune donnée');
            
            // Vérifier que nous avons des données pour toutes les catégories
            const categories = ['music', 'movies', 'tv', 'books', 'brands', 'restaurants', 'travel', 'fashion', 'beauty', 'food'];
            
            console.log('\n📊 Résumé des données enrichies:');
            categories.forEach(category => {
                const data = enriched.culturalData?.[category];
                const count = Array.isArray(data) ? data.length : 0;
                const status = count > 0 ? '✅' : '❌';
                console.log(`${status} ${category}: ${count} éléments`);
                if (count > 0 && category === 'travel') {
                    console.log(`   Exemples: ${data.slice(0, 2).join(', ')}`);
                }
            });
            
        } else {
            console.log('❌ Aucune donnée enrichie retournée');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'enrichissement:', error.message);
        
        // Vérifier si c'est encore une erreur 400 liée aux destinations
        if (error.message.includes('400') && error.message.includes('destination')) {
            console.log('⚠️  Erreur 400 détectée - la correction n\'a peut-être pas été appliquée correctement');
        }
    }
    
    console.log('\n🏁 Test terminé');
}

// Exécuter le test
testTravelFix().catch(console.error);