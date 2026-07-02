import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MockApi } from '../../services/mockApi';
import { Movie, Category } from '../../types';
import { HeroBanner } from '../../components/HeroBanner';
import { ContentRow } from '../../components/ContentRow';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/States';

export default function HomeScreen() {
  const [hero, setHero] = useState<Movie | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
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
      setHero(data.hero);
      setCategories(data.categories);
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
    <SafeAreaView edges={['top']} className="flex-1 bg-[#0f1014]">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
        }
        showsVerticalScrollIndicator={false}
      >
      {loading || !hero ? (
        <View>
          <SkeletonLoader width="100%" height={400} />
          <View className="p-4 space-y-4">
             <SkeletonLoader width={200} height={24} className="mb-2" />
             <View className="flex-row space-x-3">
               {[1, 2, 3].map(i => <SkeletonLoader key={i} width={130} height={195} />)}
             </View>
          </View>
        </View>
      ) : (
        <>
          <HeroBanner movie={hero} onPress={handleMoviePress} />
          <View className="-mt-4">
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
    </SafeAreaView>
  );
}
