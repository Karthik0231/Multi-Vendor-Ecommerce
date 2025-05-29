import React, { useContext, useEffect, useState, useMemo } from 'react';
import { VendorContext } from '../Context/Context';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    MenuItem,
    Select,
    FormControl,
    Grid,
    Divider,
    Pagination,
    TextField,
    InputAdornment,
    Collapse,
    IconButton,
    Card,
    CardContent,
    Stack,
    Tabs,
    Tab
} from '@mui/material';
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';

const Orders = () => {
    const { orders, getOrders, updateOrderStatus, loading } = useContext(VendorContext);
    
    // Pagination and filtering states
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [ordersPerPage] = useState(10); // Configurable items per page

    useEffect(() => {
        getOrders();
    }, []);

    // Filter and search orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.contactInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    // Paginated orders
    const paginatedOrders = useMemo(() => {
        const startIndex = (page - 1) * ordersPerPage;
        return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    }, [filteredOrders, page, ordersPerPage]);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        // Reset expanded orders when changing pages
        setExpandedOrders(new Set());
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const toggleOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getOrderSummary = (order) => {
        const itemCount = order.items?.length || 0;
        const itemText = itemCount === 1 ? 'item' : 'items';
        return `${itemCount} ${itemText} • ₹${order.totalAmount}`;
    };

    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header */}
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
                    Orders Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View and manage your orders • {filteredOrders.length} total orders
                </Typography>
            </Paper>

            {/* Filters and Search */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by order ID, customer name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                displayEmpty
                            >
                                {statusOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="body2" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            Showing {paginatedOrders.length} of {filteredOrders.length} orders
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Loading orders...</Typography>
                </Paper>
            ) : filteredOrders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        {searchTerm || statusFilter !== 'all' ? 'No orders match your filters' : 'No orders found'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'Orders will appear here once customers place them'}
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* Orders List */}
                    <Stack spacing={2}>
                        {paginatedOrders.map((order) => {
                            const isExpanded = expandedOrders.has(order._id);
                            
                            return (
                                <Card key={order._id} sx={{ borderRadius: 2, overflow: 'visible' }}>
                                    {/* Compact Order Header */}
                                    <CardContent sx={{ pb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontSize: '1.1rem' }} noWrap>
                                                    Order #{order._id}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {order.contactInfo?.name || 'N/A'} • {formatDate(order.createdAt)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {getOrderSummary(order)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                                {/* Payment Status */}
                                                {order.orderStatus === 'delivered' || order.paymentMethod === 'UPI' ? (
                                                    <Chip label="Paid" color="success" size="small" />
                                                ) : order.orderStatus === 'cancelled' ? (
                                                    <Chip label="Cancelled" color="error" size="small" />
                                                ) : (
                                                    <Chip label="Payment Pending" color="warning" size="small" />
                                                )}

                                                {/* Order Status */}
                                                {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' ? (
                                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={order.orderStatus}
                                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                            size="small"
                                                        >
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="processing">Processing</MenuItem>
                                                            <MenuItem value="shipped">Shipped</MenuItem>
                                                            <MenuItem value="delivered">Delivered</MenuItem>
                                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <Chip
                                                        label={order.orderStatus}
                                                        color={getStatusColor(order.orderStatus)}
                                                        size="small"
                                                        sx={{ textTransform: 'capitalize' }}
                                                    />
                                                )}

                                                {/* Expand Button */}
                                                <IconButton
                                                    onClick={() => toggleOrderExpansion(order._id)}
                                                    size="small"
                                                >
                                                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                    {/* Expandable Details */}
                                    <Collapse in={isExpanded}>
                                        <Divider />
                                        <CardContent sx={{ pt: 2 }}>
                                            <Grid container spacing={2}>
                                                {/* Customer Information */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Customer Details
                                                    </Typography>
                                                    <Typography variant="body2"><strong>Name:</strong> {order.contactInfo.name || 'N/A'}</Typography>
                                                    <Typography variant="body2"><strong>Email:</strong> {order.contactInfo.email || 'N/A'}</Typography>
                                                    <Typography variant="body2"><strong>Phone:</strong> {order.contactInfo.phone || 'N/A'}</Typography>
                                                </Grid>

                                                {/* Shipping Information */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Shipping Address
                                                    </Typography>
                                                    <Typography variant="body2">{order.shippingAddress.street || 'N/A'}</Typography>
                                                    <Typography variant="body2">
                                                        {order.shippingAddress.city && order.shippingAddress.state ? 
                                                            `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2">{order.shippingAddress.pincode || 'N/A'}</Typography>
                                                    <Typography variant="body2">{order.shippingAddress.country}</Typography>
                                                </Grid>

                                                {/* Order Summary */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Order Summary
                                                    </Typography>
                                                    <Typography variant="body2"><strong>Payment:</strong> {order.paymentMethod}</Typography>
                                                    <Typography variant="body2"><strong>Created:</strong> {formatDate(order.createdAt)}</Typography>
                                                    <Typography variant="body2"><strong>Updated:</strong> {formatDate(order.updatedAt)}</Typography>
                                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                                                        <strong>Total: ₹{order.totalAmount}</strong>
                                                    </Typography>
                                                </Grid>

                                                {/* Order Items */}
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Order Items
                                                    </Typography>
                                                    <TableContainer component={Paper} variant="outlined">
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Product Name</TableCell>
                                                                    <TableCell align="center">Quantity</TableCell>
                                                                    <TableCell align="right">Price</TableCell>
                                                                    <TableCell align="right">Total</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {order.items.map((item) => (
                                                                    <TableRow key={item._id}>
                                                                        <TableCell>{item.product?.name || 'N/A'}</TableCell>
                                                                        <TableCell align="center">{item.quantity}</TableCell>
                                                                        <TableCell align="right">₹{item.price}</TableCell>
                                                                        <TableCell align="right">₹{item.price * item.quantity}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            );
                        })}
                    </Stack>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Orders;