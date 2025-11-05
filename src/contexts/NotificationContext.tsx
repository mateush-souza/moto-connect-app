import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Device from 'expo-device';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  AndroidImportance,
  cancelAllScheduledNotificationsAsync,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  Notification,
  NotificationResponse,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  Subscription,
} from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationContextData {
  expoPushToken: string | null;
  notification: Notification | null;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  sendLocalNotification: (title: string, body: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  useEffect(() => {
    loadNotificationPreference();

    notificationListener.current = addNotificationReceivedListener((notification: Notification) => {
      setNotification(notification);
    });

    responseListener.current = addNotificationResponseReceivedListener((response: NotificationResponse) => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  async function loadNotificationPreference() {
    try {
      const saved = await AsyncStorage.getItem('@notifications_enabled');
      if (saved !== null) {
        setNotificationsEnabledState(saved === 'true');
        if (saved === 'true') {
          const token = await registerForPushNotificationsAsync();
          setExpoPushToken(token || null);
        }
      } else {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token || null);
      }
    } catch (error) {
      console.log('Erro ao carregar preferência de notificações:', error);
    }
  }

  async function setNotificationsEnabled(enabled: boolean) {
    try {
      await AsyncStorage.setItem('@notifications_enabled', String(enabled));
      setNotificationsEnabledState(enabled);
      if (!enabled) {
        await cancelAllScheduledNotificationsAsync();
      } else {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token || null);
      }
    } catch (error) {
      console.log('Erro ao salvar preferência de notificações:', error);
    }
  }

  async function sendLocalNotification(title: string, body: string) {
    if (!notificationsEnabled) {
      console.log('Notificações desabilitadas');
      return;
    }

    await scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { timestamp: Date.now() },
      },
      trigger: null, // Immediately
    });
  }

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        notificationsEnabled,
        setNotificationsEnabled,
        sendLocalNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

async function registerForPushNotificationsAsync() {
  let token: string | undefined;

  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Notificações', 'Falha ao obter permissão para notificações push!');
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.expoConfig?.extra?.projectId ??
      (Constants as any).easConfig?.projectId;

    const tokenResponse = projectId
      ? await getExpoPushTokenAsync({ projectId })
      : await getExpoPushTokenAsync();

    token = tokenResponse.data;
    console.log('Expo Push Token:', token);
  } else {
    Alert.alert('Notificações', 'É necessário um dispositivo físico para Push Notifications');
  }

  return token;
}
