import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      AsyncStorage.getItem('@user_email').then(setUserEmail).catch(() => setUserEmail(null));
    }
  }, [visible]);

  const menuItems = [
    {
      title: t('drawer.home'),
      icon: 'home-outline',
      iconType: 'Ionicons',
      onPress: () => {
        navigation.navigate('Home');
        onClose();
      }
    },
    {
      title: t('drawer.register'),
      icon: 'motorbike',
      iconType: 'MaterialCommunityIcons',
      onPress: () => {
        navigation.navigate('MotorcycleRegistration');
        onClose();
      }
    },
    {
      title: t('drawer.list'),
      icon: 'speedometer',
      iconType: 'MaterialCommunityIcons',
      onPress: () => {
        navigation.navigate('MotorcycleList');
        onClose();
      }
    },
    {
      title: t('drawer.settings'),
      icon: 'settings-outline',
      iconType: 'Ionicons',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      }
    },
    {
      title: t('drawer.about'),
      icon: 'information-circle-outline',
      iconType: 'Ionicons',
      onPress: () => {
        navigation.navigate('About');
        onClose();
      }
    },
    {
      title: t('drawer.logout'),
      icon: 'log-out-outline',
      iconType: 'Ionicons',
      onPress: () => {
        navigation.navigate('Login');
        onClose();
      }
    }
  ];

  const renderIcon = (iconName: string, iconType: string) => {
    if (iconType === 'Ionicons') {
      return <Ionicons name={iconName as any} size={24} color={isDark ? '#93c5fd' : '#1E40AF'} />;
    } else if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={iconName as any} size={24} color={isDark ? '#93c5fd' : '#1E40AF'} />;
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity 
          className="flex-1" 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View className={`${isDark ? 'bg-gray-900' : 'bg-white'} w-80 h-full absolute right-0 shadow-lg`}>
          {/* Header do Drawer */}
          <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-700'} p-6 pt-16`}>
            <TouchableOpacity 
              className="absolute top-12 right-4"
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-row items-center">
              <View className="bg-white/20 rounded-full p-3 mr-4">
                <Ionicons name="person" size={32} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-bold">
                  {userEmail || 'MotoConnect'}
                </Text>
                <Text className="text-white/80 text-sm">
                  {t('drawer.version')} {Constants.expoConfig?.version || '1.0.0'}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="flex-1 p-4">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center py-4 px-2 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
                onPress={item.onPress}
              >
                <View className="mr-4">
                  {renderIcon(item.icon, item.iconType)}
                </View>
                <Text className={`${isDark ? 'text-gray-200' : 'text-gray-800'} text-base font-medium`}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <Text className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs text-center`}>
              MotoConnect v{Constants.expoConfig?.version || '1.0.0'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
