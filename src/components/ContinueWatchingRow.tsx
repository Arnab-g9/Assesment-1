import React, { useCallback, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { Movie } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.65; // Matches w-64 closely

interface ContinueWatchingRowProps {
  title: string;
  movies: Movie[];
  onMoviePress: (id: string) => void;
}

const ContinueWatchingCard = memo(({ item, onPress }: { item: Movie; onPress: () => void }) => {
  return (
    <TouchableOpacity 
      className="mr-4"
      style={{ width: ITEM_WIDTH }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="relative">
        <Image 
          source={item.bannerUrl} 
          className="w-full h-36 rounded-md bg-gray-200 dark:bg-gray-800" 
          contentFit="cover" 
          transition={300}
          cachePolicy="memory-disk"
        />
        <View className="absolute bottom-2 left-2 bg-black/50 p-1 rounded-full border border-gray-600">
          <Play color="white" size={14} fill="white" style={{ marginLeft: 2 }} />
        </View>
        <View className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 rounded-b-md">
          <View className="h-full bg-blue-500 rounded-bl-md" style={{ width: '45%' }} />
        </View>
      </View>
      <View className="mt-2 flex-row justify-between items-start">
        <View>
          <Text className="text-black dark:text-white font-semibold mb-0.5" numberOfLines={1}>{item.title}</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs">{item.duration} left</Text>
        </View>
        <Text className="text-black dark:text-white font-bold">⋮</Text>
      </View>
    </TouchableOpacity>
  );
});

export const ContinueWatchingRow = memo(({ title, movies, onMoviePress }: ContinueWatchingRowProps) => {
  const renderItem = useCallback(({ item }: { item: Movie }) => (
    <ContinueWatchingCard item={item} onPress={() => onMoviePress(item.id)} />
  ), [onMoviePress]);

  if (!movies || movies.length === 0) return null;

  return (
    <View className="mb-4">
      <Text className="text-black dark:text-white text-lg font-bold px-4 mb-3">{title}</Text>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        removeClippedSubviews={true}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + 16, // 16 is mr-4 spacing
          offset: (ITEM_WIDTH + 16) * index,
          index,
        })}
      />
    </View>
  );
});
