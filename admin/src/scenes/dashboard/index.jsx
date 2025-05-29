import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
  Tab,
  Tabs,
  Stack,
  Badge,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  DownloadOutlined,
  PersonAdd,
  PointOfSale,
  Traffic,
  TrendingUp,
  TrendingDown,
  Refresh,
  MoreVert,
  ShoppingCart,
  Store,
  AttachMoney,
  Group,
  Dashboard as DashboardIcon,
  Analytics,
  Schedule,
  FilterList,
  GetApp,
  LocalShipping,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Inventory,
  Star,
  Warning,
  Info,
  CalendarToday,
  Settings,
} from "@mui/icons-material";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Pie,
} from "recharts";
import Assessment from '@mui/icons-material/Assessment';
import { AdminContext } from '../../Context/Context'; // Import AdminContext

// Default color theme fallback
const defaultColors = {
  primary: {
    400: '#1e293b',
    500: '#0f172a',
    600: '#020617',
    900: '#000000'
  },
  gray: {
    100: '#f1f5f9',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569'
  },
  blueAccent: {
    400: '#3b82f6',
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af'
  },
  greenAccent: {
    500: '#22c55e',
    600: '#16a34a'
  },
  redAccent: {
    500: '#ef4444'
  },
  yellowAccent: {
    500: '#eab308',
    600: '#ca8a04'
  },
  purpleAccent: {
    500: '#a855f7'
  }
};

