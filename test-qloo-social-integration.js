// Test Qloo social media integration with real API
const fetch = require('node-fetch');

class QlooSocialTester {
    constructor() {
        this.apiKey = process.env.QLOO_API_KEY || '';
        this.baseUrl = (process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com').replace(/\/+$/, '');
    }

    async fetchData(entityType, age, occupation, location, take = 3) {
        const mappedEntityType = this.mapEntityType(entityType);
        const params = {};

        if (age) {
            const ageRange = this.getAgeRange(age);
            params['signal.demographics.audiences'] = ageRange;
        } else {
            params['signal.demographics.audiences'] = 'millennials';
        }

        if (occupation) {
            const professionSignal = this.mapOccupationToSignal(occupation);
            if (professionSignal) {
                const [key, value] = professionSignal.split('=');
                params[key] = value;
            }
        }

        if (location) {
            params['signal.demographics.location'] = this.normalizeLocation(location);
        }

        const url = this.buildValidatedUrl(entityType, params, take);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`❌ Erreur ${response.status} pour ${entityType}`);
                return [];
            }

            const result = await response.json();
            const entities = result.results?.entities || [];
            return entities.map(entity => entity.name || entity.title).filter(Boolean);
        } catch (error) {
            console.error(`❌ Erreur réseau pour ${entityType}:`, error.message);
            return [];
        }
    }

    mapEntityType(entityType) {
        const entityMap = {
            'music': 'urn:entity:artist',
            'brand': 'urn:entity:brand',
            'person': 'urn:entity:person'
        };
        return entityMap[entityType] || `urn:entity:${entityType}`;
    }

    getAgeRange(age) {
        if (age < 25) return 'gen-z';
        if (age < 35) return 'millennials';
        if (age < 50) return 'gen-x';
        return 'baby-boomers';
    }

    mapOccupationToSignal(occupation) {
        const lowerOccupation = occupation.toLowerCase();
        if (lowerOccupation.includes('développeur') || lowerOccupation.includes('tech')) {
            return 'signal.interests.tags=technology';
        } else if (lowerOccupation.includes('marketing') || lowerOccupation.includes('communication')) {
            return 'signal.interests.tags=marketing';
        } else if (lowerOccupation.includes('designer') || lowerOccupation.includes('créatif')) {
            return 'signal.interests.tags=design';
        } else if (lowerOccupation.includes('manager') || lowerOccupation.includes('directeur')) {
            return 'signal.interests.tags=business';
        }
        return null;
    }

    normalizeLocation(location) {
        const cityToIsoMap = {
            'paris': 'FR-75',
            'lyon': 'FR-69',
            'marseille': 'FR-13',
            'toulouse': 'FR-31'
        };
        const normalizedCity = location.toLowerCase().trim();
        return cityToIsoMap[normalizedCity] || location;
    }

    buildValidatedUrl(entityType, params, take) {
        const mappedEntityType = this.mapEntityType(entityType);
        const url = new URL('/v2/insights', this.baseUrl);
        url.searchParams.set('filter.type', mappedEntityType);
        url.searchParams.set('take', take.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            }
        });

        return url.toString();
    }

    mapQlooDataToSocialPlatforms(influencers, brands, musicArtists) {
        const platforms = [];

        // Mapping based on influencers/persons
        influencers.forEach(influencer => {
            const lowerInfluencer = influencer.toLowerCase();
            if (this.isYouTubePersonality(lowerInfluencer)) platforms.push('YouTube');
            if (this.isInstagramInfluencer(lowerInfluencer)) platforms.push('Instagram');
            if (this.isTikTokCreator(lowerInfluencer)) platforms.push('TikTok');
            if (this.isTechPersonality(lowerInfluencer)) platforms.push('Twitter', 'LinkedIn');
        });

        // Mapping based on brands
        brands.forEach(brand => {
            const brandPlatforms = this.getBrandSocialPlatforms(brand);
            platforms.push(...brandPlatforms);
        });

        // Mapping based on music artists
        musicArtists.forEach(artist => {
            const artistPlatforms = this.getArtistSocialPlatforms(artist);
            platforms.push(...artistPlatforms);
        });

        return Array.from(new Set(platforms));
    }

    isYouTubePersonality(name) {
        const youtubeKeywords = ['youtuber', 'vlogger', 'creator', 'channel', 'video'];
        return youtubeKeywords.some(keyword => name.includes(keyword));
    }

    isInstagramInfluencer(name) {
        const instagramKeywords = ['influencer', 'model', 'fashion', 'lifestyle', 'beauty', 'fitness'];
        return instagramKeywords.some(keyword => name.includes(keyword));
    }

    isTikTokCreator(name) {
        const tiktokKeywords = ['tiktok', 'viral', 'dance', 'comedy', 'short'];
        return tiktokKeywords.some(keyword => name.includes(keyword));
    }

    isTechPersonality(name) {
        const techKeywords = ['tech', 'developer', 'engineer', 'startup', 'ceo', 'founder'];
        return techKeywords.some(keyword => name.includes(keyword));
    }

    getBrandSocialPlatforms(brand) {
        const brandToSocialMap = {
            'Apple': ['Twitter', 'YouTube', 'Instagram'],
            'Google': ['YouTube', 'Twitter', 'LinkedIn'],
            'Microsoft': ['LinkedIn', 'Twitter', 'YouTube'],
            'Tesla': ['Twitter', 'YouTube', 'Instagram'],
            'Meta': ['Instagram', 'Facebook', 'Twitter'],
            'Nike': ['Instagram', 'TikTok', 'Twitter', 'YouTube'],
            'Adidas': ['Instagram', 'TikTok', 'Twitter'],
            'Zara': ['Instagram', 'Pinterest', 'TikTok'],
            'H&M': ['Instagram', 'TikTok', 'Pinterest'],
            'Sephora': ['Instagram', 'TikTok', 'YouTube', 'Pinterest'],
            'Netflix': ['Instagram', 'Twitter', 'TikTok', 'YouTube'],
            'Disney': ['Instagram', 'YouTube', 'TikTok', 'Facebook'],
            'Spotify': ['Instagram', 'Twitter', 'TikTok'],
            'Starbucks': ['Instagram', 'TikTok', 'Twitter']
        };
        return brandToSocialMap[brand] || [];
    }

    getArtistSocialPlatforms(artist) {
        const musicPlatforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter'];
        const artistLower = artist.toLowerCase();
        if (artistLower.includes('electronic') || artistLower.includes('dj')) {
            musicPlatforms.push('SoundCloud');
        }
        if (artistLower.includes('indie') || artistLower.includes('alternative')) {
            musicPlatforms.push('Bandcamp', 'SoundCloud');
        }
        return musicPlatforms;
    }

    getSocialMediaByProfile(age, occupation) {
        const baseSocialMedia = ['Instagram', 'LinkedIn'];

        if (!age) return [...baseSocialMedia, 'TikTok'];

        if (age < 25) {
            baseSocialMedia.push('TikTok', 'Snapchat', 'Discord', 'BeReal');
        } else if (age < 35) {
            baseSocialMedia.push('TikTok', 'Twitter', 'Pinterest');
        } else if (age < 50) {
            baseSocialMedia.push('Facebook', 'Twitter', 'YouTube');
        } else {
            baseSocialMedia.push('Facebook', 'YouTube', 'WhatsApp');
        }

        const occupationLower = occupation?.toLowerCase() || '';
        
        if (occupationLower.includes('développeur') || occupationLower.includes('tech')) {
            baseSocialMedia.push('GitHub', 'Reddit', 'Stack Overflow');
        } else if (occupationLower.includes('marketing') || occupationLower.includes('communication')) {
            baseSocialMedia.push('Pinterest', 'Facebook', 'Twitter', 'TikTok');
        } else if (occupationLower.includes('designer') || occupationLower.includes('créatif')) {
            baseSocialMedia.push('Behance', 'Dribbble', 'Pinterest', 'Instagram');
        }

        const uniqueSocialMedia = Array.from(new Set(baseSocialMedia));
        return uniqueSocialMedia.slice(0, 6);
    }

    async enrichSocialMediaWithQloo(persona) {
        try {
            console.log(`\n🔍 Enrichissement social média pour ${persona.name}...`);
            
            const [influencers, brands, musicArtists] = await Promise.all([
                this.fetchData('person', persona.age, persona.occupation, persona.location, 3),
                this.fetchData('brand', persona.age, persona.occupation, persona.location, 3),
                this.fetchData('music', persona.age, persona.occupation, persona.location, 2)
            ]);

            console.log(`  📊 Données Qloo récupérées:`);
            console.log(`    Personnes: ${influencers.length} - ${influencers.join(', ')}`);
            console.log(`    Marques: ${brands.length} - ${brands.join(', ')}`);
            console.log(`    Musique: ${musicArtists.length} - ${musicArtists.join(', ')}`);

            const qlooBasedPlatforms = this.mapQlooDataToSocialPlatforms(influencers, brands, musicArtists);
            const localSocialMedia = this.getSocialMediaByProfile(persona.age, persona.occupation);
            
            const enrichedSocialMedia = Array.from(new Set([...qlooBasedPlatforms, ...localSocialMedia]));
            
            console.log(`  🎯 Résultat:`);
            console.log(`    Qloo (${qlooBasedPlatforms.length}): ${qlooBasedPlatforms.join(', ')}`);
            console.log(`    Local (${localSocialMedia.length}): ${localSocialMedia.join(', ')}`);
            console.log(`    Combiné (${enrichedSocialMedia.length}): ${enrichedSocialMedia.slice(0, 6).join(', ')}`);
            
            return enrichedSocialMedia.slice(0, 6);
        } catch (error) {
            console.warn(`⚠️ Erreur enrichissement social média via Qloo pour ${persona.name}:`, error.message);
            return this.getSocialMediaByProfile(persona.age, persona.occupation);
        }
    }
}

