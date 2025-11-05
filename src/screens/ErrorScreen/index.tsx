import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../routes';
import { useTheme } from '../../contexts/ThemeContext';

type ErrorScreenRouteProp = RouteProp<RootStackParamList, 'ErrorScreen'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ErrorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ErrorScreenRouteProp>();
  const motoData = route.params || {};
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const handleTryAgain = () => {
    navigation.navigate('RFIDScreen', { motoData });
  };

  const handleBackToForm = () => {
    navigation.navigate('MotorcycleRegistration');
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-blue-600'}`}>
      <StatusBar style="light" />

      <View className="pt-12 pb-4 px-6">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            {t('common.back')}
          </Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold">
          {t('motorcycleRegistration.title')}
        </Text>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-red-500 rounded-full p-8 mb-8">
          <Ionicons name="close" size={64} color="white" />
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-4">
          {t('error.title')}
        </Text>

        <Text className="text-white text-base text-center opacity-90 mb-8 max-w-xs">
          {t('error.message')}
        </Text>

        <View className="w-full max-w-xs">
          <TouchableOpacity
            onPress={handleTryAgain}
            className="bg-white rounded-full px-6 py-4"
          >
            <Text className="text-blue-600 font-semibold text-center text-base">
              {t('error.tryAgain')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBackToForm}
            className="bg-white/20 rounded-full px-6 py-4 mt-3"
          >
            <Text className="text-white font-semibold text-center text-base">
              {t('error.backToRegister')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
