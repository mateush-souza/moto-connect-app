import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { useTranslation } from "react-i18next";

import { BackgroundStripes } from "../../components/BackgroundStripes";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { Logo } from "../../components/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { RootStackParamList } from "../../routes";

interface LoginErrors {
  email?: string;
  password?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Login() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { sendLocalNotification } = useNotifications();
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  async function loadSavedData() {
    try {
      const savedEmail = await AsyncStorage.getItem('@user_email');
      const savedRememberMe = await AsyncStorage.getItem('@remember_me');

      if (savedEmail && savedRememberMe === 'true') {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Erro ao carregar dados salvos:', error);
    }
  }

  async function saveUserData(userData: any) {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('@user_email', userData.email);
        await AsyncStorage.setItem('@remember_me', 'true');
      } else {
        await AsyncStorage.removeItem('@user_email');
        await AsyncStorage.removeItem('@remember_me');
      }

      await AsyncStorage.setItem('@current_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@login_timestamp', new Date().toISOString());
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  }

  function validateFields() {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = t('login.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('login.invalidEmail');
    }

    if (!password.trim()) {
      newErrors.password = t('login.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('login.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function clearFields() {
    setEmail("");
    setPassword("");
    setErrors({});
  }

  async function handleLogin() {
    if (!validateFields()) {
      Alert.alert(t('common.error'), t('login.fixErrors'));
      return;
    }

    setIsLoading(true);

    try {
      const { loginUser } = require('../../services/api');
      const authResult = await loginUser(email.toLowerCase().trim(), password);

      if (authResult.success && authResult.user) {
        const userData = {
          ...authResult.user,
          email: email.toLowerCase().trim(),
          loginTime: new Date().toISOString(),
          isAuthenticated: true,
          token: authResult.token
        };

        await saveUserData(userData);
        await saveLoginHistory(userData);
        await sendLocalNotification(t('notifications.welcomeTitle'), t('notifications.welcomeBody'));

        Alert.alert(
          t('common.success'),
          authResult.message || t('login.loginSuccess'),
          [{ text: t('common.ok'), onPress: () => navigation.navigate("Home") }]
        );
      } else {
        Alert.alert(t('common.error'), authResult.message || t('login.loginError'));
      }
    } catch (error) {
      console.log('Erro no login:', error);
      Alert.alert(t('common.error'), t('login.loginError'));
    } finally {
      setIsLoading(false);
    }
  }

  async function saveLoginHistory(userData: any) {
    try {
      const existingHistory = await AsyncStorage.getItem('@login_history');
      let history = existingHistory ? JSON.parse(existingHistory) : [];

      history.push({
        email: userData.email,
        timestamp: userData.loginTime,
        device: Platform.OS
      });

      if (history.length > 10) {
        history = history.slice(-10);
      }

      await AsyncStorage.setItem('@login_history', JSON.stringify(history));
    } catch (error) {
      console.log('Erro ao salvar histórico:', error);
    }
  }

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <BackgroundStripes />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-8 py-10">
          <Logo />

          <View>
            <CustomInput
              placeholder={t('login.email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.email}
              </Text>
            )}

            <CustomInput
              placeholder={t('login.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.password}
              </Text>
            )}

            <TouchableOpacity
              className="flex-row items-center mt-4 mb-2"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${
                rememberMe ? 'bg-blue-600 border-blue-600' : isDark ? 'border-gray-500' : 'border-gray-400'
              }`}>
                {rememberMe && (
                  <Text className="text-white text-xs">✓</Text>
                )}
              </View>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                {t('login.rememberMe')}
              </Text>
            </TouchableOpacity>

            <CustomButton
              title={isLoading ? t('login.loggingIn') : t('login.loginButton')}
              onPress={handleLogin}
              disabled={isLoading}
            />

            <TouchableOpacity
              className="mt-2 py-2"
              onPress={clearFields}
            >
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center text-sm`}>
                {t('login.clearFields')}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                {t('login.noAccount')}{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register") }>
                <Text className="text-blue-600 text-sm font-semibold underline">
                  {t('login.register')}
                </Text>
              </TouchableOpacity>
            </View>

            {email ? (
              <View className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-xs`}>
                  {t('login.insertedEmail')}: {email}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
