import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Settings, ChevronDown, ChevronRight, Plus, Play } from 'lucide-react-native';
import { MockApi } from '../../services/mockApi';
import { UserProfile, Movie, PromoBanner, ProfileUser } from '../../types';
import { STRINGS } from '../../constants/strings';
import { ErrorState } from '../../components/States';
import { ContinueWatchingRow } from '../../components/ContinueWatchingRow';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Moon, Sun } from 'lucide-react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [promos, setPromos] = useState<PromoBanner[]>([]);
  const [profiles, setProfiles] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const profileData = await MockApi.getUserProfile();
      const more = await MockApi.getMoreLikeThis(); // using for continue watching
      const promoData = await MockApi.getPromoBanners();
      const profileUsers = await MockApi.getProfiles();
      
      setProfile(profileData);
      setContinueWatching(more);
      setPromos(promoData);
      setProfiles(profileUsers);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-[#050511]">
      {/* Top Background Gradient */}
      <LinearGradient
        colors={['rgba(30,20,60,0.5)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300 }}
      />
      
      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-4 mb-6">
          <Star color={colorScheme === 'dark' ? 'white' : 'black'} size={32} fill={colorScheme === 'dark' ? 'white' : 'black'} />
          
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={toggleColorScheme} className="flex-row items-center mr-4">
              {colorScheme === 'dark' ? <Sun color="white" size={18} /> : <Moon color="black" size={18} />}
              <Text className="text-black dark:text-white text-sm ml-1 font-medium">{colorScheme === 'dark' ? 'Light' : 'Dark'}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Settings color={colorScheme === 'dark' ? 'white' : 'black'} size={16} />
              <Text className="text-black dark:text-white text-sm ml-1 font-medium">{STRINGS.PROFILE.HELP_SETTINGS}</Text>
            </TouchableOpacity>
          </View>
        </View>

          {promos[0] && (
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <View className="flex-row items-center mb-1">
                  <Text className="text-yellow-500 font-bold text-lg">{promos[0].title} - Mobile/</Text>
                  <ChevronDown color="#eab308" size={18} />
                </View>
                <Text className="text-yellow-500 font-bold text-lg">4K TV</Text>
                <Text className="text-gray-400 text-xs mt-1">+91 9883646228</Text>
              </View>
              <LinearGradient
                colors={['#2563eb', '#9333ea', '#db2777']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 4, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', width: 128 }}
              >
                <Text className="text-white font-bold mb-1">{STRINGS.HOME.UPGRADE}</Text>
                <Text className="text-white/80 text-[10px] text-center">Upgrade for more benefits</Text>
              </LinearGradient>
            </View>
          )}

        {/* Profiles Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black dark:text-white text-xl font-bold">{STRINGS.PROFILE.PROFILES}</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">{STRINGS.PROFILE.EDIT}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row space-x-6">
            {profiles.map((p) => {
              if (p.isAdd) {
                return (
                  <View key={p.id} className="items-center">
                    <View className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 items-center justify-center mb-2">
                      <Plus color={colorScheme === 'dark' ? 'white' : 'black'} size={24} />
                    </View>
                    <Text className="text-gray-600 dark:text-gray-400 text-xs">{p.name}</Text>
                  </View>
                );
              }
              if (p.isKids) {
                return (
                  <View key={p.id} className="items-center">
                    <LinearGradient colors={p.avatarColors || ['#9333ea', '#db2777']} style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <Text className="text-white font-bold text-lg">{p.name.toUpperCase()}</Text>
                    </LinearGradient>
                    <Text className="text-gray-600 dark:text-gray-400 text-xs">{p.name}</Text>
                  </View>
                );
              }
              return (
                <View key={p.id} className="items-center">
                  <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-2 border-2 border-blue-400">
                    <View className="w-2 h-2 rounded-full bg-white absolute top-4 left-4" />
                    <View className="w-2 h-2 rounded-full bg-white absolute top-4 right-4" />
                    <View className="w-6 h-1 rounded-full bg-white absolute bottom-4" style={{ transform: [{ rotate: '10deg' }] }}/>
                  </View>
                  <Text className="text-gray-700 dark:text-gray-300 text-xs">{profile?.name.substring(0, 8)}...</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Promo Banner 2 */}
        {promos[1] && (
          <LinearGradient
            colors={['#4c1d95', '#9d174d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 8, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}
          >
            <View>
              <Text className="text-white font-bold text-base mb-1">Played {promos[1].title}?</Text>
              <View className="flex-row items-center">
                <Text className="text-yellow-400 font-semibold text-xs">See Winnings </Text>
                <ChevronRight color="#facc15" size={14} />
              </View>
            </View>
            <View className="bg-pink-600 px-2 py-1 rounded">
              <Text className="text-white font-bold text-xs uppercase text-center">{promos[1].title.replace(/ /g, '\n')}</Text>
            </View>
          </LinearGradient>
        )}

        {/* Notifications */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black dark:text-white text-xl font-bold">{STRINGS.PROFILE.NOTIFICATIONS}</Text>
            <ChevronRight color={colorScheme === 'dark' ? 'white' : 'black'} size={20} />
          </View>
          <View className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 flex-row justify-between items-center border border-gray-200 dark:border-transparent">
            <View className="flex-1">
              <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{STRINGS.PROFILE.CAUGHT_UP}</Text>
              <Text className="text-black dark:text-white text-sm font-semibold">{STRINGS.PROFILE.ENABLE_NOTIFICATIONS}</Text>
            </View>
            <TouchableOpacity className="bg-blue-500 dark:bg-gray-700 px-4 py-2 rounded">
              <Text className="text-white font-semibold">{STRINGS.PROFILE.ALLOW}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Watching */}
        {profile && (
          <ContinueWatchingRow 
            title={`${STRINGS.HOME.CONTINUE_WATCHING_PREFIX} ${profile.name}`} 
            movies={continueWatching} 
            onMoviePress={(id) => router.push(`/detail/${id}`)} 
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
