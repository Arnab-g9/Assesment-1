import React, { memo, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronUp } from 'lucide-react-native';
import { STRINGS } from '../constants/strings';

export const FloatingMenu = memo(() => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(500, withSpring(0, { damping: 15, stiffness: 100 }));
    opacity.value = withDelay(500, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      className="absolute bottom-6 w-full flex-row justify-center items-center px-4" 
      style={[{ zIndex: 100 }, animatedStyle]}
      pointerEvents="box-none"
    >
      <View className="flex-row items-center">
        {/* The Pill Menu */}
        <View 
          className="rounded-full overflow-hidden mr-4 shadow-lg border border-gray-700"
          style={{ width: 220, height: 48 }}
        >
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)']}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 8 }}
          >
            <TouchableOpacity className="px-2 py-2">
              <Text className="text-white font-medium text-sm">{STRINGS.FLOATING_MENU.TV}</Text>
            </TouchableOpacity>
            <Text className="text-gray-500 font-light">|</Text>
            <TouchableOpacity className="px-2 py-2">
              <Text className="text-white font-medium text-sm">{STRINGS.FLOATING_MENU.MOVIES}</Text>
            </TouchableOpacity>
            <Text className="text-gray-500 font-light">|</Text>
            <TouchableOpacity className="px-2 py-2">
              <Text className="text-white font-medium text-sm">{STRINGS.FLOATING_MENU.SPORTS}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-1 py-2">
              <ChevronUp color="white" size={16} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* The Blue Circle Button */}
        <TouchableOpacity 
          className="rounded-full shadow-lg items-center justify-center border border-blue-400"
          style={{ width: 48, height: 48 }}
        >
          <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#9333ea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', height: '100%', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Swirl Simulation Icon */}
            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: 'white', borderStyle: 'dashed' }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});
