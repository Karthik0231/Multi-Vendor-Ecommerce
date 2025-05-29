import React, { useContext, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    IconButton,
    Divider,
    Alert,
    Chip,
    Fade,
    Slide,
    Zoom,
    Card,
    CardContent,
    Badge,
} from '@mui/material';
import {
    Add,
    Remove,
    Delete,
    ShoppingCart,
    ArrowBack,
    LocalShipping,
    Security,
    Favorite,
    Share
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { config } from '../Config/Config';

const Cart = () => {
    const { cart, loading, updateCartItem, removeFromCart, getCart } = useContext(userContext);
    const navigate = useNavigate();
    const { host } = config;

    useEffect(() => {
        getCart();
    }, []);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    if (loading) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Header />
                <Container sx={{ py: 4, mt: 8, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Card sx={{ 
                        p: 4, 
                        borderRadius: 4, 
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: '4px solid #667eea',
                                borderTop: '4px solid transparent',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }} />
                            <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                                Loading your cart...
                            </Typography>
                        </Box>
                    </Card>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                zIndex: -1
            }
        }}>
            <Header />
            
            <Container maxWidth="xl" sx={{ py: 4, mt: 8, flex: 1 }}>
                <Fade in timeout={600}>
                    <Box>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/products')}
                            sx={{ 
                                mb: 3,
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                color: '#667eea',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(255,255,255,1)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            Continue Shopping
                        </Button>

                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 3, 
                            mb: 4,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4,
                            p: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}>
                            <Box sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShoppingCart sx={{ color: 'white', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 800, 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}>
                                    Shopping Cart
                                </Typography>
                                {cart && cart.length > 0 && (
                                    <Chip 
                                        label={`${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'}`}
                                        sx={{ 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                            borderRadius: 3
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Fade>

                {(!cart || cart.length === 0) ? (
                    <Slide in direction="up" timeout={800}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            py: 8,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}>
                            <Box sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3
                            }}>
                                <ShoppingCart sx={{ fontSize: 60, color: '#ff6b6b' }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>
                                Your cart is empty
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#718096', mb: 4, textAlign: 'center' }}>
                                Looks like you haven't added anything to your cart yet.<br />
                                Start shopping to fill it up!
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/products')}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                                    }
                                }}
                            >
                                Start Shopping
                            </Button>
                        </Box>
                    </Slide>
                ) : (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Fade in timeout={800}>
                                <Card sx={{ 
                                    borderRadius: 4, 
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    overflow: 'hidden'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        {cart.map((item, index) => (
                                            <Slide key={item.product._id} in direction="right" timeout={600 + (index * 100)}>
                                                <Box>
                                                    <Box sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                        mb: 3,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                                                        }
                                                    }}>
                                                        <Grid container spacing={3} alignItems="center">
                                                            <Grid item xs={3} sm={2}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <img
                                                                        src={`${host}/uploads/products/${item.product.images[0]}`}
                                                                        alt={item.product.name}
                                                                        style={{
                                                                            width: '500px',
                                                                            height: '300px',
                                                                            borderRadius: 12,
                                                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                                                                        }}
                                                                    />
                                                                    <Badge
                                                                        badgeContent={item.quantity}
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: -8,
                                                                            right: -8,
                                                                            '& .MuiBadge-badge': {
                                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                                color: 'white',
                                                                                fontWeight: 700
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={9} sm={10}>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'flex-start'
                                                                }}>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography variant="h6" sx={{ 
                                                                            fontWeight: 700, 
                                                                            mb: 1,
                                                                            color: '#2d3748'
                                                                        }}>
                                                                            {item.product.name}
                                                                        </Typography>
                                                                        {/* <Chip
                                                                            label={item.product.category?.name}
                                                                            size="small"
                                                                            sx={{
                                                                                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                                                                color: '#8b4513',
                                                                                fontWeight: 600,
                                                                                mb: 2
                                                                            }}
                                                                        /> */}
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        <IconButton
                                                                            color="error"
                                                                            onClick={() => removeFromCart(item.product._id)}
                                                                            sx={{
                                                                                background: 'rgba(255,255,255,0.8)',
                                                                                backdropFilter: 'blur(10px)',
                                                                                '&:hover': {
                                                                                    background: 'rgba(255,99,99,0.1)',
                                                                                    transform: 'scale(1.1)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Delete sx={{ fontSize: 18 }} />
                                                                        </IconButton>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        background: 'rgba(255,255,255,0.8)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        borderRadius: 3,
                                                                        border: '2px solid rgba(102, 126, 234, 0.1)',
                                                                        overflow: 'hidden'
                                                                    }}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                                                                            disabled={item.quantity <= 1}
                                                                            sx={{
                                                                                borderRadius: 0,
                                                                                '&:hover': {
                                                                                    background: 'rgba(102, 126, 234, 0.1)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Remove />
                                                                        </IconButton>
                                                                        <Typography sx={{ 
                                                                            px: 3, 
                                                                            py: 1,
                                                                            fontWeight: 700,
                                                                            color: '#667eea',
                                                                            minWidth: 40,
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            {item.quantity}
                                                                        </Typography>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                                                                            disabled={item.quantity >= item.product.stock}
                                                                            sx={{
                                                                                borderRadius: 0,
                                                                                '&:hover': {
                                                                                    background: 'rgba(102, 126, 234, 0.1)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Add />
                                                                        </IconButton>
                                                                    </Box>
                                                                    <Box sx={{ textAlign: 'right' }}>
                                                                        {/* <Typography variant="body2" sx={{ 
                                                                            color: '#718096',
                                                                            textDecoration: 'line-through'
                                                                        }}>
                                                                            {formatPrice(item.product.price * item.quantity * 1.2)}
                                                                        </Typography> */}
                                                                        <Typography variant="h6" sx={{ 
                                                                            fontWeight: 800,
                                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                            backgroundClip: 'text',
                                                                            WebkitBackgroundClip: 'text',
                                                                            WebkitTextFillColor: 'transparent'
                                                                        }}>
                                                                            {formatPrice(item.product.price * item.quantity)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                            </Slide>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Zoom in timeout={1000}>
                                <Card sx={{ 
                                    borderRadius: 4, 
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    position: 'sticky',
                                    top: 100
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: 3,
                                            p: 3,
                                            mb: 3,
                                            color: 'white',
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                                                Order Summary
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Review your items before checkout
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(102, 126, 234, 0.05)'
                                            }}>
                                                <Typography sx={{ fontWeight: 600 }}>Subtotal</Typography>
                                                <Typography sx={{ fontWeight: 600 }}>
                                                    {formatPrice(calculateTotal())}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(76, 175, 80, 0.05)'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocalShipping sx={{ fontSize: 18, color: '#4caf50' }} />
                                                    <Typography sx={{ fontWeight: 600 }}>Shipping</Typography>
                                                </Box>
                                                <Chip 
                                                    label="FREE" 
                                                    size="small"
                                                    sx={{ 
                                                        background: '#4caf50', 
                                                        color: 'white',
                                                        fontWeight: 700
                                                    }}
                                                />
                                            </Box>
                                            <Divider sx={{ my: 2 }} />
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                p: 3,
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                                            }}>
                                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                    Total
                                                </Typography>
                                                <Typography variant="h5" sx={{ 
                                                    fontWeight: 800,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {formatPrice(calculateTotal())}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            startIcon={<ShoppingCart />}
                                            onClick={() => navigate('/checkout')}
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: 3,
                                                py: 2,
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                                mb: 2,
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                                                }
                                            }}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                        
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            gap: 1,
                                            color: '#718096',
                                            fontSize: '0.875rem'
                                        }}>
                                            <Security sx={{ fontSize: 16 }} />
                                            <Typography variant="body2">
                                                Secure checkout guaranteed
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Zoom>
                        </Grid>
                    </Grid>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default Cart;