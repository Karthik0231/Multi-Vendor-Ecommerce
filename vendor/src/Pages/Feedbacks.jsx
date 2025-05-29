import React, { useContext, useEffect, useState } from 'react';
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
    IconButton,
    TextField,
    InputAdornment,
    Grid,
    Rating,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@mui/icons-material';

const Feedbacks = () => {
    const { feedbacks = [], getFeedbacks, deleteFeedback, loading } = useContext(VendorContext);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [feedbacksPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        getFeedbacks();
    }, []); // Add getFeedbacks to dependency array

    // Add null check before filtering
    const filteredFeedbacks = feedbacks?.filter(feedback =>
        feedback?.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const paginatedFeedbacks = filteredFeedbacks.slice(
        (page - 1) * feedbacksPerPage,
        page * feedbacksPerPage
    );

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleDeleteClick = (feedback) => {
        setSelectedFeedback(feedback);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedFeedback) {
            await deleteFeedback(selectedFeedback._id);
            setDeleteDialogOpen(false);
            setSelectedFeedback(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    Customer Feedbacks
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Manage customer reviews and feedback
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by customer name or feedback content..."
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
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            Showing {paginatedFeedbacks.length} of {filteredFeedbacks.length} feedbacks
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Feedback</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Loading feedbacks...</TableCell>
                            </TableRow>
                        ) : paginatedFeedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No feedbacks found</TableCell>
                            </TableRow>
                        ) : (
                            paginatedFeedbacks.map((feedback) => (
                                <TableRow key={feedback._id}>
                                    <TableCell>{feedback.customer?.name || 'Anonymous'}</TableCell>
                                    <TableCell>
                                        <Rating value={feedback.rating} readOnly />
                                    </TableCell>
                                    <TableCell>{feedback.comment}</TableCell>
                                    <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(feedback)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredFeedbacks.length > feedbacksPerPage && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={Math.ceil(filteredFeedbacks.length / feedbacksPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this feedback?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Feedbacks;