const authMiddleware = {
    isAdmin: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        
        next();
    },

    isUser: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        
        if (req.user.role !== 'user') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        
        next();
    },

    addToCartAuthorization: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        
        const requestedCartId = req.params.cid || req.body.cartId;
        
        if (req.user.cart.toString() !== requestedCartId) {
            return res.status(403).json({ error: 'No autorizado para modificar este carrito' });
        }
        
        next();
    }
};

export default authMiddleware;