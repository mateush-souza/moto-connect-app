import "./global.css";
import "./src/locales/i18n";
import React from 'react';
import { View, ActivityIndicator } from "react-native";

import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";

import {
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_600SemiBold,
  RedHatDisplay_700Bold
} from "@expo-google-fonts/red-hat-display";

import Routes from "./src/routes";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { NotificationProvider } from "./src/contexts/NotificationContext";
import { LanguageProvider, useLanguage } from "./src/contexts/LanguageContext";
import { useTheme } from "./src/contexts/ThemeContext";

function LoadingScreen() {
  const { isDark } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDark ? "#0f172a" : "#040404" }} >
      <ActivityIndicator size="large" color={isDark ? "#60a5fa" : "#ED145B"} />
    </View>
  );
}

function AppContent() {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Routes />;
}

export default function App() {
  const [isFontLoaded] = useFonts({
    primary_regular: Inter_400Regular,
    primary_medium: Inter_500Medium,
    primary_semiBold: Inter_600SemiBold,
    primary_bold: Inter_700Bold,
    secondary_regular: RedHatDisplay_400Regular,
    secondary_medium: RedHatDisplay_500Medium,
    secondary_semiBold: RedHatDisplay_600SemiBold,
    secondary_bold: RedHatDisplay_700Bold
  });

  if (!isFontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#040404" }} >
        <ActivityIndicator size="large" color="#ED145B" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
