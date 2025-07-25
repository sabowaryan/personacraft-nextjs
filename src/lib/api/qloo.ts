import { Persona } from '@/types';

export class QlooClient {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.QLOO_API_KEY || '';
        this.baseUrl = process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com';
    }

    async enrichPersonas(personas: Partial<Persona>[]): Promise<Partial<Persona>[]> {
        if (!this.apiKey) {
            console.warn('Clé API Qloo manquante, utilisation de données simulées');
            return this.getFallbackEnrichment(personas);
        }

        try {
            const enrichedPersonas = await Promise.all(
                personas.map(persona => this.enrichSinglePersona(persona))
            );

            return enrichedPersonas;
        } catch (error) {
            console.error('Erreur générale Qloo:', error);
            return this.getFallbackEnrichment(personas);
        }
    }

    private async enrichSinglePersona(persona: Partial<Persona>): Promise<Partial<Persona>> {
        if (!persona.age) {
            return this.getFallbackPersonaEnrichment(persona);
        }

        try {
            const [musicData, brandsData, moviesData] = await Promise.all([
                this.fetchMusicData(persona.age),
                this.fetchBrandsData(persona.age),
                this.fetchMoviesData(persona.age)
            ]);

            const socialMedia = this.getSocialMediaByProfile(persona.age, persona.occupation);

            return {
                ...persona,
                culturalData: {
                    ...persona.culturalData,
                    music: musicData,
                    movies: moviesData,
                    brands: brandsData,
                    socialMedia: socialMedia
                }
            };

        } catch (error) {
            console.error(`Erreur enrichissement Qloo pour ${persona.name}:`, error);
            return this.getFallbackPersonaEnrichment(persona);
        }
    }

    private async fetchMusicData(age: number): Promise<string[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/v2/insights?filter.type=urn:entity:music&signal.demographics.age=${age}-${age + 5}&take=3`,
                {
                    headers: {
                        'X-Api-Key': this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    return result.data
                        .slice(0, 3)
                        .map((entity: any) => entity.name);
                }
            }
        } catch (error) {
            console.error('Erreur fetch music data:', error);
        }

        return ['Indie Pop', 'Electronic', 'Jazz moderne'];
    }

    private async fetchBrandsData(age: number): Promise<string[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/v2/insights?filter.type=urn:entity:brand&signal.demographics.age=${age}-${age + 5}&take=4`,
                {
                    headers: {
                        'X-Api-Key': this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    return result.data
                        .slice(0, 4)
                        .map((entity: any) => entity.name);
                }
            }
        } catch (error) {
            console.error('Erreur fetch brands data:', error);
        }

        return ['Apple', 'Zara', 'Sephora', 'Airbnb'];
    }

    private async fetchMoviesData(age: number): Promise<string[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/v2/insights?filter.type=urn:entity:movie&signal.demographics.age=${age}-${age + 5}&take=3`,
                {
                    headers: {
                        'X-Api-Key': this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    return result.data
                        .slice(0, 3)
                        .map((entity: any) => entity.name);
                }
            }
        } catch (error) {
            console.error('Erreur fetch movies data:', error);
        }

        return ['Films indépendants', 'Documentaires', 'Comédies'];
    }

    private getSocialMediaByProfile(age?: number, occupation?: string): string[] {
        const baseSocialMedia = ['Instagram', 'LinkedIn'];

        if (!age) return [...baseSocialMedia, 'TikTok'];

        // Ajustements basés sur l'âge
        if (age < 30) {
            baseSocialMedia.push('TikTok', 'Snapchat');
        } else if (age < 40) {
            baseSocialMedia.push('TikTok', 'Twitter');
        } else {
            baseSocialMedia.push('Facebook', 'Twitter');
        }

        // Ajustements basés sur la profession
        if (occupation?.toLowerCase().includes('développeur') ||
            occupation?.toLowerCase().includes('tech')) {
            baseSocialMedia.push('GitHub', 'Reddit');
        } else if (occupation?.toLowerCase().includes('marketing') ||
            occupation?.toLowerCase().includes('communication')) {
            baseSocialMedia.push('Pinterest', 'YouTube');
        }

        // Retourner les 4 premiers pour éviter la surcharge
        const uniqueSocialMedia = baseSocialMedia.filter((item, index) => baseSocialMedia.indexOf(item) === index);
        return uniqueSocialMedia.slice(0, 4);
    }

    private getFallbackEnrichment(personas: Partial<Persona>[]): Partial<Persona>[] {
        return personas.map(persona => this.getFallbackPersonaEnrichment(persona));
    }

    private getFallbackPersonaEnrichment(persona: Partial<Persona>): Partial<Persona> {
        return {
            ...persona,
            culturalData: {
                ...persona.culturalData,
                music: ['Indie Pop', 'Electronic', 'Jazz moderne'],
                movies: ['Films indépendants', 'Documentaires', 'Comédies'],
                brands: ['Apple', 'Zara', 'Sephora', 'Airbnb'],
                socialMedia: this.getSocialMediaByProfile(persona.age, persona.occupation)
            }
        };
    }

    async testConnection(): Promise<boolean> {
        if (!this.apiKey) {
            return false;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/v2/insights?filter.type=urn:entity:music&take=1`,
                {
                    headers: {
                        'X-Api-Key': this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Test de connexion Qloo échoué:', error);
            return false;
        }
    }

    getApiStatus(): { hasApiKey: boolean; baseUrl: string } {
        return {
            hasApiKey: !!this.apiKey,
            baseUrl: this.baseUrl
        };
    }
}

// Instance singleton
let qlooClient: QlooClient | null = null;

export function getQlooClient(): QlooClient {
    if (!qlooClient) {
        qlooClient = new QlooClient();
    }
    return qlooClient;
}