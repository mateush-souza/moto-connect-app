import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Menu } from '../../components/Menu';
import { RootStackParamList } from '../../routes';
import { useTheme } from '../../contexts/ThemeContext';

const image = require("../../../assets/images/banner-home.jpg");

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('@current_user')
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.name) {
            setUserName(parsed.name as string);
          }
        }
      })
      .catch((error) => console.log('Erro ao carregar usuário:', error));
  }, []);

  const greetingText = userName
    ? t('home.greeting', { name: userName.split(' ')[0] })
    : t('home.greetingFallback');

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={image}
          className="h-64 justify-end"
          resizeMode="cover"
        >
          <View className="absolute inset-0 bg-black/40" />

          <TouchableOpacity
            className="absolute top-12 right-4 bg-white/20 rounded-full p-2"
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>

          <View className="p-6 pb-8">
            <Text className="text-white text-2xl font-bold mb-2">
              {t('about.appName')}
            </Text>
            <Text className="text-white text-base opacity-90">
              {t('home.subtitle')}
            </Text>
            <Text className="text-white text-sm opacity-80 mt-1">
              {t('home.comingSoon')}
            </Text>
          </View>
        </ImageBackground>

        <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-600'} px-6 py-4`}>
          <Text className="text-white text-lg font-semibold mb-1">
            {greetingText}
          </Text>
          <Text className="text-white text-sm opacity-90">
            {t('home.helpDescription')}
          </Text>
        </View>

        <View className="px-6 py-8">
          <View className="flex-row justify-between">
            <TouchableOpacity
              className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-2xl p-6 flex-1 mr-3 shadow-sm`}
              onPress={() => navigation.navigate('MotorcycleRegistration')}
            >
              <View className="items-center">
                <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-100'} rounded-full p-4 mb-4`}>
                  <MaterialCommunityIcons name="motorbike" size={32} color={isDark ? '#60a5fa' : '#2563eb'} />
                </View>
                <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} font-semibold text-center`}>
                  {t('home.registerMotorcycle')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-2xl p-6 flex-1 ml-3 shadow-sm`}
              onPress={() => navigation.navigate("MotorcycleList")}
            >
              <View className="items-center">
                <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-100'} rounded-full p-4 mb-4`}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={32} color={isDark ? '#60a5fa' : '#2563eb'} />
                </View>
                <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} font-semibold text-center`}>
                  {t('home.motorcycleList')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-600'} mx-6 rounded-2xl p-6 mb-8`}>
          <Text className="text-white text-lg font-semibold mb-2">
            {t('home.help')}
          </Text>
          <Text className="text-white text-sm opacity-90 mb-4">
            {t('home.helpDescription')}
          </Text>

          <TouchableOpacity
            className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-full px-6 py-3 self-start`}
            onPress={() => navigation.navigate('MotorcycleList')}
          >
            <Text className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
              {t('home.comingSoon')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Menu />
    </View>
  );
}
