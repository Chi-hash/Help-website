// Auth utility functions for consistent token management

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const userData = getUserData();
  return !!(token && userData);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const handleAuthError = (response) => {
  if (response.status === 401) {
    console.error('Authentication failed - logging out');
    logout();
    return true; // Indicates auth error was handled
  }
  return false; // No auth error
}; 