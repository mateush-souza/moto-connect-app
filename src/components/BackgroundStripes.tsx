import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function BackgroundStripes() {
  const { isDark } = useTheme();

  const primaryColor = isDark ? '#1e293b' : '#2563eb';
  const secondaryColor = isDark ? '#0f172a' : '#3b82f6';

  return (
    <View className="absolute bottom-0 right-0 w-full h-64">
      {/* Primeira linha diagonal */}
      <View 
        className="absolute bottom-0 right-0 h-20 w-full"
        style={{
          backgroundColor: primaryColor,
          transform: [{ skewY: '-10deg' }],
          transformOrigin: 'bottom right'
        }}
      />
      {/* Segunda linha diagonal */}
      <View 
        className="absolute bottom-16 right-0 h-16 w-full"
        style={{
          backgroundColor: secondaryColor,
          transform: [{ skewY: '-10deg' }],
          transformOrigin: 'bottom right'
        }}
      />
    </View>
  );
}
