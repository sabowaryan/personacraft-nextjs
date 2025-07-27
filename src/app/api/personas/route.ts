import { NextRequest, NextResponse } from 'next/server';
const { prisma } = await import('@/lib/prisma');

import { getAuthenticatedUser } from '@/lib/auth-utils';
import { QlooClient } from '@/lib/api/qloo';
import { PROMPTS, PromptManager } from '@/lib/prompts/gemini-prompts';
import { CulturalDataForPrompt, UserProfileForCulturalData } from '@/types/qloo';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Persona } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const personas = await prisma.persona.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(personas)
  } catch (error) {
    console.error('Erreur lors de la récupération des personas:', error)
    
    // Handle specific error types
    if (error instanceof Error && error.message === 'Auth timeout') {
      return NextResponse.json(
        { error: 'Timeout d\'authentification' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des personas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { brief, age, interests, values, personaCount } = body;

    if (!brief || !age || !interests || !values) {
      return NextResponse.json({ error: 'Données de profil utilisateur manquantes' }, { status: 400 });
    }

    const qlooClient = new QlooClient();
    let culturalData: CulturalDataForPrompt | null = null;
    let useFallbackFlow = false;

    const userProfile: UserProfileForCulturalData = {
      age,
      interests,
      values,
      personaCount: personaCount || 2, // Default to 2 if not provided
    };

    try {
      culturalData = await qlooClient.getPreGenerationCulturalData(userProfile);
      console.log('Données culturelles Qloo récupérées avec succès.');
    } catch (error) {
      console.error('Erreur lors de la récupération des données Qloo:', error);
      const errorObj = error instanceof Error ? error : new Error(String(error));

      // Check if it's a critical error that requires falling back to the old flow
      if (qlooClient['shouldFallbackToOldFlow'](errorObj)) { // Access private method for internal logic
        useFallbackFlow = true;
        console.warn('Basculement vers l\'ancien flux de génération de personas.');
      } else {
        // If not a critical error, still use fallback cultural data
        culturalData = qlooClient.generateFallbackCulturalData(userProfile);
        console.warn('Utilisation des données culturelles de fallback.');
      }
    }

    let generatedPersonas: Partial<Persona>[] = [];

    if (useFallbackFlow) {
      // Old flow: generate personas first, then enrich (if enrichPersonas is still relevant)
      // For now, we'll just generate with basic prompt if fallback is true
      const promptTemplate = PROMPTS.DEFAULT;
      const prompt = await PromptManager.buildPrompt(promptTemplate, brief, null, { personaCount });

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        generatedPersonas = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur de parsing JSON pour l\'ancien flux:', parseError);
        return NextResponse.json({ error: 'Erreur de format de réponse de Gemini (ancien flux)' }, { status: 500 });
      }

      // If there's an old enrichPersonas method, call it here
      // generatedPersonas = await qlooClient.enrichExistingPersonas(generatedPersonas);

    } else {
      // New flow: Qloo data first, then Gemini
      const promptTemplate = PROMPTS.DEFAULT;
      const prompt = await PromptManager.buildPrompt(promptTemplate, brief, culturalData, { personaCount });

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        generatedPersonas = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur de parsing JSON pour le nouveau flux:', parseError);
        return NextResponse.json({ error: 'Erreur de format de réponse de Gemini (nouveau flux)' }, { status: 500 });
      }
    }

    // Save generated personas to the database
    const createdPersonas = [];
    for (const personaData of generatedPersonas) {
      const persona = await prisma.persona.create({
        data: {
          userId: user.id,
          name: personaData.name || 'Persona sans nom',
          age: personaData.age || 0,
          occupation: personaData.occupation || 'Inconnu',
          location: personaData.location || 'Inconnu',
          bio: personaData.bio || 'Aucune biographie fournie.',
          quote: personaData.quote || 'Aucune citation fournie.',
          demographics: personaData.demographics || {},
          psychographics: personaData.psychographics || {},
          culturalData: culturalData || {}, // Store cultural data used for generation
          painPoints: personaData.painPoints || [],
          goals: personaData.goals || [],
          marketingInsights: personaData.marketingInsights || {},
          qualityScore: personaData.qualityScore || 0,
        },
      });
      createdPersonas.push(persona);
    }

    return NextResponse.json(createdPersonas, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la génération ou de la création des personas:', error);

    if (error instanceof Error && error.message === 'Auth timeout') {
      return NextResponse.json(
        { error: 'Timeout d\'authentification' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération ou de la création des personas' },
      { status: 500 }
    );
  }
}