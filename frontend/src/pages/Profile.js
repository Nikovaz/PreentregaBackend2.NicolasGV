import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setResetEmail(user.email || '');
      
      // Aquí podrías cargar las órdenes del usuario desde una API
      // const fetchOrders = async () => {
      //   try {
      //     const response = await orderService.getUserOrders();
      //     setOrders(response.data);
      //   } catch (error) {
      //     toast.error('Error al cargar las órdenes');
      //   }
      // };
      // fetchOrders();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateUserProfile({ name });
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setPasswordLoading(true);
      await authService.changePassword({
        currentPassword,
        newPassword
      });
      toast.success('Contraseña actualizada correctamente');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Debe ingresar su correo electrónico');
      return;
    }
    
    try {
      setResetLoading(true);
      await authService.requestPasswordReset(resetEmail);
      toast.success('Se ha enviado un correo con instrucciones para restablecer su contraseña');
      setShowResetForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al solicitar el restablecimiento de contraseña');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card shadow mb-4">
          <div className="card-body">
            <h3 className="card-title">Mi Perfil</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  disabled
                />
                <div className="form-text">El correo electrónico no puede ser modificado</div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="card shadow">
          <div className="card-body">
            <h3 className="card-title">Seguridad</h3>
            {!showPasswordForm ? (
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Cambiar Contraseña
                </button>
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowResetForm(true)}
                >
                  Restablecer Contraseña
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-grow-1" 
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            )}
            
            {showResetForm && (
              <form onSubmit={handleResetRequest} className="mt-3">
                <h5>Restablecer Contraseña</h5>
                <p className="small text-muted">Se enviará un correo electrónico con las instrucciones para restablecer tu contraseña.</p>
                <div className="mb-3">
                  <label htmlFor="resetEmail" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetEmail(user?.email || '');
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-grow-1" 
                    disabled={resetLoading}
                  >
                    {resetLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="card-title">Mis Pedidos</h3>
            {orders.length === 0 ? (
              <p className="text-muted">No tienes pedidos todavía.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}...</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`badge bg-${
                            order.status === 'pending' ? 'warning' :
                            order.status === 'completed' ? 'success' :
                            order.status === 'cancelled' ? 'danger' : 'info'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;