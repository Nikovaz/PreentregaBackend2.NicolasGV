import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  // Sample products data that matches the MongoDB id format
  const featuredProducts = [
    {
      _id: '60d21b4667d0d8992e610c85',
      name: 'Producto 1',
      price: 99.99
    },
    {
      _id: '60d21b4667d0d8992e610c86',
      name: 'Producto 2',
      price: 99.99
    },
    {
      _id: '60d21b4667d0d8992e610c87',
      name: 'Producto 3',
      price: 99.99
    },
    {
      _id: '60d21b4667d0d8992e610c88',
      name: 'Producto 4',
      price: 99.99
    }
  ];
  
  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.warning('Por favor inicia sesión para añadir productos al carrito');
      return;
    }
    
    try {
      await addToCart(productId, 1);
      const product = featuredProducts.find(p => p._id === productId);
      toast.success(`${product.name} añadido al carrito!`);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      toast.error(`Error al añadir al carrito: ${error.message}`);
    }
  };
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="p-5 mb-4 bg-light rounded-3">
            <Container fluid className="py-5">
              <h1 className="display-5 fw-bold">¡Bienvenido a nuestra tienda!</h1>
              <p className="fs-4">
                Encuentra los mejores productos con los mejores precios. Navega por nuestras categorías 
                y descubre ofertas increíbles.
              </p>
              <Button variant="primary" size="lg">
                Ver productos
              </Button>
            </Container>
          </div>
        </Col>
      </Row>

      <h2 className="mb-4">Productos destacados</h2>
      
      <Row>
        {featuredProducts.map((product) => (
          <Col key={product._id} md={3} className="mb-4">
            <Card>
              <Card.Img 
  variant="top" 
  src={`/images/azul.png`} // o la imagen que prefieras
/>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  Descripción corta del {product.name}.
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 mb-0">${product.price}</span>
                  <Button variant="primary" size="sm" onClick={() => handleAddToCart(product._id)}>
                    Agregar al carrito
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="my-5">
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <i className="bi bi-truck fs-1 mb-3"></i>
              <Card.Title>Envío gratis</Card.Title>
              <Card.Text>
                En todos los pedidos superiores a $50.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <i className="bi bi-arrow-repeat fs-1 mb-3"></i>
              <Card.Title>Devoluciones sencillas</Card.Title>
              <Card.Text>
                30 días para devoluciones sin preguntas.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <i className="bi bi-shield-check fs-1 mb-3"></i>
              <Card.Title>Pago seguro</Card.Title>
              <Card.Text>
                Todos los métodos de pago son 100% seguros.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;