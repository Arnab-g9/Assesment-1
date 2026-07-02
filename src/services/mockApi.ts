import { Category, Movie, UserProfile } from '../types';

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Avengers: Endgame',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&q=80',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    year: 2019,
    rating: 'U/A 13+',
    duration: '3h 1m',
    matchScore: 98,
  },
  {
    id: '2',
    title: 'The Lion King',
    posterUrl: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=500&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=1200&q=80',
    description: 'Simba idolizes his father, King Mufasa, and takes to heart his own royal destiny on the plains of Africa.',
    genre: ['Animation', 'Adventure', 'Drama'],
    year: 2019,
    rating: 'U',
    duration: '1h 58m',
    matchScore: 95,
  },
  {
    id: '3',
    title: 'Star Wars: The Mandalorian',
    posterUrl: 'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=500&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=1200&q=80',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    genre: ['Action', 'Adventure', 'Fantasy'],
    year: 2019,
    rating: 'U/A 16+',
    duration: '40m',
    matchScore: 99,
  },
  {
    id: '4',
    title: 'Frozen II',
    posterUrl: 'https://images.unsplash.com/photo-1511200922880-038c11438967?w=500&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511200922880-038c11438967?w=1200&q=80',
    description: 'Anna, Elsa, Kristoff, Olaf and Sven leave Arendelle to travel to an ancient, autumn-bound forest of an enchanted land.',
    genre: ['Animation', 'Adventure', 'Comedy'],
    year: 2019,
    rating: 'U',
    duration: '1h 43m',
    matchScore: 92,
  },
  {
    id: '5',
    title: 'WandaVision',
    posterUrl: 'https://images.unsplash.com/photo-1582236940801-b7556ed4d673?w=500&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1582236940801-b7556ed4d673?w=1200&q=80',
    description: 'Blends the style of classic sitcoms with the MCU, in which Wanda Maximoff and Vision - two super-powered beings living their ideal suburban lives - begin to suspect that everything is not as it seems.',
    genre: ['Action', 'Comedy', 'Drama'],
    year: 2021,
    rating: 'U/A 13+',
    duration: '30m',
    matchScore: 96,
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
    title: 'Marvel Universe',
    movies: [MOCK_MOVIES[0], MOCK_MOVIES[4], MOCK_MOVIES[2]], // Reused some for demo
  },
  {
    id: 'c3',
    title: 'Disney Kids',
    movies: [MOCK_MOVIES[1], MOCK_MOVIES[3], MOCK_MOVIES[0]],
  },
];

const DELAY = 1500; // Artificial delay of 1.5s

export const MockApi = {
  getHomeData: async (): Promise<{ hero: Movie; categories: Category[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hero: MOCK_MOVIES[0],
          categories: MOCK_CATEGORIES,
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

  getUserProfile: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'u1',
          name: 'Alex Developer',
          avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          email: 'alex@edtech.com',
          premiumStatus: true,
        });
      }, DELAY);
    });
  },
};
