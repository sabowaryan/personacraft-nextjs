// Simple test for social media logic without TypeScript dependencies

function getSocialMediaByProfile(age, occupation) {
    // Base social media platforms
    const baseSocialMedia = ['Instagram', 'LinkedIn'];

    if (!age) return [...baseSocialMedia, 'TikTok'];

    // Age-based adjustments (demographic data 2024)
    if (age < 25) {
        // Gen Z: TikTok dominant, Snapchat, Instagram, Discord
        baseSocialMedia.push('TikTok', 'Snapchat', 'Discord', 'BeReal');
    } else if (age < 35) {
        // Millennials: Instagram, TikTok, Twitter
        baseSocialMedia.push('TikTok', 'Twitter', 'Pinterest');
    } else if (age < 50) {
        // Gen X: Facebook, Twitter, LinkedIn dominant
        baseSocialMedia.push('Facebook', 'Twitter', 'YouTube');
    } else {
        // Baby Boomers: Facebook dominant, YouTube
        baseSocialMedia.push('Facebook', 'YouTube', 'WhatsApp');
    }

    // Occupation-based adjustments
    const occupationLower = occupation?.toLowerCase() || '';
    
    if (occupationLower.includes('développeur') || occupationLower.includes('tech') || 
        occupationLower.includes('ingénieur') || occupationLower.includes('data')) {
        baseSocialMedia.push('GitHub', 'Reddit', 'Stack Overflow', 'Hacker News');
    } else if (occupationLower.includes('marketing') || occupationLower.includes('communication') ||
               occupationLower.includes('publicité') || occupationLower.includes('brand')) {
        baseSocialMedia.push('Pinterest', 'Facebook', 'Twitter', 'TikTok');
    } else if (occupationLower.includes('designer') || occupationLower.includes('créatif') ||
               occupationLower.includes('graphique') || occupationLower.includes('ux')) {
        baseSocialMedia.push('Behance', 'Dribbble', 'Pinterest', 'Instagram');
    } else if (occupationLower.includes('vente') || occupationLower.includes('commercial') ||
               occupationLower.includes('business')) {
        baseSocialMedia.push('LinkedIn', 'Twitter', 'Facebook');
    } else if (occupationLower.includes('journaliste') || occupationLower.includes('média') ||
               occupationLower.includes('rédacteur')) {
        baseSocialMedia.push('Twitter', 'LinkedIn', 'Medium');
    } else if (occupationLower.includes('influenceur') || occupationLower.includes('créateur') ||
               occupationLower.includes('youtubeur')) {
        baseSocialMedia.push('TikTok', 'YouTube', 'Instagram', 'Twitch');
    } else if (occupationLower.includes('étudiant') || occupationLower.includes('université')) {
        baseSocialMedia.push('TikTok', 'Snapchat', 'Discord', 'Instagram');
    }

    // Remove duplicates and limit to 6 platforms max
    const uniqueSocialMedia = Array.from(new Set(baseSocialMedia));
    return uniqueSocialMedia.slice(0, 6);
}

function mapQlooDataToSocialPlatforms(influencers, brands, musicArtists) {
    const platforms = [];

    // Mapping based on influencers/persons
    influencers.forEach(influencer => {
        const lowerInfluencer = influencer.toLowerCase();
        if (isYouTubePersonality(lowerInfluencer)) platforms.push('YouTube');
        if (isInstagramInfluencer(lowerInfluencer)) platforms.push('Instagram');
        if (isTikTokCreator(lowerInfluencer)) platforms.push('TikTok');
        if (isTechPersonality(lowerInfluencer)) platforms.push('Twitter', 'LinkedIn');
    });

    // Mapping based on brands
    brands.forEach(brand => {
        const brandPlatforms = getBrandSocialPlatforms(brand);
        platforms.push(...brandPlatforms);
    });

    // Mapping based on music artists
    musicArtists.forEach(artist => {
        const artistPlatforms = getArtistSocialPlatforms(artist);
        platforms.push(...artistPlatforms);
    });

    return Array.from(new Set(platforms));
}

