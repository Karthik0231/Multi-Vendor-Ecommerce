import React, { useState, useContext } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Grid,
    Divider,
    Alert,
    Card,
    CardContent,
    Chip,
    Avatar,
    Fade,
    Slide
} from '@mui/material';
import { 
    LocalShipping, 
    Person, 
    Payment, 
    ShoppingCart,
    QrCode,
    AccountBalanceWallet,
    MonetizationOn,
    Lock
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import qrimage from '../assets/qr.png';

const Checkout = () => {
    const { cart, createOrder } = useContext(userContext);
    const [formData, setFormData] = useState({
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },
        contactInfo: {
            name: '',
            phone: '',
            email: ''
        },
        paymentMethod: 'COD',
        paymentDetails: {
            upiId: '',
            transactionId: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createOrder(formData);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: '#f8fafc'
        }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h4" 
                        sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            mb: 1
                        }}
                    >
                        Checkout
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Review your order and complete your purchase
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper 
                            elevation={0}
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#cbd5e1',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ 
                                        width: 40,
                                        height: 40,
                                        borderRadius: '8px',
                                        backgroundColor: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2
                                    }}>
                                        <LocalShipping sx={{ color: '#475569', fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Shipping Address
                                    </Typography>
                                </Box>
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Street Address"
                                            name="shippingAddress.street"
                                            value={formData.shippingAddress.street}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="shippingAddress.city"
                                            value={formData.shippingAddress.city}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State"
                                            name="shippingAddress.state"
                                            value={formData.shippingAddress.state}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Pincode"
                                            name="shippingAddress.pincode"
                                            value={formData.shippingAddress.pincode}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Paper 
                            elevation={0}
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#cbd5e1',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ 
                                        width: 40,
                                        height: 40,
                                        borderRadius: '8px',
                                        backgroundColor: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2
                                    }}>
                                        <Person sx={{ color: '#475569', fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Contact Information
                                    </Typography>
                                </Box>
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="contactInfo.name"
                                            value={formData.contactInfo.name}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="contactInfo.phone"
                                            value={formData.contactInfo.phone}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="contactInfo.email"
                                            type="email"
                                            value={formData.contactInfo.email}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: '#e2e8f0'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#94a3b8'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Paper 
                            elevation={0}
                            sx={{ 
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#cbd5e1',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ 
                                        width: 40,
                                        height: 40,
                                        borderRadius: '8px',
                                        backgroundColor: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2
                                    }}>
                                        <Payment sx={{ color: '#475569', fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Payment Method
                                    </Typography>
                                </Box>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Paper 
                                                variant="outlined"
                                                sx={{ 
                                                    p: 2.5,
                                                    cursor: 'pointer',
                                                    border: formData.paymentMethod === 'COD' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                    borderRadius: 2,
                                                    backgroundColor: formData.paymentMethod === 'COD' ? '#f8faff' : 'white',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: '#3b82f6',
                                                        backgroundColor: '#f8faff'
                                                    }
                                                }}
                                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'COD' }))}
                                            >
                                                <FormControlLabel 
                                                    value="COD" 
                                                    control={<Radio sx={{ color: '#3b82f6' }} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <MonetizationOn sx={{ color: '#475569', fontSize: 20 }} />
                                                            <Box>
                                                                <Typography fontWeight={500} sx={{ color: '#1e293b' }}>
                                                                    Cash on Delivery
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Pay when your order arrives
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    sx={{ margin: 0, width: '100%' }}
                                                />
                                            </Paper>
                                            
                                            <Paper 
                                                variant="outlined"
                                                sx={{ 
                                                    p: 2.5,
                                                    cursor: 'pointer',
                                                    border: formData.paymentMethod === 'UPI' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                    borderRadius: 2,
                                                    backgroundColor: formData.paymentMethod === 'UPI' ? '#f8faff' : 'white',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: '#3b82f6',
                                                        backgroundColor: '#f8faff'
                                                    }
                                                }}
                                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'UPI' }))}
                                            >
                                                <FormControlLabel 
                                                    value="UPI" 
                                                    control={<Radio sx={{ color: '#3b82f6' }} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <AccountBalanceWallet sx={{ color: '#475569', fontSize: 20 }} />
                                                            <Box>
                                                                <Typography fontWeight={500} sx={{ color: '#1e293b' }}>
                                                                    UPI Payment
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Pay instantly using UPI
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    sx={{ margin: 0, width: '100%' }}
                                                />
                                            </Paper>
                                        </Box>
                                    </RadioGroup>
                                </FormControl>

                                {formData.paymentMethod === 'UPI' && (
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            mt: 3, 
                                            p: 3, 
                                            borderRadius: 2,
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0'
                                        }}
                                    >
                                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                                            <Box sx={{ 
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                backgroundColor: '#3b82f6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2
                                            }}>
                                                <QrCode sx={{ color: 'white', fontSize: 24 }} />
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                                                Scan QR Code to Pay
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Use any UPI app to scan and pay
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                            <Paper 
                                                elevation={0}
                                                sx={{ 
                                                    p: 2,
                                                    borderRadius: 2,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            >
                                                <Box 
                                                    component="img"
                                                    src={qrimage}
                                                    alt="UPI QR Code"
                                                    sx={{ 
                                                        width: 160, 
                                                        height: 160,
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </Paper>
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="UPI ID"
                                                    name="paymentDetails.upiId"
                                                    value={formData.paymentDetails.upiId}
                                                    onChange={handleChange}
                                                    required={formData.paymentMethod === 'UPI'}
                                                    variant="outlined"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px',
                                                            backgroundColor: 'white',
                                                            '& fieldset': {
                                                                borderColor: '#e2e8f0'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#94a3b8'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Transaction ID"
                                                    name="paymentDetails.transactionId"
                                                    value={formData.paymentDetails.transactionId}
                                                    onChange={handleChange}
                                                    required={formData.paymentMethod === 'UPI'}
                                                    helperText="Enter the UPI transaction ID after payment"
                                                    variant="outlined"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px',
                                                            backgroundColor: 'white',
                                                            '& fieldset': {
                                                                borderColor: '#e2e8f0'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#94a3b8'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={0}
                            sx={{ 
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                position: 'sticky',
                                top: 20
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ 
                                        width: 40,
                                        height: 40,
                                        borderRadius: '8px',
                                        backgroundColor: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2
                                    }}>
                                        <ShoppingCart sx={{ color: '#475569', fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Order Summary
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 3 }}>
                                    {cart.map((item) => (
                                        <Box key={item.product._id} sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            py: 2,
                                            borderBottom: '1px solid #f1f5f9',
                                            '&:last-child': {
                                                borderBottom: 'none'
                                            }
                                        }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography fontWeight={500} sx={{ color: '#1e293b', mb: 0.5 }}>
                                                    {item.product.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Quantity: {item.quantity}
                                                </Typography>
                                            </Box>
                                            <Typography fontWeight={600} sx={{ color: '#1e293b' }}>
                                                ₹{item.product.price * item.quantity}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mb: 3,
                                    py: 2,
                                    backgroundColor: '#f8fafc',
                                    borderRadius: 1.5,
                                    px: 2
                                }}>
                                    <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                                        Total
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700} sx={{ color: '#1e293b' }}>
                                        ₹{calculateTotal()}
                                    </Typography>
                                </Box>
                                
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    startIcon={<Lock />}
                                    sx={{ 
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        backgroundColor: '#1e293b',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#0f172a',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}
                                >
                                    Place Order
                                </Button>
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mt: 2,
                                    gap: 1
                                }}>
                                    <Lock sx={{ fontSize: 14, color: '#64748b' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Your payment information is secure
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default Checkout;