import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  Box,
  Rating,
  Chip,
  IconButton,
  Skeleton 
} from '@mui/material';
import { FavoriteBorder, Favorite, Share } from '@mui/icons-material';

const CustomCard = ({
  title,
  subtitle,
  description,
  image,
  price,
  discount,
  rating,
  reviews,
  tags,
  actions,
  loading = false,
  favorite = false,
  onFavoriteClick,
  onShare,
  elevation = 2,
  onClick,
  sx = {},
  children
}) => {
  if (loading) {
    return (
      <Card elevation={elevation} sx={{ ...sx }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={30} width="80%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="text" height={20} width="40%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={{
        position: 'relative',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        cursor: onClick ? 'pointer' : 'default',
        ...sx
      }}
    >
      {discount && (
        <Chip
          label={`${discount}% OFF`}
          color="error"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1
          }}
        />
      )}
      
      {(onFavoriteClick || onShare) && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            display: 'flex',
            gap: 1
          }}
        >
          {onFavoriteClick && (
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick();
              }}
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              {favorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          )}
          {onShare && (
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <Share />
            </IconButton>
          )}
        </Box>
      )}

      {image && (
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        {title && (
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h3"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}

        {description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
        )}

        {(rating || price) && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={rating} precision={0.5} readOnly size="small" />
                {reviews && (
                  <Typography variant="body2" color="text.secondary">
                    ({reviews})
                  </Typography>
                )}
              </Box>
            )}
            {price && (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${price.toFixed(2)}
                </Typography>
                {discount && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${(price * (1 + discount/100)).toFixed(2)}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}

        {tags && tags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="outlined" 
                color="primary" 
              />
            ))}
          </Box>
        )}

        {children}
      </CardContent>

      {actions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
            {actions}
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default CustomCard;