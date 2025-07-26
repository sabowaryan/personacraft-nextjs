# Guide de résolution des problèmes Qloo API

## ✅ Corrections appliquées

### 1. En-tête d'authentification
- **Problème** : `'X-Api-Key'` (casse incorrecte)
- **Solution** : `'X-API-Key'` (casse exacte requise)
- **Impact** : Résout la majorité des erreurs 403

### 2. Construction d'URL
- **Problème** : Doubles slashes dans l'URL (`//v2/insights`)
- **Solution** : Utilisation de `new URL()` au lieu de concaténation manuelle
- **Code** :
```typescript
const url = new URL('/v2/insights', this.baseUrl);
url.searchParams.set('filter.type', mappedEntityType);
```

### 3. Normalisation des localisations
- **Problème** : Noms de villes en texte libre non acceptés
- **Solution** : Conversion automatique vers codes ISO-3166-2
- **Exemples** :
  - `Paris` → `FR-75`
  - `Lyon` → `FR-69`
  - `London` → `GB-LND`

### 4. Types d'entités validés
- **Problème** : Types d'entités non conformes aux URN Qloo
- **Solution** : Mapping vers les URN officiels
- **Types supportés** :
  - `music` → `urn:entity:artist`
  - `brand` → `urn:entity:brand`
  - `movie` → `urn:entity:movie`
  - `tv` → `urn:entity:tv_show`
  - `restaurant` → `urn:entity:place`
  - `travel` → `urn:entity:destination`

## 🔧 Diagnostic des erreurs

### Erreur 403 FORBIDDEN

#### Causes possibles :
1. **En-tête incorrect** : Vérifiez `X-API-Key` (casse exacte)
2. **URL malformée** : Vérifiez qu'il n'y a pas de double slash
3. **Paramètres non supportés** : Utilisez uniquement les paramètres documentés
4. **Clé API invalide** : Vérifiez votre clé API
5. **Type d'entité incorrect** : Utilisez les URN officiels

#### Actions correctives :
```bash
# Test de base
curl -G 'https://hackathon.api.qloo.com/v2/insights' \
  --data-urlencode 'filter.type=urn:entity:artist' \
  --data-urlencode 'take=1' \
  -H 'X-API-Key: YOUR_KEY'
```

### Erreur 429 RATE LIMIT

#### Solution :
- Implémentation du retry avec backoff exponentiel
- Limitation des requêtes concurrentes (max 3)
- Délai minimum entre les requêtes (100ms)

### Erreur 404 NOT FOUND

#### Causes possibles :
1. **Endpoint incorrect** : Vérifiez l'URL de base
2. **Version d'API incorrecte** : Utilisez `/v2/insights`

## 🧪 Tests de validation

### Test de connexion simple :
```javascript
node test-qloo-real-api.js
```

### Test des corrections :
```javascript
node test-qloo-simple.js
```

## 📋 Checklist de validation

- [ ] En-tête `X-API-Key` avec casse correcte
- [ ] URL construite avec `new URL()`
- [ ] Pas de double slash dans l'URL
- [ ] Types d'entités conformes aux URN Qloo
- [ ] Localisations en format ISO-3166-2
- [ ] Paramètres validés par type d'entité
- [ ] Gestion des erreurs 403/429/404
- [ ] Rate limiting implémenté

## 🔍 Paramètres autorisés par entité

| Type d'entité | Paramètres supportés |
|---------------|---------------------|
| `urn:entity:artist` | `signal.demographics.audiences`, `signal.interests.tags`, `signal.demographics.location` |
| `urn:entity:movie` | `signal.demographics.audiences`, `signal.interests.tags`, `signal.demographics.location` |
| `urn:entity:tv_show` | `signal.demographics.audiences`, `signal.interests.tags`, `signal.demographics.location` |
| `urn:entity:brand` | `signal.demographics.audiences`, `signal.interests.tags`, `signal.demographics.location` |
| `urn:entity:place` | `signal.demographics.audiences`, `signal.interests.tags`, `signal.demographics.location` |
| `urn:entity:destination` | `signal.demographics.audiences`, `signal.interests.tags`, `signal.demographics.location` |

## 🌍 Codes de localisation supportés

### Format requis : ISO-3166-2
- France : `FR-75` (Paris), `FR-69` (Lyon), `FR-13` (Marseille)
- UK : `GB-LND` (Londres), `GB-MAN` (Manchester)
- USA : `US-NY` (New York), `US-CA` (Californie)
- Canada : `CA-ON` (Ontario), `CA-QC` (Québec)

### Conversion automatique
Le code convertit automatiquement les noms de villes courantes :
```typescript
'paris' → 'FR-75'
'london' → 'GB-LND'
'new york' → 'US-NY'
```

## 🚀 Exemple d'appel fonctionnel

```typescript
const url = new URL('/v2/insights', 'https://hackathon.api.qloo.com');
url.searchParams.set('filter.type', 'urn:entity:artist');
url.searchParams.set('signal.demographics.audiences', 'millennials');
url.searchParams.set('signal.interests.tags', 'technology');
url.searchParams.set('signal.demographics.location', 'FR-75');
url.searchParams.set('take', '5');

const response = await fetch(url.toString(), {
    headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
    }
});
```

## 📞 Support

Si les problèmes persistent après avoir appliqué ces corrections :
1. Vérifiez la documentation officielle Qloo
2. Testez avec curl pour isoler le problème
3. Vérifiez les logs de l'API pour plus de détails