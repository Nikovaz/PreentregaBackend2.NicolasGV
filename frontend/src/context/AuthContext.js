import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      await getCurrentUser();
      toast.success('Registro exitoso');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      await getCurrentUser();
      toast.success('Inicio de sesión exitoso');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Has cerrado sesión');
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Error getting current user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset (alias for forgotPassword)
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      toast.success('Se ha enviado un correo de recuperación');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al solicitar recuperación');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Alias for requestPasswordReset for more intuitive naming
  const forgotPassword = requestPasswordReset;

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      toast.success('Contraseña actualizada correctamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al restablecer contraseña');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify reset token
  const verifyResetToken = async (token) => {
    try {
      setLoading(true);
      await authService.verifyResetToken(token);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Token inválido o expirado');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(userData);
      setUser({...user, ...userData});
      toast.success('Perfil actualizado correctamente');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getCurrentUser,
        requestPasswordReset,
        forgotPassword,
        resetPassword,
        verifyResetToken,
        updateUserProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};