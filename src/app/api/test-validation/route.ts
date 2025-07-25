import { NextRequest, NextResponse } from 'next/server';
import { GeminiDebugger } from '@/lib/debug/gemini-debug';
import { PersonaValidator } from '@/lib/validators/persona-validator';

export async function GET() {
  try {
    // Test avec un exemple valide
    const validExample = GeminiDebugger.generateValidExample();
    const debugResult = GeminiDebugger.debugParseResponse(validExample, 'Test brief');

    return NextResponse.json({
      success: true,
      message: 'Test de validation réussi',
      result: debugResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors du test de validation:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rawResponse, brief } = await request.json();

    if (!rawResponse) {
      return NextResponse.json(
        { error: 'rawResponse requis pour le test' },
        { status: 400 }
      );
    }

    // Tester le parsing avec la réponse fournie
    const debugResult = GeminiDebugger.debugParseResponse(
      rawResponse, 
      brief || 'Test brief'
    );

    return NextResponse.json({
      success: true,
      message: 'Test de parsing personnalisé',
      result: debugResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors du test personnalisé:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}