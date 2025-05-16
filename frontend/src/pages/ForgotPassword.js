import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error('Por favor ingresa tu correo electrónico');
    }
    
    try {
      setLoading(true);
      await forgotPassword(email);
      setSent(true);
      toast.success('Se ha enviado un correo con instrucciones para restablecer tu contraseña');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4 text-center">
              <div className="mb-4">
                <i className="bi bi-envelope-check" style={{ fontSize: '3rem', color: 'var(--bs-success)' }}></i>
              </div>
              <h2 className="mb-3">Correo Enviado</h2>
              <p className="mb-4">
                Hemos enviado instrucciones para restablecer tu contraseña a: <strong>{email}</strong>
              </p>
              <p className="mb-4">
                Por favor revisa tu bandeja de entrada y sigue las instrucciones en el correo.
              </p>
              <div>
                <Link to="/login" className="btn btn-primary">
                  Volver al Inicio de Sesión
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
            <h2 className="text-center mb-4">Recuperar Contraseña</h2>
            <p className="text-muted mb-4">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
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

export default ForgotPassword;