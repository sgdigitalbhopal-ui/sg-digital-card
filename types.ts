export interface Skill {
  subject: string;
  A: number;
  fullMark: number;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
}

export interface CardData {
  fullName: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  socials: SocialLinks;
  photoUrl: string | null;
  videoUrl: string | null;
  themeColor: string;
  skills: Skill[];
}

export const THEME_COLORS = [
  { name: 'Slate', value: '#1e293b' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Cyan', value: '#0891b2' },
];

export const INITIAL_DATA: CardData = {
  fullName: 'Alex Morgan',
  title: 'Senior Product Designer',
  company: 'Creative Solutions Inc.',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Passionate about creating intuitive user experiences and bridging the gap between design and technology. 10+ years of delivering high-impact digital products.',
  socials: {
    linkedin: 'linkedin.com/in/alexmorgan',
    website: 'alexmorgan.design',
    twitter: '@alexm_design',
    instagram: '@alex_creates',
    facebook: ''
  },
  photoUrl: 'https://picsum.photos/300/300',
  videoUrl: null,
  themeColor: '#1e293b',
  skills: [
    { subject: 'UI Design', A: 90, fullMark: 100 },
    { subject: 'UX Research', A: 85, fullMark: 100 },
    { subject: 'Prototyping', A: 95, fullMark: 100 },
    { subject: 'Frontend', A: 70, fullMark: 100 },
    { subject: 'Strategy', A: 80, fullMark: 100 },
    { subject: 'Leadership', A: 75, fullMark: 100 },
  ],
};