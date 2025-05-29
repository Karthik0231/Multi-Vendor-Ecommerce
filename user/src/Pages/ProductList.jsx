import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, Slider, FormControl, InputLabel, Select, MenuItem, TextField, Chip, IconButton, Card, CardMedia, CardContent, Fade, Zoom, Button, Badge, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Star,Favorite as Heart,Visibility as Eye, GridView, ViewList, Sort, LocalOffer, Verified, TrendingUp } from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Section from '../components/Section';
import Banner from '../components/Banner';
import bgimage from '../assets/banner.png';
import { config } from '../Config/Config';

const ProductList = () => {
    const {host} = config;
    const { products = [], getAllProducts, loading } = useContext(userContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('name');
    const [favorites, setFavorites] = useState(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    
    useEffect(() => {
        getAllProducts();
        fetch(`${host}/customer/categories`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.categories);
                }
            })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    const sortProducts = (products) => {
        switch (sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'name':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return products;
        }
    };

    const filteredProducts = sortProducts(
        products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (product.specifications?.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            const matchesCategory = selectedCategory === 'all' || (product.category && product.category._id === selectedCategory);
            
            return matchesSearch && matchesPrice && matchesCategory;
        })
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Replace the random discount function with a fixed calculation based on product
    const getDiscountPercentage = (product) => {
    // Calculate discount based on product price range
    if (product.price >= 50000) return 30;
    if (product.price >= 25000) return 25;
    if (product.price >= 10000) return 20;
    if (product.price >= 5000) return 15;
    return 10;
    };

    if (loading) return <Loading />;

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            pt: '84px'
        }}>
            <Header />
            
            {/* Enhanced Hero Banner */}
            <Box sx={{
                background: 'linear-gradient(135deg, rgba(107, 116, 154, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                py: 8,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '50%',
                    height: '100%',
                    background: 'url(' + bgimage + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3
                }} />
                
                <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, position: 'relative', zIndex: 1 }}>
                    <Fade in timeout={1000}>
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h2" sx={{ 
                                color: 'white', 
                                fontWeight: 800, 
                                mb: 2,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                Discover Amazing Products
                            </Typography>
                            <Typography variant="h5" sx={{ 
                                color: 'rgba(255,255,255,0.9)', 
                                fontWeight: 300,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}>
                                Browse through our premium collection
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Enhanced Search & Filter Section */}
                    <Paper 
                        elevation={20} 
                        sx={{ 
                            p: 4,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Search sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search for products, brands, or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        fontSize: '1.1rem',
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        }
                                    }
                                }}
                            />
                            <IconButton 
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{ 
                                    ml: 2, 
                                    bgcolor: showFilters ? 'primary.main' : 'transparent',
                                    color: showFilters ? 'white' : 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                    }
                                }}
                            >
                                <Filter />
                            </IconButton>
                        </Box>
                        
                        <Fade in={showFilters}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            label="Category"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="all">All Categories</MenuItem>
                                            {categories.map(category => (
                                                <MenuItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Sort By</InputLabel>
                                        <Select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            label="Sort By"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="name">Name A-Z</MenuItem>
                                            <MenuItem value="price-low">Price: Low to High</MenuItem>
                                            <MenuItem value="price-high">Price: High to Low</MenuItem>
                                            <MenuItem value="newest">Newest First</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography gutterBottom sx={{ fontWeight: 600 }}>Price Range</Typography>
                                    <Slider
                                        value={priceRange}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={100000}
                                        sx={{
                                            '& .MuiSlider-thumb': {
                                                width: 20,
                                                height: 20,
                                            },
                                            '& .MuiSlider-track': {
                                                height: 6,
                                            },
                                            '& .MuiSlider-rail': {
                                                height: 6,
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Chip label={formatPrice(priceRange[0])} size="small" color="primary" />
                                        <Chip label={formatPrice(priceRange[1])} size="small" color="primary" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Fade>
                    </Paper>
                </Box>
            </Box>

            <Section sx={{ py: 6, bgcolor: '#f8fafc' }}>
                <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
                    {/* Results Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                Our Products
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
                                {filteredProducts.length} products found
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                onClick={() => setViewMode('grid')}
                                color={viewMode === 'grid' ? 'primary' : 'default'}
                                sx={{ 
                                    bgcolor: viewMode === 'grid' ? 'primary.light' : 'transparent',
                                    '&:hover': { bgcolor: 'primary.light' }
                                }}
                            >
                                <GridView />
                            </IconButton>
                            {/* <IconButton 
                                onClick={() => setViewMode('list')}
                                color={viewMode === 'list' ? 'primary' : 'default'}
                                sx={{ 
                                    bgcolor: viewMode === 'list' ? 'primary.light' : 'transparent',
                                    '&:hover': { bgcolor: 'primary.light' }
                                }}
                            >
                                <ViewList />
                            </IconButton> */}
                        </Box>
                    </Box>
                    
                    {filteredProducts.length > 0 ? (
                        <Grid container spacing={2}>
                            {filteredProducts.map((product, index) => {
                                const discount = getDiscountPercentage(product);
                                const originalPrice = Math.round(product.price / (1 - discount / 100));
                                
                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product._id}>
                                        <Zoom in timeout={200 + index * 100}>
                                            <Card
                                                onMouseEnter={() => setHoveredProduct(product._id)}
                                                onMouseLeave={() => setHoveredProduct(null)}
                                                sx={{
                                                    height: '100%',
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                                    transform: hoveredProduct === product._id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                                                    boxShadow: hoveredProduct === product._id 
                                                        ? '0 15px 30px rgba(0,0,0,0.12)' 
                                                        : '0 3px 8px rgba(0,0,0,0.06)',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                        opacity: hoveredProduct === product._id ? 1 : 0,
                                                        transition: 'opacity 0.3s ease',
                                                        zIndex: 1,
                                                        pointerEvents: 'none'
                                                    }
                                                }}
                                            >
                                                {/* Product Image */}
                                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={`${host}/uploads/products/${product.images[0]}`}
                                                        alt={product.name}
                                                        sx={{
                                                            transition: 'transform 0.5s ease',
                                                            transform: hoveredProduct === product._id ? 'scale(1.08)' : 'scale(1)',
                                                        }}
                                                    />
                                                    
                                                    {/* Badges */}
                                                    <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
                                                        <Chip 
                                                            label={`${discount}% OFF`}
                                                            size="small"
                                                            sx={{ 
                                                                bgcolor: '#ff4757', 
                                                                color: 'white', 
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                mb: 0.5
                                                            }}
                                                        />
                                                        {product.stock < 10 && (
                                                            <Chip 
                                                                label="Limited"
                                                                size="small"
                                                                sx={{ 
                                                                    bgcolor: '#ffa502', 
                                                                    color: 'white', 
                                                                    fontWeight: 600,
                                                                    fontSize: '0.65rem',
                                                                    height: 18,
                                                                    display: 'block'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>

                                                    {/* Action Buttons */}
                                                    <Box sx={{ 
                                                        position: 'absolute', 
                                                        top: 8, 
                                                        right: 8, 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        gap: 0.5,
                                                        opacity: hoveredProduct === product._id ? 1 : 0,
                                                        transform: hoveredProduct === product._id ? 'translateX(0)' : 'translateX(15px)',
                                                        transition: 'all 0.3s ease',
                                                        zIndex: 2
                                                    }}>
                                                        {/* Action buttons can be added here if needed */}
                                                    </Box>
                                                </Box>

                                                <CardContent sx={{ p: 2, position: 'relative', zIndex: 2 }}>
                                                    {/* Brand & Rating */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                        <Chip 
                                                            label={product.specifications?.brand || 'Brand'}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                fontSize: '0.65rem',
                                                                height: 20
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Product Name */}
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        sx={{ 
                                                            fontWeight: 700, 
                                                            mb: 1,
                                                            color: '#1a202c',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.3
                                                        }}
                                                    >
                                                        {product.name}
                                                    </Typography>

                                                    {/* Description */}
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: '#64748b', 
                                                            mb: 1.5,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            lineHeight: 1.3,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {product.description}
                                                    </Typography>

                                                    {/* Price Section */}
                                                    <Box sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                                                                {formatPrice(product.price)}
                                                            </Typography>
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    textDecoration: 'line-through', 
                                                                    color: '#94a3b8',
                                                                    fontSize: '0.7rem'
                                                                }}
                                                            >
                                                                {formatPrice(originalPrice)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, fontSize: '0.65rem' }}>
                                                            Save {formatPrice(originalPrice - product.price)}
                                                        </Typography>
                                                    </Box>

                                                    {/* Stock Status */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                        <Box sx={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            bgcolor: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444',
                                                            mr: 0.5
                                                        }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                                                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Limited' : 'Out of Stock'}
                                                        </Typography>
                                                    </Box>

                                                    {/* Action Button */}
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                        size="small"
                                                        sx={{
                                                            py: 1,
                                                            borderRadius: 2,
                                                            fontWeight: 700,
                                                            fontSize: '0.75rem',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                                transform: 'translateY(-1px)',
                                                                boxShadow: '0 6px 15px rgba(102, 126, 234, 0.3)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        startIcon={<ShoppingBag sx={{ fontSize: '16px !important' }} />}
                                                    >
                                                        View Details
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Zoom>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Paper 
                            sx={{ 
                                p: 8, 
                                textAlign: 'center',
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                                border: '2px dashed #e2e8f0'
                            }}
                        >
                            <ShoppingBag sx={{ fontSize: 80, color: '#cbd5e1', mb: 3 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                                No products found
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                                We couldn't find any products matching your criteria.
                            </Typography>
                            <Button 
                                variant="outlined" 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setPriceRange([0, 100000]);
                                }}
                                sx={{ borderRadius: 3, px: 4 }}
                            >
                                Clear Filters
                            </Button>
                        </Paper>
                    )}
                </Box>
            </Section>

            <Footer />
        </Box>
    );
};

export default ProductList;