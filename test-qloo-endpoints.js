/**
 * Test direct des endpoints pour identifier le problème des données culturelles
 */

console.log('=== TEST DIRECT DES ENDPOINTS ===\n');

// Test 1: API Gemini seule
async function testGeminiAPI() {
    console.log('🔍 Test 1: API Gemini');
    try {
        const response = await fetch('http://localhost:3000/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                brief: 'Créer des personas pour une application de fitness destinée aux jeunes professionnels urbains âgés de 25-35 ans.',
                userContext: 'en tant que directeur marketing expérimenté dans le secteur technologique'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ API Gemini répond');
            console.log(`   📊 Nombre de personas: ${data.personas?.length || 0}`);
            
            if (data.personas && data.personas.length > 0) {
                const firstPersona = data.personas[0];
                console.log(`   👤 Premier persona: ${firstPersona.name}`);
                
                if (firstPersona.culturalData) {
                    console.log('   ✅ culturalData présent dans Gemini');
                    const culturalCategories = Object.keys(firstPersona.culturalData);
                    console.log(`   📋 Catégories: ${culturalCategories.join(', ')}`);
                } else {
                    console.log('   ❌ culturalData manquant dans Gemini');
                }
            }
        } else {
            console.log(`   ❌ Erreur API Gemini: ${response.status}`);
            const errorText = await response.text();
            console.log(`   📝 Détails: ${errorText}`);
        }
    } catch (error) {
        console.log(`   ❌ Erreur réseau Gemini: ${error.message}`);
    }
}

// Test 2: API Qloo seule
async function testQlooAPI() {
    console.log('\n🔍 Test 2: API Qloo');
    
    const testPersona = {
        id: 'test-1',
        name: 'Marie Dubois',
        age: 28,
        occupation: 'Marketing Manager',
        location: 'Paris, France',
        psychographics: {
            interests: ['fitness', 'wellness', 'technology', 'travel']
        }
    };

    try {
        const response = await fetch('http://localhost:3000/api/qloo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personas: [testPersona]
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ API Qloo répond');
            console.log(`   📊 Nombre de personas enrichis: ${data.personas?.length || 0}`);
            
            if (data.personas && data.personas.length > 0) {
                const enrichedPersona = data.personas[0];
                console.log(`   👤 Persona enrichi: ${enrichedPersona.name}`);
                
                if (enrichedPersona.culturalData) {
                    console.log('   ✅ culturalData ajouté par Qloo');
                    Object.entries(enrichedPersona.culturalData).forEach(([category, items]) => {
                        if (Array.isArray(items) && items.length > 0) {
                            console.log(`     - ${category}: ${items.length} éléments - [${items.slice(0, 2).join(', ')}...]`);
                        }
                    });
                } else {
                    console.log('   ❌ culturalData manquant après Qloo');
                }
            }
        } else {
            console.log(`   ❌ Erreur API Qloo: ${response.status}`);
            const errorText = await response.text();
            console.log(`   📝 Détails: ${errorText}`);
        }
    } catch (error) {
        console.log(`   ❌ Erreur réseau Qloo: ${error.message}`);
    }
}

// Test 3: Pipeline complet (sans authentification)
async function testCompletePipeline() {
    console.log('\n🔍 Test 3: Pipeline complet (simulation)');
    
    try {
        // Étape 1: Gemini
        console.log('   📝 Étape 1: Génération Gemini...');
        const geminiResponse = await fetch('http://localhost:3000/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                brief: 'Application de fitness pour jeunes professionnels urbains',
                userContext: 'directeur marketing tech'
            })
        });

        if (!geminiResponse.ok) {
            throw new Error(`Gemini failed: ${geminiResponse.status}`);
        }

        const geminiData = await geminiResponse.json();
        console.log(`   ✅ Gemini: ${geminiData.personas?.length || 0} personas générés`);

        // Étape 2: Qloo
        console.log('   📝 Étape 2: Enrichissement Qloo...');
        const qlooResponse = await fetch('http://localhost:3000/api/qloo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ personas: geminiData.personas })
        });

        if (!qlooResponse.ok) {
            throw new Error(`Qloo failed: ${qlooResponse.status}`);
        }

        const qlooData = await qlooResponse.json();
        console.log(`   ✅ Qloo: ${qlooData.personas?.length || 0} personas enrichis`);

        // Vérification finale
        if (qlooData.personas && qlooData.personas.length > 0) {
            const finalPersona = qlooData.personas[0];
            console.log(`   👤 Persona final: ${finalPersona.name}`);
            
            if (finalPersona.culturalData) {
                const totalItems = Object.values(finalPersona.culturalData).flat().length;
                console.log(`   ✅ Pipeline complet réussi: ${totalItems} éléments culturels`);
                
                // Détail par catégorie
                Object.entries(finalPersona.culturalData).forEach(([category, items]) => {
                    if (Array.isArray(items) && items.length > 0) {
                        console.log(`     ✅ ${category}: ${items.length} éléments`);
                    } else {
                        console.log(`     ❌ ${category}: vide`);
                    }
                });
            } else {
                console.log('   ❌ culturalData perdu dans le pipeline');
            }
        }

    } catch (error) {
        console.log(`   ❌ Erreur pipeline: ${error.message}`);
    }
}

// Exécution des tests
async function runAllTests() {
    await testGeminiAPI();
    await testQlooAPI();
    await testCompletePipeline();
    
    console.log('\n=== RÉSUMÉ ===');
    console.log('Si tous les tests passent mais que les données n\'apparaissent pas dans l\'interface:');
    console.log('1. Le problème est dans l\'authentification de generate-personas');
    console.log('2. Ou dans la sauvegarde localStorage côté client');
    console.log('3. Utilisez debug-localStorage-personas.js dans le navigateur pour vérifier');
    console.log('\n📋 PROCHAINE ÉTAPE: Tester avec un utilisateur authentifié');
}

runAllTests().catch(console.error);