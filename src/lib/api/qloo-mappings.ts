/**
 * Qloo API Mappings and Constants
 * Contains all mapping data for interests, values, keywords, and other static configurations
 */

// Complete mapping of all form interests to Qloo signals
// Based on PREDEFINED_INTERESTS from form-constants.ts
export const INTEREST_TO_QLOO_MAP: Record<string, string> = {
    'Sport et fitness': 'fitness,sports,health',
    'Technologie': 'technology,tech,innovation',
    'Voyage': 'travel,tourism,adventure',
    'Cuisine': 'food,cooking,culinary',
    'Mode': 'fashion,style,clothing',
    'Musique': 'music,audio,entertainment',
    'Lecture': 'books,reading,literature',
    'Cinéma': 'movies,film,entertainment',
    'Art': 'art,creative,culture',
    'Nature': 'outdoor,nature,environment',
    'Gaming': 'gaming,esports,technology',
    'Photographie': 'photography,visual,art',
    'Entrepreneuriat': 'business,startup,entrepreneurship',
    'Développement personnel': 'self-improvement,personal-development,wellness',
    'Famille': 'family,parenting,lifestyle',
    'Santé et bien-être': 'wellness,health,fitness'
};

// Complete mapping of all form values to Qloo signals
// Based on PREDEFINED_VALUES from form-constants.ts
export const VALUE_TO_QLOO_MAP: Record<string, string> = {
    'Authenticité': 'authenticity,genuine,real',
    'Innovation': 'innovation,technology,future',
    'Durabilité': 'sustainability,eco-friendly,environment',
    'Qualité': 'quality,premium,excellence',
    'Efficacité': 'efficiency,productivity,optimization',
    'Créativité': 'creativity,art,innovation',
    'Collaboration': 'collaboration,teamwork,social',
    'Respect': 'respect,ethics,values',
    'Transparence': 'transparency,honesty,trust',
    'Excellence': 'excellence,quality,premium',
    'Simplicité': 'simplicity,minimalism,clean',
    'Sécurité': 'security,safety,protection',
    'Liberté': 'freedom,independence,flexibility',
    'Équilibre vie-travail': 'work-life-balance,wellness,lifestyle',
    'Responsabilité sociale': 'social-responsibility,community,ethics',
    'Tradition': 'tradition,heritage,culture'
};

