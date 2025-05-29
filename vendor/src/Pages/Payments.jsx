import React, { useContext, useState, useMemo } from 'react';
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
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    Pagination,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import {
    Search as SearchIcon,
    CurrencyRupee as CurrencyRupeeIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';

const Payments = () => {
    const { orders, loading } = useContext(VendorContext);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [paymentsPerPage] = useState(10);

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

    // Calculate total earnings
    const totalEarnings = useMemo(() => {
        return orders.reduce((total, order) => {
            if (order.paymentStatus === 'paid' || order.orderStatus === 'delivered') {
                return total + order.totalAmount;
            }
            return total;
        }, 0);
    }, [orders]);

    // Filter and search payments
    const filteredPayments = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesPaymentStatus = 
                paymentFilter === 'all' || 
                (paymentFilter === 'paid' && (order.paymentStatus === 'paid' || order.orderStatus === 'delivered')) ||
                (paymentFilter === 'pending' && order.paymentStatus === 'pending' && order.orderStatus !== 'delivered');
            
            return matchesSearch && matchesPaymentStatus;
        });
    }, [orders, searchTerm, paymentFilter]);

    // Paginate payments
    const paginatedPayments = useMemo(() => {
        const startIndex = (page - 1) * paymentsPerPage;
        return filteredPayments.slice(startIndex, startIndex + paymentsPerPage);
    }, [filteredPayments, page, paymentsPerPage]);

    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const getPaymentStatusColor = (order) => {
        if (order.orderStatus === 'cancelled') return 'error';
        if (order.orderStatus === 'delivered' || order.paymentStatus === 'paid') return 'success';
        return 'warning';
    };

    const getPaymentStatus = (order) => {
        if (order.orderStatus === 'cancelled') return 'Cancelled';
        if (order.orderStatus === 'delivered' || order.paymentStatus === 'paid') return 'Paid';
        return 'Pending';
    };

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
                    Payments Overview
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Track and manage your payments
                </Typography>
            </Paper>

            {/* Payment Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Earnings
                            </Typography>
                            <Typography variant="h4">
                                ₹{totalEarnings.toLocaleString('en-IN')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Transactions
                            </Typography>
                            <Typography variant="h4">
                                {orders.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending Payments
                            </Typography>
                            <Typography variant="h4">
                                {orders.filter(order => 
                                    order.paymentStatus === 'pending' && 
                                    order.orderStatus !== 'cancelled' && 
                                    order.orderStatus !== 'delivered'
                                ).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by order ID, customer name, or payment method..."
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
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Payments</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="body2" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            Showing {paginatedPayments.length} of {filteredPayments.length} payments
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Payments List */}
            {loading ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Loading payments...</Typography>
                </Paper>
            ) : filteredPayments.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <PaymentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6">No payments found</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm || paymentFilter !== 'all' ? 
                            'Try adjusting your search or filter criteria' : 
                            'Payments will appear here once orders are placed'}
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPayments.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {order.contactInfo?.name || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {order.contactInfo?.email || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CurrencyRupeeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                {order.totalAmount}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{order.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getPaymentStatus(order)}
                                                color={getPaymentStatusColor(order)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
                </Stack>
            )}
        </Box>
    );
};

export default Payments;