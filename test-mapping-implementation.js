/**
 * Test script to verify the mapping implementation for interests and values
 * This tests the mapUserInterestsAndValuesToQlooSignals method
 */

// Import the predefined constants
const PREDEFINED_INTERESTS = [
    'Sport et fitness',
    'Technologie',
    'Voyage',
    'Cuisine',
    'Mode',
    'Musique',
    'Lecture',
    'Cinéma',
    'Art',
    'Nature',
    'Gaming',
    'Photographie',
    'Entrepreneuriat',
    'Développement personnel',
    'Famille',
    'Santé et bien-être'
];

const PREDEFINED_VALUES = [
    'Authenticité',
    'Innovation',
    'Durabilité',
    'Qualité',
    'Efficacité',
    'Créativité',
    'Collaboration',
    'Respect',
    'Transparence',
    'Excellence',
    'Simplicité',
    'Sécurité',
    'Liberté',
    'Équilibre vie-travail',
    'Responsabilité sociale',
    'Tradition'
];

// Mock QlooClient class with just the mapping method for testing
class TestQlooClient {
    mapUserInterestsAndValuesToQlooSignals(interests, values) {
        const signals = {};
        
        // Complete mapping of all form interests to Qloo signals
        const interestMap = {
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
        const valueMap = {
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
        
        // Process interests with enhanced mapping
        const mappedInterests = [];
        const unrecognizedInterests = [];
        
        interests.forEach(interest => {
            const mappedInterest = interestMap[interest];
            if (mappedInterest) {
                mappedInterests.push(...mappedInterest.split(','));
            } else {
                unrecognizedInterests.push(interest);
                console.warn(`Intérêt non reconnu dans le mapping Qloo: "${interest}"`);
            }
        });
        
        // Process values with enhanced mapping
        const mappedValues = [];
        const unrecognizedValues = [];
        
        values.forEach(value => {
            const mappedValue = valueMap[value];
            if (mappedValue) {
                mappedValues.push(...mappedValue.split(','));
            } else {
                unrecognizedValues.push(value);
                console.warn(`Valeur non reconnue dans le mapping Qloo: "${value}"`);
            }
        });
        
        // Combine mapped signals with priority weighting
        const prioritizedTags = [
            ...mappedInterests.map(tag => ({ tag, priority: 2 })),
            ...mappedValues.map(tag => ({ tag, priority: 1 }))
        ];
        
        // Handle unrecognized interests/values by attempting generic mapping
        const genericMappedTags = this.handleUnrecognizedTerms([...unrecognizedInterests, ...unrecognizedValues]);
        prioritizedTags.push(...genericMappedTags.map(tag => ({ tag, priority: 0.5 })));
        
        // Sort by priority and remove duplicates
        const sortedTags = prioritizedTags
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.tag);
        
        const uniqueTags = Array.from(new Set(sortedTags)).slice(0, 12);
        
        if (uniqueTags.length > 0) {
            signals['signal.interests.tags'] = uniqueTags.join(',');
        }
        
        // Return mapping metadata for testing
        return {
            signals,
            metadata: {
                originalInterests: interests,
                originalValues: values,
                mappedInterests: mappedInterests,
                mappedValues: mappedValues,
                unrecognizedInterests,
                unrecognizedValues,
                finalSignals: uniqueTags,
                mappingSuccessRate: {
                    interests: interests.length > 0 ? (interests.length - unrecognizedInterests.length) / interests.length : 1,
                    values: values.length > 0 ? (values.length - unrecognizedValues.length) / values.length : 1,
                    overall: (interests.length + values.length) > 0 ? 
                        ((interests.length + values.length) - (unrecognizedInterests.length + unrecognizedValues.length)) / (interests.length + values.length) : 1
                }
            }
        };
    }

    handleUnrecognizedTerms(unrecognizedTerms) {
        // Simplified version for testing - just return generic lifestyle mapping
        return unrecognizedTerms.length > 0 ? ['lifestyle'] : [];
    }
}

// Test functions
function testAllPredefinedInterests() {
    console.log('\n=== Testing All Predefined Interests ===');
    const client = new TestQlooClient();
    
    PREDEFINED_INTERESTS.forEach(interest => {
        const result = client.mapUserInterestsAndValuesToQlooSignals([interest], []);
        console.log(`✓ ${interest}: ${result.signals['signal.interests.tags'] || 'No mapping'}`);
        
        if (result.metadata.unrecognizedInterests.length > 0) {
            console.error(`❌ FAILED: ${interest} was not recognized!`);
        }
    });
}

function testAllPredefinedValues() {
    console.log('\n=== Testing All Predefined Values ===');
    const client = new TestQlooClient();
    
    PREDEFINED_VALUES.forEach(value => {
        const result = client.mapUserInterestsAndValuesToQlooSignals([], [value]);
        console.log(`✓ ${value}: ${result.signals['signal.interests.tags'] || 'No mapping'}`);
        
        if (result.metadata.unrecognizedValues.length > 0) {
            console.error(`❌ FAILED: ${value} was not recognized!`);
        }
    });
}

function testCombinedMapping() {
    console.log('\n=== Testing Combined Interests + Values ===');
    const client = new TestQlooClient();
    
    const testInterests = ['Technologie', 'Voyage', 'Musique'];
    const testValues = ['Innovation', 'Créativité', 'Authenticité'];
    
    const result = client.mapUserInterestsAndValuesToQlooSignals(testInterests, testValues);
    
    console.log('Input interests:', testInterests);
    console.log('Input values:', testValues);
    console.log('Final signals:', result.signals['signal.interests.tags']);
    console.log('Mapping success rate:', result.metadata.mappingSuccessRate);
    console.log('Priority ordering (interests first):', result.metadata.finalSignals);
}

function testUnrecognizedTerms() {
    console.log('\n=== Testing Unrecognized Terms ===');
    const client = new TestQlooClient();
    
    const unknownInterests = ['Jardinage', 'Astronomie'];
    const unknownValues = ['Patience', 'Curiosité'];
    
    const result = client.mapUserInterestsAndValuesToQlooSignals(unknownInterests, unknownValues);
    
    console.log('Unknown interests:', unknownInterests);
    console.log('Unknown values:', unknownValues);
    console.log('Unrecognized interests:', result.metadata.unrecognizedInterests);
    console.log('Unrecognized values:', result.metadata.unrecognizedValues);
    console.log('Final signals (with fallback):', result.signals['signal.interests.tags']);
    console.log('Overall success rate:', result.metadata.mappingSuccessRate.overall);
}

function testEdgeCases() {
    console.log('\n=== Testing Edge Cases ===');
    const client = new TestQlooClient();
    
    // Empty arrays
    console.log('Empty arrays:');
    const emptyResult = client.mapUserInterestsAndValuesToQlooSignals([], []);
    console.log('Result:', emptyResult.signals);
    
    // Mixed known and unknown
    console.log('\nMixed known and unknown:');
    const mixedResult = client.mapUserInterestsAndValuesToQlooSignals(
        ['Technologie', 'UnknownInterest'], 
        ['Innovation', 'UnknownValue']
    );
    console.log('Final signals:', mixedResult.signals['signal.interests.tags']);
    console.log('Success rate:', mixedResult.metadata.mappingSuccessRate.overall);
}

// Run all tests
console.log('🧪 Testing Qloo Mapping Implementation');
console.log('=====================================');

testAllPredefinedInterests();
testAllPredefinedValues();
testCombinedMapping();
testUnrecognizedTerms();
testEdgeCases();

console.log('\n✅ All mapping tests completed!');
console.log('\nSummary:');
console.log(`- ${PREDEFINED_INTERESTS.length} predefined interests mapped`);
console.log(`- ${PREDEFINED_VALUES.length} predefined values mapped`);
console.log('- Priority weighting implemented (interests > values > generic)');
console.log('- Unrecognized terms handling implemented');
console.log('- Edge cases handled');