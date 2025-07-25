import { NextRequest, NextResponse } from 'next/server';
import { validateAndCleanPersonas } from '@/lib/persona-utils';

export async function POST(request: NextRequest) {
  try {
    const { brief } = await request.json();

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief marketing requis' },
        { status: 400 }
      );
    }

    // Étape 1: Générer les personas de base avec Gemini
    const geminiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brief })
    });

    if (!geminiResponse.ok) {
      throw new Error('Erreur lors de la génération avec Gemini');
    }

    const geminiData = await geminiResponse.json();
    
    // Étape 2: Enrichir avec les données culturelles Qloo
    const qlooResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/qloo`, {
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