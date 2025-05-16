import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Por favor completa todos los campos');
    }
    
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Inicio de sesión exitoso');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
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
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-end">
                <Link to="/forgot-password" className="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Iniciar Sesión'}
              </button>
            </form>
            <div className="mt-3 text-center">
              <p>¿No tienes una cuenta? <Link to="/register" className="text-decoration-none">Regístrate</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;