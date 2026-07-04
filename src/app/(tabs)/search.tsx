import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Dimensions, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MockApi } from '../../services/mockApi';
import { Movie } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { ErrorState } from '../../components/States';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { STRINGS } from '../../constants/strings';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const SPACING = 12;
const ITEM_WIDTH = (width - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchResults = useCallback(async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      const data = await MockApi.searchMovies(searchQuery, pageNum);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setResults(prev => pageNum === 1 ? data : [...prev, ...data]);
        setHasMore(data.length === 12); // limit is 12
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : STRINGS.SEARCH.ERROR_DEFAULT);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchResults(debouncedQuery, 1);
  }, [debouncedQuery, fetchResults]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && results.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(debouncedQuery, nextPage);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    Keyboard.dismiss();
  };

  const renderItem = useCallback(({ item }: { item: Movie }) => (
    <TouchableOpacity
      className="mb-3 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800"
      style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, marginRight: SPACING }}
      onPress={() => router.push(`/detail/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={item.posterUrl}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    </TouchableOpacity>
  ), [router]);

  const renderEmptyState = () => {
    if (loading || !debouncedQuery.trim() || error) return null;
    return (
      <View className="flex-1 justify-center items-center mt-20">
        <Search color="#4b5563" size={48} className="mb-4" />
        <Text className="text-gray-600 dark:text-gray-400 text-lg font-medium text-center px-8">
          {STRINGS.SEARCH.NO_RESULTS_TITLE} "{debouncedQuery}".
        </Text>
        <Text className="text-gray-500 text-sm text-center mt-2">
          {STRINGS.SEARCH.NO_RESULTS_SUBTITLE}
        </Text>
      </View>
    );
  };

  const renderSkeleton = () => {
    return (
      <View className="flex-row flex-wrap" style={{ paddingHorizontal: SPACING }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View 
            key={index} 
            style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, marginRight: SPACING, marginBottom: SPACING }}
          >
            <SkeletonLoader width="100%" height="100%" />
          </View>
        ))}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-[#050511]">
      {/* Search Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-900">
        <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-800/80 rounded-xl px-3 py-2">
          <Search color="#9ca3af" size={20} />
          <TextInput
            className="flex-1 text-black dark:text-white text-base ml-3"
            placeholder={STRINGS.SEARCH.PLACEHOLDER}
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            selectionColor="#3b82f6"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="p-1">
              <X color="#9ca3af" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 pt-4">
        {error ? (
          <ErrorState message={error} onRetry={() => fetchResults(debouncedQuery)} />
        ) : loading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            contentContainerStyle={{ 
              paddingHorizontal: SPACING,
              paddingBottom: insets.bottom + 100 
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            keyboardShouldPersistTaps="handled"
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            
            // Performance Optimizations
            removeClippedSubviews={true}
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={5}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT + SPACING,
              offset: (ITEM_HEIGHT + SPACING) * Math.floor(index / NUM_COLUMNS),
              index,
            })}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
