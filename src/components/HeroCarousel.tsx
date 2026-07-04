import React, { useRef, useState, useCallback, memo } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { Movie } from '../types';

const { width } = Dimensions.get('window');
// Card width is less than screen width to allow adjacent cards to peek
const CARD_WIDTH = width * 0.85; 
const CARD_HEIGHT = CARD_WIDTH * 1.2;
const SPACING = 16;

interface HeroCarouselProps {
  movies: Movie[];
  onMoviePress: (id: string) => void;
}

export const HeroCarousel = memo(({ movies, onMoviePress }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + SPACING));
    if (index !== currentIndex && index >= 0 && index < movies.length) {
      setCurrentIndex(index);
    }
  };

  const renderItem = useCallback(({ item, index }: { item: Movie; index: number }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => onMoviePress(item.id)}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginRight: SPACING,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: '#1a1c29',
        }}
      >
        <Image 
          source={item.bannerUrl}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />

        {/* Live Badge Simulation */}
        {item.rating === 'LIVE' && (
          <View className="absolute top-4 left-4 bg-black/60 rounded-full px-3 py-1 flex-row items-center backdrop-blur-md">
            <View className="w-2 h-2 rounded-full bg-red-600 mr-2" />
            <Text className="text-white text-xs font-bold">{item.rating} {item.duration}</Text>
          </View>
        )}

        {/* Bottom Overlay Gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(15,16,20,0.9)', '#0f1014']}
          style={{ position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingTop: 60 }}
        >
          <View className="flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-white font-bold text-3xl italic mb-1 uppercase leading-8">
                {item.title}
              </Text>
              {item.description.split('\n').map((line, i) => (
                <Text key={i} className="text-gray-300 text-xs font-medium mt-1">{line}</Text>
              ))}
            </View>
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-lg ml-4">
              <Play color="black" size={20} fill="black" style={{ marginLeft: 3 }} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [onMoviePress]);

  return (
    <View className="mb-8 mt-2">
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={true}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ 
          paddingHorizontal: (width - CARD_WIDTH) / 2, // Center the active item
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        // Performance Optimizations
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + SPACING,
          offset: (CARD_WIDTH + SPACING) * index,
          index,
        })}
      />
    </View>
  );
});
