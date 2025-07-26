# Flux d'Onboarding après Vérification d'Email

## Vue d'ensemble

Ce document décrit le flux d'onboarding qui se déclenche automatiquement après la vérification d'email d'un nouvel utilisateur.

## Flux Complet

### 1. Inscription
- L'utilisateur s'inscrit via `/auth/signup`
- Un email de vérification est automatiquement envoyé
- L'utilisateur est redirigé vers `/auth/verify-email`

### 2. Vérification d'Email
- L'utilisateur clique sur le lien dans l'email
- Il est redirigé vers `/handler/email-verification`
- Stack Auth vérifie automatiquement l'email
- **NOUVEAU**: Après vérification, redirection vers `/onboarding` (au lieu de `/dashboard`)

### 3. Onboarding
- L'utilisateur remplit le formulaire d'onboarding avec :
  - Entreprise/organisation
  - Rôle professionnel
  - Secteur d'activité
  - Taille de l'équipe
  - Principal cas d'usage
- Les données sont sauvegardées dans `user.clientReadOnlyMetadata`
- Après soumission, redirection vers `/dashboard`

### 4. Protection par Middleware
- Le middleware vérifie l'état d'onboarding pour toutes les routes protégées
- Si l'utilisateur n'est pas onboardé, redirection automatique vers `/onboarding`
- Si l'utilisateur est déjà onboardé et accède à `/onboarding`, redirection vers `/dashboard`

## Fichiers Modifiés

### 1. `/src/app/handler/email-verification/page.tsx`
```typescript
// Redirection après succès - vérifier si l'onboarding est nécessaire
setTimeout(() => {
  const isOnboarded = user?.clientReadOnlyMetadata?.onboardedAt;
  
  if (!isOnboarded) {
    router.push('/onboarding');
  } else {
    const redirectUrl = afterAuthReturnTo ?
      decodeURIComponent(afterAuthReturnTo) : '/dashboard';
    router.push(redirectUrl);
  }
}, 2000);
```

### 2. `/src/app/auth/verify-email/page.tsx`
```typescript
// Si l'email est déjà vérifié, rediriger vers l'onboarding ou le dashboard
if (user.primaryEmailVerified) {
    const isOnboarded = user?.clientReadOnlyMetadata?.onboardedAt;
    router.push(isOnboarded ? '/dashboard' : '/onboarding');
    return;
}
```

### 3. `/src/middleware.ts`
```typescript
// Vérification de l'onboarding pour les routes protégées (sauf /onboarding)
const isOnboardingRoute = request.nextUrl.pathname === '/onboarding';
if (isProtectedRoute && !isOnboardingRoute && user && user.primaryEmailVerified) {
  const isOnboarded = user.clientReadOnlyMetadata?.onboardedAt;
  if (!isOnboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
}

// Si l'utilisateur est déjà onboardé et essaie d'accéder à /onboarding
if (isOnboardingRoute && user && user.primaryEmailVerified) {
  const isOnboarded = user.clientReadOnlyMetadata?.onboardedAt;
  if (isOnboarded) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

### 4. `/src/hooks/useOnboarding.ts`
```typescript
useEffect(() => {
  // Ne pas rediriger si on est déjà sur la page d'onboarding
  if (user && !user.clientReadOnlyMetadata?.onboardedAt && pathname !== '/onboarding') {
    router.push('/onboarding');
  }
}, [user, router, pathname]);
```

## États Utilisateur

### Nouvel Utilisateur (après inscription)
- `primaryEmailVerified: false`
- `clientReadOnlyMetadata.onboardedAt: undefined`
- **Redirection**: `/auth/verify-email`

### Email Vérifié, Non Onboardé
- `primaryEmailVerified: true`
- `clientReadOnlyMetadata.onboardedAt: undefined`
- **Redirection**: `/onboarding`

### Email Vérifié et Onboardé
- `primaryEmailVerified: true`
- `clientReadOnlyMetadata.onboardedAt: "2024-01-01T00:00:00.000Z"`
- **Redirection**: `/dashboard`

## Données d'Onboarding

Les données collectées sont stockées dans `user.clientReadOnlyMetadata` :

```typescript
{
  onboarded: true,
  company: string,
  role: 'marketing-manager' | 'growth-hacker' | 'product-manager' | 'consultant' | 'entrepreneur' | 'freelancer' | 'other',
  industry: 'tech' | 'ecommerce' | 'saas' | 'fashion' | 'health' | 'finance' | 'education' | 'consulting' | 'other',
  teamSize: 'solo' | 'small' | 'medium' | 'large' | 'enterprise',
  useCase: 'campaign-planning' | 'content-strategy' | 'product-development' | 'market-research' | 'client-work' | 'personal-project',
  onboardedAt: string // ISO date
}
```

## Avantages

1. **Expérience Utilisateur Améliorée**: L'onboarding se fait naturellement après la vérification d'email
2. **Données Utilisateur Enrichies**: Collecte d'informations précieuses dès le début
3. **Personnalisation**: Les données d'onboarding peuvent être utilisées pour personnaliser l'expérience
4. **Protection Robuste**: Le middleware garantit que tous les utilisateurs passent par l'onboarding

## Test

Exécuter le test avec :
```bash
node test-onboarding-flow.js
```

Ce test vérifie la logique de redirection et la validation des données d'onboarding.