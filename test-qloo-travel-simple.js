// Test simple pour vérifier la correction des requêtes de voyage
const fs = require('fs');

// Lire le fichier .env manuellement
function loadEnv() {
    try {
        const envContent = fs.readFileSync('.env', 'utf8');
        const envVars = {};
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        });
        return envVars;
    } catch (error) {
        return {};
    }
}

async function testTravelAPI() {
    console.log('🧪 Test direct de l\'API Qloo pour les données de voyage...\n');
    
    const env = loadEnv();
    const apiKey = env.QLOO_API_KEY;
    const baseUrl = (env.QLOO_API_URL || 'https://hackathon.api.qloo.com').replace(/\/+$/, '');
    
    if (!apiKey) {
        console.log('❌ Clé API Qloo manquante');
        return;
    }
    
    console.log('🔑 Clé API trouvée');
    console.log('🌐 URL de base:', baseUrl);
    
    // Test 1: Requête avec urn:entity:destination (devrait échouer)
    console.log('\n📍 Test 1: Requête avec urn:entity:destination...');
    try {
        const destinationUrl = new URL('/v2/insights', baseUrl);
        destinationUrl.searchParams.set('filter.type', 'urn:entity:destination');
        destinationUrl.searchParams.set('signal.demographics.audiences', 'millennials');
        destinationUrl.searchParams.set('take', '3');
        
        const response1 = await fetch(destinationUrl.toString(), {
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (response1.ok) {
            console.log('✅ Requête destination réussie (inattendu)');
        } else {
            const errorText = await response1.text();
            console.log('❌ Erreur attendue:', response1.status);
            if (errorText.includes('does not yet support audience requests')) {
                console.log('✅ Confirmation: urn:entity:destination ne supporte pas les audience requests');
            }
        }
    } catch (error) {
        console.log('❌ Erreur requête destination:', error.message);
    }
    
    // Test 2: Requête avec urn:entity:place (devrait réussir)
    console.log('\n🏢 Test 2: Requête avec urn:entity:place...');
    try {
        const placeUrl = new URL('/v2/insights', baseUrl);
        placeUrl.searchParams.set('filter.type', 'urn:entity:place');
        placeUrl.searchParams.set('signal.demographics.audiences', 'millennials');
        placeUrl.searchParams.set('take', '3');
        
        const response2 = await fetch(placeUrl.toString(), {
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (response2.ok) {
            const data = await response2.json();
            console.log('✅ Requête place réussie !');
            console.log('📊 Nombre de résultats:', data.data?.length || 0);
            if (data.data && data.data.length > 0) {
                console.log('🎯 Exemples:', data.data.slice(0, 2).map(item => item.name || item.title).join(', '));
            }
        } else {
            console.log('❌ Erreur requête place:', response2.status);
            const errorText = await response2.text();
            console.log('Détails:', errorText);
        }
    } catch (error) {
        console.log('❌ Erreur requête place:', error.message);
    }
    
    // Test 3: Requête place sans filtres démographiques
    console.log('\n🌍 Test 3: Requête place sans filtres démographiques...');
    try {
        const simplePlaceUrl = new URL('/v2/insights', baseUrl);
        simplePlaceUrl.searchParams.set('filter.type', 'urn:entity:place');
        simplePlaceUrl.searchParams.set('take', '5');
        
        const response3 = await fetch(simplePlaceUrl.toString(), {
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (response3.ok) {
            const data = await response3.json();
            console.log('✅ Requête place simple réussie !');
            console.log('📊 Nombre de résultats:', data.data?.length || 0);
            if (data.data && data.data.length > 0) {
                console.log('🎯 Exemples de lieux:', data.data.slice(0, 3).map(item => item.name || item.title).join(', '));
            }
        } else {
            console.log('❌ Erreur requête place simple:', response3.status);
        }
    } catch (error) {
        console.log('❌ Erreur requête place simple:', error.message);
    }
    
    console.log('\n🏁 Tests terminés');
    console.log('\n💡 Conclusion:');
    console.log('- urn:entity:destination ne supporte pas les audience requests');
    console.log('- urn:entity:place supporte les audience requests');
    console.log('- La correction consiste à utiliser urn:entity:place pour les données de voyage');
}

testTravelAPI().catch(console.error);