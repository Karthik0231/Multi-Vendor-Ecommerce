import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Paper, Typography, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Modal, TextField, IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import Swal from 'sweetalert2';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

const Categories = () => {
    const { getCategories, addCategory, updateCategory, deleteCategory } = useContext(AdminContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to load categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (mode, category = null) => {
        setModalMode(mode);
        setSelectedCategory(category);
        setCategoryName(category ? category.name : '');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCategory(null);
        setCategoryName('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                const result = await addCategory(categoryName);
                if (result.success) {
                    Swal.fire('Success', 'Category added successfully', 'success');
                }
            } else {
                const result = await updateCategory(selectedCategory._id, categoryName);
                if (result.success) {
                    Swal.fire('Success', 'Category updated successfully', 'success');
                }
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
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
                const response = await deleteCategory(id);
                if (response.success) {
                    Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                    fetchCategories();
                }
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to delete category', 'error');
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Paper elevation={2} sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                color: 'white'
            }}>
                <Typography variant="h5" fontWeight="bold">
                    Categories Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Manage product categories
                </Typography>
            </Paper>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 3, color: 'green', fontWeight: 'bold', backgroundColor: 'white' }}
                onClick={() => handleOpenModal('add')}
            >
                Add New Category
            </Button>

            <TableContainer 
                component={Paper} 
                sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    // background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '& .MuiTableCell-head': {
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderBottom: 'none',
                                py: 2.5
                            }
                        }}>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell 
                                    colSpan={2} 
                                    align="center"
                                    sx={{
                                        py: 6,
                                        fontSize: '1.1rem',
                                        color: '#666',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell 
                                    colSpan={2} 
                                    align="center"
                                    sx={{
                                        py: 6,
                                        fontSize: '1.1rem',
                                        color: '#666',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category, index) => (
                                <TableRow 
                                    key={category._id}
                                    sx={{
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderLeft: '4px solid transparent',
                                        '&:hover': {
                                            ...{
                                                background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                            },
                                            borderLeft: '4px solid #667eea'
                                        }
                                    }}
                                >
                                    <TableCell sx={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: 'yellow',
                                        py: 2.5,
                                        px: 3,
                                        borderBottom: '1px solid rgba(0,0,0,0.06)'
                                    }}>
                                        {category.name}
                                    </TableCell>
                                    <TableCell 
                                        align="right"
                                        sx={{
                                            py: 2.5,
                                            px: 3,
                                            borderBottom: '1px solid rgba(0,0,0,0.06)'
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleOpenModal('edit', category)}
                                            sx={{
                                                mr: 1,
                                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '8px',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #43a3f5 0%, #0ee9f5 100%)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '1.2rem'
                                                }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDelete(category._id)}
                                            sx={{
                                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '8px',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #ff5252 0%, #e53935 100%)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '1.2rem'
                                                }
                                            }}
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

            <Modal
                open={openModal}
                onClose={handleCloseModal}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" mb={3}>
                        {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" variant="contained">
                                {modalMode === 'add' ? 'Add' : 'Update'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default Categories;