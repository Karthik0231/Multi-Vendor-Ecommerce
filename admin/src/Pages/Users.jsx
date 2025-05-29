import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Avatar, Tooltip
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import Swal from 'sweetalert2';

const Users = () => {
    const { getUsers, deleteUser } = useContext(AdminContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
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
                const success = await deleteUser(userId);
                if (success) {
                    Swal.fire('Deleted!', 'User has been deleted.', 'success');
                    fetchUsers();
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete user', 'error');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    Users Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View and manage all users
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by name or email..."
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
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>Loading users...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>No users found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={user.profileImage} />
                                            <Typography>{user.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status || 'active'}
                                            color={user.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Delete User">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteUser(user._id)}
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
        </Box>
    );
};

export default Users;