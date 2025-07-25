/**
 * Utilitaire pour tester et déboguer les prompts Gemini
 */

import { PromptManager, PROMPTS, PromptType, DEFAULT_PROMPT_VARIABLES } from '@/lib/prompts/gemini-prompts';

export interface PromptTestResult {
  promptType: PromptType;
  brief: string;
  variables: Partial<typeof DEFAULT_PROMPT_VARIABLES>;
  generatedPrompt: string;
  promptLength: number;
  containsExpectedElements: {
    brief: boolean;
    personaCount: boolean;
    ageRange: boolean;
    jsonFormat: boolean;
  };
  estimatedTokens: number;
}

export class PromptTester {
  /**
   * Teste un prompt avec un brief donné
   */
  static testPrompt(
    promptType: PromptType,
    brief: string,
    variables: Partial<typeof DEFAULT_PROMPT_VARIABLES> = {}
  ): PromptTestResult {
    const template = PROMPTS[promptType];
    const generatedPrompt = PromptManager.buildPrompt(template, brief, variables);
    const finalVariables = { ...DEFAULT_PROMPT_VARIABLES, ...variables };

    return {
      promptType,
      brief,
      variables: finalVariables,
      generatedPrompt,
      promptLength: generatedPrompt.length,
      containsExpectedElements: {
        brief: generatedPrompt.includes(brief),
        personaCount: generatedPrompt.includes(finalVariables.personaCount.toString()),
        ageRange: generatedPrompt.includes(`${finalVariables.minAge}-${finalVariables.maxAge}`),
        jsonFormat: generatedPrompt.toLowerCase().includes('json')
      },
      estimatedTokens: Math.ceil(generatedPrompt.length / 4) // Estimation approximative
    };
  }

  /**
   * Teste tous les types de prompts avec le même brief
   */
  static testAllPrompts(
    brief: string,
    variables: Partial<typeof DEFAULT_PROMPT_VARIABLES> = {}
  ): PromptTestResult[] {
    const promptTypes: PromptType[] = ['DEFAULT', 'SIMPLE', 'B2B'];
    
    return promptTypes.map(type => this.testPrompt(type, brief, variables));
  }

  /**
   * Compare deux prompts côte à côte
   */
  static comparePrompts(
    promptType1: PromptType,
    promptType2: PromptType,
    brief: string,
    variables: Partial<typeof DEFAULT_PROMPT_VARIABLES> = {}
  ): {
    prompt1: PromptTestResult;
    prompt2: PromptTestResult;
    comparison: {
      lengthDifference: number;
      tokenDifference: number;
      commonElements: string[];
      uniqueToPrompt1: string[];
      uniqueToPrompt2: string[];
    };
  } {
    const prompt1 = this.testPrompt(promptType1, brief, variables);
    const prompt2 = this.testPrompt(promptType2, brief, variables);

    // Analyse simple des différences
    const words1 = new Set(prompt1.generatedPrompt.toLowerCase().split(/\s+/));
    const words2 = new Set(prompt2.generatedPrompt.toLowerCase().split(/\s+/));
    
    const commonElements = Array.from(words1).filter(word => words2.has(word));
    const uniqueToPrompt1 = Array.from(words1).filter(word => !words2.has(word));
    const uniqueToPrompt2 = Array.from(words2).filter(word => !words1.has(word));

    return {
      prompt1,
      prompt2,
      comparison: {
        lengthDifference: prompt2.promptLength - prompt1.promptLength,
        tokenDifference: prompt2.estimatedTokens - prompt1.estimatedTokens,
        commonElements: commonElements.slice(0, 10), // Limiter pour la lisibilité
        uniqueToPrompt1: uniqueToPrompt1.slice(0, 10),
        uniqueToPrompt2: uniqueToPrompt2.slice(0, 10)
      }
    };
  }

