// src/components/CustomInput.tsx
import { TextInput, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export function CustomInput({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences"
}: CustomInputProps) {
  const { isDark } = useTheme();

  return (
    <View className="mb-4">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className={`w-full rounded-lg px-4 py-4 text-base ${isDark ? 'bg-gray-800 border border-gray-600 text-gray-100' : 'bg-white border border-blue-300 text-gray-700'}`}
        placeholderTextColor={isDark ? "#64748b" : "#9CA3AF"}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
