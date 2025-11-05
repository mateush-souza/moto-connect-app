// src/components/CustomButton.tsx
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function CustomButton({ title, onPress, disabled = false }: CustomButtonProps) {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      className={`w-full rounded-lg py-4 mt-6 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} ${disabled ? 'opacity-60' : ''}`}
    >
      <Text className={`text-center text-base font-semibold ${isDark ? 'text-white' : 'text-white'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
