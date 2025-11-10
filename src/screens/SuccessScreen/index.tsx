import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../routes';
import { useTheme } from '../../contexts/ThemeContext';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'SuccessScreen'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function SuccessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SuccessScreenRouteProp>();
  const { motoData } = route.params || {};
  const { t } = useTranslation();
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

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
        <View className={`${isDark ? 'bg-green-600' : 'bg-green-500'} rounded-full p-8 mb-8`}>
          <Ionicons name="checkmark" size={64} color="white" />
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-4">
          {t('success.title')}
        </Text>

        <Text className="text-white text-base text-center opacity-90 mb-8">
          {t('success.message')}
        </Text>

        {motoData && (
          <View className="bg-white/10 rounded-xl p-4 mb-8 w-full max-w-xs">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-sm opacity-75">{t('success.plate')}:</Text>
              <Text className="text-white font-semibold text-lg">{motoData.plate || motoData.placa}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-white text-sm opacity-75">{t('success.model')}:</Text>
              <Text className="text-white font-semibold">{motoData.model || motoData.modelo}</Text>
            </View>
          </View>
        )}

        <Text className="text-white text-sm text-center opacity-75">
          {t('success.redirecting')}
        </Text>
      </View>
    </View>
  );
}
