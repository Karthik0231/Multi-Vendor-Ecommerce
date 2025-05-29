import React, { useContext, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Grid,
    Chip,
    Card,
    CardContent,
    Divider,
    Stack,
    Avatar
} from '@mui/material';
import {
    ShoppingBag,
    LocalShipping,
    Cancel,
    CheckCircle,
    Schedule,
    ArrowBack,
    Receipt,
    CalendarToday
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {config} from '../Config/Config';
import Swal from 'sweetalert2';

const Orders = () => {
    const {host}=config;    
    const { orders, getOrders, cancelOrder, submitFeedback } = useContext(userContext);
    const navigate = useNavigate();

    useEffect(() => {
        getOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b',
            processing: '#3b82f6',
            shipped: '#10b981',
            delivered: '#059669',
            cancelled: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Schedule sx={{ fontSize: 16 }} />,
            processing: <LocalShipping sx={{ fontSize: 16 }} />,
            shipped: <LocalShipping sx={{ fontSize: 16 }} />,
            delivered: <CheckCircle sx={{ fontSize: 16 }} />,
            cancelled: <Cancel sx={{ fontSize: 16 }} />
        };
        return icons[status] || <Schedule sx={{ fontSize: 16 }} />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };
    const handleSubmitFeedback = async (orderId, rating, feedback) => {
        try {
            await submitFeedback(orderId, rating, feedback);
            await getOrders(); // Refresh orders to update feedback status
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to submit feedback. Please try again.'
            });
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#fafafa'
        }}>
            <Header />
            <Container maxWidth="xl" sx={{ py: 4, mt: 8, flex: 1 }}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/')}
                        sx={{ 
                            mb: 3,
                            color: '#64748b',
                            '&:hover': {
                                bgcolor: '#f1f5f9'
                            }
                        }}
                    >
                        Back to Home
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Receipt sx={{ fontSize: 32, color: '#475569' }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Order History
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Track and manage your orders
                    </Typography>
                </Box>

                {orders.length === 0 ? (
                    <Card sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Avatar sx={{ 
                                bgcolor: '#f1f5f9', 
                                width: 80, 
                                height: 80, 
                                mx: 'auto', 
                                mb: 3 
                            }}>
                                <ShoppingBag sx={{ fontSize: 40, color: '#64748b' }} />
                            </Avatar>
                            <Typography variant="h6" sx={{ mb: 1, color: '#334155' }}>
                                No orders found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                You haven't placed any orders yet. Start exploring our products.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/products')}
                                sx={{ 
                                    bgcolor: '#1e293b',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        bgcolor: '#334155'
                                    }
                                }}
                            >
                                Start Shopping
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {orders.map((order) => (
                            <Grid item xs={12} key={order._id}>
                                <Paper sx={{ 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 3,
                                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }
                                }}>
                                    {/* Order Header */}
                                    <Box sx={{ 
                                        bgcolor: '#f8fafc',
                                        p: 3,
                                        borderBottom: '1px solid #e2e8f0'
                                    }}>
                                        <Stack 
                                            direction={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            spacing={2}
                                        >
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                                                    Order #{order._id?.slice(-8).toUpperCase()}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Placed on {formatDate(order.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                icon={getStatusIcon(order.orderStatus || 'pending')}
                                                label={(order.orderStatus || 'pending').toUpperCase()}
                                                sx={{
                                                    bgcolor: getStatusColor(order.orderStatus || 'pending'),
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    px: 2,
                                                    borderRadius: 2
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                    
                                    {/* Order Items */}
                                    <Box sx={{ p: 3 }}>
                                        <Stack spacing={3}>
                                            {order.items.map((item, index) => (
                                                <Box key={item._id}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 3
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={`${host}/uploads/products/${item.product.images[0]}`}
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                objectFit: 'cover',
                                                                borderRadius: 2,
                                                                border: '1px solid #e2e8f0'
                                                            }}
                                                        />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="subtitle1" sx={{ 
                                                                fontWeight: 600, 
                                                                color: '#1e293b',
                                                                mb: 0.5
                                                            }}>
                                                                {item.product.name}
                                                            </Typography>
                                                            <Stack direction="row" spacing={3}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Qty: {item.quantity}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ 
                                                                    fontWeight: 600,
                                                                    color: '#1e293b'
                                                                }}>
                                                                    {formatPrice(item.price)}
                                                                </Typography>
                                                            </Stack>
                                                        </Box>
                                                    </Box>
                                                    {index < order.items.length - 1 && (
                                                        <Divider sx={{ mt: 3 }} />
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                    
                                    {/* Order Footer */}
                                    <Box sx={{ 
                                        bgcolor: '#f8fafc',
                                        p: 3,
                                        borderTop: '1px solid #e2e8f0'
                                    }}>
                                        <Stack 
                                            direction={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            spacing={2}
                                        >
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 700,
                                                color: '#1e293b'
                                            }}>
                                                Total: {formatPrice(order.totalAmount)}
                                            </Typography>
                                            {(order.orderStatus || 'pending') === 'pending' && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Cancel />}
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Are you sure?',
                                                            text: "You won't be able to revert this!",
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#ef4444',
                                                            cancelButtonColor: '#d1d5db',
                                                            confirmButtonText: 'Yes, cancel it!',
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                cancelOrder(order._id);
                                                                Swal.fire('Cancelled!', 'The order has been cancelled.', 'success');
                                                            }
                                                        });
                                                    }}
                                                    sx={{
                                                        borderColor: '#ef4444',
                                                        color: '#ef4444',
                                                        px: 3,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Cancel Order
                                                </Button>
                                            )}
                                            {(order.orderStatus === 'delivered' && !order.feedback) && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Rate your order',
                                                            html: `
                                                                <div style="margin-bottom: 1rem;">
                                                                    <div id="rating"></div>
                                                                </div>
                                                                <textarea id="feedback" class="swal2-textarea" placeholder="Share your experience..."></textarea>
                                                            `,
                                                            didOpen: () => {
                                                                const container = Swal.getHtmlContainer().querySelector('#rating');
                                                                const stars = Array.from({ length: 5 }, (_, i) => {
                                                                    const star = document.createElement('span');
                                                                    star.innerHTML = '★';
                                                                    star.style.cursor = 'pointer';
                                                                    star.style.fontSize = '2rem';
                                                                    star.style.color = '#ddd';
                                                                    star.style.margin = '0 5px';
                                                                    star.addEventListener('click', () => {
                                                                        stars.forEach((s, index) => {
                                                                            s.style.color = index <= i ? '#fbbf24' : '#ddd';
                                                                        });
                                                                        container.dataset.rating = i + 1;
                                                                    });
                                                                    container.appendChild(star);
                                                                    return star;
                                                                });
                                                            },
                                                            preConfirm: () => {
                                                                const rating = Swal.getHtmlContainer().querySelector('#rating').dataset.rating;
                                                                const feedback = Swal.getHtmlContainer().querySelector('#feedback').value;
                                                                if (!rating) {
                                                                    Swal.showValidationMessage('Please select a rating');
                                                                    return false;
                                                                }
                                                                return { rating: parseInt(rating), feedback };
                                                            },
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Submit Feedback',
                                                            cancelButtonText: 'Cancel',
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                handleSubmitFeedback(order._id, result.value.rating, result.value.feedback);
                                                            }
                                                        });
                                                    }}
                                                    sx={{
                                                        bgcolor: '#1e293b',
                                                        px: 3,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            bgcolor: '#334155'
                                                        }
                                                    }}
                                                >
                                                    Give Feedback
                                                </Button>
                                            )}
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default Orders;