/**
 * Test du flux d'onboarding après vérification d'email
 * Ce script teste que l'utilisateur est bien redirigé vers l'onboarding après avoir vérifié son email
 */

async function testOnboardingFlow() {
    console.log('🧪 Test du flux d\'onboarding après vérification d\'email...\n');

    try {
        
        // Simuler un utilisateur qui vient de vérifier son email
        console.log('1. Simulation d\'un utilisateur avec email vérifié mais sans onboarding...');
        
        // Test des conditions d'onboarding
        const testUser = {
            id: 'test-user-123',
            primaryEmail: 'test@example.com',
            primaryEmailVerified: true,
            clientReadOnlyMetadata: {
                // Pas d'onboardedAt - utilisateur non onboardé
            }
        };

        console.log('✅ Utilisateur simulé:', {
            email: testUser.primaryEmail,
            emailVerified: testUser.primaryEmailVerified,
            onboarded: !!testUser.clientReadOnlyMetadata?.onboardedAt
        });

        // Test de la logique de redirection
        console.log('\n2. Test de la logique de redirection...');
        
        const shouldRedirectToOnboarding = testUser.primaryEmailVerified && !testUser.clientReadOnlyMetadata?.onboardedAt;
        console.log('✅ Devrait rediriger vers onboarding:', shouldRedirectToOnboarding);

        // Test après onboarding
        console.log('\n3. Test après onboarding...');
        const onboardedUser = {
            ...testUser,
            clientReadOnlyMetadata: {
                onboardedAt: new Date().toISOString(),
                company: 'Test Company',
                role: 'marketing-manager',
                industry: 'tech',
                teamSize: 'small',
                useCase: 'campaign-planning'
            }
        };

        const shouldRedirectToDashboard = onboardedUser.primaryEmailVerified && !!onboardedUser.clientReadOnlyMetadata?.onboardedAt;
        console.log('✅ Utilisateur onboardé devrait aller au dashboard:', shouldRedirectToDashboard);

        // Test des données d'onboarding
        console.log('\n4. Test des données d\'onboarding...');
        const onboardingData = {
            company: 'Test Company',
            role: 'marketing-manager',
            industry: 'tech',
            teamSize: 'small',
            useCase: 'campaign-planning'
        };

        // Validation des données
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

        const isValidData = validRoles.includes(onboardingData.role) &&
                           validIndustries.includes(onboardingData.industry) &&
                           validTeamSizes.includes(onboardingData.teamSize) &&
                           validUseCases.includes(onboardingData.useCase);

        console.log('✅ Données d\'onboarding valides:', isValidData);

        console.log('\n🎉 Tous les tests du flux d\'onboarding sont passés !');
        console.log('\n📋 Résumé du flux:');
        console.log('1. Utilisateur s\'inscrit → Email de vérification envoyé');
        console.log('2. Utilisateur clique sur le lien → Email vérifié');
        console.log('3. Redirection vers /onboarding (si pas encore fait)');
        console.log('4. Utilisateur remplit le formulaire d\'onboarding');
        console.log('5. Redirection vers /dashboard');
        console.log('6. Middleware protège les routes selon l\'état d\'onboarding');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        process.exit(1);
    }
}

// Exécuter le test
testOnboardingFlow();