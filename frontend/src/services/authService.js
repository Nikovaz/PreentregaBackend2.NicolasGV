import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request:', config.method, config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    return Promise.reject(error);
  }
);

// Service methods
const authService = {
  // Register a new user
  register: async (userData) => {
    // Transformar nombres de campos para coincidir con el backend
    const transformedData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      age: userData.age || 18 // Valor predeterminado si no se proporciona
    };
    const response = await api.post('/auth/register', transformedData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/current');
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      return response.data;
    } catch (error) {
      // Mejorar el manejo de errores para proporcionar mensajes más útiles
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Error response:', error.response.status, error.response.data);
        
        // Si el servidor proporciona un mensaje de error, lo usamos
        if (error.response.data && error.response.data.message) {
          error.message = error.response.data.message;
        } else if (error.response.status === 404) {
          error.message = 'El correo electrónico no está registrado en el sistema.';
        } else if (error.response.status === 500) {
          error.message = 'Error en el servidor al procesar la solicitud. Por favor, intenta más tarde.';
        }
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.error('Error request:', error.request);
        error.message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      }
      
      throw error;
    }
  },

  // Verify reset token
  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { newPassword: password });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put(`/users/profile`, userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  },
};

export default authService;