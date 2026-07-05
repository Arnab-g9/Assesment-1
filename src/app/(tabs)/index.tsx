import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentRow } from '../../components/ContentRow';
import { ContinueWatchingRow } from '../../components/ContinueWatchingRow';
import { FloatingMenu } from '../../components/FloatingMenu';
import { HeroCarousel } from '../../components/HeroCarousel';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/States';
import { STRINGS } from '../../constants/strings';
import { MockApi } from '../../services/mockApi';
import { Category, Movie, UserProfile } from '../../types';

export default function HomeScreen() {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const data = await MockApi.getHomeData();
      const more = await MockApi.getMoreLikeThis(); // Simulate continue watching
      const profile = await MockApi.getUserProfile();
      
      // Ensure hero is treated as an array from our updated mockApi
      setHeroMovies(Array.isArray(data.hero) ? data.hero : [data.hero as unknown as Movie]);
      setCategories(data.categories);
      setContinueWatching(more);
      setUser(profile);
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  const handleMoviePress = useCallback((id: string) => {
    router.push(`/detail/${id}`);
  }, [router]);

  if (error) {
    return <ErrorState message={error} onRetry={() => loadData()} />;
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-[#050511]">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row (JioHotstar / TADKA) */}
        <View className="flex-row items-center justify-between px-4 mt-2 mb-6">
          <TouchableOpacity 
            className="flex-1 mr-2 rounded-xl border border-blue-500 overflow-hidden h-12 justify-center items-center flex-row"
            style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)' }}
          >
            <Star color="white" size={16} fill="white" className="mr-1" />
            <Text className="text-white font-bold text-lg tracking-wider">{STRINGS.HOME.JIO_HOTSTAR}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 ml-2 rounded-xl overflow-hidden h-12 justify-center items-center flex-row"
          >
            <LinearGradient
              colors={['#facc15', '#ef4444', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            />
            <Star color="white" size={16} fill="white" className="mr-1" />
            <Text className="text-white font-black text-lg tracking-widest">{STRINGS.HOME.TADKA}</Text>
          </TouchableOpacity>
        </View>

        {/* Section Header: For You + UPGRADE */}
        <View className="flex-row justify-between items-center px-4 mb-2">
          <Text className="text-black dark:text-white text-xl font-bold">{STRINGS.HOME.FOR_YOU}</Text>
          <TouchableOpacity className="border border-[#d4af37] px-3 py-1 rounded">
            <Text className="text-[#d4af37] font-bold text-[10px] tracking-widest uppercase">{STRINGS.HOME.UPGRADE}</Text>
          </TouchableOpacity>
        </View>

        {loading || heroMovies.length === 0 ? (
          <View>
            <SkeletonLoader height={400} className="flex-1 ml-4 mr-4"/>
            <View className="p-4 space-y-4">
              <SkeletonLoader width={200} height={24} className="mb-3" />
              <View className="flex-row space-x-3 gap-3">
                {[1, 2, 3].map(i => <SkeletonLoader key={i} width={130} height={195} />)}
              </View>
            </View>
          </View>
        ) : (
          <>
            <HeroCarousel movies={heroMovies} onMoviePress={handleMoviePress} />
            
            {/* Continue Watching Section */}
            {user && (
              <ContinueWatchingRow 
                title={`${STRINGS.HOME.CONTINUE_WATCHING_PREFIX} ${user.name}`} 
                movies={continueWatching} 
                onMoviePress={handleMoviePress} 
              />
            )}

            <View className="-mt-2">
              {categories.map((category) => (
                <ContentRow
                  key={category.id}
                  title={category.title}
                  movies={category.movies}
                  onMoviePress={handleMoviePress}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Menu */}
      <FloatingMenu />
    </SafeAreaView>
  );
}
