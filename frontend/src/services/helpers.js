import { jwtDecode } from 'jwt-decode';
import router from '../router';
import { getActivePinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useAllTripsStore } from '@/stores/allTripsStore';
import { useClosingsStore } from '@/stores/closingsStore';
import { useGroupAndRoleStore } from '@/stores/groupAndRoleStore';
import { fetchAllDataByGroup } from './apiRequests';

export const isTokenExpired = () => {
    try {
      const decodedJWT = jwtDecode(localStorage.getItem('jwt'));
      return decodedJWT.exp < (Date.now() / 1000);
    } catch (err) {
      return true;
    }  
}

export const isAdmin = () => {
    try {
      const groupAndRoleStore = useGroupAndRoleStore();
      return groupAndRoleStore.getCurrentGroup.role_id === 1 || groupAndRoleStore.getCurrentGroup.role_id === 0;
    } catch (err) {
      return false;
    }
}

export const isSuperUser = () => {
  try {
    const groupAndRoleStore = useGroupAndRoleStore();
    return groupAndRoleStore.getCurrentGroup.role_id === 0;
  } catch (err) {
    return false;
  }
}

export const getUser = () => {
  try {
    const decodedJWT = jwtDecode(localStorage.getItem('jwt'));
    return {
      email: decodedJWT.email,
      userId: decodedJWT.userId,
      name: decodedJWT.name,
      active: decodedJWT.active,
      groups: decodedJWT.groups,
    }
  } catch (err) {
    return false;
  }
}

export const checkStoreExistsByStoreId = (storeId) => {
  const pinia = getActivePinia();
  return pinia._s.has(storeId);
};

export const signOut = () => {
  checkStoreExistsByStoreId('userStore') && useUserStore().resetStore();
  checkStoreExistsByStoreId('settingsStore') && useSettingsStore().resetStore();
  checkStoreExistsByStoreId('favoritesStore') && useFavoritesStore().resetStore();
  checkStoreExistsByStoreId('allTripsStore') && useAllTripsStore().resetStore();
  checkStoreExistsByStoreId('closingsStore') && useClosingsStore().resetStore();
  checkStoreExistsByStoreId('groupAndRoleStore') && useGroupAndRoleStore().resetStore();
  localStorage.removeItem('jwt');
  router.push('/signIn');
}

export const resetStoresAndFetchDataByGroupId = (groupId) => {
  useUserStore().resetStore();
  useSettingsStore().resetStore();
  useFavoritesStore().resetStore();
  useAllTripsStore().resetStore();
  useClosingsStore().resetStore();
  useGroupAndRoleStore().resetStore();
  fetchAllDataByGroup(groupId);
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const dayFormatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });
  const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric'});

  const day = dayFormatter.format(date);
  const formattedDate = dateFormatter.format(date);

  return `${day}, ${formattedDate}`;
}

export const getMonthsNames = () => ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

export const getMonthAsNumeral = (monthAsString) => {
  return getMonthsNames().indexOf(monthAsString) + 1;
}