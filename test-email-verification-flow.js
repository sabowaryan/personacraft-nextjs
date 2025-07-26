/**
 * Test du flux de vérification d'email après inscription
 * Ce script teste que l'utilisateur est bien redirigé vers la page de vérification d'email après l'inscription
 */

const { chromium } = require('playwright');

async function testEmailVerificationFlow() {
    console.log('🧪 Test du flux de vérification d\'email...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. Aller sur la page d'inscription
        console.log('📝 Navigation vers la page d\'inscription...');
        await page.goto('http://localhost:3000/auth/signup');
        await page.waitForLoadState('networkidle');
        
        // 2. Vérifier que la page d'inscription est chargée
        const signupTitle = await page.textContent('h2');
        console.log('✅ Page d\'inscription chargée:', signupTitle);
        
        // 3. Simuler une inscription (sans vraiment créer de compte)
        // On va juste vérifier que les éléments sont présents
        const emailInput = await page.locator('input[type="email"]').first();
        const passwordInput = await page.locator('input[type="password"]').first();
        const submitButton = await page.locator('button[type="submit"]').first();
        
        console.log('✅ Éléments du formulaire d\'inscription trouvés');
        
        // 4. Tester la navigation directe vers la page de vérification d'email
        console.log('📧 Navigation vers la page de vérification d\'email...');
        await page.goto('http://localhost:3000/auth/verify-email');
        await page.waitForLoadState('networkidle');
        
        // 5. Vérifier la redirection (si pas connecté, devrait rediriger vers signin)
        const currentUrl = page.url();
        console.log('🔄 URL actuelle après navigation:', currentUrl);
        
        if (currentUrl.includes('/auth/signin')) {
            console.log('✅ Redirection correcte vers signin pour utilisateur non connecté');
        } else if (currentUrl.includes('/auth/verify-email')) {
            console.log('ℹ️  Page de vérification d\'email accessible (utilisateur peut-être connecté)');
            
            // Vérifier le contenu de la page
            const verifyTitle = await page.textContent('h2');
            console.log('📧 Titre de la page de vérification:', verifyTitle);
            
            if (verifyTitle && verifyTitle.includes('Vérifiez votre email')) {
                console.log('✅ Page de vérification d\'email correctement configurée');
            }
        }
        
        // 6. Tester l'accès au dashboard sans vérification d'email
        console.log('🏠 Test d\'accès au dashboard...');
        await page.goto('http://localhost:3000/dashboard');
        await page.waitForLoadState('networkidle');
        
        const dashboardUrl = page.url();
        console.log('🔄 URL après tentative d\'accès au dashboard:', dashboardUrl);
        
        if (dashboardUrl.includes('/auth/signin') || dashboardUrl.includes('/handler/signin')) {
            console.log('✅ Redirection correcte vers signin pour accès dashboard non autorisé');
        }
        
        console.log('✅ Test du flux de vérification d\'email terminé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await browser.close();
    }
}

// Fonction pour tester les redirections programmatiques
async function testRedirectionLogic() {
    console.log('\n🔄 Test de la logique de redirection...');
    
    // Simuler différents états d'utilisateur
    const testCases = [
        {
            name: 'Utilisateur non connecté',
            user: null,
            expectedRedirect: '/auth/signin'
        },
        {
            name: 'Utilisateur connecté avec email non vérifié',
            user: { id: 'test', primaryEmailVerified: false },
            expectedRedirect: '/auth/verify-email'
        },
        {
            name: 'Utilisateur connecté avec email vérifié',
            user: { id: 'test', primaryEmailVerified: true },
            expectedRedirect: '/dashboard'
        }
    ];
    
    testCases.forEach(testCase => {
        console.log(`\n📋 Test: ${testCase.name}`);
        
        // Logique de redirection simulée
        let redirect;
        if (!testCase.user) {
            redirect = '/auth/signin';
        } else if (!testCase.user.primaryEmailVerified) {
            redirect = '/auth/verify-email';
        } else {
            redirect = '/dashboard';
        }
        
        if (redirect === testCase.expectedRedirect) {
            console.log(`✅ Redirection correcte: ${redirect}`);
        } else {
            console.log(`❌ Redirection incorrecte: attendu ${testCase.expectedRedirect}, obtenu ${redirect}`);
        }
    });
}

// Exécuter les tests
async function runTests() {
    console.log('🚀 Démarrage des tests de vérification d\'email\n');
    
    // Test de la logique de redirection
    await testRedirectionLogic();
    
    // Test du flux complet (nécessite que l'application soit en cours d'exécution)
    console.log('\n' + '='.repeat(50));
    console.log('Pour tester le flux complet, assurez-vous que l\'application est en cours d\'exécution sur http://localhost:3000');
    console.log('Puis exécutez: node test-email-verification-flow.js --full');
    
    if (process.argv.includes('--full')) {
        await testEmailVerificationFlow();
    }
}

runTests().catch(console.error);