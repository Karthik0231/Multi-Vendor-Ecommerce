import React, { useState, useContext } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Container,
    Link,
    Grid,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { VendorContext } from '../Context/Context';
import { Link as RouterLink } from 'react-router-dom';
import { Email, Lock, Store, Person, Phone, LocationOn, Visibility, VisibilityOff,PhotoCamera
 } from '@mui/icons-material';

const Register = () => {
    const { RegisterVendor, loading } = useContext(VendorContext);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        shopName: '',
        address: '',
        profileImage: null
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profileImage: e.target.files[0]
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formDataObj = new FormData();
            Object.keys(formData).forEach(key => {
                formDataObj.append(key, formData[key]);
            });
            await RegisterVendor(formDataObj);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{
                marginY: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 3
                        }}
                    >
                        Vendor Registration
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Shop Name"
                                    name="shopName"
                                    required
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    error={!!errors.shopName}
                                    helperText={errors.shopName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Store />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    multiline
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="profile-image"
                                    type="file"
                                    onChange={handleFileChange}
                                />
<label htmlFor="profile-image">
    <Button
        variant="contained"
        component="span"
        fullWidth
        startIcon={<PhotoCamera />}
        sx={{
            backgroundColor: '#fff',
            color: '#000',
            '&:hover': {
                backgroundColor: '#f0f0f0',
            }
        }}
    >
        Upload Profile Image
    </Button>
</label>

                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #FF5252 30%, #43A047 90%)',
                                        }
                                    }}
                                >
                                    {loading ? 'Registering...' : 'Register as Vendor'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" sx={{ color: '#FF6B6B' }}>
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;