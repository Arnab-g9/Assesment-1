import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MockApi } from '../../services/mockApi';
import { UserProfile } from '../../types';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/States';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MockApi.getUserProfile();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={loadProfile} />;

  return (
    <ScrollView 
      className="flex-1 bg-[#0f1014]"
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 16 }}
    >
      <Text className="text-white text-3xl font-bold mb-8">My Space</Text>

      {loading || !profile ? (
        <View className="items-center mt-10">
          <SkeletonLoader width={100} height={100} borderRadius={50} />
          <SkeletonLoader width={150} height={20} className="mt-4" />
          <SkeletonLoader width={100} height={16} className="mt-2" />
        </View>
      ) : (
        <View className="items-center mt-10">
          <Image
            source={profile.avatarUrl}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text className="text-white text-xl font-bold mt-4">{profile.name}</Text>
          <Text className="text-gray-400 mt-1">{profile.email}</Text>
          
          {profile.premiumStatus && (
            <View className="mt-4 bg-yellow-600 px-4 py-1 rounded-full">
              <Text className="text-white font-bold">Premium Member</Text>
            </View>
          )}

          <View className="w-full mt-12 bg-gray-900 rounded-lg p-4">
            <Text className="text-white text-lg font-bold mb-4">Settings</Text>
            {['Account', 'Downloads', 'Watchlist', 'Help & Support'].map((item, idx) => (
              <View key={idx} className="py-3 border-b border-gray-800">
                <Text className="text-gray-300">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
