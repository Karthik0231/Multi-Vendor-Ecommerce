import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import { Search, History, TrendingUp, Clear } from '@mui/icons-material';

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  loading = false,
  fullWidth = false,
  sx = {}
}) => {
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFocus = (event) => {
    if (recentSearches.length > 0 || trendingSearches.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (searchQuery) => {
    onSearch(searchQuery);
    setQuery(searchQuery);
    handleClose();
  };

  const handleClear = () => {
    setQuery('');
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
      <Paper
        elevation={2}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 2
        }}
      >
        <IconButton disabled>
          <Search />
        </IconButton>
        <InputBase
          fullWidth
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          onFocus={handleFocus}
          sx={{ ml: 1, flex: 1 }}
        />
        {loading && <CircularProgress size={24} sx={{ mx: 1 }} />}
        {query && (
          <IconButton onClick={handleClear}>
            <Clear />
          </IconButton>
        )}
        <IconButton onClick={() => handleSearch(query)}>
          <Search />
        </IconButton>
      </Paper>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: anchorEl?.offsetWidth,
            mt: 1,
            boxShadow: 3,
            borderRadius: 2
          }
        }}
      >
        {recentSearches.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              Recent Searches
            </Typography>
            <List dense>
              {recentSearches.map((search, index) => (
                <ListItem 
                  key={index} 
                  button 
                  onClick={() => handleSearch(search)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <History fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={search} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </>
        )}

        {trendingSearches.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              Trending Searches
            </Typography>
            <List dense>
              {trendingSearches.map((search, index) => (
                <ListItem 
                  key={index} 
                  button 
                  onClick={() => handleSearch(search)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <TrendingUp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={search} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Popover>
    </Box>
  );
};

export default SearchBar;