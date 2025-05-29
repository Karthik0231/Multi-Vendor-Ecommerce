import React from 'react';
import CustomCard from './CustomCard';
import { Button } from '@mui/material';
import { ShoppingCart, Visibility } from '@mui/icons-material';

const ProductCard = ({
  product,
  onAddToCart,
  onViewDetails,
  loading = false,
  isFavorite = false,
  onFavoriteClick,
  onShare
}) => {
  return (
    <CustomCard
      title={product?.name}
      description={product?.description}
      image={product?.images?.[0] ? `${process.env.REACT_APP_API_URL}/uploads/products/${product.images[0]}` : ''}
      price={product?.price}
      discount={product?.discount}
      rating={product?.rating}
      reviews={product?.reviews?.length}
      tags={[product?.category?.name, product?.status]}
      loading={loading}
      favorite={isFavorite}
      onFavoriteClick={onFavoriteClick}
      onShare={onShare}
      actions={
        <>
          <Button 
            fullWidth 
            variant="contained" 
            startIcon={<ShoppingCart />}
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<Visibility />}
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </>
      }
    />
  );
};

export default ProductCard;