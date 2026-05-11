export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const logout = () => {
  localStorage.removeItem('access_token');
};
