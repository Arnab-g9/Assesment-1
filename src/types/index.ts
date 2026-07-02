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
