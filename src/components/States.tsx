import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RefreshCcw, AlertCircle } from 'lucide-react-native';

interface StateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: StateProps) => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <AlertCircle color="#ef4444" size={48} className="mb-4" />
      <Text className="text-white text-lg font-semibold text-center mb-2">{message}</Text>
      {onRetry && (
        <TouchableOpacity 
          onPress={onRetry}
          className="mt-4 bg-blue-600 px-6 py-2 rounded-full flex-row items-center"
        >
          <RefreshCcw color="white" size={16} className="mr-2" />
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const EmptyState = ({ message = 'No data available' }: StateProps) => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-gray-400 text-lg font-medium text-center">{message}</Text>
    </View>
  );
};
