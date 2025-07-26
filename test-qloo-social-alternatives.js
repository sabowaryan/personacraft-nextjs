/**
 * Test pour trouver des alternatives Qloo pour les données de réseaux sociaux
 */

const fetch = require('node-fetch');

console.log('🔍 TEST: Alternatives Qloo pour les réseaux sociaux\n');

async function testQlooSocialAlternatives() {
    const qlooApiKey = process.env.QLOO_API_KEY || '32_1GLe_0t05IQmBI7UqVYh2A0pT9oeOgQZtsuzL594';
    const qlooBaseUrl = process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com';
    
    // Test différents types d'entités qui pourraient contenir des données sociales
    const testTypes = [
        'urn:entity:person',      // Influenceurs, personnalités
        'urn:entity:brand',       // Marques avec présence sociale
        'urn:entity:app',         // Applications sociales
        'urn:entity:website',     // Sites web/plateformes
        'urn:entity:platform'     // Plateformes sociales
    ];

    for (const entityType of testTypes) {
        console.log(`\n📤 Test pour ${entityType}...`);
        
        try {
            const url = `${qlooBaseUrl}/v2/insights?filter.type=${entityType}&signal.demographics.audiences=millennials&take=5`;
            
            const response = await fetch(url, {
                headers: {
                    'X-API-Key': qlooApiKey,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`   Statut: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                const entities = data.results?.entities || [];
                
                console.log(`   ✅ ${entities.length} entités trouvées`);
                
                if (entities.length > 0) {
                    console.log('   📋 Échantillon:');
                    entities.slice(0, 3).forEach((entity, index) => {
                        const name = entity.name || entity.title || 'Sans nom';
                        const type = entity.type || 'Type inconnu';
                        const subtype = entity.subtype || '';
                        console.log(`      [${index}] ${name} (${type}${subtype ? `, ${subtype}` : ''})`);
                    });
                    
                    // Chercher des entités liées aux réseaux sociaux
                    const socialRelated = entities.filter(entity => {
                        const name = (entity.name || entity.title || '').toLowerCase();
                        const socialKeywords = ['instagram', 'facebook', 'twitter', 'tiktok', 'linkedin', 'snapchat', 'youtube', 'social', 'influencer'];
                        return socialKeywords.some(keyword => name.includes(keyword));
                    });
                    
                    if (socialRelated.length > 0) {
                        console.log(`   🎯 ${socialRelated.length} entités liées aux réseaux sociaux trouvées:`);
                        socialRelated.forEach((entity, index) => {
                            console.log(`      [${index}] ${entity.name || entity.title}`);
                        });
                    }
                }
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Erreur: ${errorText}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Exception: ${error.message}`);
        }
        
        // Délai entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n🔍 Test de recherche directe pour les plateformes sociales...');
    
    const socialPlatforms = ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'LinkedIn'];
    
    for (const platform of socialPlatforms) {
        console.log(`\n📤 Recherche pour "${platform}"...`);
        
        try {
            const url = `${qlooBaseUrl}/search?q=${encodeURIComponent(platform)}&types=brand,person,app&take=3`;
            
            const response = await fetch(url, {
                headers: {
                    'X-API-Key': qlooApiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const results = data.data || [];
                
                console.log(`   ✅ ${results.length} résultats trouvés`);
                results.forEach((result, index) => {
                    console.log(`      [${index}] ${result.name || result.title} (${result.type})`);
                });
            } else {
                console.log(`   ❌ Erreur: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Exception: ${error.message}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n🎯 RECOMMANDATIONS:');
    console.log('1. Si urn:entity:person retourne des influenceurs, on peut les mapper vers des plateformes');
    console.log('2. Si urn:entity:brand retourne des marques sociales, on peut extraire leurs plateformes');
    console.log('3. Sinon, améliorer la fonction locale getSocialMediaByProfile()');
}

// Définir les variables d'environnement
process.env.QLOO_API_KEY = '32_1GLe_0t05IQmBI7UqVYh2A0pT9oeOgQZtsuzL594';
process.env.QLOO_API_URL = 'https://hackathon.api.qloo.com';

testQlooSocialAlternatives().catch(console.error);