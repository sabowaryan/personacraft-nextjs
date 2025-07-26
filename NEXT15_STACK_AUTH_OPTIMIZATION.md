# Guide d'Optimisation Next.js 15 + Stack Auth

## 🚀 Problème Résolu
Les builds Next.js 15 avec Stack Auth peuvent être très lents (>10 minutes) et consommer beaucoup de mémoire (>4GB). Ce guide applique les optimisations les plus efficaces.

## ✅ Optimisations Appliquées

### 1. Configuration Next.js Optimisée
- **webpackMemoryOptimizations**: Nouveau dans Next.js 15, réduit l'utilisation mémoire
- **optimizePackageImports**: Optimise spécifiquement Stack Auth et Gemini AI
- **Turbo rules**: Accélère le traitement des templates
- **Split chunks**: Sépare Stack Auth dans son propre chunk

### 2. Scripts de Build Optimisés
```bash
# Build standard optimisé
npm run build

# Build rapide (skip validations)
npm run build:fast

# Build avec monitoring mémoire
npm run build:optimized
```

### 3. Configuration Mémoire
- **NODE_OPTIONS**: `--max-old-space-size=4096` (4GB au lieu de 1.4GB par défaut)
- **SKIP_ENV_VALIDATION**: Accélère les builds de développement
- **NEXT_TELEMETRY_DISABLED**: Réduit les appels réseau

### 4. Optimisations Stack Auth
- Configuration optimisée dans `src/lib/stack-config-optimized.ts`
- Lazy loading des composants Stack Auth
- Types optimisés pour réduire les imports

## 📊 Résultats Attendus

### Avant Optimisation
- ⏱️ Temps de build: 8-15 minutes
- 🧠 Mémoire utilisée: 4-6 GB
- 📦 Taille du bundle: Non optimisée
- ❌ Échecs fréquents par manque de mémoire

### Après Optimisation
- ⏱️ Temps de build: 3-6 minutes (-50-60%)
- 🧠 Mémoire utilisée: 2-3 GB (-40-50%)
- 📦 Taille du bundle: Optimisée avec code splitting
- ✅ Builds stables et reproductibles

## 🛠️ Utilisation

### Build Local
```bash
# Build optimisé avec monitoring
npm run build:optimized

# Build rapide pour développement
npm run build:fast
```

### Déploiement Vercel
Le script `vercel-build` est automatiquement optimisé avec les bonnes variables d'environnement.

### Variables d'Environnement
Copiez `.env.local.example` vers `.env.local` et configurez vos clés API.

## 🔧 Monitoring

Le script `build-optimizer.js` surveille:
- Utilisation mémoire en temps réel
- Progression du build
- Détection des goulots d'étranglement

## 📈 Optimisations Avancées

### 1. Bundle Analysis
```bash
npm run build:analyze
```

### 2. Lazy Loading Components
Utilisez `src/lib/stack-config-optimized.ts` pour les composants Stack Auth optimisés.

### 3. Template Optimization
Les templates `.template` sont maintenant traités par Turbo pour des builds plus rapides.

## 🚨 Troubleshooting

### Build qui traîne
1. Vérifiez la mémoire disponible: `npm run build:optimized`
2. Utilisez le build rapide: `npm run build:fast`
3. Redémarrez votre terminal/IDE

### Erreurs de mémoire
1. Augmentez `--max-old-space-size` dans package.json
2. Fermez les autres applications
3. Utilisez `build:fast` pour les tests

### Stack Auth lent
1. Utilisez `src/lib/stack-config-optimized.ts`
2. Vérifiez que `optimizePackageImports` inclut Stack Auth
3. Activez le lazy loading des composants

## 📝 Notes Importantes

- Ces optimisations sont spécifiques à Next.js 15
- Stack Auth 2.8+ est recommandé
- Les builds Vercel bénéficient automatiquement des optimisations
- Le monitoring mémoire aide à identifier les problèmes

## 🎯 Prochaines Étapes

1. Testez `npm run build:optimized`
2. Surveillez les métriques de performance
3. Ajustez `max-old-space-size` selon vos besoins
4. Utilisez les composants optimisés Stack Auth