function isYouTubePersonality(name) {
    const youtubeKeywords = ['youtuber', 'vlogger', 'creator', 'channel', 'video'];
    return youtubeKeywords.some(keyword => name.includes(keyword));
}

function isInstagramInfluencer(name) {
    const instagramKeywords = ['influencer', 'model', 'fashion', 'lifestyle', 'beauty', 'fitness'];
    return instagramKeywords.some(keyword => name.includes(keyword));
}

function isTikTokCreator(name) {
    const tiktokKeywords = ['tiktok', 'viral', 'dance', 'comedy', 'short'];
    return tiktokKeywords.some(keyword => name.includes(keyword));
}

function isTechPersonality(name) {
    const techKeywords = ['tech', 'developer', 'engineer', 'startup', 'ceo', 'founder'];
    return techKeywords.some(keyword => name.includes(keyword));
}

function getBrandSocialPlatforms(brand) {
    const brandToSocialMap = {
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

    return brandToSocialMap[brand] || [];
}

function getArtistSocialPlatforms(artist) {
    // Artists are generally present on these platforms
    const musicPlatforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter'];
    
    // Adjustments based on musical genre (if detectable)
    const artistLower = artist.toLowerCase();
    if (artistLower.includes('electronic') || artistLower.includes('dj')) {
        musicPlatforms.push('SoundCloud');
    }
    if (artistLower.includes('indie') || artistLower.includes('alternative')) {
        musicPlatforms.push('Bandcamp', 'SoundCloud');
    }
    
    return musicPlatforms;
}

// Test the functions
console.log('🧪 Test de l\'enrichissement des réseaux sociaux\n');

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
    },
    {
        name: 'Pierre Senior',
        age: 55,
        occupation: 'Directeur Commercial',
        location: 'Marseille'
    }
];

console.log('=== Test de la logique locale ===');
testPersonas.forEach(persona => {
    console.log(`\n${persona.name} (${persona.age} ans, ${persona.occupation}):`);
    const socialMedia = getSocialMediaByProfile(persona.age, persona.occupation);
    socialMedia.forEach((platform, index) => {
        console.log(`  ${index + 1}. ${platform}`);
    });
});

console.log('\n\n=== Test du mapping Qloo vers réseaux sociaux ===');

// Simulate Qloo data based on your test results
const mockQlooData = {
    persons: ['Yuri Tsunematsu', 'Teliana Pereira', 'Brandon Turner'],
    brands: ['Best Day Brewing', 'Wilfred\'s', 'Casamara Club', 'Nike', 'Apple'],
    music: ['Taylor Swift', 'Drake', 'Billie Eilish']
};

console.log('\nDonnées Qloo simulées:');
console.log('Personnes:', mockQlooData.persons);
console.log('Marques:', mockQlooData.brands);
console.log('Musique:', mockQlooData.music);

const qlooBasedPlatforms = mapQlooDataToSocialPlatforms(
    mockQlooData.persons, 
    mockQlooData.brands, 
    mockQlooData.music
);

console.log('\nPlateformes dérivées de Qloo:', qlooBasedPlatforms);

// Test combined approach
console.log('\n\n=== Test de l\'approche combinée ===');
testPersonas.forEach(persona => {
    console.log(`\n${persona.name}:`);
    
    const localPlatforms = getSocialMediaByProfile(persona.age, persona.occupation);
    const combinedPlatforms = Array.from(new Set([...qlooBasedPlatforms, ...localPlatforms]));
    const finalPlatforms = combinedPlatforms.slice(0, 6);
    
    console.log(`  Local (${localPlatforms.length}): ${localPlatforms.join(', ')}`);
    console.log(`  Qloo (${qlooBasedPlatforms.length}): ${qlooBasedPlatforms.join(', ')}`);
    console.log(`  Combiné (${finalPlatforms.length}): ${finalPlatforms.join(', ')}`);
});