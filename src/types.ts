export interface Opportunity {
  id: number;
  title: string;
  description: string;
  organization: string;
  date: string;
  location: string;
  category: 'Environment' | 'Education' | 'Health' | 'Community' | 'Animals';
  imageUrl: string;
  hours: number;
}

export interface Volunteer {
  id: number;
  name: string;
  email: string;
}

export interface Registration {
  id: number;
  volunteerId: number;
  opportunityId: number;
  status: 'registered' | 'completed';
  registeredAt: string;
}

export interface ActivityStats {
  date: string;
  hours: number;
}
