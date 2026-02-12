
export interface User {
  id: string;
  name: string;
  location: string;
  district: string;
  acres: number;
  crops: string[];
  score: number;
  badges: Badge[];
  createdAt: Date;
  phone?: string;
}

export interface Mission {
  id: string;
  title: string;
  titleMalayalam: string;
  description: string;
  descriptionMalayalam: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  category: 'General' | 'Paddy' | 'Coconut' | 'Rubber' | 'Tea' | 'Coffee' | 'Spices';
  isCompleted: boolean;
  isAccepted: boolean;
  completedAt?: Date;
  acceptedAt?: Date;
  proofRequired: boolean;
  proofSubmitted?: boolean;
  estimatedDuration: string;
}

export interface Badge {
  id: string;
  name: string;
  nameMalayalam: string;
  description: string;
  descriptionMalayalam: string;
  icon: string;
  pointsRequired: number;
  earnedAt?: Date;
}

export interface SoilData {
  type: string;
  typeMalayalam: string;
  waterContent: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  description: string;
  descriptionMalayalam: string;
}

export interface Crop {
  id: string;
  name: string;
  nameMalayalam: string;
  icon: string;
  description: string;
  descriptionMalayalam: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userScore: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  replies: ForumReply[];
  likes: number;
  hasPhoto: boolean;
}

export interface ForumReply {
  id: string;
  userId: string;
  userName: string;
  userScore: number;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  badges: Badge[];
  district: string;
  crops: string[];
  rank: number;
}

export interface AppLanguage {
  code: 'en' | 'ml';
  name: string;
  nativeName: string;
}

export const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

export const KERALA_DISTRICTS_MALAYALAM = [
  'തിരുവനന്തപുരം',
  'കൊല്ലം',
  'പത്തനംതിട്ട',
  'ആലപ്പുഴ',
  'കോട്ടയം',
  'ഇടുക്കി',
  'എറണാകുളം',
  'തൃശ്ശൂർ',
  'പാലക്കാട്',
  'മലപ്പുറം',
  'കോഴിക്കോട്',
  'വയനാട്',
  'കണ്ണൂർ',
  'കാസർഗോഡ്'
];

// Translation interface for app texts
export interface AppTranslations {
  [key: string]: {
    en: string;
    ml: string;
  };
}
