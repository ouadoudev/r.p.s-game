import jwtDecode from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      return false; // Token is expired
    }

    return true; // Token is valid
  } catch (error) {
    return false; // Token is invalid
  }
};
