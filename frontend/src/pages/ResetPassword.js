import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, verifyResetToken } = useAuth();

  useEffect(() => {
    // Verificamos si ya existe un indicador en sessionStorage de que hemos restablecido la contraseña con este token
    const hasResetPassword = sessionStorage.getItem(`password_reset_${token}`);
    
    if (hasResetPassword) {
      // Si ya se ha restablecido la contraseña con este token, redireccionar al login
      toast.info('Esta sesión de restablecimiento ya ha sido utilizada');
      navigate('/login');
      return;
    }

    // Verificar si el token es válido
    const checkToken = async () => {
      try {
        const response = await verifyResetToken(token);
        if (!response.valid) {
          if (response.used) {
            toast.info('Esta sesión de restablecimiento ya ha sido utilizada');
            navigate('/login');
          } else {
            setValidToken(false);
            toast.error('El enlace es inválido o ha expirado');
          }
        } else {
          setValidToken(true);
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        setValidToken(false);
        toast.error(error.response?.data?.message || 'Error al verificar el enlace');
      }
    };

    // Verificar el token inmediatamente
    if (token) {
      checkToken();
    }

    // Verificar cada 5 segundos si el token sigue siendo válido
    const interval = setInterval(() => {
      if (token) {
        checkToken();
      }
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [token, verifyResetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }
    
    if (password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }
    
    try {
      setLoading(true);
      await resetPassword(token, password);
      // Marcamos que este token ya ha sido usado para restablecer la contraseña
      sessionStorage.setItem(`password_reset_${token}`, 'true');
      toast.success('Contraseña restablecida exitosamente');
      // Redirigir al login inmediatamente
      navigate('/login', { replace: true });
      // Limpieza de la sesión después de la redirección
      sessionStorage.removeItem(`password_reset_${token}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
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