
import { Mission, Badge, SoilData, Crop, ForumPost, LeaderboardEntry } from '../types';

export const MOCK_SOIL_DATA: SoilData = {
  type: 'Laterite',
  typeMalayalam: 'ലാറ്ററൈറ്റ്',
  waterContent: '60-70%',
  nitrogen: 'Medium (50-100 kg/ha)',
  phosphorus: 'Low (20-40 kg/ha)',
  potassium: 'High (150-200 kg/ha)',
  ph: '5.5-6.5',
  description: 'Red, well-drained soil typical of Kerala. Good for most crops with proper fertilization.',
  descriptionMalayalam: 'കേരളത്തിലെ സാധാരണ ചുവന്ന, നല്ല നീർവാർച്ചയുള്ള മണ്ണ്. ശരിയായ വളപ്രയോഗത്തോടെ മിക്ക വിളകൾക്കും അനുയോജ്യം.'
};

export const AVAILABLE_CROPS: Crop[] = [
  {
    id: 'coconut',
    name: 'Coconut',
    nameMalayalam: 'തെങ്ങ്',
    icon: '🥥',
    description: 'Kerala\'s primary tree crop',
    descriptionMalayalam: 'കേരളത്തിന്റെ പ്രധാന വൃക്ഷവിള'
  },
  {
    id: 'rubber',
    name: 'Rubber',
    nameMalayalam: 'റബ്ബർ',
    icon: '🌳',
    description: 'Important cash crop',
    descriptionMalayalam: 'പ്രധാന നാണ്യവിള'
  },
  {
    id: 'paddy',
    name: 'Paddy',
    nameMalayalam: 'നെല്ല്',
    icon: '🌾',
    description: 'Traditional rice cultivation',
    descriptionMalayalam: 'പരമ്പരാഗത നെല്ലുകൃഷി'
  },
  {
    id: 'tea',
    name: 'Tea',
    nameMalayalam: 'ചായ',
    icon: '🍃',
    description: 'Hill station specialty',
    descriptionMalayalam: 'മലയോര പ്രത്യേകത'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    nameMalayalam: 'കാപ്പി',
    icon: '☕',
    description: 'Aromatic hill crop',
    descriptionMalayalam: 'സുഗന്ധമുള്ള മലയോര വിള'
  },
  {
    id: 'spices',
    name: 'Spices',
    nameMalayalam: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ',
    icon: '🌶️',
    description: 'Pepper, cardamom, etc.',
    descriptionMalayalam: 'കുരുമുളക്, ഏലം മുതലായവ'
  }
];

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    nameMalayalam: 'പരിസ്ഥിതി യോദ്ധാവ്',
    description: 'Earned 500 points',
    descriptionMalayalam: '500 പോയിന്റുകൾ നേടി',
    icon: '🌿',
    pointsRequired: 500
  },
  {
    id: 'soil_guardian',
    name: 'Soil Guardian',
    nameMalayalam: 'മണ്ണിന്റെ കാവൽക്കാരൻ',
    description: 'Completed 5 soil missions',
    descriptionMalayalam: '5 മണ്ണ് ദൗത്യങ്ങൾ പൂർത്തിയാക്കി',
    icon: '🌱',
    pointsRequired: 250
  },
  {
    id: 'water_saver',
    name: 'Water Saver',
    nameMalayalam: 'ജല സംരക്ഷകൻ',
    description: 'Implemented water conservation',
    descriptionMalayalam: 'ജല സംരക്ഷണം നടപ്പാക്കി',
    icon: '💧',
    pointsRequired: 300
  },
  {
    id: 'organic_champion',
    name: 'Organic Champion',
    nameMalayalam: 'ജൈവിക ചാമ്പ്യൻ',
    description: 'Switched to organic farming',
    descriptionMalayalam: 'ജൈവിക കൃഷിയിലേക്ക് മാറി',
    icon: '🍃',
    pointsRequired: 400
  },
  {
    id: 'community_leader',
    name: 'Community Leader',
    nameMalayalam: 'സമുദായ നേതാവ്',
    description: 'Active in forum discussions',
    descriptionMalayalam: 'ഫോറം ചർച്ചകളിൽ സജീവം',
    icon: '👥',
    pointsRequired: 600
  }
];

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'soil_test',
    title: 'Soil Test',
    titleMalayalam: 'മണ്ണ് പരിശോധന',
    description: 'Test your soil nutrients and pH levels',
    descriptionMalayalam: 'നിങ്ങളുടെ മണ്ണിന്റെ പോഷകങ്ങളും pH നിലവാരവും പരിശോധിക്കുക',
    difficulty: 'Easy',
    points: 50,
    category: 'General',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '1 day'
  },
  {
    id: 'bio_pesticides',
    title: 'Switch to Bio-Pesticides',
    titleMalayalam: 'ജൈവ കീടനാശിനികളിലേക്ക് മാറുക',
    description: 'Use bio-pesticides for 1 acre of your farm',
    descriptionMalayalam: 'നിങ്ങളുടെ ഫാമിന്റെ 1 ഏക്കറിൽ ജൈവ കീടനാശിനികൾ ഉപയോഗിക്കുക',
    difficulty: 'Medium',
    points: 100,
    category: 'General',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '1 week'
  },
  {
    id: 'mulching',
    title: 'Implement Mulching',
    titleMalayalam: 'മൾച്ചിംഗ് നടപ്പാക്കുക',
    description: 'Apply mulching technique for 3 weeks',
    descriptionMalayalam: '3 ആഴ്ചയ്ക്ക് മൾച്ചിംഗ് സാങ്കേതികത പ്രയോഗിക്കുക',
    difficulty: 'Hard',
    points: 150,
    category: 'General',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '3 weeks'
  },
  {
    id: 'mixed_cropping',
    title: 'Mixed Cropping with Legumes',
    titleMalayalam: 'പയർവർഗ്ഗങ്ങളുമായി മിശ്ര കൃഷി',
    description: 'Implement mixed cropping with legumes in paddy fields',
    descriptionMalayalam: 'നെൽവയലുകളിൽ പയർവർഗ്ഗങ്ങളുമായി മിശ്ര കൃഷി നടപ്പാക്കുക',
    difficulty: 'Medium',
    points: 120,
    category: 'Paddy',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '2 weeks'
  },
  {
    id: 'organic_manure_coconut',
    title: 'Organic Manure for Coconut',
    titleMalayalam: 'തെങ്ങിന് ജൈവ വളം',
    description: 'Apply organic manure to coconut trees',
    descriptionMalayalam: 'തെങ്ങുകൾക്ക് ജൈവ വളം പ്രയോഗിക്കുക',
    difficulty: 'Easy',
    points: 80,
    category: 'Coconut',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '3 days'
  },
  {
    id: 'water_conservation',
    title: 'Water Conservation System',
    titleMalayalam: 'ജല സംരക്ഷണ സംവിധാനം',
    description: 'Install rainwater harvesting or drip irrigation',
    descriptionMalayalam: 'മഴവെള്ള സംഭരണം അല്ലെങ്കിൽ ഡ്രിപ്പ് ജലസേചനം സ്ഥാപിക്കുക',
    difficulty: 'Hard',
    points: 200,
    category: 'General',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '1 month'
  },
  {
    id: 'composting',
    title: 'Start Composting',
    titleMalayalam: 'കമ്പോസ്റ്റിംഗ് ആരംഭിക്കുക',
    description: 'Create compost from farm waste',
    descriptionMalayalam: 'കാർഷിക മാലിന്യങ്ങളിൽ നിന്ന് കമ്പോസ്റ്റ് ഉണ്ടാക്കുക',
    difficulty: 'Easy',
    points: 60,
    category: 'General',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '2 weeks'
  },
  {
    id: 'intercropping_rubber',
    title: 'Intercropping in Rubber Plantation',
    titleMalayalam: 'റബ്ബർ തോട്ടത്തിൽ ഇടവിള',
    description: 'Grow vegetables between rubber trees',
    descriptionMalayalam: 'റബ്ബർ മരങ്ങൾക്കിടയിൽ പച്ചക്കറികൾ വളർത്തുക',
    difficulty: 'Medium',
    points: 110,
    category: 'Rubber',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '1 month'
  },
  {
    id: 'organic_tea',
    title: 'Organic Tea Cultivation',
    titleMalayalam: 'ജൈവ ചായ കൃഷി',
    description: 'Switch to organic methods for tea cultivation',
    descriptionMalayalam: 'ചായ കൃഷിയിൽ ജൈവ രീതികളിലേക്ക് മാറുക',
    difficulty: 'Hard',
    points: 180,
    category: 'Tea',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '2 months'
  },
  {
    id: 'spice_processing',
    title: 'Value Addition to Spices',
    titleMalayalam: 'സുഗന്ധവ്യഞ്ജനങ്ങൾക്ക് മൂല്യവർദ്ധന',
    description: 'Process and package spices for better market value',
    descriptionMalayalam: 'മികച്ച വിപണി മൂല്യത്തിനായി സുഗന്ധവ്യഞ്ജനങ്ങൾ സംസ്കരിച്ച് പാക്കേജ് ചെയ്യുക',
    difficulty: 'Medium',
    points: 130,
    category: 'Spices',
    isCompleted: false,
    isAccepted: false,
    proofRequired: true,
    estimatedDuration: '2 weeks'
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post1',
    userId: 'user1',
    userName: 'Rajesh Kumar',
    userScore: 650,
    title: 'Best organic fertilizer for coconut?',
    content: 'I want to switch to organic fertilizers for my coconut farm. What are your recommendations?',
    category: 'Coconut',
    createdAt: new Date('2024-01-15'),
    replies: [
      {
        id: 'reply1',
        userId: 'user2',
        userName: 'Sunitha Devi',
        userScore: 520,
        content: 'I use cow dung compost mixed with neem cake. Works great!',
        createdAt: new Date('2024-01-15'),
        likes: 5
      }
    ],
    likes: 12,
    hasPhoto: false
  },
  {
    id: 'post2',
    userId: 'user3',
    userName: 'Anil Varma',
    userScore: 780,
    title: 'Water conservation techniques',
    content: 'Sharing my experience with drip irrigation system. Reduced water usage by 40%!',
    category: 'General',
    createdAt: new Date('2024-01-14'),
    replies: [],
    likes: 18,
    hasPhoto: true
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: 'user1',
    userName: 'Rajesh Kumar',
    score: 850,
    badges: [AVAILABLE_BADGES[0], AVAILABLE_BADGES[1]],
    district: 'Ernakulam',
    crops: ['Coconut', 'Spices'],
    rank: 1
  },
  {
    userId: 'user2',
    userName: 'Sunitha Devi',
    score: 720,
    badges: [AVAILABLE_BADGES[1], AVAILABLE_BADGES[2]],
    district: 'Thrissur',
    crops: ['Paddy', 'Coconut'],
    rank: 2
  },
  {
    userId: 'user3',
    userName: 'Anil Varma',
    score: 680,
    badges: [AVAILABLE_BADGES[0]],
    district: 'Kottayam',
    crops: ['Rubber', 'Tea'],
    rank: 3
  },
  {
    userId: 'user4',
    userName: 'Priya Menon',
    score: 590,
    badges: [AVAILABLE_BADGES[2]],
    district: 'Palakkad',
    crops: ['Paddy'],
    rank: 4
  },
  {
    userId: 'user5',
    userName: 'Vinod Krishnan',
    score: 540,
    badges: [],
    district: 'Wayanad',
    crops: ['Coffee', 'Spices'],
    rank: 5
  }
];
