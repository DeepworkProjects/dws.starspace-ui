export interface User {
  id: string;
  email: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  avatar?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  timeOfBirth: string;
  mbtiType: MBTIType;
  enneagramType: EnneagramType;
  westernZodiac?: string;
  chineseZodiac?: string;
}

export interface Friend {
  id: string;
  userId: string;
  fullName: string;
  avatar?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  timeOfBirth: string;
  mbtiType: MBTIType;
  enneagramType: EnneagramType;
  westernZodiac?: string;
  chineseZodiac?: string;
}

export interface CompatibilityScore {
  overall: number;
  love: number;
  physicalIntimacy: number;
  work: number;
  marriage: number;
  friendship: number;
}

export interface Compatibility {
  user: UserProfile;
  friend: Friend;
  scores: CompatibilityScore;
  analysis?: string;
}

export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type EnneagramType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';