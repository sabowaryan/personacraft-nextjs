import { NextRequest, NextResponse } from 'next/server';
import { getStackServerApp } from '@/stack-server'

export async function POST(request: NextRequest) {
  try {
    const stackServerApp = await getStackServerApp();
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { company, role, industry, teamSize, useCase } = body;

    // Validation des données
    if (!company || !role || !industry || !teamSize || !useCase) {
      return NextResponse.json({ 
        error: 'Tous les champs sont requis' 
      }, { status: 400 });
    }

    // Validation des valeurs autorisées
    const validRoles = [
      'marketing-manager', 'growth-hacker', 'product-manager', 
      'consultant', 'entrepreneur', 'freelancer', 'other'
    ];
    const validIndustries = [
      'tech', 'ecommerce', 'saas', 'fashion', 'health', 
      'finance', 'education', 'consulting', 'other'
    ];
    const validTeamSizes = ['solo', 'small', 'medium', 'large', 'enterprise'];
    const validUseCases = [
      'campaign-planning', 'content-strategy', 'product-development',
      'market-research', 'client-work', 'personal-project'
    ];

    if (!validRoles.includes(role) || 
        !validIndustries.includes(industry) ||
        !validTeamSizes.includes(teamSize) ||
        !validUseCases.includes(useCase)) {
      return NextResponse.json({ 
        error: 'Valeurs non valides' 
      }, { status: 400 });
    }

    // Mise à jour sécurisée avec clientReadOnlyMetadata
    await user.update({
      clientReadOnlyMetadata: {
        onboarded: true,
        company,
        role,
        industry,
        teamSize,
        useCase,
        onboardedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'onboarding:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}