async function testQlooSocialIntegration() {
    console.log('🧪 Test d\'intégration Qloo pour les réseaux sociaux\n');
    
    const tester = new QlooSocialTester();
    
    if (!tester.apiKey) {
        console.log('❌ Clé API Qloo manquante');
        return;
    }

    const testPersonas = [
        {
            name: 'Alex Tech',
            age: 28,
            occupation: 'Développeur Full-Stack',
            location: 'Paris'
        },
        {
            name: 'Sophie Marketing',
            age: 32,
            occupation: 'Responsable Marketing Digital',
            location: 'Lyon'
        },
        {
            name: 'Emma GenZ',
            age: 22,
            occupation: 'Étudiante en Design',
            location: 'Toulouse'
        }
    ];

    for (const persona of testPersonas) {
        console.log(`\n=== ${persona.name} ===`);
        console.log(`Profil: ${persona.age} ans, ${persona.occupation}, ${persona.location}`);
        
        const socialMedia = await tester.enrichSocialMediaWithQloo(persona);
        
        console.log(`\n📱 Réseaux sociaux finaux pour ${persona.name}:`);
        socialMedia.forEach((platform, index) => {
            console.log(`  ${index + 1}. ${platform}`);
        });
    }
}

testQlooSocialIntegration().catch(console.error);