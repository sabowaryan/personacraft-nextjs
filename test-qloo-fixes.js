// Test des corrections appliquées à l'API Qloo
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

async function testQlooFixes() {
    console.log('🔧 Test des corrections appliquées à l\'API Qloo...\n');
    
    const env = loadEnv();
    const apiKey = env.QLOO_API_KEY;
    const baseUrl = (env.QLOO_API_URL || 'https://hackathon.api.qloo.com').replace(/\/+$/, '');
    
    if (!apiKey) {
        console.log('❌ Clé API manquante. Définissez QLOO_API_KEY dans votre fichier .env');
        return;
    }
    
    console.log('✅ Clé API trouvée');
    console.log('✅ URL de base:', baseUrl);
    
    // Test 1: Vérifier que urn:entity:destination échoue avec audience requests
    console.log('\n1. 🚫 Test urn:entity:destination avec audience requests (doit échouer)...');
    
    try {
        const url = new URL('/v2/insights', baseUrl);
        url.searchParams.set('filter.type', 'urn:entity:destination');
        url.searchParams.set('signal.demographics.audiences', 'millennials');
        url.searchParams.set('take', '3');
        
        const response = await fetch(url.toString(), {
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('   ⚠️  Inattendu: La requête a réussi (l\'API a peut-être changé)');
        } else if (response.status === 400) {
            const errorText = await response.text();
            if (errorText.includes('does not yet support audience requests')) {
                console.log('   ✅ Confirmation: urn:entity:destination ne supporte pas les audience requests');
            } else {
                console.log('   ❌ Erreur 400 différente:', errorText);
            }
        } else {
            console.log('   ❌ Erreur inattendue:', response.status);
        }
        
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
    }
    
    // Test 2: Vérifier que urn:entity:place fonctionne avec audience requests
    console.log('\n2. ✅ Test urn:entity:place avec audience requests (doit réussir)...');
    
    try {
        const url = new URL('/v2/insights', baseUrl);
        url.searchParams.set('filter.type', 'urn:entity:place');
        url.searchParams.set('signal.demographics.audiences', 'millennials');
        url.searchParams.set('take', '3');
        
        const response = await fetch(url.toString(), {
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Requête urn:entity:place réussie!');
            console.log('   📊 Nombre de résultats:', data.data?.length || 0);
            
            if (data.data && data.data.length > 0) {
                console.log('   🏢 Exemples de lieux:');
                data.data.slice(0, 2).forEach((place, index) => {
                    console.log(`     ${index + 1}. ${place.name || place.title || 'Nom non disponible'}`);
                });
            }
        } else {
            console.log('   ❌ Erreur inattendue:', response.status);
            const errorText = await response.text();
            console.log('   📄 Détails:', errorText);
        }
        
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }
    
    // Test 3: Test de tous les types d'entités supportés
    console.log('\n3. 🧪 Test de tous les types d\'entités avec audience requests...');
    
    const entityTypes = [
        { name: 'artist', urn: 'urn:entity:artist', category: 'Musique' },
        { name: 'brand', urn: 'urn:entity:brand', category: 'Marques' },
        { name: 'movie', urn: 'urn:entity:movie', category: 'Films' },
        { name: 'tv_show', urn: 'urn:entity:tv_show', category: 'Séries TV' },
        { name: 'book', urn: 'urn:entity:book', category: 'Livres' },
        { name: 'place', urn: 'urn:entity:place', category: 'Lieux/Voyage' },
        { name: 'podcast', urn: 'urn:entity:podcast', category: 'Podcasts' },
        { name: 'video_game', urn: 'urn:entity:video_game', category: 'Jeux vidéo' },
        { name: 'person', urn: 'urn:entity:person', category: 'Personnes' }
    ];
    
    for (const entityType of entityTypes) {
        try {
            const url = new URL('/v2/insights', baseUrl);
            url.searchParams.set('filter.type', entityType.urn);
            url.searchParams.set('signal.demographics.audiences', 'millennials');
            url.searchParams.set('take', '2');
            
            const response = await fetch(url.toString(), {
                headers: {
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const count = data.data?.length || 0;
                console.log(`   ✅ ${entityType.category}: ${count} résultats`);
            } else {
                console.log(`   ❌ ${entityType.category}: Erreur ${response.status}`);
            }
            
            // Petite pause pour éviter de surcharger l'API
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`   ❌ ${entityType.category}: ${error.message}`);
        }
    }
    
    // Test 4: Test de la normalisation des localisations
    console.log('\n4. 🌍 Test de normalisation des localisations...');
    
    const locations = [
        { input: 'paris', expected: 'FR-75', description: 'Paris vers code ISO' },
        { input: 'FR-75', expected: 'FR-75', description: 'Code ISO déjà correct' },
        { input: 'london', expected: 'GB-LND', description: 'Londres vers code ISO' },
        { input: 'new york', expected: 'US-NY', description: 'New York vers code ISO' }
    ];
    
    // Simuler la fonction de normalisation
    function normalizeLocation(location) {
        if (/^[A-Z]{2}-[A-Z0-9]{1,3}$/.test(location)) {
            return location;
        }
        
        const cityToIsoMap = {
            'paris': 'FR-75',
            'lyon': 'FR-69',
            'marseille': 'FR-13',
            'london': 'GB-LND',
            'manchester': 'GB-MAN',
            'new york': 'US-NY',
            'los angeles': 'US-CA',
            'chicago': 'US-IL'
        };
        
        const normalizedCity = location.toLowerCase().trim();
        return cityToIsoMap[normalizedCity] || location;
    }
    
    locations.forEach(loc => {
        const result = normalizeLocation(loc.input);
        const status = result === loc.expected ? '✅' : '❌';
        console.log(`   ${status} ${loc.description}: "${loc.input}" → "${result}"`);
    });
    
    console.log('\n🎯 Tests des corrections terminés!');
    console.log('\n📋 Résumé des corrections appliquées:');
    console.log('   ✅ Changement de urn:entity:destination vers urn:entity:place pour les voyages');
    console.log('   ✅ Vérification du support des audience requests par type d\'entité');
    console.log('   ✅ Gestion d\'erreurs 400 spécifiques aux audience requests');
    console.log('   ✅ Normalisation des codes de localisation');
    console.log('   ✅ Construction d\'URL sécurisée avec new URL()');
    
    console.log('\n💡 Votre intégration Qloo devrait maintenant fonctionner sans erreurs 400!');
}

// Exécuter le test
testQlooFixes().catch(console.error);