  /**
   * Génère un rapport de test complet
   */
  static generateTestReport(brief: string): string {
    const results = this.testAllPrompts(brief);
    
    let report = `# Rapport de test des prompts\n\n`;
    report += `**Brief testé**: ${brief}\n\n`;
    
    results.forEach(result => {
      report += `## ${result.promptType}\n`;
      report += `- **Longueur**: ${result.promptLength} caractères\n`;
      report += `- **Tokens estimés**: ${result.estimatedTokens}\n`;
      report += `- **Contient le brief**: ${result.containsExpectedElements.brief ? '✅' : '❌'}\n`;
      report += `- **Contient le nombre de personas**: ${result.containsExpectedElements.personaCount ? '✅' : '❌'}\n`;
      report += `- **Contient la tranche d'âge**: ${result.containsExpectedElements.ageRange ? '✅' : '❌'}\n`;
      report += `- **Mentionne le format JSON**: ${result.containsExpectedElements.jsonFormat ? '✅' : '❌'}\n\n`;
    });

    // Comparaisons
    report += `## Comparaisons\n\n`;
    const comparison = this.comparePrompts('DEFAULT', 'SIMPLE', brief);
    report += `**DEFAULT vs SIMPLE**:\n`;
    report += `- Différence de longueur: ${comparison.comparison.lengthDifference} caractères\n`;
    report += `- Différence de tokens: ${comparison.comparison.tokenDifference} tokens\n\n`;

    const comparisonB2B = this.comparePrompts('DEFAULT', 'B2B', brief);
    report += `**DEFAULT vs B2B**:\n`;
    report += `- Différence de longueur: ${comparisonB2B.comparison.lengthDifference} caractères\n`;
    report += `- Différence de tokens: ${comparisonB2B.comparison.tokenDifference} tokens\n\n`;

    return report;
  }

  /**
   * Valide qu'un prompt respecte les bonnes pratiques
   */
  static validatePromptQuality(result: PromptTestResult): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Vérifications de base
    if (!result.containsExpectedElements.brief) {
      issues.push('Le brief n\'est pas présent dans le prompt');
      score -= 20;
    }

    if (!result.containsExpectedElements.jsonFormat) {
      issues.push('Le format JSON n\'est pas mentionné');
      score -= 15;
    }

    if (!result.containsExpectedElements.personaCount) {
      issues.push('Le nombre de personas n\'est pas spécifié');
      score -= 10;
    }

    // Vérifications de longueur
    if (result.promptLength > 2000) {
      issues.push('Le prompt est très long (>2000 caractères)');
      recommendations.push('Considérer une version plus concise');
      score -= 5;
    }

    if (result.promptLength < 500) {
      issues.push('Le prompt est très court (<500 caractères)');
      recommendations.push('Ajouter plus de contexte et d\'instructions');
      score -= 10;
    }

    // Vérifications de tokens
    if (result.estimatedTokens > 500) {
      recommendations.push('Le prompt consomme beaucoup de tokens, optimiser si possible');
    }

    // Vérifications de contenu
    const prompt = result.generatedPrompt.toLowerCase();
    
    if (!prompt.includes('json')) {
      issues.push('Le format JSON n\'est pas clairement spécifié');
      score -= 10;
    }

    if (!prompt.includes('français') && !prompt.includes('france')) {
      recommendations.push('Spécifier la langue/localisation si nécessaire');
    }

    if (prompt.includes('markdown') || prompt.includes('```')) {
      issues.push('Le prompt mentionne le markdown, ce qui peut créer de la confusion');
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }
}

// Exemples de briefs pour les tests
export const TEST_BRIEFS = {
  FITNESS: "Application mobile de fitness pour professionnels urbains actifs",
  ECOMMERCE: "Plateforme e-commerce de vêtements éthiques pour millennials",
  B2B_SAAS: "Solution SaaS de gestion de projet pour équipes agiles",
  FOOD_DELIVERY: "Service de livraison de repas healthy à domicile",
  FINTECH: "Application de gestion budgétaire pour jeunes actifs",
  EDUCATION: "Plateforme d'apprentissage en ligne pour reconversion professionnelle"
} as const;