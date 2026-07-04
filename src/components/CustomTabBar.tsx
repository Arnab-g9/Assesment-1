import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Search, User, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STRINGS } from '../constants/strings';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-row items-center justify-around border-t border-gray-900"
      style={{ backgroundColor: '#050511', height: 60 + insets.bottom, paddingBottom: insets.bottom }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let Icon = Star;
        if (route.name === 'search') Icon = Search;
        else if (route.name === 'profile') Icon = User;

        const label = route.name === 'index' ? STRINGS.TAB_BAR.HOME : route.name === 'search' ? STRINGS.TAB_BAR.SEARCH : STRINGS.TAB_BAR.MY_SPACE;

        return (
          <TabBarButton 
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            label={label}
            Icon={Icon}
            routeName={route.name}
          />
        );
      })}
    </View>
  );
}

const TabBarButton = ({ isFocused, onPress, label, Icon, routeName }: any) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, { damping: 10, stiffness: 200 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 items-center justify-center relative h-full"
      activeOpacity={1}
    >
      {/* Glow Effect using layered views */}
      {isFocused && (
        <View 
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            bottom: 0,
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            borderRadius: 30,
          }}
        />
      )}
      
      <Animated.View className="items-center justify-center z-10" style={animatedStyle}>
        <Icon 
          color={isFocused ? '#ffffff' : '#888888'} 
          size={22} 
          fill={isFocused ? (routeName === 'profile' ? 'transparent' : '#ffffff') : 'transparent'} 
        />
        <Text style={{ color: isFocused ? '#ffffff' : '#888888', fontSize: 10, marginTop: 4, fontWeight: isFocused ? '600' : '400' }}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