// Comprehensive keyword mapping for unrecognized terms
export const KEYWORD_TO_QLOO_MAP: Record<string, string[]> = {
    // Technology and Digital
    'tech': ['technology', 'innovation'],
    'digital': ['technology', 'innovation'],
    'informatique': ['technology', 'business'],
    'numérique': ['technology', 'innovation'],
    'ordinateur': ['technology'],
    'internet': ['technology', 'social'],
    'web': ['technology', 'business'],
    'mobile': ['technology'],
    'app': ['technology', 'innovation'],
    'logiciel': ['technology', 'business'],
    'programmation': ['technology', 'creativity'],
    'code': ['technology', 'creativity'],

    // Health, Wellness and Fitness
    'santé': ['wellness', 'health'],
    'bien-être': ['wellness', 'lifestyle'],
    'fitness': ['fitness', 'health'],
    'sport': ['fitness', 'health'],
    'exercice': ['fitness', 'wellness'],
    'yoga': ['wellness', 'fitness'],
    'méditation': ['wellness', 'lifestyle'],
    'nutrition': ['health', 'food'],
    'régime': ['health', 'wellness'],
    'mental': ['wellness', 'health'],
    'physique': ['fitness', 'health'],

    // Creative and Artistic
    'créatif': ['creativity', 'art'],
    'artistique': ['art', 'creativity'],
    'design': ['art', 'creativity'],
    'dessin': ['art', 'creativity'],
    'peinture': ['art', 'creativity'],
    'sculpture': ['art', 'creativity'],
    'musique': ['music', 'art'],
    'danse': ['art', 'entertainment'],
    'théâtre': ['art', 'entertainment'],
    'écriture': ['creativity', 'books'],
    'littérature': ['books', 'art'],

    // Business and Professional
    'business': ['business', 'entrepreneurship'],
    'entreprise': ['business', 'entrepreneurship'],
    'professionnel': ['business', 'career'],
    'carrière': ['business', 'career'],
    'management': ['business', 'leadership'],
    'leadership': ['business', 'leadership'],
    'finance': ['business', 'finance'],
    'marketing': ['business', 'creativity'],
    'vente': ['business', 'communication'],
    'commerce': ['business', 'entrepreneurship'],
    'startup': ['business', 'entrepreneurship', 'innovation'],

    // Lifestyle and Personal
    'lifestyle': ['lifestyle', 'wellness'],
    'vie': ['lifestyle', 'wellness'],
    'loisir': ['entertainment', 'lifestyle'],
    'divertissement': ['entertainment', 'lifestyle'],
    'hobby': ['lifestyle', 'creativity'],
    'passion': ['lifestyle', 'creativity'],
    'détente': ['wellness', 'lifestyle'],
    'relaxation': ['wellness', 'lifestyle'],
    'temps libre': ['lifestyle', 'entertainment'],

    // Social and Community
    'social': ['social', 'community'],
    'communauté': ['social', 'community'],
    'famille': ['family', 'lifestyle'],
    'amis': ['social', 'lifestyle'],
    'réseau': ['social', 'business'],
    'groupe': ['social', 'community'],
    'équipe': ['collaboration', 'business'],
    'collectif': ['collaboration', 'social'],
    'bénévolat': ['social-responsibility', 'community'],
    'solidarité': ['social-responsibility', 'community'],

    // Environmental and Sustainability
    'environnement': ['sustainability', 'nature'],
    'écologie': ['sustainability', 'environment'],
    'vert': ['sustainability', 'environment'],
    'durable': ['sustainability', 'quality'],
    'bio': ['sustainability', 'health'],
    'naturel': ['nature', 'sustainability'],
    'recyclage': ['sustainability', 'environment'],
    'énergie': ['sustainability', 'technology'],
    'climat': ['sustainability', 'environment'],

    // Food and Culinary
    'cuisine': ['food', 'creativity'],
    'culinaire': ['food', 'art'],
    'gastronomie': ['food', 'culture'],
    'restaurant': ['food', 'lifestyle'],
    'chef': ['food', 'creativity'],
    'recette': ['food', 'creativity'],
    'dégustation': ['food', 'lifestyle'],
    'vin': ['food', 'culture'],
    'boisson': ['food', 'lifestyle'],

    // Travel and Culture
    'voyage': ['travel', 'culture'],
    'tourisme': ['travel', 'lifestyle'],
    'culture': ['culture', 'art'],
    'tradition': ['culture', 'heritage'],
    'histoire': ['culture', 'education'],
    'patrimoine': ['culture', 'heritage'],
    'découverte': ['travel', 'curiosity'],
    'aventure': ['travel', 'adventure'],
    'exploration': ['travel', 'adventure'],

    // Education and Learning
    'éducation': ['education', 'learning'],
    'apprentissage': ['learning', 'education'],
    'formation': ['education', 'business'],
    'étude': ['education', 'learning'],
    'connaissance': ['learning', 'education'],
    'savoir': ['learning', 'education'],
    'compétence': ['learning', 'business'],
    'développement': ['learning', 'business'],

    // Entertainment and Media
    'spectacle': ['entertainment', 'art'],
    'cinéma': ['movies', 'entertainment'],
    'film': ['movies', 'entertainment'],
    'série': ['entertainment', 'lifestyle'],
    'télévision': ['entertainment', 'lifestyle'],
    'radio': ['entertainment', 'music'],
    'podcast': ['entertainment', 'learning'],
    'jeu': ['gaming', 'entertainment'],
    'gaming': ['gaming', 'technology']
};

