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
    const checkToken = async () => {
      try {
        await verifyResetToken(token);
      } catch (error) {
        setValidToken(false);
        toast.error('El enlace es inválido o ha expirado');
      }
    };
    
    if (token) {
      checkToken();
    }
  }, [token, verifyResetToken]);

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
      toast.success('Contraseña restablecida exitosamente');
      navigate('/login');
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
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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