/**
 * Types definition for Profyl AI
 */

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  avatar: string;
  websiteUrl?: string;
  headline?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
  image?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  text: string;
  avatar?: string;
}

export interface PortfolioData {
  id: string;
  userId: string;
  title: string;
  templateId: 'cyberpunk' | 'glassmorphism' | 'professional' | 'creative' | 'founder' | 'neo_brutalist' | 'midnight_nebula';
  accentColor: string;
  isPublished: boolean;
  slug: string;
  personalInfo: PersonalInfo;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  testimonials: Testimonial[];
  customDomain?: string;
  userPlan?: 'free' | 'student_pro' | 'premium' | 'lifetime';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'recruiter' | 'admin';
  plan: 'free' | 'student_pro' | 'premium' | 'lifetime';
  portfolioCount: number;
  aiUsageCount: number;
  lastActionDate?: string;
  dailyActionsCount?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'student_pro' | 'premium' | 'lifetime';
  status: 'active' | 'canceled';
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  startDate: string;
  nextBillingDate: string;
}

export interface ViewAnalytics {
  portfolioId: string;
  views: number;
  uniqueVisitors: number;
  recruiterViews: number;
  resumeDownloads: number;
  projectClicks: Record<string, number>;
  devices: { mobile: number; desktop: number; tablet: number };
  locations: Array<{ country: string; count: number }>;
  weeklyViews: Array<{ day: string; count: number }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface RecruiterSearchQuery {
  skills: string[];
  title: string;
  location: string;
  plan?: string;
}

export interface Template {
  id: 'cyberpunk' | 'glassmorphism' | 'professional' | 'creative' | 'founder' | 'neo_brutalist' | 'midnight_nebula';
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  premiumOnly: boolean;
}
