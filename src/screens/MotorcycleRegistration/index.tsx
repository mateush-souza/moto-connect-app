import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { Menu } from '../../components/Menu';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { RootStackParamList } from '../../routes';

interface FormData {
  placa: string;
  dataEntrada: string;
  modelo: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MotorcycleRegistration() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { sendLocalNotification } = useNotifications();

  const [formData, setFormData] = useState<FormData>({
    placa: '',
    dataEntrada: '',
    modelo: 'E'
  });
  const [isLoading, setIsLoading] = useState(false);

  const modelOptions = useMemo(
    () => [
      { label: t('motorcycleRegistration.modelE'), value: 'E' },
      { label: t('motorcycleRegistration.modelSport'), value: 'SPORT' },
      { label: t('motorcycleRegistration.modelPop'), value: 'POP' },
    ],
    [t]
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPlaca = (text: string) => {
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
  };

  const formatData = (text: string) => {
    const numbers = text.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handlePlacaChange = (text: string) => {
    const formatted = formatPlaca(text);
    handleInputChange('placa', formatted);
  };

  const handleDataChange = (text: string) => {
    const formatted = formatData(text);
    handleInputChange('dataEntrada', formatted);
  };

  const validateForm = (): boolean => {
    if (!formData.placa || formData.placa.length < 7) {
      Alert.alert(t('common.error'), t('motorcycleRegistration.plateRequired'));
      return false;
    }

    if (!formData.dataEntrada || formData.dataEntrada.length < 10) {
      Alert.alert(t('common.error'), t('motorcycleRegistration.invalidDate'));
      return false;
    }

    if (!formData.modelo.trim()) {
      Alert.alert(t('common.error'), t('motorcycleRegistration.modelRequired'));
      return false;
    }

    return true;
  };

  const handleCadastrar = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { createVehicle } = require('../../services/api');

      const plateClean = formData.placa.replace('-', '').toUpperCase();

      const vehicleData = {
        licensePlate: plateClean,
        vehicleModel: formData.modelo || 'E'
      };

      const response = await createVehicle(vehicleData);

      if (response.status >= 200 && response.status < 300) {
        await sendLocalNotification(
          t('notifications.newMotorcycle'),
          t('notifications.motorcycleRegistered', { plate: formData.placa })
        );

        navigation.navigate('SuccessScreen', {
          motoData: {
            plate: formData.placa,
            model: formData.modelo,
            date: formData.dataEntrada,
            id: response.data?.vehicleId,
          }
        });
      } else {
        const errorMsg = response.data?.error || t('motorcycleRegistration.registerError');
        Alert.alert(t('common.error'), errorMsg);
      }
    } catch (error: any) {
      console.log('Erro no cadastro de moto:', error);
      const errorMessage = error.response?.data?.error || error.message || t('motorcycleRegistration.registerError');
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar style="light" />

      <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-600'} pt-12 pb-4 px-6`}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              {t('common.back')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white text-2xl font-bold mt-4">
          {t('motorcycleRegistration.title')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-12" showsVerticalScrollIndicator={false}>
        <View className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-2xl p-6 shadow-sm`}>
          <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-lg font-semibold mb-6`}>
            {t('motorcycleRegistration.motorcycleData')}
          </Text>

          <View className="mb-4">
            <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
              {t('motorcycleRegistration.plate')}
            </Text>
            <CustomInput
              placeholder={t('motorcycleRegistration.platePlaceholder')}
              value={formData.placa}
              onChangeText={handlePlacaChange}
              autoCapitalize="characters"
            />
          </View>

          <View className="mb-4">
            <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
              {t('motorcycleRegistration.date')}
            </Text>
            <CustomInput
              placeholder={t('motorcycleRegistration.datePlaceholder')}
              value={formData.dataEntrada}
              onChangeText={handleDataChange}
              keyboardType="numeric"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-6">
            <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
              {t('motorcycleRegistration.model')}
            </Text>

            <View className={`${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl px-2 justify-center h-14`}>
              <Picker
                selectedValue={formData.modelo || 'E'}
                onValueChange={(itemValue) => handleInputChange('modelo', itemValue)}
                style={{
                  color: isDark ? '#f8fafc' : '#1f2937',
                  fontSize: 16,
                  ...Platform.select({
                    android: { paddingLeft: 0 },
                  }),
                }}
                dropdownIconColor={isDark ? '#60a5fa' : '#2563eb'}
              >
                {modelOptions.map(option => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <CustomButton
            title={isLoading ? t('motorcycleRegistration.registering') : t('motorcycleRegistration.register')}
            onPress={handleCadastrar}
            disabled={isLoading}
          />
        </View>

        <View className="h-8" />
      </ScrollView>

      <Menu />
    </View>
  );
}
