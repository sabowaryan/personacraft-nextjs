/**
 * Système de prompts pour Gemini AI
 * Centralise tous les prompts pour faciliter la maintenance et les tests A/B
 */

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    template: string;
    version: string;
    language: 'fr' | 'en';
    expectedPersonaCount: number;
}

/**
 * Prompt principal pour la génération de personas
 */
export const PERSONA_GENERATION_PROMPT: PromptTemplate = {
    id: 'persona-generation-v2',
    name: 'Génération de Personas Marketing',
    description: 'Prompt optimisé pour générer des personas détaillés à partir d\'un brief marketing',
    version: '2.0',
    language: 'fr',
    expectedPersonaCount: 2,
    template: `
En tant qu'expert en marketing et personas, génère exactement {{personaCount}} personas détaillés basés sur ce brief marketing :

"{{brief}}"

Pour chaque persona, fournis les informations suivantes au format JSON strict :
- name: nom complet français
- age: âge entre {{minAge}}-{{maxAge}} ans
- occupation: métier spécifique et réaliste
- location: ville française
- bio: biographie courte et engageante (2-3 phrases) qui résume qui est cette personne
- quote: citation authentique et personnelle qui reflète sa personnalité et ses valeurs (1 phrase entre guillemets)
- demographics: { 
    income: "tranche de revenus précise", 
    education: "niveau d'études détaillé", 
    familyStatus: "situation familiale" 
  }
- psychographics: {
    personality: [{{personalityTraitCount}} traits de personnalité],
    values: [{{valuesCount}} valeurs importantes],
    interests: [{{interestsCount}} centres d'intérêt],
    lifestyle: "description détaillée du style de vie"
  }
- painPoints: [{{painPointsCount}} points de douleur spécifiques et concrets]
- goals: [{{goalsCount}} objectifs principaux mesurables]
- marketingInsights: {
    preferredChannels: [{{channelsCount}} canaux de communication préférés],
    messagingTone: "ton de communication adapté",
    buyingBehavior: "comportement d'achat détaillé"
  }
- qualityScore: nombre entre {{minQualityScore}} et {{maxQualityScore}}

CONTRAINTES IMPORTANTES:
- Réponds UNIQUEMENT avec un tableau JSON valide
- AUCUN texte supplémentaire avant ou après
- AUCUNE balise de formatage
- Assure-toi que le JSON est parfaitement formaté
- Chaque persona doit être unique et cohérent

Format exact attendu:
[{"name": "...", "age": 30, "occupation": "...", "location": "...", "bio": "...", "quote": "...", ...}, {"name": "...", "age": 35, "occupation": "...", "location": "...", "bio": "...", "quote": "...", ...}]
`
};

/**
 * Prompt alternatif pour des cas spécifiques
 */
export const PERSONA_GENERATION_SIMPLE: PromptTemplate = {
    id: 'persona-generation-simple-v1',
    name: 'Génération Simple de Personas',
    description: 'Version simplifiée pour des briefs courts ou des tests rapides',
    version: '1.0',
    language: 'fr',
    expectedPersonaCount: 2,
    template: `
Crée {{personaCount}} personas marketing pour: "{{brief}}"

Format JSON requis (réponse directe):
[{
  "name": "Prénom Nom",
  "age": nombre,
  "occupation": "métier",
  "location": "ville, France",
  "bio": "biographie courte et engageante",
  "quote": "citation personnelle authentique",
  "demographics": {"income": "revenus", "education": "études", "familyStatus": "famille"},
  "psychographics": {"personality": ["trait1", "trait2"], "values": ["valeur1", "valeur2"], "interests": ["intérêt1", "intérêt2"], "lifestyle": "style de vie"},
  "painPoints": ["problème1", "problème2", "problème3"],
  "goals": ["objectif1", "objectif2", "objectif3"],
  "marketingInsights": {"preferredChannels": ["canal1", "canal2"], "messagingTone": "ton", "buyingBehavior": "comportement"},
  "qualityScore": nombre
}]

Réponds SEULEMENT avec le JSON, rien d'autre.
`
};

/**
 * Prompt pour des personas B2B
 */
