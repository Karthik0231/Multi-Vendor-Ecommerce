import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, TextField, Modal,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, FormControl, InputLabel, Select, MenuItem,
    Grid, CircularProgress, Chip, Avatar, AvatarGroup, Collapse,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    Visibility as ViewIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { VendorContext } from '../Context/Context';
import Swal from 'sweetalert2';
import {config} from '../Config/Config';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflow: 'auto'
};

const Products = () => {
    const { 
        products, 
        getProducts, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        getCategories,
        loading 
    } = useContext(VendorContext);
    const {host} = config;
    
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    const [viewImagesModal, setViewImagesModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        status: 'active',
        specifications: {
            brand: '',
            model: '',
            color: '',
            size: '',
            weight: '',
            material: '',
            warranty: '',
            features: '',
            dimensions: '',
            manufacturer: ''
        },
        images: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await getProducts();
            const response = await getCategories();
            if (response && response.success) {
                setCategories(response.categories || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load data', 'error');
        }
    };

    const resetFormData = () => ({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        status: 'active',
        specifications: {
            brand: '',
            model: '',
            color: '',
            size: '',
            weight: '',
            material: '',
            warranty: '',
            features: '',
            dimensions: '',
            manufacturer: ''
        },
        images: []
    });

    const handleOpenModal = (mode, product = null) => {
        setModalMode(mode);
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category?._id || '',
                stock: product.stock || '',
                status: product.status || 'active',
                specifications: {
                    brand: product.specifications?.brand || '',
                    model: product.specifications?.model || '',
                    color: product.specifications?.color || '',
                    size: product.specifications?.size || '',
                    weight: product.specifications?.weight || '',
                    material: product.specifications?.material || '',
                    warranty: product.specifications?.warranty || '',
                    features: product.specifications?.features || '',
                    dimensions: product.specifications?.dimensions || '',
                    manufacturer: product.specifications?.manufacturer || ''
                },
                images: []
            });
        } else {
            setSelectedProduct(null);
            setFormData(resetFormData());
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
        setFormData(resetFormData());
        setSubmitting(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSpecificationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [field]: value
            }
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({ ...prev, images: files }));
    };

    const validateForm = () => {
        const errors = [];
        
        if (!formData.name.trim()) errors.push('Product name is required');
        if (!formData.description.trim()) errors.push('Description is required');
        if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required');
        if (!formData.category) errors.push('Category is required');
        if (!formData.stock || parseInt(formData.stock) < 0) errors.push('Valid stock quantity is required');
        if (modalMode === 'add' && formData.images.length === 0) errors.push('At least one image is required');
        
        if (errors.length > 0) {
            Swal.fire({
                title: 'Validation Error',
                html: errors.join('<br>'),
                icon: 'error'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                category: formData.category,
                stock: formData.stock,
                status: formData.status,
                specifications: formData.specifications,
                images: formData.images
            };

            if (modalMode === 'add') {
                await addProduct(updateData);
                Swal.fire('Success', 'Product added successfully', 'success');
            } else {
                await updateProduct(selectedProduct._id, updateData);
                Swal.fire('Success', 'Product updated successfully', 'success');
            }
            
            handleCloseModal();
            await fetchData();
        } catch (error) {
            console.error('Operation failed:', error);
            Swal.fire(
                'Error',
                error.response?.data?.message || `Failed to ${modalMode} product`,
                'error'
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const deleteResult = await deleteProduct(id);
                if (deleteResult && deleteResult.success) {
                    await fetchData();
                    Swal.fire('Deleted!', 'Product has been deleted.', 'success');
                } else {
                    throw new Error(deleteResult?.message || 'Delete failed');
                }
            }
        } catch (error) {
            console.error('Delete error:', error);
            Swal.fire('Error', 'Failed to delete product', 'error');
        }
    };

    const toggleRowExpansion = (productId) => {
        setExpandedRows(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const handleViewImages = (images) => {
        setSelectedImages(images || []);
        setViewImagesModal(true);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(price || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderSpecifications = (specs) => {
        if (!specs) return 'N/A';
        
        const specEntries = Object.entries(specs).filter(([key, value]) => 
            value && key !== '_id' && key !== '__v'
        );
        
        if (specEntries.length === 0) return 'N/A';
        
        return (
            <Box sx={{ maxWidth: 300 }}>
                {specEntries.slice(0, 3).map(([key, value]) => (
                    <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        size="small"
                        variant="outlined"
                        sx={{ m: 0.25, fontSize: '0.7rem' }}
                    />
                ))}
                {specEntries.length > 3 && (
                    <Typography variant="caption" color="textSecondary">
                        ...and {specEntries.length - 3} more
                    </Typography>
                )}
            </Box>
        );
    };

    const renderExpandedDetails = (product) => (
        <Box sx={{ p: 2, bgcolor: 'grey', borderRadius: 1,color:'white',fontWeight:'bold' }}>
            <Grid container spacing={3}>
                {/* Product Info */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Product Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <strong>Description:</strong> {product.description}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <strong>Created:</strong> {formatDate(product.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Updated:</strong> {formatDate(product.updatedAt)}
                    </Typography>
                </Grid>

                {/* Images */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Images ({product.images?.length || 0})
                    </Typography>
                    {product.images && product.images.length > 0 ? (
                        <Box>
                            <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                                {product.images.map((image, index) => (
                                    <Avatar
                                        key={index}
                                        src={`${host}/uploads/products/${image}`}
                                        sx={{ width: 40, height: 40 }}
                                    >
                                        <ImageIcon />
                                    </Avatar>
                                ))}
                            </AvatarGroup>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewImages(product.images)}
                                sx={{ mt: 1 }}
                                startIcon={<ViewIcon />}
                            >
                                View All
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No images available
                        </Typography>
                    )}
                </Grid>

                {/* Specifications */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Specifications
                    </Typography>
                    {product.specifications ? (
                        <Box>
                            {Object.entries(product.specifications)
                                .filter(([key, value]) => value && key !== '_id' && key !== '__v')
                                .map(([key, value]) => (
                                    <Typography key={key} variant="body2" gutterBottom>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                    </Typography>
                                ))
                            }
                        </Box>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No specifications available
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Paper elevation={2} sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                color: 'white'
            }}>
                <Typography variant="h5" fontWeight="bold">
                    Products Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Manage your product inventory
                </Typography>
            </Paper>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenModal('add')}
                sx={{ mb: 3 }}
                disabled={loading}
            >
                Add New Product
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="30px"></TableCell>
                            <TableCell>Product Details</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Images</TableCell>
                            <TableCell>Specifications</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <CircularProgress size={24} />
                                    <Typography sx={{ ml: 1 }}>Loading...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : !products || products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <Typography color="textSecondary">
                                        No products found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <React.Fragment key={product._id}>
                                    <TableRow>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleRowExpansion(product._id)}
                                            >
                                                <ExpandMoreIcon 
                                                    sx={{
                                                        transform: expandedRows[product._id] 
                                                            ? 'rotate(180deg)' 
                                                            : 'rotate(0deg)',
                                                        transition: 'transform 0.3s'
                                                    }}
                                                />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {product.name}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="textSecondary">
                                                    {product.description?.slice(0, 50)}
                                                    {product.description?.length > 50 ? '...' : ''}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{product.category?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatPrice(product.price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                color={product.stock > 0 ? 'text.primary' : 'error.main'}
                                                fontWeight="medium"
                                            >
                                                {product.stock}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.status?.toUpperCase()}
                                                color={product.status === 'active' ? 'success' : 'error'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {product.images && product.images.length > 0 ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 30, height: 30 } }}>
                                                        {product.images.slice(0, 3).map((image, index) => (
                                                            <Avatar
                                                                key={index}
                                                                src={`${host}/uploads/products/${image}`}
                                                                sx={{ width: 30, height: 30 }}
                                                            >
                                                                <ImageIcon fontSize="small" />
                                                            </Avatar>
                                                        ))}
                                                    </AvatarGroup>
                                                    <Typography variant="caption">
                                                        ({product.images.length})
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="textSecondary">
                                                    No images
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {renderSpecifications(product.specifications)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenModal('edit', product)}
                                                size="small"
                                            >
                                                <EditIcon sx={{color:'orange'}}/>
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(product._id)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ p: 0 }}>
                                            <Collapse in={expandedRows[product._id]} timeout="auto" unmountOnExit>
                                                {renderExpandedDetails(product)}
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Image Viewer Modal */}
            <Modal
                open={viewImagesModal}
                onClose={() => setViewImagesModal(false)}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}>
                    <Typography variant="h6" mb={2}>
                        Product Images ({selectedImages.length})
                    </Typography>
                    <Grid container spacing={2}>
                        {selectedImages.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    component="img"
                                    src={`${host}/uploads/products/${image}`}
                                    alt={`Product image ${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'grey.300'
                                    }}
                                />
                                <Typography variant="caption" display="block" textAlign="center" mt={1}>
                                    {image}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setViewImagesModal(false)}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Add/Edit Product Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                disableEscapeKeyDown={submitting}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" mb={3}>
                        {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                    disabled={submitting}
                                    error={!formData.name.trim()}
                                    helperText={!formData.name.trim() ? 'Product name is required' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required error={!formData.category}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        disabled={submitting}
                                        label="Category"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {!formData.category && (
                                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                            Category is required
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Price"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    required
                                    disabled={submitting}
                                    inputProps={{ min: 0, step: 0.01 }}
                                    error={!formData.price || parseFloat(formData.price) <= 0}
                                    helperText={!formData.price || parseFloat(formData.price) <= 0 ? 'Valid price is required' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Stock"
                                    value={formData.stock}
                                    onChange={(e) => handleInputChange('stock', e.target.value)}
                                    required
                                    disabled={submitting}
                                    inputProps={{ min: 0 }}
                                    error={!formData.stock || parseInt(formData.stock) < 0}
                                    helperText={!formData.stock || parseInt(formData.stock) < 0 ? 'Valid stock quantity is required' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    required
                                    disabled={submitting}
                                    error={!formData.description.trim()}
                                    helperText={!formData.description.trim() ? 'Description is required' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                    disabled={submitting}
                                />
                                <label htmlFor="image-upload">
                                    <Button 
                                        variant="outlined" 
                                        component="span"
                                        disabled={submitting}
                                        sx={{color:'white',
                                            backgroundColor: 'blue',
                                        }}
                                    >
                                        Upload Images
                                    </Button>
                                </label>
                                {formData.images.length > 0 && (
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        {formData.images.length} file(s) selected
                                    </Typography>
                                )}
                            </Grid>
                            
                            {/* Specifications Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Specifications
                                </Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(formData.specifications).map(([key, value]) => (
                                        <Grid item xs={12} sm={6} key={key}>
                                            <TextField
                                                fullWidth
                                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                value={value}
                                                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                disabled={submitting}
                                                multiline={key === 'features'}
                                                rows={key === 'features' ? 3 : 1}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        disabled={submitting}
                                        label="Status"
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button 
                                onClick={handleCloseModal}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"
                                disabled={submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : null}
                            >
                                {submitting 
                                    ? 'Processing...' 
                                    : modalMode === 'add' ? 'Add Product' : 'Update Product'
                                }
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default Products;