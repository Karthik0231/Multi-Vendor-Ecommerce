import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Avatar, Tooltip, Pagination, Stack
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import Swal from 'sweetalert2';

const Feedbacks = () => {
    const { getFeedbacks, deleteFeedback } = useContext(AdminContext);  
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await getFeedbacks();
            if (data.success) {
                setFeedbacks(data.feedbacks);
            } else {
                Swal.fire('Error', data.message || 'Failed to load feedbacks', 'error');
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            Swal.fire('Error', 'Failed to load feedbacks', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDeleteFeedback = async (feedbackId) => {
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
                const success = await deleteFeedback(feedbackId);
                if (success) {
                    await fetchFeedbacks();
                    Swal.fire('Deleted!', 'Feedback has been deleted.', 'success');
                } else {
                    Swal.fire('Error', 'Failed to delete feedback', 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            Swal.fire('Error', 'Failed to delete feedback', 'error');
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedFeedbacks = filteredFeedbacks.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
                    Feedback Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View and manage customer feedbacks
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search feedbacks..."
                    variant="outlined"
                    size="small"
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
            </Paper>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'black' }}>
                            <TableCell>Customer</TableCell>
                            <TableCell>Order Details</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>Loading feedbacks...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredFeedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>No feedbacks found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedFeedbacks.map((feedback) => (
                                <TableRow key={feedback._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar>{feedback.customer?.name?.charAt(0) || 'A'}</Avatar>
                                            <Box>
                                                <Typography>{feedback.customer?.name || 'Anonymous'}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {feedback.customer?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            Amount: ₹{feedback.order?.totalAmount || 0}
                                        </Typography>
                                        <Chip
                                            label={feedback.order?.orderStatus || 'N/A'}
                                            color={feedback.order?.orderStatus === 'delivered' ? 'success' : 'default'}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${feedback.rating} ★`}
                                            color={feedback.rating >= 4 ? 'success' : 
                                                   feedback.rating >= 3 ? 'warning' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{feedback.comment}</TableCell>
                                    <TableCell>
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Delete Feedback">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteFeedback(feedback._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {filteredFeedbacks.length > rowsPerPage && (
                <Stack spacing={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                    <Pagination
                        count={Math.ceil(filteredFeedbacks.length / rowsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            )}
        </Box>
    );
};

export default Feedbacks;