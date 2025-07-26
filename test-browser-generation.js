/**
 * Script à exécuter dans la console du navigateur (avec authentification)
 * pour tester la génération complète des personas avec données culturelles
 */

(function() {
  console.log('🧪 TEST NAVIGATEUR: Génération complète avec authentification\n');
  
  const TEST_BRIEF = {
    brief: "Créer des personas pour une application de fitness destinée aux jeunes professionnels urbains de 25-35 ans qui cherchent à maintenir un mode de vie sain malgré un emploi du temps chargé."
  };
  
  // Fonction pour analyser les données culturelles
  function analyzeCulturalData(persona, source = '') {
    const prefix = source ? `[${source}] ` : '';
    
    if (!persona.culturalData) {
      console.log(`${prefix}❌ Aucune donnée culturelle pour ${persona.name}`);
      return { hasData: false, totalElements: 0, categories: 0 };
    }
    
    const categories = [
      'music', 'movies', 'tv', 'books', 'brands', 'restaurants',
      'travel', 'fashion', 'beauty', 'food', 'socialMedia'
    ];
    
    let totalElements = 0;
    let categoriesWithData = 0;
    
    console.log(`${prefix}🎭 Données culturelles pour ${persona.name}:`);
    
    categories.forEach(category => {
      const data = persona.culturalData[category];
      if (data && Array.isArray(data) && data.length > 0) {
        console.log(`${prefix}  ✅ ${category}: ${data.length} éléments (${data.slice(0, 2).join(', ')}${data.length > 2 ? '...' : ''})`);
        totalElements += data.length;
        categoriesWithData++;
      } else {
        console.log(`${prefix}  ❌ ${category}: ${data ? 'vide' : 'manquant'}`);
      }
    });
    
    console.log(`${prefix}📊 Total: ${totalElements} éléments dans ${categoriesWithData}/${categories.length} catégories\n`);
    
    return {
      hasData: totalElements > 0,
      totalElements,
      categories: categoriesWithData
    };
  }
  
  // Test de génération avec authentification
  async function testAuthenticatedGeneration() {
    try {
      console.log('📤 Envoi de la requête authentifiée...');
      console.log('Brief:', TEST_BRIEF.brief);
      
      const response = await fetch('/api/generate-personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(TEST_BRIEF)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Réponse reçue avec succès');
      
      // Analyser la réponse
      console.log('\n📊 Analyse de la réponse:');
      console.log(`- Succès: ${data.success}`);
      console.log(`- Nombre de personas: ${data.personas?.length || 0}`);
      console.log(`- Sources: Gemini=${data.sources?.gemini}, Qloo=${data.sources?.qloo}`);
      console.log(`- Timestamp: ${data.timestamp}`);
      
      if (data.personas && data.personas.length > 0) {
        console.log('\n🔍 ANALYSE DES PERSONAS GÉNÉRÉES:');
        
        data.personas.forEach((persona, index) => {
          console.log(`\n👤 Persona ${index + 1}: ${persona.name}`);
          const analysis = analyzeCulturalData(persona, 'API');
          
          // Évaluation de la qualité
          if (analysis.totalElements >= 20 && analysis.categories >= 8) {
            console.log(`🎉 EXCELLENT: ${analysis.totalElements} éléments culturels`);
          } else if (analysis.totalElements >= 10 && analysis.categories >= 5) {
            console.log(`✅ BON: ${analysis.totalElements} éléments culturels`);
          } else if (analysis.totalElements > 0) {
            console.log(`⚠️ INSUFFISANT: ${analysis.totalElements} éléments culturels`);
          } else {
            console.log(`❌ AUCUNE DONNÉE CULTURELLE`);
          }
        });
        
        // Test de sauvegarde dans localStorage
        console.log('\n💾 TEST DE SAUVEGARDE:');
        
        // Sauvegarder l'état actuel du localStorage
        const beforePersonas = JSON.parse(localStorage.getItem('personacraft_personas') || '[]');
        const beforeCount = beforePersonas.length;
        
        console.log(`📊 Avant sauvegarde: ${beforeCount} personas`);
        
        // Simuler l'ajout des personas (comme le fait l'interface)
        const updatedPersonas = [...beforePersonas, ...data.personas];
        localStorage.setItem('personacraft_personas', JSON.stringify(updatedPersonas));
        
        // Vérifier la sauvegarde
        const afterPersonas = JSON.parse(localStorage.getItem('personacraft_personas') || '[]');
        const afterCount = afterPersonas.length;
        const newCount = afterCount - beforeCount;
        
        console.log(`📊 Après sauvegarde: ${afterCount} personas (+${newCount})`);
        
        if (newCount > 0) {
          console.log('\n🔍 VÉRIFICATION DES PERSONAS SAUVEGARDÉES:');
          const savedNewPersonas = afterPersonas.slice(-newCount);
          
          savedNewPersonas.forEach((persona, index) => {
            console.log(`\n💾 Persona sauvegardée ${index + 1}: ${persona.name}`);
            const analysis = analyzeCulturalData(persona, 'SAVED');
            
            if (analysis.hasData) {
              console.log(`✅ Données culturelles préservées: ${analysis.totalElements} éléments`);
            } else {
              console.log(`❌ Données culturelles perdues lors de la sauvegarde`);
            }
          });
          
          // Résumé final
          const savedWithCulturalData = savedNewPersonas.filter(p => 
            p.culturalData && Object.keys(p.culturalData).some(key => 
              Array.isArray(p.culturalData[key]) && p.culturalData[key].length > 0
            )
          ).length;
          
          console.log('\n📈 RÉSUMÉ FINAL:');
          console.log(`- Personas générées: ${data.personas.length}`);
          console.log(`- Personas sauvegardées: ${newCount}`);
          console.log(`- Avec données culturelles: ${savedWithCulturalData}/${newCount}`);
          
          if (savedWithCulturalData === newCount) {
            console.log('🎉 SUCCÈS COMPLET: Toutes les données culturelles sont préservées !');
          } else if (savedWithCulturalData > 0) {
            console.log('⚠️ SUCCÈS PARTIEL: Certaines données culturelles sont perdues');
          } else {
            console.log('❌ ÉCHEC: Toutes les données culturelles sont perdues');
          }
        }
        
        return data.personas;
        
      } else {
        console.log('❌ Aucune persona générée');
        return [];
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error.message);
      
      if (error.message.includes('401')) {
        console.log('\n💡 Suggestion: Assurez-vous d\'être connecté à l\'application');
      }
      return [];
    }
  }
  
  // Test de comparaison avec l'état actuel du localStorage
  function compareWithCurrentState() {
    console.log('\n🔄 COMPARAISON AVEC L\'ÉTAT ACTUEL:\n');
    
    const currentPersonas = JSON.parse(localStorage.getItem('personacraft_personas') || '[]');
    console.log(`📊 Personas actuellement en localStorage: ${currentPersonas.length}`);
    
    if (currentPersonas.length > 0) {
      console.log('\n🔍 Analyse des personas existantes:');
      
      currentPersonas.forEach((persona, index) => {
        console.log(`\n👤 Persona existante ${index + 1}: ${persona.name}`);
        const analysis = analyzeCulturalData(persona, 'EXISTING');
        
        if (analysis.hasData) {
          console.log(`✅ A des données culturelles: ${analysis.totalElements} éléments`);
        } else {
          console.log(`❌ Pas de données culturelles`);
        }
      });
      
      const existingWithCulturalData = currentPersonas.filter(p => 
        p.culturalData && Object.keys(p.culturalData).some(key => 
          Array.isArray(p.culturalData[key]) && p.culturalData[key].length > 0
        )
      ).length;
      
      console.log(`\n📊 Résumé existant: ${existingWithCulturalData}/${currentPersonas.length} personas avec données culturelles`);
    } else {
      console.log('📭 Aucune persona existante');
    }
  }
  
  // Exposer les fonctions pour utilisation manuelle
  window.testGeneration = testAuthenticatedGeneration;
  window.comparePersonas = compareWithCurrentState;
  
  // Exécuter automatiquement la comparaison
  compareWithCurrentState();
  
  console.log('\n💡 FONCTIONS DISPONIBLES:');
  console.log('- testGeneration() : Tester la génération complète');
  console.log('- comparePersonas() : Comparer l\'état actuel du localStorage');
  console.log('\n🚀 Pour tester, tapez: testGeneration()');
  
})();