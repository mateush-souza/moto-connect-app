import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';

import { Menu } from '../../components/Menu';
import { DrawerMenu } from '../../components/DrawerMenu';
import { getVehicles } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface Vehicle {
  vehicleId: string;
  licensePlate: string;
  vehicleModel: string;
}

interface FilterOptions {
  modelo: string;
}

export default function MotorcycleList() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { sendLocalNotification } = useNotifications();

  const [search, setSearch] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const [filters, setFilters] = useState<FilterOptions>({
    modelo: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [search, filters, vehicles]);

  const filterOptions = useMemo(
    () => [
      { label: t('motorcycleList.allModels'), value: '' },
      { label: t('motorcycleList.modelE'), value: 'E' },
      { label: t('motorcycleList.modelSport'), value: 'SPORT' },
      { label: t('motorcycleList.modelPop'), value: 'POP' },
    ],
    [t]
  );

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVehicles({
        page: currentPage,
        pageSize: itemsPerPage
      });

      if (response.data && Array.isArray(response.data)) {
        setVehicles(response.data);

        const paginationHeader = response.headers['x-pagination'];
        if (paginationHeader) {
          const paginationInfo = JSON.parse(paginationHeader);
          setTotalPages(paginationInfo.TotalPages || 1);
        } else {
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        }
      }
    } catch (error) {
      console.log('Erro ao carregar veículos:', error);
      Alert.alert(t('common.error'), t('motorcycleList.loadError') || t('motorcycleRegistration.registerError'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, t]);

  const applyFilters = () => {
    let filtered = vehicles;

    if (search) {
      filtered = filtered.filter(vehicle =>
        vehicle.licensePlate.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.modelo) {
      filtered = filtered.filter(vehicle => vehicle.vehicleModel === filters.modelo);
    }

    setFilteredVehicles(filtered);
  };

  const clearFilters = () => {
    setFilters({ modelo: '' });
    setSearch('');
    setFilterModalVisible(false);
  };

  const handleVehicleAction = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setActionModalVisible(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatLicensePlate = (plate: string) => {
    if (plate.length === 7) {
      return `${plate.slice(0, 3)}-${plate.slice(3)}`;
    }
    return plate;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      buttons.push(
        <TouchableOpacity
          key="prev"
          className={`${isDark ? 'bg-gray-700' : 'bg-gray-300'} px-3 py-2 rounded-md mx-1`}
          onPress={() => handlePageChange(currentPage - 1)}
        >
          <MaterialIcons name="chevron-left" size={20} color={isDark ? '#e2e8f0' : '#333'} />
        </TouchableOpacity>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      const isCurrent = i === currentPage;
      buttons.push(
        <TouchableOpacity
          key={`page-${i}`}
          className={`px-3 py-2 rounded-md mx-1 ${
            isCurrent ? (isDark ? 'bg-blue-800' : 'bg-blue-700') : (isDark ? 'bg-gray-800' : 'bg-gray-300')
          }`}
          onPress={() => handlePageChange(i)}
        >
          <Text className={`font-medium ${
            isCurrent ? 'text-white' : (isDark ? 'text-gray-200' : 'text-gray-700')
          }`}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <TouchableOpacity
          key="next"
          className={`${isDark ? 'bg-gray-700' : 'bg-gray-300'} px-3 py-2 rounded-md mx-1`}
          onPress={() => handlePageChange(currentPage + 1)}
        >
          <MaterialIcons name="chevron-right" size={20} color={isDark ? '#e2e8f0' : '#333'} />
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  const handleSendNotification = () => {
    if (selectedVehicle) {
      sendLocalNotification(
        t('notifications.newMotorcycle'),
        t('notifications.motorcycleRegistered', { plate: formatLicensePlate(selectedVehicle.licensePlate) })
      );
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View className={`${isDark ? 'bg-blue-900' : 'bg-blue-700'} p-4 rounded-b-2xl`}>
        <View className="flex-row mt-14 justify-between items-center">
          <Text className="text-white text-lg font-bold">{t('motorcycleList.title')}</Text>
          <TouchableOpacity
            className="bg-white/20 rounded-full p-2"
            onPress={() => setDrawerVisible(true)}
          >
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white mt-2 opacity-80">{t('motorcycleList.pullToRefresh')}</Text>
      </View>

      <View className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex-row justify-between items-center px-4 py-3`}>
        <TouchableOpacity
          className={`${isDark ? 'bg-blue-800' : 'bg-blue-700'} px-4 py-2 rounded-md flex-row items-center`}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={18} color="white" />
          <Text className="text-white font-medium ml-1">{t('motorcycleList.filters')}</Text>
        </TouchableOpacity>

        <View className="flex-1 ml-3">
          <TextInput
            placeholder={t('motorcycleList.searchPlaceholder')}
            placeholderTextColor={isDark ? '#94a3b8' : '#6b7280'}
            className={`${isDark ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white border border-gray-200 text-gray-800'} px-4 py-2 rounded-md`}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && (
        <View className="flex-row items-center justify-center py-3">
          <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#2563eb'} />
          <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} ml-2`}>{t('common.loading')}</Text>
        </View>
      )}

      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.vehicleId}
        className="flex-1 px-4"
        refreshing={loading}
        onRefresh={loadVehicles}
        renderItem={({ item }) => (
          <View className={`flex-row items-center justify-between py-4 border-b ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          } ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <View className="flex-row items-center flex-1">
              <FontAwesome name="motorcycle" size={24} color={isDark ? '#60a5fa' : '#1E40AF'} />
              <View className="ml-3 flex-1">
                <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-base font-semibold`}>
                  {formatLicensePlate(item.licensePlate)}
                </Text>
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  {t('motorcycleList.model')}: {item.vehicleModel}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="p-2"
              onPress={() => handleVehicleAction(item)}
            >
              <Entypo name="dots-three-horizontal" size={20} color={isDark ? '#cbd5f5' : '#333'} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <FontAwesome name="motorcycle" size={48} color={isDark ? '#1f2937' : '#D1D5DB'} />
            <Text className={`${isDark ? 'text-gray-500' : 'text-gray-500'} mt-4 text-center`}>
              {t('motorcycleList.noMotorcycles')}
            </Text>
            <Text className={`${isDark ? 'text-gray-600' : 'text-gray-400'} mt-2 text-center`}>
              {t('motorcycleList.addFirst')}
            </Text>
          </View>
        }
      />

      {totalPages > 1 && (
        <View className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex-row justify-center items-center py-4`}>
          <View className="flex-row items-center">
            {renderPaginationButtons()}
          </View>
        </View>
      )}

      <Menu />

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl p-6`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-xl font-bold`}>
                {t('motorcycleList.filters')}
              </Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#9ca3af' : '#666'} />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-base font-semibold mb-2`}>
                {t('motorcycleList.model')}
              </Text>
              <View className="flex-row flex-wrap">
                {filterOptions.map((modelo) => (
                  <TouchableOpacity
                    key={modelo.value || 'all'}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      filters.modelo === modelo.value
                        ? (isDark ? 'bg-blue-800' : 'bg-blue-700')
                        : (isDark ? 'bg-gray-800' : 'bg-gray-200')
                    }`}
                    onPress={() => setFilters({ modelo: modelo.value })}
                  >
                    <Text className={`${
                      filters.modelo === modelo.value
                        ? 'text-white'
                        : (isDark ? 'text-gray-300' : 'text-gray-700')
                    }`}>
                      {modelo.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                className={`${isDark ? 'bg-gray-800' : 'bg-gray-300'} px-6 py-3 rounded-lg flex-1 mr-2`}
                onPress={clearFilters}
              >
                <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-center font-semibold`}>
                  {t('motorcycleList.clearFilters')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${isDark ? 'bg-blue-800' : 'bg-blue-700'} px-6 py-3 rounded-lg flex-1 ml-2`}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text className="text-white text-center font-semibold">
                  {t('motorcycleList.applyFilters')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={actionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 w-80`}>
            <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-lg font-bold mb-4 text-center`}>
              {selectedVehicle ? formatLicensePlate(selectedVehicle.licensePlate) : ''}
            </Text>

            <TouchableOpacity className={`flex-row items-center py-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <MaterialIcons name="visibility" size={24} color={isDark ? '#60a5fa' : '#1E40AF'} />
              <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} ml-3 text-base`}>
                {t('motorcycleList.viewDetails')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className={`flex-row items-center py-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <MaterialIcons name="edit" size={24} color={isDark ? '#60a5fa' : '#1E40AF'} />
              <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} ml-3 text-base`}>
                {t('motorcycleList.edit')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={handleSendNotification}
            >
              <MaterialIcons name="notifications" size={24} color={isDark ? '#fbbf24' : '#f59e0b'} />
              <Text className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} ml-3 text-base`}>
                {t('notifications.testNotification')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-3">
              <MaterialIcons name="delete" size={24} color="#EF4444" />
              <Text className="ml-3 text-base text-red-500">
                {t('motorcycleList.delete')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${isDark ? 'bg-gray-800' : 'bg-gray-300'} px-6 py-3 rounded-lg mt-4`}
              onPress={() => setActionModalVisible(false)}
            >
              <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-center font-semibold`}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
