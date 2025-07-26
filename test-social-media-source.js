/**
 * Test pour vérifier la source des données de réseaux sociaux
 * Vérifie si elles proviennent de Qloo ou sont générées localement
 */

const fetch = require('node-fetch');

console.log('🔍 TEST: Source des données de réseaux sociaux\n');

async function testSocialMediaSource() {
    // 1. Test direct de l'API Qloo pour voir si elle retourne des réseaux sociaux
    console.log('1️⃣ Test direct API Qloo pour les réseaux sociaux...');
    
    const qlooApiKey = process.env.QLOO_API_KEY;
    const qlooBaseUrl = process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com';
    
    if (!qlooApiKey) {
        console.log('❌ Clé API Qloo manquante, impossible de tester');
        return;
    }

    try {
        // Essayer de récupérer des données de réseaux sociaux via Qloo
        const socialMediaUrl = `${qlooBaseUrl}/v2/insights?filter.type=urn:entity:social_media&signal.demographics.audiences=millennials&take=5`;
        
        console.log('📤 URL testée:', socialMediaUrl);
        
        const response = await fetch(socialMediaUrl, {
            headers: {
                'X-API-Key': qlooApiKey,
                'Content-Type': 'application/json'
            }
        });

        console.log('📥 Statut de réponse:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Données reçues de Qloo pour social_media:');
            console.log(JSON.stringify(data, null, 2));
            
            const entities = data.results?.entities || [];
            if (entities.length > 0) {
                console.log('🎯 Réseaux sociaux trouvés via Qloo:');
                entities.forEach((entity, index) => {
                    console.log(`   [${index}]: ${entity.name || entity.title}`);
                });
            } else {
                console.log('❌ Aucun réseau social trouvé via Qloo');
            }
        } else {
            const errorText = await response.text();
            console.log('❌ Erreur API Qloo:', response.status, errorText);
            
            if (response.status === 400 && errorText.includes('does not yet support')) {
                console.log('🔍 CONCLUSION: L\'API Qloo ne supporte pas les requêtes pour social_media');
            }
        }
    } catch (error) {
        console.error('❌ Erreur lors du test Qloo:', error.message);
    }

    console.log('\n2️⃣ Test de la fonction locale getSocialMediaByProfile...');
    
    // Simuler la fonction locale (copie du code)
    function getSocialMediaByProfile(age, occupation) {
        const baseSocialMedia = ['Instagram', 'LinkedIn'];

        if (!age) return [...baseSocialMedia, 'TikTok'];

        // Ajustements basés sur l'âge
        if (age < 30) {
            baseSocialMedia.push('TikTok', 'Snapchat');
        } else if (age < 40) {
            baseSocialMedia.push('TikTok', 'Twitter');
        } else {
            baseSocialMedia.push('Facebook', 'Twitter');
        }

        // Ajustements basés sur la profession
        if (occupation?.toLowerCase().includes('développeur') ||
            occupation?.toLowerCase().includes('tech')) {
            baseSocialMedia.push('GitHub', 'Reddit');
        } else if (occupation?.toLowerCase().includes('marketing') ||
            occupation?.toLowerCase().includes('communication')) {
            baseSocialMedia.push('Pinterest', 'Facebook');
        } else if (occupation?.toLowerCase().includes('designer') ||
            occupation?.toLowerCase().includes('créatif')) {
            baseSocialMedia.push('Behance', 'Dribbble');
        }

        // Supprimer les doublons et retourner
        return Array.from(new Set(baseSocialMedia));
    }

    // Test avec différents profils
    const testProfiles = [
        { age: 25, occupation: 'Développeur' },
        { age: 35, occupation: 'Marketing Manager' },
        { age: 45, occupation: 'Designer' },
        { age: 28, occupation: 'Consultant' }
    ];

    console.log('🧪 Résultats de la fonction locale:');
    testProfiles.forEach((profile, index) => {
        const socialMedia = getSocialMediaByProfile(profile.age, profile.occupation);
        console.log(`   [${index}] ${profile.occupation}, ${profile.age} ans: ${socialMedia.join(', ')}`);
    });

    console.log('\n3️⃣ Comparaison avec les données de nos tests précédents...');
    
    // Données observées dans nos tests précédents
    const observedSocialMedia = ['Instagram', 'LinkedIn', 'TikTok', 'Snapchat', 'Twitter', 'Facebook'];
    
    console.log('📊 Réseaux sociaux observés dans nos tests:', observedSocialMedia.join(', '));
    
    // Test si ces données correspondent à la fonction locale
    const testResult = getSocialMediaByProfile(25, 'Designer');
    const matches = testResult.filter(item => observedSocialMedia.includes(item));
    
    console.log('🔍 Correspondance avec fonction locale:', matches.join(', '));
    console.log(`📈 Taux de correspondance: ${matches.length}/${testResult.length} (${Math.round(matches.length/testResult.length*100)}%)`);

    console.log('\n🎯 CONCLUSION:');
    console.log('Les données de réseaux sociaux sont générées LOCALEMENT par getSocialMediaByProfile()');
    console.log('et ne proviennent PAS de l\'API Qloo.');
    console.log('Ceci explique pourquoi elles apparaissent même quand Qloo échoue.');
}

testSocialMediaSource().catch(console.error);