/**
 * Script de débogage pour examiner le contenu du localStorage des personas
 * À exécuter dans la console du navigateur
 */

(function() {
  console.log('🔍 DÉBOGAGE: Analyse du localStorage des personas\n');
  
  // Fonction pour analyser les données du localStorage
  function analyzeLocalStorage() {
    try {
      // Récupérer les données brutes
      const rawData = localStorage.getItem('personacraft_personas');
      
      if (!rawData) {
        console.log('❌ Aucune donnée trouvée dans localStorage.personacraft_personas');
        return;
      }
      
      console.log('✅ Données brutes trouvées');
      console.log('📏 Taille des données:', rawData.length, 'caractères');
      
      // Parser les données
      let personas;
      try {
        personas = JSON.parse(rawData);
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError.message);
        console.log('🔍 Début des données brutes:', rawData.substring(0, 200) + '...');
        return;
      }
      
      if (!Array.isArray(personas)) {
        console.log('❌ Les données ne sont pas un tableau');
        return;
      }
      
      console.log(`📊 Nombre de personas: ${personas.length}\n`);
      
      // Analyser chaque persona
      personas.forEach((persona, index) => {
        console.log(`👤 PERSONA ${index + 1}: ${persona.name || 'Sans nom'}`);
        console.log(`   ID: ${persona.id || 'N/A'}`);
        console.log(`   Âge: ${persona.age || 'N/A'}`);
        console.log(`   Profession: ${persona.occupation || 'N/A'}`);
        console.log(`   Localisation: ${persona.location || 'N/A'}`);
        console.log(`   Date de création: ${persona.createdAt || 'N/A'}`);
        
        // Analyser les données culturelles en détail
        if (persona.culturalData) {
          console.log('   🎭 DONNÉES CULTURELLES:');
          
          const categories = [
            'music', 'movies', 'tv', 'books', 'brands', 'restaurants',
            'travel', 'fashion', 'beauty', 'food', 'socialMedia',
            'podcasts', 'videoGames', 'influencers'
          ];
          
          let totalElements = 0;
          let categoriesWithData = 0;
          
          categories.forEach(category => {
            const data = persona.culturalData[category];
            if (data !== undefined) {
              if (Array.isArray(data) && data.length > 0) {
                console.log(`     ✅ ${category}: ${data.length} éléments`);
                console.log(`        Exemples: ${data.slice(0, 3).join(', ')}${data.length > 3 ? '...' : ''}`);
                totalElements += data.length;
                categoriesWithData++;
              } else if (Array.isArray(data)) {
                console.log(`     ⚠️ ${category}: tableau vide`);
              } else {
                console.log(`     ❌ ${category}: type incorrect (${typeof data}):`, data);
              }
            } else {
              console.log(`     ❌ ${category}: manquant`);
            }
          });
          
          console.log(`   📊 Total: ${totalElements} éléments dans ${categoriesWithData}/${categories.length} catégories`);
          
          // Vérifier s'il y a des catégories supplémentaires
          const extraCategories = Object.keys(persona.culturalData).filter(key => !categories.includes(key));
          if (extraCategories.length > 0) {
            console.log(`   🔍 Catégories supplémentaires: ${extraCategories.join(', ')}`);
          }
          
        } else {
          console.log('   ❌ AUCUNE DONNÉE CULTURELLE');
        }
        
        // Analyser d'autres champs importants
        console.log('   📋 AUTRES DONNÉES:');
        console.log(`     - Points de douleur: ${persona.painPoints?.length || 0} éléments`);
        console.log(`     - Objectifs: ${persona.goals?.length || 0} éléments`);
        console.log(`     - Score qualité: ${persona.qualityScore || 'N/A'}`);
        
        if (persona.psychographics) {
          console.log(`     - Intérêts: ${persona.psychographics.interests?.length || 0} éléments`);
          console.log(`     - Valeurs: ${persona.psychographics.values?.length || 0} éléments`);
        }
        
        console.log(''); // Ligne vide entre les personas
      });
      
      // Résumé global
      const personasWithCulturalData = personas.filter(p => 
        p.culturalData && Object.keys(p.culturalData).some(key => 
          Array.isArray(p.culturalData[key]) && p.culturalData[key].length > 0
        )
      ).length;
      
      console.log('📈 RÉSUMÉ GLOBAL:');
      console.log(`- Total personas: ${personas.length}`);
      console.log(`- Avec données culturelles: ${personasWithCulturalData}/${personas.length}`);
      console.log(`- Pourcentage: ${Math.round((personasWithCulturalData / personas.length) * 100)}%`);
      
      if (personasWithCulturalData === personas.length) {
        console.log('🎉 PARFAIT: Toutes les personas ont des données culturelles');
      } else if (personasWithCulturalData > 0) {
        console.log('⚠️ PARTIEL: Certaines personas manquent de données culturelles');
      } else {
        console.log('❌ PROBLÈME: Aucune persona n\'a de données culturelles');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse:', error);
    }
  }
  
  // Fonction pour nettoyer le localStorage (utile pour les tests)
  function clearPersonas() {
    localStorage.removeItem('personacraft_personas');
    console.log('🧹 localStorage nettoyé');
  }
  
  // Fonction pour créer un persona de test avec données culturelles
  function createTestPersona() {
    const testPersona = {
      id: 'debug-test-' + Date.now(),
      name: 'Persona de Test',
      age: 30,
      occupation: 'Testeur',
      location: 'Test City',
      demographics: {
        income: '40000-50000€',
        education: 'Master',
        familyStatus: 'Célibataire'
      },
      psychographics: {
        personality: ['Analytique', 'Curieux'],
        values: ['Qualité', 'Innovation'],
        interests: ['Technologie', 'Tests'],
        lifestyle: 'Digital'
      },
      culturalData: {
        music: ['Test Music 1', 'Test Music 2', 'Test Music 3'],
        movies: ['Test Movie 1', 'Test Movie 2'],
        tv: ['Test TV 1', 'Test TV 2', 'Test TV 3'],
        books: ['Test Book 1', 'Test Book 2'],
        brands: ['Test Brand 1', 'Test Brand 2', 'Test Brand 3', 'Test Brand 4'],
        restaurants: ['Test Restaurant 1', 'Test Restaurant 2'],
        travel: ['Test Destination 1', 'Test Destination 2'],
        fashion: ['Test Fashion 1', 'Test Fashion 2'],
        beauty: ['Test Beauty 1', 'Test Beauty 2'],
        food: ['Test Food 1', 'Test Food 2'],
        socialMedia: ['Instagram', 'LinkedIn', 'Twitter'],
        podcasts: ['Test Podcast 1', 'Test Podcast 2'],
        videoGames: ['Test Game 1', 'Test Game 2'],
        influencers: ['Test Influencer 1', 'Test Influencer 2']
      },
      painPoints: ['Test Pain 1', 'Test Pain 2'],
      goals: ['Test Goal 1', 'Test Goal 2'],
      marketingInsights: {
        preferredChannels: ['Email', 'Social'],
        messagingTone: 'Professionnel',
        buyingBehavior: 'Réfléchi'
      },
      qualityScore: 90,
      createdAt: new Date().toISOString()
    };
    
    // Ajouter au localStorage
    const existingPersonas = JSON.parse(localStorage.getItem('personacraft_personas') || '[]');
    existingPersonas.push(testPersona);
    localStorage.setItem('personacraft_personas', JSON.stringify(existingPersonas));
    
    console.log('✅ Persona de test créé avec données culturelles complètes');
    return testPersona;
  }
  
  // Fonction pour comparer avant/après génération
  function compareBeforeAfter() {
    console.log('🔄 COMPARAISON: Avant/Après génération\n');
    
    // Sauvegarder l'état actuel
    const beforeData = localStorage.getItem('personacraft_personas');
    const beforeCount = beforeData ? JSON.parse(beforeData).length : 0;
    
    console.log(`📊 Avant: ${beforeCount} personas`);
    
    // Fonction à appeler après génération
    window.debugAfterGeneration = function() {
      const afterData = localStorage.getItem('personacraft_personas');
      const afterCount = afterData ? JSON.parse(afterData).length : 0;
      const newPersonas = afterCount - beforeCount;
      
      console.log(`📊 Après: ${afterCount} personas (+${newPersonas})`);
      
      if (newPersonas > 0) {
        const allPersonas = JSON.parse(afterData);
        const recentPersonas = allPersonas.slice(-newPersonas);
        
        console.log('🆕 Nouveaux personas:');
        recentPersonas.forEach((persona, index) => {
          console.log(`   ${index + 1}. ${persona.name}`);
          const hasCulturalData = persona.culturalData && 
            Object.keys(persona.culturalData).some(key => 
              Array.isArray(persona.culturalData[key]) && persona.culturalData[key].length > 0
            );
          console.log(`      Données culturelles: ${hasCulturalData ? '✅' : '❌'}`);
        });
      }
    };
    
    console.log('💡 Générez maintenant des personas, puis tapez: debugAfterGeneration()');
  }
  
  // Exposer les fonctions globalement pour utilisation dans la console
  window.analyzePersonas = analyzeLocalStorage;
  window.clearPersonas = clearPersonas;
  window.createTestPersona = createTestPersona;
  window.compareBeforeAfter = compareBeforeAfter;
  
  // Exécuter l'analyse automatiquement
  analyzeLocalStorage();
  
  console.log('\n💡 FONCTIONS DISPONIBLES:');
  console.log('- analyzePersonas() : Analyser le localStorage');
  console.log('- clearPersonas() : Nettoyer le localStorage');
  console.log('- createTestPersona() : Créer un persona de test');
  console.log('- compareBeforeAfter() : Comparer avant/après génération');
  
})();