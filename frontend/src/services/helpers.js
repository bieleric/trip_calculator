import { jwtDecode } from 'jwt-decode';

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
      return decodedJWT.role_id === 1;
    } catch (err) {
      return false;
    }
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const dayFormatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });
  const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric'});

  const day = dayFormatter.format(date);
  const formattedDate = dateFormatter.format(date);

  return `${day}, ${formattedDate}`;
}