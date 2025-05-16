import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
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
        {[1, 2, 3, 4].map((num) => (
          <Col key={num} md={3} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={`https://via.placeholder.com/300x200?text=Producto+${num}`} 
              />
              <Card.Body>
                <Card.Title>Producto {num}</Card.Title>
                <Card.Text>
                  Descripción corta del producto destacado número {num}.
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 mb-0">$99.99</span>
                  <Button variant="primary" size="sm">
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