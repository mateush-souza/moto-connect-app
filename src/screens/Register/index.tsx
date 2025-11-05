import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
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

import { BackgroundStripes } from "../../components/BackgroundStripes";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { Logo } from "../../components/Logo";
import { Picker } from '@react-native-picker/picker';

colorScheme.set("light");

interface Errors {
  fullName?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

export default function Register() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { navigate } = useNavigation();

  function validateFields(): boolean {
    const newErrors: Errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validateFields()) {
      Alert.alert("Erro", "Por favor, corrija os campos destacados");
      return;
    }

    setIsLoading(true);

    try {
      const { registerUser } = require('../../services/api');

      const userData = {
        name: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        type: selectedRole === 'admin' ? 1 : 0
      };

      const result = await registerUser(userData);

      if (result.success) {
        Alert.alert(
          "Sucesso",
          "Usuário cadastrado com sucesso!",
          [{ text: "OK", onPress: () => navigate("Login") }]
        );
      } else {
        Alert.alert("Erro", "Falha ao realizar cadastro. Tente novamente.");
      }
    } catch (error: any) {
      console.log("Erro no registro:", error);
      const errorMessage = error.message || "Falha ao realizar cadastro. Tente novamente.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

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
              placeholder="Nome Completo"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: null }));
                }
              }}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.fullName}
              </Text>
            )}

            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: null }));
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
              placeholder="Senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: null }));
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
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
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
              title={isLoading ? "Cadastrando..." : "Cadastrar"}
              onPress={handleRegister}
              disabled={isLoading}
            />

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600 text-sm">
                Já tem conta?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigate("Login")}>
                <Text className="text-blue-600 text-sm font-semibold underline">
                  Faça login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