export const PERSONA_GENERATION_B2B: PromptTemplate = {
    id: 'persona-generation-b2b-v1',
    name: 'Génération Personas B2B',
    description: 'Spécialisé pour les personas en contexte professionnel B2B',
    version: '1.0',
    language: 'fr',
    expectedPersonaCount: 2,
    template: `
Génère {{personaCount}} personas B2B professionnels pour ce contexte business :

"{{brief}}"

Focus sur les aspects professionnels :
- Rôle et responsabilités dans l'entreprise
- Processus de décision d'achat
- Contraintes budgétaires et organisationnelles
- Objectifs business et KPIs
- Écosystème professionnel et influenceurs

Format JSON strict (réponse directe):
[{
  "name": "Prénom Nom",
  "age": nombre,
  "occupation": "Titre professionnel précis",
  "location": "Ville, France",
  "bio": "biographie professionnelle concise",
  "quote": "citation révélatrice de sa vision business",
  "demographics": {"income": "salaire professionnel", "education": "formation", "familyStatus": "situation"},
  "psychographics": {"personality": ["traits pro"], "values": ["valeurs business"], "interests": ["intérêts pro"], "lifestyle": "style de vie professionnel"},
  "painPoints": ["défis business spécifiques"],
  "goals": ["objectifs professionnels mesurables"],
  "marketingInsights": {"preferredChannels": ["canaux B2B"], "messagingTone": "ton professionnel", "buyingBehavior": "processus d'achat B2B"},
  "qualityScore": nombre
}]
`
};

/**
 * Configuration par défaut des variables de template
 */
export const DEFAULT_PROMPT_VARIABLES = {
    personaCount: 2,
    minAge: 25,
    maxAge: 45,
    personalityTraitCount: 3,
    valuesCount: 3,
    interestsCount: 3,
    painPointsCount: 3,
    goalsCount: 3,
    channelsCount: 2,
    minQualityScore: 75,
    maxQualityScore: 95
};

/**
 * Classe pour gérer les prompts et leurs variables
 */
export class PromptManager {
    /**
     * Construit un prompt en remplaçant les variables
     */
    static buildPrompt(
        template: PromptTemplate,
        brief: string,
        variables: Partial<typeof DEFAULT_PROMPT_VARIABLES> = {}
    ): string {
        const finalVariables = { ...DEFAULT_PROMPT_VARIABLES, ...variables };

        let prompt = template.template;

        // Remplacer le brief
        prompt = prompt.replace(/\{\{brief\}\}/g, brief);

        // Remplacer toutes les variables
        Object.entries(finalVariables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            prompt = prompt.replace(regex, value.toString());
        });

        return prompt.trim();
    }

    /**
     * Obtient un prompt par son ID
     */
    static getPromptById(id: string): PromptTemplate | null {
        const prompts = [
            PERSONA_GENERATION_PROMPT,
            PERSONA_GENERATION_SIMPLE,
            PERSONA_GENERATION_B2B
        ];

        return prompts.find(p => p.id === id) || null;
    }

    /**
     * Liste tous les prompts disponibles
     */
    static getAllPrompts(): PromptTemplate[] {
        return [
            PERSONA_GENERATION_PROMPT,
            PERSONA_GENERATION_SIMPLE,
            PERSONA_GENERATION_B2B
        ];
    }

    /**
     * Valide qu'un prompt contient toutes les variables nécessaires
     */
    static validatePrompt(template: PromptTemplate): { valid: boolean; missingVariables: string[] } {
        const requiredVariables = ['brief'];
        const missingVariables: string[] = [];

        requiredVariables.forEach(variable => {
            if (!template.template.includes(`{{${variable}}}`)) {
                missingVariables.push(variable);
            }
        });

        return {
            valid: missingVariables.length === 0,
            missingVariables
        };
    }

    /**
     * Génère un prompt de test avec des données d'exemple
     */
    static generateTestPrompt(templateId: string = 'persona-generation-v2'): string {
        const template = this.getPromptById(templateId);
        if (!template) {
            throw new Error(`Template ${templateId} non trouvé`);
        }

        const testBrief = "Lancement d'une application mobile de fitness pour les professionnels urbains actifs qui manquent de temps pour aller en salle de sport.";

        return this.buildPrompt(template, testBrief);
    }
}

// Export des prompts les plus utilisés pour un accès rapide
export const PROMPTS = {
    DEFAULT: PERSONA_GENERATION_PROMPT,
    SIMPLE: PERSONA_GENERATION_SIMPLE,
    B2B: PERSONA_GENERATION_B2B
} as const;

export type PromptType = keyof typeof PROMPTS;