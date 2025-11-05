import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";

import { BackgroundStripes } from "../../components/BackgroundStripes";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { Logo } from "../../components/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../routes";

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Register() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function validateFields(): boolean {
    const newErrors: RegisterErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = t('register.fullNameRequired');
    }

    if (!email.trim()) {
      newErrors.email = t('register.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('register.invalidEmail');
    }

    if (!password.trim()) {
      newErrors.password = t('register.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('register.passwordMinLength');
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('register.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('register.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validateFields()) {
      Alert.alert(t('common.error'), t('register.fixErrors'));
      return;
    }

    setIsLoading(true);

    try {
      const { registerUser } = require('../../services/api');

      const userData = {
        name: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        type: 0
      };

      const result = await registerUser(userData);

      if (result.success) {
        Alert.alert(
          t('common.success'),
          t('register.registerSuccess'),
          [{ text: t('common.ok'), onPress: () => navigation.navigate("Login") }]
        );
      } else {
        Alert.alert(t('common.error'), t('register.registerError'));
      }
    } catch (error: any) {
      console.log("Erro no registro:", error);
      const errorMessage = error.message || t('register.registerError');
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      setIsLoading(false);
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
              placeholder={t('register.fullName')}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }
              }}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.fullName}
              </Text>
            )}

            <CustomInput
              placeholder={t('register.email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
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
              placeholder={t('register.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.password}
              </Text>
            )}

            <CustomInput
              placeholder={t('register.confirmPassword')}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.confirmPassword}
              </Text>
            )}

            <CustomButton
              title={isLoading ? t('register.registering') : t('register.registerButton')}
              onPress={handleRegister}
              disabled={isLoading}
            />

            <View className="flex-row justify-center mt-4">
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                {t('register.hasAccount')}{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login") }>
                <Text className="text-blue-600 text-sm font-semibold underline">
                  {t('register.login')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