function Dashboard() {
  const theme = useTheme();
  const { getDashboardStats } = useContext(AdminContext); // Use AdminContext

  // Safe color access with fallback
  const getColors = () => {
    try {
      // Try to use your tokens function if available
      if (typeof tokens !== 'undefined') {
        return tokens(theme.palette.mode);
      }
    } catch (error) {
      console.warn('Tokens function not available, using default colors');
    }
    return defaultColors;
  };

  const colors = getColors();
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalRevenue: 0,
    totalOrders: 0,
    recentOrders: [],
    monthlyGrowth: {
      users: 0,
      vendors: 0,
      revenue: 0,
      orders: 0,
    },
    topProducts: [],
    salesTrend: [],
    vendorStats: {
      active: 0,
      pending: 0,
      suspended: 0,
    },
    orderStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    categoryStats: [],
    revenueByMonth: [],
    topVendors: [],
    customerStats: {
      new: 0,
      returning: 0,
      vip: 0,
    },
    performanceMetrics: {
      avgOrderValue: 0,
      conversionRate: 0,
      customerSatisfaction: 0,
      deliveryTime: 0,
    }
  });

  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setRefreshing(true);
      setLoading(true); // Set loading to true before fetching data
      const data = await getDashboardStats(); // Fetch data from context
      if (data.success) {
        setStats(data.stats); // Update stats with fetched data
        setAlertOpen(true); // Show success alert
      } else {
        console.error("Failed to fetch dashboard stats:", data.message);
        // Optionally show an error message to the user
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setRefreshing(false);
      setLoading(false); // Set loading to false after fetching data
    }
  }, [getDashboardStats]); // Depend on getDashboardStats

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? colors.greenAccent[500] : colors.redAccent[500];
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle sx={{ color: colors.greenAccent[500] }} />;
      case 'cancelled': return <Cancel sx={{ color: colors.redAccent[500] }} />;
      case 'shipped': return <LocalShipping sx={{ color: colors.blueAccent[500] }} />;
      case 'processing': return <HourglassEmpty sx={{ color: colors.yellowAccent[500] }} />;
      default: return <Schedule sx={{ color: colors.gray[500] }} />;
    }
  };

  // Enhanced Stat Card Component
  const EnhancedStatCard = ({ title, value, growth, icon, color, subtitle, progress }) => (
    <Zoom in timeout={500}>
      <Card 
        sx={{ 
          bgcolor: colors.primary[400], 
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': { 
            transform: 'translateY(-8px)',
            boxShadow: `0 12px 24px rgba(0,0,0,0.2)`
          },
          border: `1px solid ${colors.primary[500]}`,
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, ${color}20, transparent)`,
            borderRadius: '0 0 0 100px',
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box flex={1}>
              <Typography variant="h3" fontWeight="bold" color={colors.gray[100]} mb={0.5}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              <Typography variant="body2" color={colors.gray[300]} mb={1}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color={colors.gray[400]}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar 
              sx={{ 
                bgcolor: `${color}20`, 
                color: color,
                width: 64, 
                height: 64,
                border: `2px solid ${color}30`
              }}
            >
              {icon}
            </Avatar>
          </Box>
          
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              {getGrowthIcon(growth)}
              <Typography 
                variant="body2" 
                color={getGrowthColor(growth)}
                ml="4px"
                fontWeight="600"
              >
                {Math.abs(growth)}% this month
              </Typography>
            </Box>
            {progress && (
              <Typography variant="caption" color={colors.gray[400]}>
                {progress}% target
              </Typography>
            )}
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress || 75} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: colors.primary[500],
              '& .MuiLinearProgress-bar': { 
                bgcolor: color,
                borderRadius: 3,
              }
            }} 
          />
        </CardContent>
      </Card>
    </Zoom>
  );

  // Prepare data for the new charts
  const prepareOrderStatusData = () => {
    const orderData = stats.orderStatus || {};
    const data = [
      { name: 'Pending', value: orderData.pending || 25, color: colors.yellowAccent[500] },
      { name: 'Processing', value: orderData.processing || 35, color: colors.blueAccent[500] },
      { name: 'Shipped', value: orderData.shipped || 20, color: colors.purpleAccent[500] },
      { name: 'Delivered', value: orderData.delivered || 45, color: colors.greenAccent[500] },
      { name: 'Cancelled', value: orderData.cancelled || 8, color: colors.redAccent[500] },
    ];
    return data.filter(item => item.value > 0);
  };

  const prepareVendorStatusData = () => {
    const vendorData = stats.vendorStats || {};
    const data = [
      { name: 'Active', value: vendorData.active || 85, color: colors.greenAccent[500] },
      { name: 'Pending', value: vendorData.pending || 12, color: colors.yellowAccent[500] },
      { name: 'Suspended', value: vendorData.suspended || 3, color: colors.redAccent[500] },
    ];
    return data.filter(item => item.value > 0);
  };

  const prepareRevenueAnalyticsData = () => {
    const revenueData = stats.revenueByMonth || [];
    // If no data from API, create sample data for demonstration
    if (revenueData.length === 0) {
      return Array.from({ length: 6 }, (_, i) => ({
        month: new Date(2024, i + 6).toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 20000,
        orders: Math.floor(Math.random() * 200) + 100,
        users: Math.floor(Math.random() * 150) + 50,
      }));
    }
    return revenueData;
  };

  console.log('Order Status Data:', prepareOrderStatusData());
  console.log('Vendor Status Data:', prepareVendorStatusData());
  console.log('Revenue Analytics Data:', prepareRevenueAnalyticsData());

  if (loading) {
    return (
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" mb="20px">
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={300} height={20} />
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* Enhanced Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="30px">
        <Box>
          <Typography variant="h2" fontWeight="bold" color={colors.gray[100]} mb={1}>
            ADMIN DASHBOARD
          </Typography>
          <Typography variant="h5" color={colors.gray[300]} mb={2}>
            Real-time business analytics and insights
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={<CalendarToday fontSize="small" />}
              label={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
              variant="outlined"
              size="small"
              sx={{ color: colors.gray[300], borderColor: colors.gray[600] }}
            />
            <Tooltip title="Refresh Data">
              <IconButton 
                size="small" 
                onClick={fetchStats}
                disabled={refreshing}
                sx={{ 
                  color: colors.gray[300],
                  '&:hover': { bgcolor: colors.primary[500] }
                }}
              >
                <Refresh sx={{ 
                  fontSize: "20px",
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Key Metrics */}
      <Grid container spacing={3} mb="30px">
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Total Orders"
            value={stats.totalOrders}
            growth={stats.monthlyGrowth?.orders ?? 0}
            icon={<ShoppingCart />}
            color={colors.greenAccent[500]}
            subtitle="Active transactions"
            progress={75}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            growth={stats.monthlyGrowth?.revenue ?? 0}
            icon={<AttachMoney />}
            color={colors.blueAccent[500]}
            subtitle="Net earnings"
            progress={85}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Active Vendors"
            value={stats.totalVendors}
            growth={stats.monthlyGrowth?.vendors ?? 0}
            icon={<Store />}
            color={colors.greenAccent[500]}
            subtitle="Registered sellers"
            progress={60}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Total Users"
            value={stats.totalUsers}
            growth={stats.monthlyGrowth?.users ?? 0}
            icon={<Group />}
            color={colors.redAccent[500]}
            subtitle="Platform members"
            progress={90}
          />
        </Grid>
      </Grid>

    </Box>
  );
}

export default Dashboard;