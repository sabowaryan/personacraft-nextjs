import { NextRequest, NextResponse } from 'next/server';

interface PersonaData {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  demographics: {
    income: string;
    education: string;
    situation: string;
  };
  culturalData: {
    music: string;
    brands: string;
  };
  painPoints: string[];
  goals: string[];
  insights: string[];
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    const { brief } = await request.json();

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief marketing requis' },
        { status: 400 }
      );
    }

    // Appel à Google Gemini pour générer les personas de base
    const geminiPersonas = await generatePersonasWithGemini(brief);
    
    // Enrichissement avec Qloo pour les données culturelles
    const enrichedPersonas = await enrichWithQloo(geminiPersonas);

    return NextResponse.json({
      success: true,
      personas: enrichedPersonas,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors de la génération des personas:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function generatePersonasWithGemini(brief: string): Promise<PersonaData[]> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  if (!GEMINI_API_KEY) {
    throw new Error('Clé API Gemini manquante');
  }

  const prompt = `
En tant qu'expert en marketing et personas, génère exactement 2 personas détaillés basés sur ce brief marketing :

"${brief}"

Pour chaque persona, fournis les informations suivantes au format JSON :
- name: nom complet français
- age: âge entre 25-45 ans
- profession: métier spécifique
- location: ville française
- demographics: { income: "tranche de revenus", education: "niveau d'études", situation: "situation familiale" }
- painPoints: [3 points de douleur spécifiques]
- goals: [3 objectifs principaux]
- insights: [2 insights marketing pertinents]

Réponds uniquement avec un tableau JSON valide de 2 personas, sans texte supplémentaire.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur Gemini API: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Nettoyer et parser la réponse JSON
    const cleanedText = generatedText.replace(/```json|```/g, '').trim();
    const personas = JSON.parse(cleanedText);

    // Ajouter des IDs et scores
    return personas.map((persona: any, index: number) => ({
      ...persona,
      id: `persona_${Date.now()}_${index}`,
      score: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100, // Score entre 0.7 et 1.0
      culturalData: {
        music: '',
        brands: ''
      }
    }));

  } catch (error) {
    console.error('Erreur Gemini:', error);
    // Fallback avec des personas simulés
    return generateFallbackPersonas();
  }
}

async function enrichWithQloo(personas: PersonaData[]): Promise<PersonaData[]> {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com';

  if (!QLOO_API_KEY) {
    console.warn('Clé API Qloo manquante, utilisation de données simulées');
    return personas.map(persona => ({
      ...persona,
      culturalData: {
        music: 'Indie Pop, Electronic, Jazz moderne',
        brands: 'Apple, Zara, Sephora, Airbnb'
      }
    }));
  }

  try {
    const enrichedPersonas = await Promise.all(
      personas.map(async (persona) => {
        try {
          // Recherche d'entités musicales basées sur l'âge et la profession
          const musicResponse = await fetch(
            `${QLOO_API_URL}/v2/insights?filter.type=urn:entity:music&signal.demographics.age=${persona.age}-${persona.age + 5}&take=3`,
            {
              headers: {
                'X-Api-Key': QLOO_API_KEY,
                'Content-Type': 'application/json'
              }
            }
          );

          // Recherche de marques populaires
          const brandsResponse = await fetch(
            `${QLOO_API_URL}/v2/insights?filter.type=urn:entity:brand&signal.demographics.age=${persona.age}-${persona.age + 5}&take=4`,
            {
              headers: {
                'X-Api-Key': QLOO_API_KEY,
                'Content-Type': 'application/json'
              }
            }
          );

          let musicData = 'Indie Pop, Electronic, Jazz moderne';
          let brandsData = 'Apple, Zara, Sephora, Airbnb';

          if (musicResponse.ok) {
            const musicResult = await musicResponse.json();
            if (musicResult.data && musicResult.data.length > 0) {
              musicData = musicResult.data
                .slice(0, 3)
                .map((entity: any) => entity.name)
                .join(', ');
            }
          }

          if (brandsResponse.ok) {
            const brandsResult = await brandsResponse.json();
            if (brandsResult.data && brandsResult.data.length > 0) {
              brandsData = brandsResult.data
                .slice(0, 4)
                .map((entity: any) => entity.name)
                .join(', ');
            }
          }

          return {
            ...persona,
            culturalData: {
              music: musicData,
              brands: brandsData
            }
          };

        } catch (error) {
          console.error(`Erreur enrichissement Qloo pour ${persona.name}:`, error);
          return {
            ...persona,
            culturalData: {
              music: 'Indie Pop, Electronic, Jazz moderne',
              brands: 'Apple, Zara, Sephora, Airbnb'
            }
          };
        }
      })
    );

    return enrichedPersonas;

  } catch (error) {
    console.error('Erreur générale Qloo:', error);
    return personas.map(persona => ({
      ...persona,
      culturalData: {
        music: 'Indie Pop, Electronic, Jazz moderne',
        brands: 'Apple, Zara, Sephora, Airbnb'
      }
    }));
  }
}

function getAgeRange(age: number): string {
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  return '55-64';
}

function generateFallbackPersonas(): PersonaData[] {
  return [
    {
      id: `persona_${Date.now()}_0`,
      name: 'Marie Dubois',
      age: 32,
      profession: 'Chef de projet marketing',
      location: 'Paris, France',
      demographics: {
        income: '45 000 - 60 000€/an',
        education: 'Master en Marketing',
        situation: 'En couple, sans enfants'
      },
      culturalData: {
        music: 'Indie Pop, Electronic, Jazz moderne',
        brands: 'Apple, Zara, Sephora, Airbnb'
      },
      painPoints: [
        'Manque de temps pour la veille concurrentielle',
        'Difficulté à mesurer le ROI des campagnes créatives',
        'Pression pour des résultats rapides'
      ],
      goals: [
        'Optimiser les performances des campagnes digitales',
        'Développer une stratégie de contenu efficace',
        'Améliorer la mesure de l\'impact marketing'
      ],
      insights: [
        'Privilégie les outils tout-en-un pour gagner en efficacité',
        'Sensible aux solutions qui démontrent un ROI clair'
      ],
      score: 0.92
    },
    {
      id: `persona_${Date.now()}_1`,
      name: 'Thomas Martin',
      age: 28,
      profession: 'Développeur Full-Stack',
      location: 'Lyon, France',
      demographics: {
        income: '40 000 - 55 000€/an',
        education: 'École d\'ingénieur',
        situation: 'Célibataire'
      },
      culturalData: {
        music: 'Electronic, Hip-Hop, Rock alternatif',
        brands: 'Apple, Nike, Spotify, Netflix'
      },
      painPoints: [
        'Complexité des nouvelles technologies à maîtriser',
        'Équilibre vie professionnelle/personnelle difficile',
        'Besoin de formation continue'
      ],
      goals: [
        'Monter en compétences sur les technologies émergentes',
        'Contribuer à des projets innovants',
        'Développer son réseau professionnel'
      ],
      insights: [
        'Attiré par les solutions techniques élégantes',
        'Valorise l\'apprentissage et le développement personnel'
      ],
      score: 0.88
    }
  ];
}

