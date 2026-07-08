import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('blemout_admin_token');
    const email = localStorage.getItem('blemout_admin_email');
    if (token && email) {
      setAdmin({ email, token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    localStorage.setItem('blemout_admin_token', data.token);
    localStorage.setItem('blemout_admin_email', data.email);
    setAdmin({ email: data.email, token: data.token });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('blemout_admin_token');
    localStorage.removeItem('blemout_admin_email');
    setAdmin(null);
  };

  const isAuthenticated = !!admin?.token;

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
