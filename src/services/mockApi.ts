import { Category, Movie, UserProfile } from '../types';

const MOCK_MOVIES: Movie[] = [
  {
    id: 't1',
    title: 'DIMITROV VS BERRETTINI',
    posterUrl: 'https://picsum.photos/id/1015/500/750',
    bannerUrl: 'https://picsum.photos/id/1015/1200/800',
    description: 'Wimbledon 2026\nCentre Court • Tennis',
    genre: ['Sports', 'Live'],
    year: 2026,
    rating: 'LIVE',
    duration: '6L Views',
    matchScore: 100,
  },
  {
    id: '1',
    title: 'Voices of the Land',
    posterUrl: 'https://picsum.photos/id/1018/500/750',
    bannerUrl: 'https://picsum.photos/id/1018/1200/800',
    description: 'Join Adarsh Gourav as he journeys through scenic Northeast India, exploring five indigenous communities through food, music, tradition, and stories!',
    genre: ['Travel', 'Documentary', 'Lifestyle', 'People & Culture', 'Information'],
    year: 2026,
    rating: 'U/A 13+',
    duration: '1 Season',
    matchScore: 98,
    isSeries: true,
    episodes: [
      { id: 'e1', title: 'Angami', thumbnailUrl: 'https://picsum.photos/id/1035/300/170', duration: '24m', date: '3 Jul 2026', seasonNum: 1, episodeNum: 1 },
      { id: 'e2', title: 'Mising', thumbnailUrl: 'https://picsum.photos/id/1043/300/170', duration: '23m', date: '3 Jul 2026', seasonNum: 1, episodeNum: 2 },
      { id: 'e3', title: 'Sherdukpen', thumbnailUrl: 'https://picsum.photos/id/1050/300/170', duration: '24m', date: '3 Jul 2026', seasonNum: 1, episodeNum: 3 },
      { id: 'e4', title: 'Biate', thumbnailUrl: 'https://picsum.photos/id/1062/300/170', duration: '22m', date: '3 Jul 2026', seasonNum: 1, episodeNum: 4 },
    ],
  },
  {
    id: '2',
    title: 'Jewels of Legacy',
    posterUrl: 'https://picsum.photos/id/1069/500/750',
    bannerUrl: 'https://picsum.photos/id/1069/1200/800',
    description: 'Discover the ancient structures of humanity.',
    genre: ['Documentary', 'History'],
    year: 2025,
    rating: 'U',
    duration: '2h 10m',
    matchScore: 92,
  },
  {
    id: '3',
    title: 'Cityscapes',
    posterUrl: 'https://picsum.photos/id/1076/500/750',
    bannerUrl: 'https://picsum.photos/id/1076/1200/800',
    description: 'A deep dive into modern architecture.',
    genre: ['Travel', 'Lifestyle'],
    year: 2024,
    rating: 'U',
    duration: '1h 45m',
    matchScore: 88,
  },
  {
    id: '4',
    title: 'Nature Calls',
    posterUrl: 'https://picsum.photos/id/1084/500/750',
    bannerUrl: 'https://picsum.photos/id/1084/1200/800',
    description: 'The untold secrets of the wild.',
    genre: ['Nature', 'Documentary'],
    year: 2026,
    rating: 'U/A 13+',
    duration: '45m',
    matchScore: 95,
  },
  {
    id: '5',
    title: 'Ocean Deep',
    posterUrl: 'https://picsum.photos/id/1093/500/750',
    bannerUrl: 'https://picsum.photos/id/1093/1200/800',
    description: 'Beneath the surface lies a world unknown.',
    genre: ['Science', 'Nature'],
    year: 2023,
    rating: 'U',
    duration: '50m',
    matchScore: 90,
  }
];

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'c1',
    title: 'Latest & Trending',
    movies: [MOCK_MOVIES[0], MOCK_MOVIES[2], MOCK_MOVIES[4], MOCK_MOVIES[1], MOCK_MOVIES[3]],
  },
  {
    id: 'c2',
    title: 'Documentaries',
    movies: [MOCK_MOVIES[0], MOCK_MOVIES[1], MOCK_MOVIES[3]],
  },
  {
    id: 'c3',
    title: 'More Like This',
    movies: [MOCK_MOVIES[1], MOCK_MOVIES[2], MOCK_MOVIES[3], MOCK_MOVIES[4]],
  },
];

const DELAY = 800; // Artificial delay of 0.8s (a bit snappier for testing animations)

export const MockApi = {
  getHomeData: async (): Promise<{ hero: Movie[]; categories: Category[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hero: [MOCK_MOVIES[0], MOCK_MOVIES[1], MOCK_MOVIES[2], MOCK_MOVIES[3]],
          categories: MOCK_CATEGORIES.slice(0, 2),
        });
      }, DELAY);
    });
  },

  getMovieDetail: async (id: string): Promise<Movie> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const movie = MOCK_MOVIES.find((m) => m.id === id);
        if (movie) resolve(movie);
        else reject(new Error('Movie not found'));
      }, DELAY);
    });
  },
  
  getMoreLikeThis: async (): Promise<Movie[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATEGORIES[2].movies);
      }, DELAY);
    });
  },

  getUserProfile: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'u1',
          name: 'Arnab Ghorai',
          avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          email: 'arnab@edtech.com',
          premiumStatus: true,
        });
      }, DELAY);
    });
  },

  searchMovies: async (query: string, page: number = 1, limit: number = 12): Promise<Movie[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (query.toLowerCase() === 'error' || query.toLowerCase() === 'crash') {
          return reject(new Error('Simulated network error during search'));
        }
        
        if (!query.trim()) {
          return resolve([]);
        }

        const lowerQuery = query.toLowerCase();
        let results = MOCK_MOVIES.filter((movie) => 
          movie.title.toLowerCase().includes(lowerQuery) || 
          movie.genre.some(g => g.toLowerCase().includes(lowerQuery))
        );
        
        // Artificially expand the dataset to simulate large pagination
        const expandedResults = [];
        for (let i = 0; i < 5; i++) {
          expandedResults.push(...results.map(r => ({ ...r, id: `${r.id}_${i}` })));
        }

        const startIndex = (page - 1) * limit;
        const paginatedResults = expandedResults.slice(startIndex, startIndex + limit);

        resolve(paginatedResults);
      }, DELAY);
    });
  },

  getPromoBanners: async (): Promise<PromoBanner[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'p1',
            title: 'Jio Cricket Offer',
            backgroundColor: '#0c4a6e', // Tailwind sky-900 equivalent
          },
          {
            id: 'p2',
            title: 'Jeeto Dhan Dhana Dhan',
            backgroundColor: '#831843', // Tailwind fuchsia-900 equivalent
          }
        ]);
      }, DELAY);
    });
  },

  getProfiles: async (): Promise<ProfileUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'u1',
            name: 'User',
            avatarColors: ['#2563eb', '#9333ea', '#db2777'],
          },
          {
            id: 'u2',
            name: 'Kids',
            isKids: true,
            avatarColors: ['#9333ea', '#db2777'],
          },
          {
            id: 'u3',
            name: 'Add',
            isAdd: true,
          }
        ]);
      }, DELAY);
    });
  },
};
