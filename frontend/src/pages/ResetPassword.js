import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, verifyResetToken } = useAuth();

  useEffect(() => {
    // Verificar token solo una vez al cargar
    if (token && !hasCheckedToken) {
      checkToken();
      setHasCheckedToken(true);
    }
  }, [token, verifyResetToken, navigate, hasCheckedToken]);

  const checkToken = async () => {
    try {
      const response = await verifyResetToken(token);
      
      // El backend no devuelve un objeto con .valid, así que asumimos que si no hay error, el token es válido
      setTokenIsValid(true);
      
    } catch (error) {
      console.error('Error al verificar el token:', error);
      setTokenIsValid(false);
      
      // Manejar los diferentes tipos de errores que puede devolver el backend
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('Token inválido')) {
          toast.error('El enlace es inválido o ha expirado');
        } else if (error.response.data.message.includes('Usuario no encontrado')) {
          toast.error('Usuario no encontrado');
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Error al verificar el enlace');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      return toast.error('Token de reseteo no válido');
    }

    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }
    
    if (password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }
    
    try {
      setLoading(true);
      
      // Intentar resetear la contraseña directamente
      await resetPassword(token, password);
      
      // Si llegamos aquí, el reseteo fue exitoso
      toast.success('Contraseña restablecida exitosamente');
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Error al resetear la contraseña:', error);
      
      // Manejar los diferentes tipos de errores
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('Token inválido')) {
          toast.error('El enlace de reseteo ha expirado o es inválido');
        } else if (error.response.data.message.includes('La nueva contraseña')) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Error al restablecer la contraseña');
        }
      } else {
        toast.error('Error al restablecer la contraseña');
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenIsValid === false) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4 text-center">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--bs-danger)' }}></i>
              </div>
              <h2 className="mb-3">Enlace Inválido</h2>
              <p className="mb-4">
                El enlace para restablecer la contraseña es inválido o ha expirado.
              </p>
              <div>
                <Link to="/forgot-password" className="btn btn-primary">
                  Solicitar Nuevo Enlace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Crear Nueva Contraseña</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Restablecer Contraseña'}
              </button>
            </form>
            <div className="mt-3 text-center">
              <Link to="/login" className="text-decoration-none">
                Volver al Inicio de Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;