import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Enviamos la solicitud al backend
      await authService.requestPasswordReset(email);
      
      // Si llegamos aquí, todo fue exitoso
      setSent(true);
      toast.success('Correo de recuperación enviado exitosamente');
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      
      // Mensaje de error más detallado y guía para el usuario
      const errorMessage = error.response?.data?.message || 'Error al solicitar recuperación de contraseña';
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Si fue un error de correo específico, damos sugerencias
      if (errorMessage.includes('correo') || errorMessage.includes('email')) {
        setError(errorMessage + '\nPor favor, verifica que el correo electrónico sea correcto y esté registrado en el sistema.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Recuperar Contraseña</h2>
              
              {!sent ? (
                <>
                  <p className="text-center text-muted mb-4">
                    Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
                  </p>
                  
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  
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
                    
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Enviando...
                          </>
                        ) : 'Enviar Enlace de Recuperación'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para recuperar tu contraseña.
                  </div>
                  <p>Revisa tu bandeja de entrada (y carpeta de spam) y sigue las instrucciones del correo.</p>
                </div>
              )}
              
              <div className="mt-3 text-center">
                <Link to="/login" className="text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i> Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;