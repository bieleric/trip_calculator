import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useAllTripsStore } from '@/stores/allTripsStore';
import { useClosingsStore } from '@/stores/closingsStore';
import router from '../router';

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
      const decodedJWT = jwtDecode(localStorage.getItem('jwt'));
      return decodedJWT.role_id === 1 || decodedJWT.role_id === 0;
    } catch (err) {
      return false;
    }
}

export const isSuperUser = () => {
  try {
    const decodedJWT = jwtDecode(localStorage.getItem('jwt'));
    return decodedJWT.role_id === 0;
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
      roleId: decodedJWT.role_id,
      groupId: decodedJWT.group_id
    }
  } catch (err) {
    return false;
  }
}

export const signOut = () => {
  useUserStore().resetStore();
  useSettingsStore().resetStore();
  useFavoritesStore().resetStore();
  useAllTripsStore().resetStore();
  useClosingsStore().resetStore();
  localStorage.removeItem('jwt');
  router.push('/signIn');
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