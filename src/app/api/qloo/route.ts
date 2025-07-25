import { NextRequest, NextResponse } from 'next/server';
import { getQlooClient } from '@/lib/api/qloo';

export async function POST(request: NextRequest) {
  try {
    const { personas } = await request.json();

    if (!personas || !Array.isArray(personas)) {
      return NextResponse.json(
        { error: 'Personas requis pour l\'enrichissement' },
        { status: 400 }
      );
    }

    const qlooClient = getQlooClient();
    const enrichedPersonas = await qlooClient.enrichPersonas(personas);

    return NextResponse.json({
      success: true,
      personas: enrichedPersonas,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors de l\'enrichissement Qloo:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Route pour tester la connexion Qloo
export async function GET() {
  try {
    const qlooClient = getQlooClient();
    const isConnected = await qlooClient.testConnection();
    const status = qlooClient.getApiStatus();

    return NextResponse.json({
      success: true,
      connected: isConnected,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur test connexion Qloo:', error);
    return NextResponse.json({
      success: false,
      connected: false,
      error: 'Erreur de connexion'
    });
  }
}

