import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Rating,
  Divider,
  ImageList,
  ImageListItem,
  Breadcrumbs,
  Link,
  Fade,
  Zoom,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Skeleton,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  Stack
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Assignment,
  NavigateNext,
  CheckCircle,
  Error,
  Warning,
  Add,
  Remove,
  CompareArrows,
  VerifiedUser,
  LocalOffer,
  Star,
  StarBorder,
  Inventory,
  CalendarToday,
  Business,
  Category,
  Info,
  HeadsetMic
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { config } from '../Config/Config';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { host } = config;
  const { addToCart } = useContext(userContext); // Add this line to get addToCart from context
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${host}/customer/products/${id}`);
        const data = await response.json();
        
        if (data.success && data.product) {
          setProduct(data.product);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, host]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'error', text: 'Out of Stock', icon: <Error /> };
    if (stock <= 5) return { color: 'warning', text: `Only ${stock} left`, icon: <Warning /> };
    return { color: 'success', text: 'In Stock', icon: <CheckCircle /> };
  };

  const getStatusChip = (status) => {
    const statusColors = {
      active: 'success',
      inactive: 'error',
      pending: 'warning'
    };
    return (
      <Chip 
        label={status.toUpperCase()} 
        color={statusColors[status] || 'default'}
        size="small"
        variant="filled"
      />
    );
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isInactive) return;
    try {
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Add wishlist logic here
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4, mt: 8, flex: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={100} />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4, mt: 8, flex: 1 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            <AlertTitle>Error</AlertTitle>
            {error || 'Product not found'}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = product.stock === 0;
  const isInactive = product.status !== 'active';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4, mt: 8, flex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 4 }}
        >
          <Link href="/" color="inherit" underline="hover">Home</Link>
          <Link href="/products" color="inherit" underline="hover">Products</Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Inactive Product Warning */}
        {isInactive && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Product Unavailable</AlertTitle>
            This product is currently not available for purchase.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Product Images - Left Column */}
          <Grid item xs={12} lg={5}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: 3,
                bgcolor: 'white',
                overflow: 'hidden',
                position: 'relative',
                height: 'fit-content',
                position: 'sticky',
                top: 100
              }}
            >
              {/* Product Status Badge */}
              <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                {getStatusChip(product.status)}
              </Box>

              <Zoom in={true} timeout={500}>
                <Box
                  component="img"
                  src={`${host}/uploads/products/${product.images[selectedImage]}`}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 500,
                    width:500,
                    objectFit: 'contain',
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: '#f9f9f9',
                    transition: 'all 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'; // Add fallback image
                  }}
                />
              </Zoom>
              
              <ImageList 
                sx={{ 
                  width: '100%',
                  height: 120,
                  mb: 0
                }}
                cols={Math.min(product.images.length, 4)}
                rowHeight={120}
                gap={8}
              >
                {product.images.map((image, index) => (
                  <Fade in={true} timeout={300 * (index + 1)} key={index}>
                    <ImageListItem 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 2,
                        width: 120,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={`${host}/uploads/products/${image}`}
                        alt={`${product.name} ${index + 1}`}
                        style={{ 
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </ImageListItem>
                  </Fade>
                ))}
              </ImageList>
            </Paper>
          </Grid>

          {/* Product Details - Right Column */}
          <Grid item xs={12} lg={7}>
            <Stack spacing={3}>
              {/* Main Product Info Paper */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 3,
                  bgcolor: 'white'
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  {product.name}
                </Typography>

                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating value={4.5} readOnly precision={0.5} size="large" />
                  <Typography variant="body1" color="text.secondary">
                    (4.5/5 • 150 Reviews)
                  </Typography>
                </Box> */}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    {formatPrice(product.price)}
                  </Typography>
                  <Chip 
                    icon={<LocalOffer />} 
                    label="Best Price" 
                    color="secondary" 
                    variant="filled"
                  />
                </Box>

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: '#555' }}>
                  {product.description}
                </Typography>

                {/* Stock Status */}
                <Alert 
                  severity={stockStatus.color} 
                  icon={stockStatus.icon}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stockStatus.text}
                    {product.stock > 0 && product.stock <= 10 && (
                      <Typography component="span" sx={{ ml: 1, fontSize: '0.9em' }}>
                        • Hurry up!
                      </Typography>
                    )}
                  </Typography>
                </Alert>

                {/* Quantity Selector */}
                {!isOutOfStock && !isInactive && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Quantity:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                      <IconButton 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                      <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        size="small"
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Max: {product.stock}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ mb: 0 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isInactive}
                    sx={{ 
                      flex: 1, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  {/* <Tooltip title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}> */}
                    {/* <IconButton 
                      color={isWishlisted ? 'error' : 'primary'}
                      onClick={handleWishlistToggle}
                      sx={{ 
                        border: '2px solid', 
                        borderColor: isWishlisted ? 'error.main' : 'primary.main',
                        '&:hover': {
                          bgcolor: isWishlisted ? 'error.light' : 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      <Favorite />
                    </IconButton> */}
                  {/* </Tooltip> */}
                  {/* <Tooltip title="Share Product">
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        border: '2px solid', 
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip> */}
                </Stack>
              </Paper>

              {/* Product Information Cards */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Key Features
                </Typography>
                <Grid container spacing={2}>
  <Grid item xs={6} sm={3}>
    <Card elevation={0} sx={{ bgcolor: '#f8f9ff', border: '1px solid #e3f2fd', textAlign: 'center' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <LocalShipping color="primary" sx={{ fontSize: 30, mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Free Delivery
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={6} sm={3}>
    <Card elevation={0} sx={{ bgcolor: '#f0f9ff', border: '1px solid #e0f2fe', textAlign: 'center' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Security color="primary" sx={{ fontSize: 30, mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {product.specifications?.warranty || 'Warranty Available'}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={6} sm={3}>
    <Card elevation={0} sx={{ bgcolor: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <HeadsetMic color="primary" sx={{ fontSize: 30, mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Easy Support
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={6} sm={3}>
    <Card elevation={0} sx={{ bgcolor: '#fefce8', border: '1px solid #fef3c7', textAlign: 'center' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Inventory color="primary" sx={{ fontSize: 30, mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Secure Packaging
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>

              </Paper>

              {/* Product Information */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Product Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Business color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Brand</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {product.specifications?.brand || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Info color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Model</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {product.specifications?.model || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Inventory color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Stock Available</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {product.stock} units
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CalendarToday color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Date Added</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(product.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        {/* Detailed Specifications */}
        <Paper 
          elevation={0}
          sx={{ 
            mt: 4,
            p: 4,
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
          }}
        >
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assignment color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Detailed Specifications
            </Typography>
          </Box>
          
          <TableContainer 
            sx={{ 
              borderRadius: 2,
              border: '1px solid #e0e7ff',
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableBody>
                {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                  <TableRow 
                    key={key}
                    sx={{ 
                      bgcolor: index % 2 === 0 ? '#f8fafc' : 'white',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: '#f1f5f9',
                        transform: 'scale(1.001)'
                      }
                    }}
                  >
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        width: '30%',
                        color: '#475569',
                        py: 2.5,
                        pl: 3,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Info sx={{ fontSize: 20, color: 'primary.main', opacity: 0.8 }} />
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Box>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        py: 2.5,
                        color: '#334155',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '0.95rem'
                      }}
                    >
                      {value || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ 
                  bgcolor: '#f8fafc',
                  '&:hover': { 
                    bgcolor: '#f1f5f9',
                    transform: 'scale(1.001)'
                  }
                }}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      py: 2.5,
                      pl: 3,
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Badge sx={{ fontSize: 20, color: 'primary.main', opacity: 0.8 }} />
                    Vendor
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      py: 2.5,
                      color: '#334155',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    {product.vendor.name || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ 
                  bgcolor: 'white',
                  '&:hover': { 
                    bgcolor: '#f1f5f9',
                    transform: 'scale(1.001)'
                  }
                }}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      py: 2.5,
                      pl: 3
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CalendarToday sx={{ fontSize: 20, color: 'primary.main', opacity: 0.8 }} />
                      Last Updated
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      py: 2.5,
                      color: '#334155',
                      fontSize: '0.95rem'
                    }}
                  >
                    {formatDate(product.updatedAt)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductView;