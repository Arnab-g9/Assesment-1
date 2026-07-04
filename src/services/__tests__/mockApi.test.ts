import { MockApi } from '../mockApi';

describe('MockApi', () => {
  describe('searchMovies', () => {
    it('should return empty array for empty query', async () => {
      const results = await MockApi.searchMovies('   ');
      expect(results).toEqual([]);
    });

    it('should correctly filter movies by title or genre', async () => {
      const results = await MockApi.searchMovies('nature');
      // "Nature Calls" and "Ocean Deep" both match nature genre
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.title === 'Nature Calls')).toBeTruthy();
    });

    it('should throw an error for simulated crash', async () => {
      await expect(MockApi.searchMovies('error')).rejects.toThrow('Simulated network error during search');
    });

    it('should support pagination by returning expanded duplicate data', async () => {
      const page1 = await MockApi.searchMovies('city', 1, 5);
      const page2 = await MockApi.searchMovies('city', 2, 5);
      
      expect(page1.length).toBeLessThanOrEqual(5);
      expect(page1[0].id).toBeDefined();
      
      // If it returned duplicates, page2 shouldn't be empty in our mock scale logic
      if (page2.length > 0) {
        expect(page1).not.toEqual(page2);
      }
    });
  });

  describe('getUserProfile', () => {
    it('should return a user profile', async () => {
      const user = await MockApi.getUserProfile();
      expect(user).toBeDefined();
      expect(user.name).toBe('Arnab Ghorai');
    });
  });
});
