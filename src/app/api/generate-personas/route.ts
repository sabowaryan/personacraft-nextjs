import { NextRequest, NextResponse } from 'next/server';
import { validateAndCleanPersonas } from '@/lib/persona-utils';
import { permissionService } from '@/services/permissionService';
import { stackServerApp } from '../../../../stack';

export async function POST(request: NextRequest) {
  try {
    const { brief } = await request.json();

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief marketing requis' },
        { status: 400 }
      );
    }

    const session = await stackServerApp.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    // Vérifier la limite de personas
    const canGenerate = await permissionService.checkPersonaLimit(session.user.id);
    if (!canGenerate) {
      return NextResponse.json({ error: 'Limite de personas atteinte pour votre plan.' }, { status: 403 });
    }

    // Étape 1: Générer les personas de base avec Gemini
    const geminiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/gemini`, {
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

