import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// Temporary product data (should come from an API)
const sampleProducts = [
  {
    id: 1,
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 19.99,
    imageUrl: '/images/azul.png'
  },
  {
    id: 2,
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 29.99,
    imageUrl: '/images/rojo.png'
  },
  {
    id: 3,
    name: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 39.99,
    imageUrl: '/images/verde.png'
  },
  {
    id: 4,
    name: 'Producto 4',
    description: 'Descripción del producto 4',
    price: 49.99,
    imageUrl: '/images/negro.png'
  }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await productService.getProducts();
        // setProducts(response.data);
        
        // Using sample data for now
        setProducts(sampleProducts);
        setLoading(false);
      } catch (error) {
        setError('Error loading products. Please try again later.');
        setLoading(false);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    console.log('Adding to cart:', product);
    
    if (!isAuthenticated) {
      toast.warning('Please log in to add items to your cart');
      return;
    }
    
    try {
      // Usar la función addToCart del CartContext
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(`Failed to add ${product.name} to cart: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h2 className="my-4">Our Products</h2>
      <Row>
        {products.map(product => (
          <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="font-weight-bold">${product.price.toFixed(2)}</span>
                    <Button 
                      variant="primary" 
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;