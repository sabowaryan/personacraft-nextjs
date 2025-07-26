import { NextRequest, NextResponse } from 'next/server';
import { validateAndCleanPersonas } from '@/lib/persona-utils';
import { permissionService } from '@/services/permissionService';
import { getStackServerApp } from '@/stack-server';

export async function POST(request: NextRequest) {
  try {
    const { brief } = await request.json();

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief marketing requis' },
        { status: 400 }
      );
    }
    const stackServerApp = await getStackServerApp();
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    // Vérifier la limite de personas
    const canGenerate = await permissionService.checkPersonaLimit(user.id);
    if (!canGenerate) {
      return NextResponse.json({ error: 'Limite de personas atteinte pour votre plan.' }, { status: 403 });
    }

    // Récupérer les données d'onboarding pour personnaliser la génération
    const onboardingData = user.clientReadOnlyMetadata;
    let userContext = '';

    if (onboardingData?.onboarded) {
      const roleContexts = {
        'marketing-manager': 'en tant que directeur marketing expérimenté',
        'growth-hacker': 'avec une approche growth hacking',
        'product-manager': 'du point de vue d\'un chef de produit',
        'consultant': 'avec l\'expertise d\'un consultant marketing',
        'entrepreneur': 'avec la vision d\'un entrepreneur',
        'freelancer': 'avec l\'agilité d\'un freelance',
        'other': 'avec votre expertise unique'
      };

      const industryContexts = {
        'tech': 'dans le secteur technologique',
        'ecommerce': 'dans l\'e-commerce',
        'saas': 'dans l\'univers SaaS',
        'fashion': 'dans l\'industrie de la mode',
        'health': 'dans le domaine de la santé',
        'finance': 'dans le secteur financier',
        'education': 'dans l\'éducation',
        'consulting': 'dans le conseil',
        'other': 'dans votre secteur d\'activité'
      };

      const contexts = [];
      if (onboardingData.role && roleContexts[onboardingData.role as keyof typeof roleContexts]) {
        contexts.push(roleContexts[onboardingData.role as keyof typeof roleContexts]);
      }
      if (onboardingData.industry && industryContexts[onboardingData.industry as keyof typeof industryContexts]) {
        contexts.push(industryContexts[onboardingData.industry as keyof typeof industryContexts]);
      }

      userContext = contexts.join(', ');
    }

    // Étape 1: Générer les personas de base avec Gemini
    const geminiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brief,
        userContext: userContext || undefined
      })
    });

    if (!geminiResponse.ok) {
      throw new Error('Erreur lors de la génération avec Gemini');
    }

    const geminiData = await geminiResponse.json();

    // Étape 2: Enrichir avec les données culturelles Qloo
    const qlooResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/qloo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personas: geminiData.personas })
    });

    let enrichedPersonas = geminiData.personas;

    if (qlooResponse.ok) {
      const qlooData = await qlooResponse.json();
      enrichedPersonas = qlooData.personas;
    } else {
      console.warn('Enrichissement Qloo échoué, utilisation des personas Gemini seuls');
    }

    // Étape 3: Valider et nettoyer les personas avant de les retourner
    const validatedPersonas = validateAndCleanPersonas(enrichedPersonas);

    return NextResponse.json({
      success: true,
      personas: validatedPersonas,
      timestamp: new Date().toISOString(),
      sources: {
        gemini: geminiResponse.ok,
        qloo: qlooResponse.ok
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération des personas:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

