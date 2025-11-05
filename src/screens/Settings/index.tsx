import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { RootStackParamList } from "../../routes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { navigate } = useNavigation<NavigationProp>();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { notificationsEnabled, setNotificationsEnabled, sendLocalNotification } = useNotifications();
  const { language, setLanguage } = useLanguage();

  const languages = useMemo(() => ([
    { code: 'es', name: 'Español' },
    { code: 'pt-BR', name: 'Português' },
  ]), []);

  const themes = useMemo(() => ([
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
    { value: 'system', label: t('settings.system') },
  ]), [t]);

  async function handleLanguageChange(languageCode: string) {
    await setLanguage(languageCode);
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView className="flex-1">
        <View className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-blue-600'}`}>
          <Text className="text-white text-2xl font-bold">
            {t('settings.title')}
          </Text>
        </View>

        <View className="mt-6 px-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t('settings.language')}
          </Text>
          {languages.map((lang) => {
            const isSelected = language === lang.code || i18n.language.startsWith(lang.code);
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageChange(lang.code)}
                className={`p-4 mb-2 rounded-lg border-2 ${
                  isSelected
                    ? isDark
                      ? 'bg-blue-900 border-blue-500'
                      : 'bg-blue-50 border-blue-600'
                    : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <Text
                  className={`text-base ${
                    isSelected
                      ? 'text-blue-500 font-semibold'
                      : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-6 px-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t('settings.theme')}
          </Text>
          {themes.map((themeOption) => (
            <TouchableOpacity
              key={themeOption.value}
              onPress={() => setThemeMode(themeOption.value as any)}
              className={`p-4 mb-2 rounded-lg border-2 ${
                themeMode === themeOption.value
                  ? isDark
                    ? 'bg-blue-900 border-blue-500'
                    : 'bg-blue-50 border-blue-600'
                  : isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Text
                className={`text-base ${
                  themeMode === themeOption.value
                    ? 'text-blue-500 font-semibold'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {themeOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 px-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t('settings.notifications')}
          </Text>
          <View
            className={`p-4 rounded-lg flex-row justify-between items-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <Text className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('settings.enableNotifications')}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              trackColor={{ false: '#767577', true: '#3b82f6' }}
              thumbColor={notificationsEnabled ? '#1d4ed8' : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity
            onPress={() => sendLocalNotification(t('notifications.testNotification'), t('notifications.testBody'))}
            disabled={!notificationsEnabled}
            className={`mt-3 p-4 rounded-lg border ${
              notificationsEnabled
                ? isDark
                  ? 'border-blue-500 bg-blue-950'
                  : 'border-blue-500 bg-blue-50'
                : isDark
                ? 'border-gray-700 bg-gray-800 opacity-50'
                : 'border-gray-300 bg-gray-100 opacity-50'
            }`}
          >
            <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm`}>
              {t('notifications.testNotification')}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 px-6 mb-8">
          <TouchableOpacity
            onPress={() => navigate("About")}
            className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            <Text className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('settings.about')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
