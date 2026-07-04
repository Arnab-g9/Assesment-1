export interface Episode {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  seasonNum: number;
  episodeNum: number;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  bannerUrl: string;
  description: string;
  genre: string[];
  year: number;
  rating: string;
  duration: string;
  matchScore: number;
  isSeries?: boolean;
  episodes?: Episode[];
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  premiumStatus: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  imageUrl?: string;
  actionText?: string;
}

export interface ProfileUser {
  id: string;
  name: string;
  isKids?: boolean;
  isAdd?: boolean;
  avatarColors?: string[];
}
