import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Plus } from 'lucide-react-native';
import { Movie } from '../types';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = width * 1.2;

interface HeroBannerProps {
  movie: Movie;
  onPress: (id: string) => void;
}

export const HeroBanner = ({ movie, onPress }: HeroBannerProps) => {
  return (
    <View className="relative bg-black w-full" style={{ height: BANNER_HEIGHT }}>
      <Image
        source={movie.bannerUrl}
        className="w-full h-full"
        contentFit="cover"
        transition={300}
      />
      
      {/* Gradients for text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
        className="absolute bottom-0 w-full h-1/2 flex justify-end px-4 pb-6"
      >
        <Text className="text-white text-3xl font-bold mb-2">{movie.title}</Text>
        <Text className="text-gray-300 text-sm mb-4">
          {movie.year} • {movie.duration} • {movie.genre.join(', ')}
        </Text>
        
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity 
            className="bg-white rounded-md flex-row items-center justify-center py-3 flex-1"
            onPress={() => onPress(movie.id)}
          >
            <Play color="black" size={20} fill="black" className="mr-2" />
            <Text className="text-black font-bold text-base">Watch Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-gray-800 rounded-md py-3 px-4">
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};
