import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Movie } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.35;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMoviePress: (id: string) => void;
}

export const ContentRow = ({ title, movies, onMoviePress }: ContentRowProps) => {
  
  const renderItem = useCallback(({ item }: { item: Movie }) => (
    <TouchableOpacity 
      className="mr-3 overflow-hidden rounded-md"
      onPress={() => onMoviePress(item.id)}
    >
      <Image
        source={item.posterUrl}
        style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
        contentFit="cover"
        transition={200}
        className="bg-gray-800"
      />
    </TouchableOpacity>
  ), [onMoviePress]);

  return (
    <View className="my-4">
      <Text className="text-white text-lg font-bold px-4 mb-3">{title}</Text>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};
