import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Avatar, Tooltip, Button
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import Swal from 'sweetalert2';

const Vendors = () => {
    const { getVendors, updateVendorStatus, deleteVendor } = useContext(AdminContext);
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const data = await getVendors();
            if (data.success) {
                setVendors(data.vendors);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            Swal.fire('Error', 'Failed to load vendors', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleStatusChange = async (vendorId, isApproved) => {
        try {
            const result = await updateVendorStatus(vendorId, isApproved);
            if (result.success) {
                Swal.fire('Success', result.message, 'success');
                fetchVendors();
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update vendor status', 'error');
        }
    };

    const handleDeleteVendor = async (vendorId) => {
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
                const success = await deleteVendor(vendorId);
                if (success) {
                    Swal.fire('Deleted!', 'Vendor has been deleted.', 'success');
                    fetchVendors();
                }
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to delete vendor', 'error');
        }
    };

    const filteredVendors = vendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlechat=async(vendorId)=>{
        window.location.href=`/chat/${vendorId}`
    }

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
                    Vendors Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Manage and monitor vendor accounts
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search vendors..."
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
                            <TableCell>Vendor</TableCell>
                            <TableCell>Shop Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>Loading vendors...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredVendors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>No vendors found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredVendors.map((vendor) => (
                                <TableRow key={vendor._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<Avatar src={`http://localhost:9000/uploads/vendor/${vendor.profileImage}`} />
                                            <Typography>{vendor.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{vendor.shopName}</TableCell>
                                    <TableCell>
                                        <Typography>{vendor.email}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {vendor.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={vendor.isApproved ? 'Approved' : 'Pending'}
                                            color={vendor.isApproved ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {!vendor.isApproved && (
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => handleStatusChange(vendor._id, true)}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                        {vendor.isApproved && (
                                            <Button
                                                size="small"
                                                color="warning"
                                                onClick={() => handleStatusChange(vendor._id, false)}
                                            >
                                                Reject
                                            </Button>
                                        )}
                                        <Tooltip title="Delete Vendor">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteVendor(vendor._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Button
                                            size="small"
                                            color="primary"
                                            sx={{
                                                color:'green',
                                                bgcolor:"orange"
                                            }}
                                            onClick={() => handlechat(vendor._id)}
                                        >
                                            Chat
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Vendors;