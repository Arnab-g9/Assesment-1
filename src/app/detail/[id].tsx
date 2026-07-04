import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Plus, Share2, Heart, X, Search, Cast, ArrowLeft } from 'lucide-react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { MockApi } from '../../services/mockApi';
import { Movie } from '../../types';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/States';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentRow } from '../../components/ContentRow';
import { STRINGS } from '../../constants/strings';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = width * 1.3;

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [moreLikeThis, setMoreLikeThis] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 150, HEADER_HEIGHT - 50],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const headerTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [15, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const heroImageAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, HEADER_HEIGHT],
      [-50, 0, HEADER_HEIGHT * 0.5], // Parallax effect
      Extrapolation.EXTEND
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  useEffect(() => {
    if (id) {
      loadMovie(id as string);
    }
  }, [id]);

  const loadMovie = async (movieId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MockApi.getMovieDetail(movieId);
      const more = await MockApi.getMoreLikeThis();
      setMovie(data);
      setMoreLikeThis(more);
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={() => loadMovie(id as string)} />;

  if (loading || !movie) {
    return (
      <View className="flex-1 bg-[#0f1014]">
        <SkeletonLoader width="100%" height={HEADER_HEIGHT} />
        <View className="p-4 space-y-4 mt-10">
          <SkeletonLoader width="80%" height={32} />
          <SkeletonLoader width="50%" height={20} />
          <SkeletonLoader width="100%" height={100} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0f1014]">
      {/* Empty space where header was */}

      <Animated.ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Dynamic Header (Image Background) */}
        <View className="relative w-full" style={{ height: HEADER_HEIGHT }}>
          
          <Animated.View className="absolute w-full h-full" style={heroImageAnimatedStyle}>
            <Image
              source={movie.bannerUrl}
              className="w-full h-full"
              contentFit="cover"
            />
          </Animated.View>
          <Text className="absolute left-4 text-white text-xs font-bold tracking-wider" style={{ top: Math.max(insets.top, 20) + 50 }}>{STRINGS.DETAIL.TRAILER_UNAVAILABLE}</Text>

          <LinearGradient
            colors={['transparent', 'rgba(15,16,20,0.8)', '#0f1014']}
            style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 128, paddingBottom: 16, alignItems: 'center' }}
          >
            {/* Title / Logo simulation */}
            <Text className="text-white text-4xl font-light tracking-widest mb-2 text-center uppercase">{movie.title}</Text>
            
            <Text className="text-blue-400 font-bold mb-3 mt-1">{STRINGS.DETAIL.NEW_RELEASE}</Text>
            
            <View className="flex-row items-center mb-6">
              <Text className="text-gray-300 text-sm font-semibold">{movie.year}</Text>
              <Text className="text-gray-500 mx-1">•</Text>
              <View className="bg-gray-800 px-2 py-0.5 rounded mr-1">
                <Text className="text-gray-300 text-xs font-bold">{movie.rating}</Text>
              </View>
              <Text className="text-gray-500 mx-1">•</Text>
              <Text className="text-gray-300 text-sm font-semibold">{movie.duration}</Text>
              <Text className="text-gray-500 mx-1">•</Text>
              <Text className="text-gray-300 text-sm font-semibold">{STRINGS.COMMON.ENGLISH}</Text>
            </View>

            <TouchableOpacity className="bg-gray-200 rounded-lg flex-row items-center justify-center py-3 w-full mb-2">
              <Play color="black" size={20} fill="black" className="mr-2" />
              <Text className="text-black font-bold text-lg">{STRINGS.DETAIL.WATCH_LATEST_SEASON} <Text className="font-normal text-gray-700">S1 E1</Text></Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Rich Metadata & Actions */}
        <View className="px-4 pb-6">
          <Text className="text-gray-100 font-medium mb-3 text-sm text-center">
            {movie.genre.join('  |  ')}
          </Text>

          <Text className="text-gray-400 text-sm leading-5 mb-6">
            {movie.description}
          </Text>
          
          {/* Action Row */}
          <View className="flex-row py-2 space-x-8">
            <TouchableOpacity className="items-center">
              <Plus color="white" size={24} className="mb-2" />
              <Text className="text-gray-400 text-xs font-medium">{STRINGS.DETAIL.WATCHLIST}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <Share2 color="white" size={24} className="mb-2" />
              <Text className="text-gray-400 text-xs font-medium">{STRINGS.DETAIL.SHARE}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <Heart color="white" size={24} className="mb-2" />
              <Text className="text-gray-400 text-xs font-medium">{STRINGS.DETAIL.RATE}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Episodes Section */}
        {movie.isSeries && movie.episodes && (
          <View className="mt-4 px-4">
            <View className="border-b-2 border-white self-start pb-1 mb-4">
              <Text className="text-white text-lg font-bold">{STRINGS.DETAIL.SEASON} 1</Text>
            </View>
            
            {movie.episodes.map((ep) => (
              <View key={ep.id} className="flex-row mb-6">
                <View className="relative">
                  <Image source={ep.thumbnailUrl} className="w-36 h-20 rounded-md bg-gray-800" contentFit="cover" />
                  <View className="absolute bottom-1 left-1 bg-black/60 p-1 rounded-full">
                    <Play color="white" size={12} fill="white" />
                  </View>
                </View>
                <View className="ml-4 justify-center flex-1">
                  <Text className="text-white font-semibold text-base mb-1">{ep.title}</Text>
                  <Text className="text-gray-400 text-xs font-medium">
                    S{ep.seasonNum} E{ep.episodeNum} • {ep.date} • {ep.duration}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Further Scrollable Sections */}
        <View className="mt-4">
          <ContentRow title={STRINGS.DETAIL.MORE_LIKE_THIS} movies={moreLikeThis} onMoviePress={(id) => router.push(`/detail/${id}`)} />
        </View>
      </Animated.ScrollView>

      {/* Modern Sticky Top Navbar (Rendered AFTER ScrollView for proper z-indexing) */}
      <View 
        className="absolute top-0 w-full"
        style={{ paddingTop: Math.max(insets.top, 12), paddingBottom: 12, elevation: 5, zIndex: 50 }}
      >
        {/* Animated Background */}
        <Animated.View 
          className="absolute top-0 left-0 right-0 bottom-0 bg-[#0f1014]"
          style={headerBackgroundStyle} 
        />
        
        {/* Header Content (Always Visible Icons, Animated Title) */}
        <View className="flex-row items-center justify-between px-4 mt-2">
          {/* Left Side: Back Button & Title */}
          <View className="flex-row items-center flex-1 mr-4">
            <TouchableOpacity onPress={() => router.back()} className="bg-black/40 p-1.5 rounded-full mr-3">
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            
            <Animated.View className="flex-1" style={headerTitleStyle}>
              <Text className="text-white text-lg font-bold" numberOfLines={1}>
                {movie.title}
              </Text>
            </Animated.View>
          </View>
          
          {/* Right Side: Cast & Search (No X anymore since we have back) */}
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity className="bg-black/40 p-1.5 rounded-full">
              <Cast color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-black/40 p-1.5 rounded-full">
              <Search color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
