# Requirements Document

## Introduction

Cette fonctionnalité vise à refactoriser l'architecture actuelle du flux de génération de personas pour corriger un problème architectural critique : l'ordre d'exécution entre les services Qloo et Gemini. Actuellement, Gemini génère des personas "génériques" sans connaître les données culturelles réelles que Qloo pourrait fournir, créant des incohérences. La solution consiste à inverser le flux pour que Qloo fournisse d'abord les données culturelles, puis Gemini génère des personas cohérents en utilisant ces données enrichies.

## Requirements

### Requirement 1

**User Story:** En tant qu'utilisateur créant des personas, je veux que les données culturelles Qloo soient intégrées dès la génération initiale, afin que mes personas soient cohérents et reflètent des préférences culturelles réelles.

#### Acceptance Criteria

1. WHEN l'utilisateur soumet le formulaire de brief THEN le système doit d'abord récupérer les données culturelles Qloo basées sur le profil démographique
2. WHEN les données Qloo sont récupérées THEN elles doivent inclure les intérêts et valeurs du formulaire dans les requêtes API
3. WHEN les données culturelles sont disponibles THEN Gemini doit générer les personas en utilisant à la fois le brief ET les données culturelles Qloo
4. WHEN la génération est terminée THEN les personas doivent présenter une cohérence entre les préférences culturelles et les caractéristiques générées

### Requirement 2

**User Story:** En tant que développeur, je veux que la bibliothèque Qloo expose une nouvelle méthode pour récupérer les données culturelles avant la génération, afin de supporter le nouveau flux architectural.

#### Acceptance Criteria

1. WHEN la bibliothèque Qloo est appelée THEN elle doit exposer une méthode `getPreGenerationCulturalData()`
2. WHEN cette méthode est appelée avec un profil utilisateur THEN elle doit accepter les champs : age, location, interests[], values[], ageRange, language
3. WHEN les données sont récupérées THEN elles doivent être formatées pour l'intégration dans les prompts Gemini
4. WHEN les requêtes Qloo échouent THEN le système doit utiliser des données de fallback appropriées

### Requirement 3

**User Story:** En tant que système, je veux que les prompts Gemini intègrent les données culturelles Qloo, afin de générer des personas plus précis et cohérents.

#### Acceptance Criteria

1. WHEN les prompts Gemini sont construits THEN ils doivent inclure les données culturelles Qloo dans des sections dédiées
2. WHEN les données culturelles sont intégrées THEN elles doivent couvrir : musique, films, séries TV, livres, marques, restaurants, voyage, mode, beauté, nourriture
3. WHEN les prompts sont générés THEN ils doivent mapper les intérêts et valeurs du formulaire vers des signaux Qloo appropriés
4. WHEN les données sociales sont incluses THEN elles doivent refléter les préférences de plateformes basées sur les données culturelles

### Requirement 4

**User Story:** En tant qu'utilisateur, je veux que le processus de génération reste fluide et performant malgré le changement architectural, afin de maintenir une expérience utilisateur optimale.

#### Acceptance Criteria

1. WHEN le nouveau flux est exécuté THEN le temps de génération total ne doit pas dépasser 120% du temps actuel
2. WHEN les requêtes Qloo échouent THEN le système doit basculer automatiquement vers l'ancien flux sans erreur utilisateur
3. WHEN les données sont en cache THEN le système doit réutiliser les données Qloo pour éviter les requêtes redondantes
4. WHEN le processus est en cours THEN l'utilisateur doit recevoir des indicateurs de progression appropriés

### Requirement 5

**User Story:** En tant que système, je veux maintenir la compatibilité avec l'architecture existante, afin de permettre une migration progressive et un rollback si nécessaire.

#### Acceptance Criteria

1. WHEN le nouveau flux est implémenté THEN l'ancienne méthode `enrichPersonas()` doit être conservée comme fallback
2. WHEN une erreur critique survient THEN le système doit pouvoir basculer vers l'ancien flux automatiquement
3. WHEN les tests sont exécutés THEN ils doivent valider à la fois le nouveau et l'ancien flux
4. WHEN la configuration le permet THEN un flag de feature doit permettre de basculer entre les deux approches