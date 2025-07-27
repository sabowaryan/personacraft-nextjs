// Qloo API types and interfaces

export interface UserProfileForCulturalData {
    age: number;
    location?: string;
    interests: string[];      // From form
    values: string[];         // From form
    ageRange?: {
        min: number;
        max: number;
    };
    language?: 'fr' | 'en';
    personaCount?: number;
}

export interface CulturalDataForPrompt {
    music: string[];
    movies: string[];
    tv: string[];
    books: string[];
    brands: string[];
    restaurants: string[];
    travel: string[];
    fashion: string[];
    beauty: string[];
    food: string[];
    socialMediaPreferences: {
        platforms: string[];
        contentTypes: string[];
        influencerTypes: string[];
    };
    demographicInsights: {
        ageGroup: string;
        primaryInterests: string[];
        coreValues: string[];
    };
}

export interface QlooSignals {
    'signal.demographics.audiences'?: string;
    'signal.demographics.location'?: string;
    'signal.interests.tags'?: string;
    [key: string]: string | undefined;
}

export interface CulturalCategory {
    name: string;
    items: string[];
    relevanceScore: number;
    source: 'qloo' | 'fallback';
}

export interface SocialMediaInsights {
    primaryPlatforms: string[];
    engagementStyle: string;
    contentPreferences: string[];
    demographicAlignment: {
        ageGroup: string;
        location: string;
        platformUsage: Record<string, string>;
    };
}

export interface EnrichedCulturalData {
    categories: {
        music: CulturalCategory;
        movies: CulturalCategory;
        tv: CulturalCategory;
        books: CulturalCategory;
        brands: CulturalCategory;
        restaurants: CulturalCategory;
        travel: CulturalCategory;
        fashion: CulturalCategory;
        beauty: CulturalCategory;
        food: CulturalCategory;
    };
    socialMedia: {
        platforms: string[];
        insights: SocialMediaInsights;
    };
    metadata: {
        generatedAt: Date;
        userProfile: UserProfileForCulturalData;
        qlooApiCalls: number;
        cacheHits: number;
    };
}

export interface QlooApiStatus {
    hasApiKey: boolean;
    baseUrl: string;
}

export interface QlooConnectionTest {
    success: boolean;
    error?: string;
    status?: number;
}

export interface QlooSearchResult {
    id: string;
    name?: string;
    title?: string;
    type: string;
}

export interface QlooAudience {
    id: string;
    name: string;
    description?: string;
}

export interface QlooTag {
    id: string;
    name: string;
}

export interface QlooInsightsResponse {
    results?: {
        entities?: Array<{
            name?: string;
            title?: string;
            id?: string;
        }>;
    };
}

export interface QlooMappingMetadata {
    originalInterests: string[];
    originalValues: string[];
    mappedInterests: string[];
    mappedValues: string[];
    unrecognizedInterests: string[];
    unrecognizedValues: string[];
    finalSignals: string[];
    mappingSuccessRate: {
        interests: number;
        values: number;
        overall: number;
    };
}

export interface QlooInfluencerInsight {
    name: string;
    relevanceFactors: string[];
    estimatedFollowingOverlap: number;
}

export interface QlooBrandInfluence {
    brand: string;
    category: string;
    platforms: string[];
    relevanceScore: number;
}

export interface QlooDemographicAlignment {
    ageGroup: string;
    primaryPlatforms: string[];
    engagementStyle: string;
}

export interface QlooSocialMediaInsights {
    audienceMatches: QlooInfluencerInsight[];
    brandInfluence: QlooBrandInfluence[];
    contentPreferences: string[];
    demographicAlignment: QlooDemographicAlignment[];
}

export interface QlooEnrichmentResult {
    platforms: string[];
    insights: QlooSocialMediaInsights;
}