// Fallback pattern mapping for terms that couldn't be matched through keywords
export const FALLBACK_PATTERNS: Record<string, string[]> = {
    // French patterns
    'isme$': ['philosophy', 'culture'],
    'tion$': ['business', 'education'],
    'ment$': ['lifestyle', 'wellness'],
    'ique$': ['art', 'creativity'],
    'able$': ['sustainability', 'quality'],

    // Activity patterns
    '^faire': ['creativity', 'lifestyle'],
    '^jouer': ['entertainment', 'gaming'],
    '^créer': ['creativity', 'art'],
    '^apprendre': ['education', 'learning'],
    '^découvrir': ['travel', 'learning'],

    // Technology patterns
    'tech|digital|cyber|web|net': ['technology'],
    'smart|intel|auto': ['technology', 'innovation'],

    // Wellness patterns
    'zen|calm|peace|relax': ['wellness', 'lifestyle'],
    'fit|strong|energy': ['fitness', 'health'],

    // Social patterns
    'social|community|group|team': ['social', 'collaboration'],
    'family|parent|child': ['family', 'lifestyle'],

    // Creative patterns
    'art|create|design|style': ['creativity', 'art'],
    'music|sound|audio': ['music', 'entertainment'],

    // Business patterns
    'work|job|career|prof': ['business', 'career'],
    'money|finance|invest': ['business', 'finance']
};

// Entity type mapping for Qloo API
export const ENTITY_TYPE_MAP: Record<string, string> = {
    'music': 'urn:entity:artist',
    'brand': 'urn:entity:brand',
    'movie': 'urn:entity:movie',
    'tv': 'urn:entity:tv_show',
    'book': 'urn:entity:book',
    'restaurant': 'urn:entity:place',
    'travel': 'urn:entity:place',
    'fashion': 'urn:entity:brand',
    'beauty': 'urn:entity:brand',
    'food': 'urn:entity:place',
    'podcast': 'urn:entity:podcast',
    'video_game': 'urn:entity:video_game',
    'person': 'urn:entity:person'
};

// Supported parameters by entity type
export const SUPPORTED_PARAMS_BY_ENTITY: Record<string, string[]> = {
    'urn:entity:artist': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:movie': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:tv_show': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:book': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:brand': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:place': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:destination': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:podcast': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:video_game': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location'],
    'urn:entity:person': ['signal.demographics.audiences', 'signal.interests.tags', 'signal.demographics.location']
};

// Content type mapping from interests
export const CONTENT_TYPE_MAP: Record<string, string[]> = {
    'Technologie': ['Tech reviews', 'Tutorials', 'Innovation news'],
    'Mode': ['Fashion hauls', 'Style guides', 'Trend updates'],
    'Sport et fitness': ['Workout videos', 'Health tips', 'Athletic content'],
    'Voyage': ['Travel vlogs', 'Destination guides', 'Cultural content'],
    'Cuisine': ['Recipe videos', 'Food reviews', 'Cooking tutorials'],
    'Musique': ['Music videos', 'Artist interviews', 'Concert footage'],
    'Gaming': ['Gaming streams', 'Reviews', 'Esports content'],
    'Art': ['Art tutorials', 'Gallery tours', 'Creative process'],
    'Photographie': ['Photo tutorials', 'Equipment reviews', 'Portfolio showcases']
};

// Influencer type mapping from values
export const INFLUENCER_TYPE_MAP: Record<string, string[]> = {
    'Authenticité': ['Lifestyle influencers', 'Personal brand creators'],
    'Innovation': ['Tech influencers', 'Thought leaders'],
    'Durabilité': ['Eco-conscious creators', 'Sustainable living advocates'],
    'Créativité': ['Artists', 'Creative directors', 'Design influencers'],
    'Entrepreneuriat': ['Business coaches', 'Startup founders'],
    'Santé et bien-être': ['Wellness coaches', 'Fitness influencers']
};

