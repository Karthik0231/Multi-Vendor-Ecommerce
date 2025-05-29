import React, { useContext, useEffect, useState } from 'react';
import { VendorContext } from '../Context/Context';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    CircularProgress
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import {config} from '../Config/Config';

const Profile = () => {
    const { vendor, getVendorProfile, updateVendorProfile, loading } = useContext(VendorContext);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        shopName: '',
        address: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const {host}=config;

    useEffect(() => {
        getVendorProfile();
    }, []);

    useEffect(() => {
        if (vendor) {
            setFormData({
                name: vendor.name || '',
                phone: vendor.phone || '',
                shopName: vendor.shopName || '',
                address: vendor.address || ''
            });
            setPreviewUrl(vendor.profileImage ? `/uploads/vendor/${vendor.profileImage}` : '');
        }
    }, [vendor]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });
        if (profileImage) {
            submitData.append('profileImage', profileImage);
        }
        await updateVendorProfile(submitData);
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                    color: 'white'
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Profile Settings
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Manage your account information
                </Typography>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={`http://localhost:9000/uploads/vendor/${vendor?.profileImage || ''}`}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="profile-image"
                                    hidden
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="profile-image">
                                    <Button
                                        component="span"
                                        variant="contained"
                                        startIcon={<PhotoCamera />}
                                        sx={{ position: 'absolute', bottom: 0, right: -20 }}
                                    >
                                        Change
                                    </Button>
                                </label>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Shop Name"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ minWidth: 120 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default Profile;