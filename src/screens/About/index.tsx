import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import Constants from 'expo-constants';

export default function About() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const commitHash =
    Constants.expoConfig?.extra?.commitHash ||
    process.env.EXPO_PUBLIC_COMMIT_HASH ||
    'dev';

  const developers = [
    { name: 'Mateus H. Souza', rm: 'RM558424', github: 'https://github.com/mateussouza' },
    { name: 'Lucas Fialho', rm: 'RM557884', github: 'https://github.com/lucasfialho' },
    { name: 'Cauan Passos', rm: 'RM555466', github: 'https://github.com/cauanpassos' },
  ];

  const technologies = [
    'React Native',
    'Expo',
    'TypeScript',
    'React Navigation',
    'NativeWind (TailwindCSS)',
    'Axios',
    'i18next',
    'Expo Notifications',
    'AsyncStorage',
  ];

  const features = [
    t('about.feature1'),
    t('about.feature2'),
    t('about.feature3'),
    t('about.feature4'),
    t('about.feature5'),
    t('about.feature6'),
  ];

  function openGitHub(url: string) {
    Linking.openURL(url);
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView className="flex-1">
        {/* Header */}
        <View className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-blue-600'}`}>
          <Text className="text-white text-3xl font-bold mb-2">
            {t('about.appName')}
          </Text>
          <Text className="text-white text-sm opacity-90">
            {t('about.description')}
          </Text>
        </View>

        {/* Version Info */}
        <View className="px-6 mt-6">
          <View className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <View className="flex-row justify-between mb-2">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about.version')}:
              </Text>
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about.build')}:
              </Text>
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {Constants.expoConfig?.android?.versionCode || '1'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about.commitHash')}:
              </Text>
              <Text className={`font-mono font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {commitHash}
              </Text>
            </View>
          </View>
        </View>

        {/* Developers */}
        <View className="px-6 mt-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t('about.developers')}
          </Text>
          {developers.map((dev, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openGitHub(dev.github)}
              className={`p-4 mb-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {dev.name}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {dev.rm}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                GitHub →
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Technologies */}
        <View className="px-6 mt-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t('about.technologies')}
          </Text>
          <View className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {technologies.map((tech, index) => (
              <Text
                key={index}
                className={`mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                • {tech}
              </Text>
            ))}
          </View>
        </View>

        {/* Features */}
        <View className="px-6 mt-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t('about.features')}
          </Text>
          <View className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {features.map((feature, index) => (
              <Text
                key={index}
                className={`mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                ✓ {feature}
              </Text>
            ))}
          </View>
        </View>

        {/* Copyright */}
        <View className="px-6 mt-6 mb-8">
          <Text className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {t('about.copyright')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