// Brand to social platform mapping
export const BRAND_TO_SOCIAL_MAP: Record<string, string[]> = {
    // Tech brands
    'Apple': ['Twitter', 'YouTube', 'Instagram'],
    'Google': ['YouTube', 'Twitter', 'LinkedIn'],
    'Microsoft': ['LinkedIn', 'Twitter', 'YouTube'],
    'Tesla': ['Twitter', 'YouTube', 'Instagram'],
    'Meta': ['Instagram', 'Facebook', 'Twitter'],

    // Fashion & Lifestyle
    'Nike': ['Instagram', 'TikTok', 'Twitter', 'YouTube'],
    'Adidas': ['Instagram', 'TikTok', 'Twitter'],
    'Zara': ['Instagram', 'Pinterest', 'TikTok'],
    'H&M': ['Instagram', 'TikTok', 'Pinterest'],
    'Louis Vuitton': ['Instagram', 'Pinterest', 'YouTube'],

    // Beauty
    'Sephora': ['Instagram', 'TikTok', 'YouTube', 'Pinterest'],
    'L\'Oréal': ['Instagram', 'YouTube', 'TikTok'],
    'MAC': ['Instagram', 'YouTube', 'TikTok'],

    // Entertainment
    'Netflix': ['Instagram', 'Twitter', 'TikTok', 'YouTube'],
    'Disney': ['Instagram', 'YouTube', 'TikTok', 'Facebook'],
    'Spotify': ['Instagram', 'Twitter', 'TikTok'],

    // Food & Beverage
    'Starbucks': ['Instagram', 'TikTok', 'Twitter'],
    'McDonald\'s': ['Instagram', 'TikTok', 'Twitter', 'Facebook'],
    'Coca-Cola': ['Instagram', 'Facebook', 'Twitter', 'YouTube']
};

// City to ISO code mapping for location normalization
export const CITY_TO_ISO_MAP: Record<string, string> = {
    'paris': 'FR-75',
    'lyon': 'FR-69',
    'marseille': 'FR-13',
    'toulouse': 'FR-31',
    'nice': 'FR-06',
    'london': 'GB-LND',
    'manchester': 'GB-MAN',
    'birmingham': 'GB-BIR',
    'new york': 'US-NY',
    'los angeles': 'US-CA',
    'chicago': 'US-IL',
    'houston': 'US-TX',
    'miami': 'US-FL',
    'toronto': 'CA-ON',
    'vancouver': 'CA-BC',
    'montreal': 'CA-QC',
    'berlin': 'DE-BE',
    'munich': 'DE-BY',
    'hamburg': 'DE-HH',
    'madrid': 'ES-MD',
    'barcelona': 'ES-CT',
    'rome': 'IT-RM',
    'milan': 'IT-MI',
    'amsterdam': 'NL-NH',
    'brussels': 'BE-BRU',
    'zurich': 'CH-ZH',
    'geneva': 'CH-GE'
};

// Fallback data by type
export const FALLBACK_DATA_MAP: Record<string, string[]> = {
    'music': ['Indie Pop', 'Electronic', 'Jazz moderne'],
    'brand': ['Apple', 'Zara', 'Sephora', 'Airbnb'],
    'movie': ['Films indépendants', 'Documentaires', 'Comédies'],
    'tv': ['Séries Netflix', 'Documentaires', 'Comédies'],
    'book': ['Romans contemporains', 'Développement personnel', 'Biographies'],
    'restaurant': ['Restaurants bio', 'Cuisine fusion', 'Food trucks'],
    'travel': ['Voyages éco-responsables', 'City breaks', 'Aventures outdoor'],
    'fashion': ['Mode durable', 'Streetwear', 'Vintage'],
    'beauty': ['Cosmétiques naturels', 'Skincare coréenne', 'Maquillage minimaliste'],
    'food': ['Cuisine végétarienne', 'Superfoods', 'Cuisine locale'],
    'podcast': ['True Crime', 'Tech Talk', 'Développement personnel'],
    'video_game': ['Jeux indépendants', 'RPG', 'Jeux de stratégie'],
    'person': ['Influenceurs lifestyle', 'Experts tech', 'Créateurs de contenu']
};