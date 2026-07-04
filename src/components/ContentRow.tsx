import { Image } from 'expo-image';
import React, { useCallback, memo } from 'react';
import { Dimensions, FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Movie } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.35;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMoviePress: (id: string) => void;
}

const AnimatedMovieCard = memo(({ item, onPress }: { item: Movie; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View className="mr-3 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800" style={animatedStyle}>
        <Image
          source={item.posterUrl}
          style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
});

export const ContentRow = memo(({ title, movies, onMoviePress }: ContentRowProps) => {

  const renderItem = useCallback(({ item }: { item: Movie }) => (
    <AnimatedMovieCard item={item} onPress={() => onMoviePress(item.id)} />
  ), [onMoviePress]);

  return (
    <View className="my-4">
      <Text className="text-black dark:text-white text-lg font-bold px-4 mb-3">{title}</Text>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH + 12, // marginRight is 12 (mr-3 in tailwind is 12px)
          offset: (ITEM_WIDTH + 12) * index,
          index,
        })}
      />
    </View>
  );
});
