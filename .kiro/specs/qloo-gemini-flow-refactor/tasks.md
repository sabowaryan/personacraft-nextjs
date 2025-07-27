# Implementation Plan

- [x] 1. Étendre la bibliothèque Qloo avec les nouvelles interfaces et méthodes
  - ✅ Ajouter les interfaces TypeScript pour UserProfileForCulturalData et CulturalDataForPrompt
  - ✅ Implémenter la méthode getPreGenerationCulturalData() dans QlooClient
  - ✅ Créer le système de mapping interests/values vers signaux Qloo
  - ✅ Corriger les erreurs de syntaxe et valider la compilation TypeScript
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2. Implémenter le mapping des intérêts et valeurs du formulaire























  - Créer la méthode mapUserInterestsAndValuesToQlooSignals() avec tous les mappings
  - Implémenter la logique de combinaison des signaux interests + values
  - Ajouter la gestion des intérêts/valeurs non reconnus
  - _Requirements: 2.2, 3.3_

- [x] 3. Développer la récupération des données culturelles pré-génération




















  - Implémenter fetchAllCulturalCategories() avec traitement par batch
  - Créer fetchDataWithSignals() pour intégrer les nouveaux signaux
  - Implémenter formatCulturalDataForPrompt() pour structurer les données
  - _Requirements: 2.1, 2.3_

- [ ] 4. Créer le système de fallback et gestion d'erreurs
  - Renommer enrichPersonas() en enrichExistingPersonas() comme fallback
  - Implémenter shouldFallbackToOldFlow() pour détecter les erreurs critiques
  - Créer generateFallbackCulturalData() et getStaticCulturalData()
  - _Requirements: 2.4, 5.1, 5.2_

- [ ] 5. Mettre à jour le système de prompts Gemini
  - Ajouter les nouvelles variables culturelles dans DEFAULT_PROMPT_VARIABLES
  - Créer les interfaces pour les données culturelles dans les prompts
  - Modifier PromptManager.buildPrompt() pour intégrer les données Qloo
  - _Requirements: 3.1, 3.2_

- [ ] 6. Modifier les templates de prompts
  - Mettre à jour persona-simple.template avec les sections culturelles
  - Ajouter les variables {{culturalData.*}} dans les templates
  - Créer des sections pour musique, films, marques, réseaux sociaux
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 7. Refactoriser la route principale de génération de personas
  - Modifier src/app/api/personas/route.ts pour implémenter le nouveau flux
  - Intégrer l'appel à getPreGenerationCulturalData() avant Gemini
  - Implémenter la logique de fallback vers l'ancien flux en cas d'erreur
  - _Requirements: 1.1, 1.2, 1.3, 4.2_

- [ ] 8. Adapter le formulaire pour le nouveau flux
  - Modifier BriefForm.tsx pour passer interests et values à la route
  - Assurer que tous les champs nécessaires sont transmis correctement
  - Maintenir la compatibilité avec l'interface existante
  - _Requirements: 1.1, 5.3_

- [ ] 9. Implémenter le cache et l'optimisation des performances
  - Étendre le système de cache existant pour les données pré-génération
  - Implémenter la réutilisation des données Qloo pour éviter les requêtes redondantes
  - Ajouter des métriques de performance et monitoring
  - _Requirements: 4.1, 4.3_

- [ ] 10. Créer les tests unitaires pour les nouvelles fonctionnalités
  - Tester getPreGenerationCulturalData() avec différents scénarios
  - Tester le mapping interests/values avec tous les cas de figure
  - Tester les fallbacks et la gestion d'erreurs
  - _Requirements: 2.1, 2.2, 2.4, 5.2_

- [ ] 11. Développer les tests d'intégration pour le nouveau flux
  - Créer des tests end-to-end pour le flux Formulaire → Qloo → Gemini
  - Tester le fallback automatique vers l'ancien flux
  - Valider la cohérence des personas générés avec les données culturelles
  - _Requirements: 1.4, 4.2, 5.2_

- [ ] 12. Ajouter les indicateurs de progression et feedback utilisateur
  - Implémenter des étapes de progression pour le nouveau flux
  - Ajouter des messages informatifs pendant la récupération des données Qloo
  - Créer des indicateurs visuels pour les différentes phases
  - _Requirements: 4.4_

- [ ] 13. Créer un système de feature flag pour basculer entre les flux
  - Implémenter une configuration pour activer/désactiver le nouveau flux
  - Créer une interface d'administration pour gérer le basculement
  - Ajouter des métriques pour comparer les performances des deux flux
  - _Requirements: 5.4_

- [ ] 14. Optimiser les requêtes Qloo avec les nouveaux signaux
  - Affiner les mappings interests/values pour améliorer la pertinence
  - Implémenter une logique de priorisation des signaux
  - Ajouter des mécanismes de validation des données retournées
  - _Requirements: 3.3, 1.4_

- [ ] 15. Documenter et finaliser la migration
  - Créer la documentation technique pour le nouveau flux
  - Mettre à jour les guides d'utilisation et de déploiement
  - Préparer les scripts de migration et de rollback si nécessaire
  - _Requirements: 5.1, 5.3_