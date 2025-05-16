import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      
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
  }, [currentUser]);

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

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card shadow">
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