import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Tooltip,  
  Stack,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Badge,
  Fade,
  LinearProgress,
  Paper,
  Avatar,
} from "@mui/material";
import {
  DownloadOutlined,
  PointOfSale,
  Refresh,
  Inventory,
  ShoppingCart,
  Feedback,
  LocalShipping,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Star,
  CalendarToday,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Header, StatBox } from "../../components";
import { tokens } from "../../theme";
import { VendorContext } from "../../Context/Context";
import {cloneElement} from 'react';

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");

  const {
    products,
    orders,
    feedbacks,
    getProducts,
    getOrders,
    getFeedbacks,
    loading,
  } = useContext(VendorContext);

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([getProducts(), getOrders(), getFeedbacks()]);
      setLastUpdated(new Date());
      setAlertOpen(true);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
      : 0;
    
    return {
      totalRevenue,
      avgRating: avgRating.toFixed(1),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      activeProducts: products.filter(product => product.status === 'active').length,
    };
  }, [orders, feedbacks, products]);

  // Enhanced StatCard Component
  const EnhancedStatCard = ({ title, subtitle, value, icon, progress, increase, trend, color }) => {
    const isPositiveTrend = trend === 'up';
    
    return (
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          border: `1px solid ${colors.primary[600]}`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 20px 40px -12px ${color}40`,
            border: `1px solid ${color}60`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          }
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: colors.gray[100],
                  mb: 0.5,
                  fontSize: '1.8rem'
                }}
              >
                {value}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.gray[300],
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {subtitle}
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: `${color}20`,
                width: 56,
                height: 56,
                border: `2px solid ${color}30`,
              }}
            >
              {cloneElement(icon, { 
                sx: { 
                  color: color, 
                  fontSize: 28 
                } 
              })}
            </Avatar>
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" color={colors.gray[400]}>
                Progress
              </Typography>
              <Typography variant="caption" color={colors.gray[400]}>
                {Math.round(progress * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: colors.primary[600],
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3,
                }
              }}
            />
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.gray[300],
                fontWeight: 500
              }}
            >
              {increase}
            </Typography>
            <Box 
              display="flex" 
              alignItems="center" 
              gap={0.5}
              sx={{
                color: isPositiveTrend ? colors.greenAccent[400] : colors.redAccent[400]
              }}
            >
              {isPositiveTrend ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {isPositiveTrend ? '+14%' : '-5%'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.orderStatus || order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const chartColors = {
      delivered: colors.greenAccent[500],
      shipped: colors.blueAccent[500],
      cancelled: colors.redAccent[500],
      pending: colors.gray[400],
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: chartColors[status] || colors.gray[400],
    }));
  }, [orders, colors]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            bgcolor: colors.primary[400],
            p: 1.5,
            borderRadius: 1,
            border: `1px solid ${colors.primary[500]}`,
            boxShadow: `0 4px 12px ${colors.primary[900]}40`,
          }}
        >
          <Typography variant="body2" color={colors.gray[100]}>
            {data.name}: {data.value} order{data.value !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="caption" color={colors.gray[300]}>
            {((data.value / orders.length) * 100).toFixed(1)}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box m="20px">
      <Fade in={alertOpen} timeout={1000}>
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setAlertOpen(false)}
        >
          Dashboard updated successfully
        </Alert>
      </Fade>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Header title="DASHBOARD" subtitle="Welcome to your vendor dashboard" />
        <Tooltip title={`Last updated: ${lastUpdated.toLocaleTimeString()}`}>
          <Button
            onClick={fetchData}
            startIcon={<Refresh />}
            disabled={refreshing}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              '&:hover': { backgroundColor: colors.blueAccent[800] },
            }}
          >
            Refresh
          </Button>
        </Tooltip>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gap="20px"
      >
        {/* Enhanced Stat Cards */}
        {loading ? (
          // Loading skeletons for stat cards
          [...Array(4)].map((_, index) => (
            <Box key={index} gridColumn="span 3">
              <Card sx={{ height: 200, bgcolor: colors.primary[400] }}>
                <CardContent>
                  <Skeleton variant="rectangular" height={160} />
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          // Enhanced stat cards
          <>
            <Box gridColumn="span 3">
              <EnhancedStatCard
                value={products.length.toString()}
                subtitle="Total Products"
                progress={metrics.activeProducts / (products.length || 1)}
                increase={`${metrics.activeProducts} Active`}
                icon={<Inventory />}
                trend="up"
                color={colors.greenAccent[500]}
              />
            </Box>

            <Box gridColumn="span 3">
              <EnhancedStatCard
                value={orders.length.toString()}
                subtitle="Total Orders"
                progress={1 - (metrics.pendingOrders / (orders.length || 1))}
                increase={`${metrics.pendingOrders} Pending`}
                icon={<ShoppingCart />}
                trend="up"
                color={colors.blueAccent[500]}
              />
            </Box>

            <Box gridColumn="span 3">
              <EnhancedStatCard
                value={metrics.avgRating}
                subtitle="Average Rating"
                progress={metrics.avgRating / 5}
                increase={`${feedbacks.length} Reviews`}
                icon={<Star />}
                trend="up"
                color="yellow"
              />
            </Box>

            <Box gridColumn="span 3">
              <EnhancedStatCard
                value={formatCurrency(metrics.totalRevenue)}
                subtitle="Total Revenue"
                progress={0.75}
                increase="This Month"
                icon={<PointOfSale />}
                trend="up"
                color={colors.greenAccent[400]}
              />
            </Box>
          </>
        )}

        {/* Order Status Pie Chart - Enhanced */}
        <Box gridColumn={isXlDevices ? "span 6" : "span 6"} gridRow="span 2">
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
              border: `1px solid ${colors.primary[600]}`,
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px -12px ${colors.primary[900]}60`,
              }
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={3}
                pb={2}
                borderBottom={`2px solid ${colors.primary[600]}`}
              >
                <Avatar
                  sx={{
                    bgcolor: `${colors.greenAccent[500]}20`,
                    width: 40,
                    height: 40,
                  }}
                >
                  <PieChartIcon sx={{ color: colors.greenAccent[500] }} />
                </Avatar>
                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                  Order Status Distribution
                </Typography>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Skeleton variant="circular" width={200} height={200} />
                </Box>
              ) : orders.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height={300}
                  gap={2}
                >
                  <PieChartIcon
                    sx={{
                      fontSize: 48,
                      color: colors.gray[500],
                      opacity: 0.5
                    }}
                  />
                  <Typography color={colors.gray[100]} textAlign="center">
                    No order data to display
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        color: colors.gray[100],
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Recent Orders - Enhanced */}
        <Box gridColumn={isXlDevices ? "span 6" : "span 6"} gridRow="span 2">
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
              border: `1px solid ${colors.primary[600]}`,
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px -12px ${colors.primary[900]}60`,
              }
            }}
          >
            <Box
              p={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`2px solid ${colors.primary[600]}`}
              sx={{
                position: 'sticky',
                top: 0,
                bgcolor: 'inherit',
                zIndex: 1
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  sx={{
                    bgcolor: `${colors.greenAccent[500]}20`,
                    width: 40,
                    height: 40,
                  }}
                >
                  <ShoppingCart sx={{ color: colors.greenAccent[500] }} />
                </Avatar>
                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                  Recent Orders
                </Typography>
              </Box>
              <Chip
                label={`${orders.length} Total`}
                size="small"
                sx={{
                  bgcolor: `${colors.greenAccent[500]}20`,
                  color: colors.greenAccent[400],
                  fontWeight: 600,
                  border: `1px solid ${colors.greenAccent[500]}40`
                }}
              />
            </Box>

            <CardContent sx={{ p: 0, height: 'calc(100% - 80px)', overflow: 'auto' }}>
              {loading ? (
                <Box p={2}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      height={80}
                      sx={{
                        my: 1,
                        transform: 'scale(1, 0.8)',
                        borderRadius: 1
                      }}
                    />
                  ))}
                </Box>
              ) : orders.length === 0 ? (
                <Box
                  p={4}
                  textAlign="center"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    height: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <ShoppingCart
                    sx={{
                      fontSize: 48,
                      color: colors.gray[500],
                      opacity: 0.5
                    }}
                  />
                  <Typography color={colors.gray[100]}>
                    No orders yet
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {orders.slice(0, 5).map((order, index) => (
                    <ListItem
                      key={order._id}
                      divider={index !== orders.length - 1}
                      sx={{
                        py: 2,
                        px: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: `${colors.primary[600]}60`,
                          transform: 'scale(1.01)'
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography
                                variant="subtitle1"
                                color={colors.gray[100]}
                                sx={{ fontWeight: 600 }}
                              >
                                #{order._id}
                              </Typography>
                              <Typography
                                variant="body2"
                                color={colors.gray[300]}
                                sx={{ 
                                  fontStyle: 'italic',
                                  fontWeight: "bold",
                                  color: "orange",
                                  fontSize: 14,
                                  textTransform: 'uppercase'
                                }}
                              >
                                {order.customer.name}
                              </Typography>
                            </Box>
                            <Typography
                              variant="subtitle1"
                              color={colors.greenAccent[500]}
                              sx={{ fontWeight: 600 }}
                            >
                              {formatCurrency(order.totalAmount)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" gap={2} mt={1}>
                            <Chip
                              size="small"
                              label={(order.orderStatus || 'pending').toUpperCase()}
                              icon={
                                order.status === 'delivered' ? <CheckCircle /> :
                                order.status === 'shipped' ? <LocalShipping /> :
                                order.status === 'cancelled' ? <Cancel /> :
                                <HourglassEmpty />
                              }
                              sx={{
                                bgcolor: 
                                  order.status === 'delivered' ? `${colors.greenAccent[500]}20` :
                                  order.status === 'shipped' ? `${colors.blueAccent[500]}20` :
                                  order.status === 'cancelled' ? `${colors.redAccent[500]}20` :
                                  `${colors.gray[500]}20`,
                                color: 
                                  order.status === 'delivered' ? colors.greenAccent[500] :
                                  order.status === 'shipped' ? colors.blueAccent[500] :
                                  order.status === 'cancelled' ? colors.redAccent[500] :
                                  colors.gray[400],
                                '& .MuiChip-icon': {
                                  color: 'inherit'
                                }
                              }}
                            />
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={0.5}
                              sx={{
                                color: colors.gray[300],
                                '& svg': { fontSize: 14 }
                              }}
                            >
                              <CalendarToday />
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;