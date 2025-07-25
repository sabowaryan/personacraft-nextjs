import { PersonaValidator, PersonaValidationError } from '@/lib/validators/persona-validator';

/**
 * Utilitaires de débogage pour les réponses Gemini
 */
export class GeminiDebugger {
  /**
   * Teste le parsing d'une réponse Gemini avec des détails de débogage
   */
  static debugParseResponse(rawResponse: string, brief: string = 'Test brief') {
    console.group('🔍 Debug Gemini Response');
    
    try {
      console.log('📝 Raw response:', rawResponse);
      console.log('📏 Response length:', rawResponse.length);
      
      // Tenter le parsing
      const personas = PersonaValidator.parseGeminiResponse(rawResponse, brief);
      
      console.log('✅ Parsing réussi!');
      console.log('👥 Nombre de personas:', personas.length);
      console.log('📊 Personas validés:', personas);
      
      return {
        success: true,
        personas,
        errors: []
      };
      
    } catch (error) {
      console.error('❌ Parsing échoué:', error);
      
      if (error instanceof PersonaValidationError) {
        console.error('🚨 Erreur de validation:', error.message);
      }
      
      return {
        success: false,
        personas: [],
        errors: [error instanceof Error ? error.message : 'Erreur inconnue']
      };
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Analyse la structure d'une réponse JSON
   */
  static analyzeJsonStructure(jsonString: string) {
    console.group('🔬 Analyse structure JSON');
    
    try {
      const parsed = JSON.parse(jsonString);
      
      if (Array.isArray(parsed)) {
        console.log('📋 Type: Array');
        console.log('📊 Nombre d\'éléments:', parsed.length);
        
        parsed.forEach((item, index) => {
          console.log(`\n🔸 Élément ${index + 1}:`);
          console.log('  - Type:', typeof item);
          if (typeof item === 'object' && item !== null) {
            console.log('  - Clés:', Object.keys(item));
            
            // Vérifier les champs requis
            const requiredFields = ['name', 'age', 'occupation', 'location'];
            const missingFields = requiredFields.filter(field => !(field in item));
            if (missingFields.length > 0) {
              console.warn('  ⚠️ Champs manquants:', missingFields);
            }
          }
        });
      } else {
        console.log('📄 Type: Object');
        console.log('🔑 Clés:', Object.keys(parsed));
      }
      
    } catch (error) {
      console.error('❌ JSON invalide:', error);
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Génère un exemple de réponse valide pour les tests
   */
  static generateValidExample(): string {
    const example = [
      {
        "name": "Marie Dubois",
        "age": 32,
        "occupation": "Chef de projet marketing",
        "location": "Paris, France",
        "demographics": {
          "income": "45 000 - 60 000€/an",
          "education": "Master en Marketing",
          "familyStatus": "En couple, sans enfants"
        },
        "psychographics": {
          "personality": ["Organisée", "Analytique", "Créative"],
          "values": ["Innovation", "Efficacité", "Collaboration"],
          "interests": ["Marketing digital", "Data analytics", "Tendances tech"],
          "lifestyle": "Urbaine active, équilibre travail-vie personnelle"
        },
        "painPoints": [
          "Manque de temps pour la veille concurrentielle",
          "Difficulté à mesurer le ROI des campagnes créatives",
          "Pression pour des résultats rapides"
        ],
        "goals": [
          "Optimiser les performances des campagnes digitales",
          "Développer une stratégie de contenu efficace",
          "Améliorer la mesure de l'impact marketing"
        ],
        "marketingInsights": {
          "preferredChannels": ["LinkedIn", "Email marketing"],
          "messagingTone": "Professionnel mais accessible",
          "buyingBehavior": "Recherche approfondie avant achat"
        },
        "qualityScore": 92
      },
      {
        "name": "Thomas Martin",
        "age": 28,
        "occupation": "Développeur Full-Stack",
        "location": "Lyon, France",
        "demographics": {
          "income": "40 000 - 55 000€/an",
          "education": "École d'ingénieur",
          "familyStatus": "Célibataire"
        },
        "psychographics": {
          "personality": ["Curieux", "Méthodique", "Innovant"],
          "values": ["Apprentissage continu", "Qualité du code", "Open source"],
          "interests": ["Nouvelles technologies", "Gaming", "Podcasts tech"],
          "lifestyle": "Digital nomad occasionnel, passionné de tech"
        },
        "painPoints": [
          "Complexité des nouvelles technologies à maîtriser",
          "Équilibre vie professionnelle/personnelle difficile",
          "Besoin de formation continue"
        ],
        "goals": [
          "Monter en compétences sur les technologies émergentes",
          "Contribuer à des projets innovants",
          "Développer son réseau professionnel"
        ],
        "marketingInsights": {
          "preferredChannels": ["Twitter", "Dev communities"],
          "messagingTone": "Technique et direct",
          "buyingBehavior": "Influence par les avis de pairs"
        },
        "qualityScore": 88
      }
    ];

    return JSON.stringify(example, null, 2);
  }

  /**
   * Teste la validation avec différents cas d'erreur
   */
  static testValidationCases() {
    console.group('🧪 Test des cas de validation');

    const testCases = [
      {
        name: 'Réponse valide',
        data: this.generateValidExample()
      },
      {
        name: 'JSON avec markdown',
        data: '```json\n' + this.generateValidExample() + '\n```'
      },
      {
        name: 'Âge invalide',
        data: '[{"name": "Test", "age": 15, "occupation": "Test"}]'
      },
      {
        name: 'Champ manquant',
        data: '[{"name": "Test", "age": 30}]'
      },
      {
        name: 'JSON malformé',
        data: '[{"name": "Test", "age": 30,}]'
      }
    ];

    testCases.forEach(testCase => {
      console.log(`\n🔸 Test: ${testCase.name}`);
      this.debugParseResponse(testCase.data);
    });

    console.groupEnd();
  }
}

// Export pour utilisation en développement
if (typeof window !== 'undefined') {
  (window as any).GeminiDebugger = GeminiDebugger;
}