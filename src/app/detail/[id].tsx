import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Plus, Share2, ArrowLeft } from 'lucide-react-native';
import { MockApi } from '../../services/mockApi';
import { Movie } from '../../types';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/States';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = width * 1.2;

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setMovie(data);
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
    <ScrollView className="flex-1 bg-[#0f1014]" showsVerticalScrollIndicator={false}>
      {/* Sticky/Dynamic Header (Image Background) */}
      <View className="relative w-full" style={{ height: HEADER_HEIGHT }}>
        <Image
          source={movie.bannerUrl}
          className="w-full h-full"
          contentFit="cover"
        />
        
        {/* Back Button */}
        <TouchableOpacity 
          className="absolute left-4 z-10 bg-black/50 p-2 rounded-full"
          style={{ top: Math.max(insets.top, 20) }}
          onPress={() => router.back()}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>

        <LinearGradient
          colors={['transparent', '#0f1014']}
          className="absolute bottom-0 w-full h-2/3 justify-end px-4 pb-6"
        >
          <Text className="text-white text-4xl font-bold mb-2">{movie.title}</Text>
          <Text className="text-green-500 font-bold mb-1">{movie.matchScore}% Match</Text>
          <Text className="text-gray-300 text-sm mb-6">
            {movie.year} • {movie.duration} • {movie.rating}
          </Text>

          <TouchableOpacity className="bg-white rounded-md flex-row items-center justify-center py-3 w-full mb-4">
            <Play color="black" size={20} fill="black" className="mr-2" />
            <Text className="text-black font-bold text-lg">Watch Now</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Rich Metadata & Actions */}
      <View className="px-4 pb-10">
        <Text className="text-gray-200 text-base leading-6 mb-6">
          {movie.description}
        </Text>
        
        <Text className="text-gray-400 font-medium mb-6">
          Genres: <Text className="text-white">{movie.genre.join(', ')}</Text>
        </Text>

        <View className="flex-row justify-around py-4 border-t border-gray-800">
          <TouchableOpacity className="items-center">
            <Plus color="white" size={24} className="mb-2" />
            <Text className="text-gray-400 text-xs">Watchlist</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Share2 color="white" size={24} className="mb-2" />
            <Text className="text-gray-400 text-xs">Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* Further Scrollable Sections (Simulated) */}
        <View className="mt-8">
          <Text className="text-white text-lg font-bold mb-4">More Like This</Text>
          {/* Reusing Skeleton to simulate other lists for now */}
          <View className="flex-row space-x-3">
             {[1, 2, 3].map(i => <SkeletonLoader key={i} width={120} height={180} />)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
