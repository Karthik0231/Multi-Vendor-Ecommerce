import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Stack,
  Divider,
  Avatar,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyDialog, setReplyDialog] = useState({ open: false, messageId: '', currentMessage: '' });
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const {vendorId}=useParams();

  const fetchVendorMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:9000/admin/vendor-messages/${vendorId}`, {
        headers: {
          'auth-token': localStorage.getItem('adminToken'),
        },
      });
      
      if (res.data.success) {
        setMessages(res.data.messages);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching vendor messages:', error);
      setError('There will be no messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorMessages();
    }
  }, [vendorId]);

  const handleReplyClick = (messageId, message) => {
    setReplyDialog({
      open: true,
      messageId,
      currentMessage: message
    });
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      setSending(true);
      const res = await axios.put(
        `http://localhost:9000/admin/reply/${replyDialog.messageId}`,
        { response: replyText },
        {
          headers: {
            'auth-token': localStorage.getItem('adminToken'),
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        setReplyDialog({ open: false, messageId: '', currentMessage: '' });
        setReplyText('');
        fetchVendorMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleCloseDialog = () => {
    setReplyDialog({ open: false, messageId: '', currentMessage: '' });
    setReplyText('');
  };

  const pendingMessages = messages.filter(msg => !msg.response);
  const repliedMessages = messages.filter(msg => msg.response);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        mx: 'auto',
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 0,
          bgcolor: '#2e7d32',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          🛠️ Admin - Vendor Messages
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {messages.length} total messages • {pendingMessages.length} pending • {repliedMessages.length} replied
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      >
        <Stack spacing={3}>
          {messages?.length > 0 ? (
            messages.map((msg) => (
              <Box key={msg._id}>
                {/* Vendor Message */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 1,
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ maxWidth: '70%' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: '20px 20px 20px 4px',
                        position: 'relative',
                      }}
                    >
                      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                        {msg.message}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 1,
                          bgcolor: 'transparent',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {new Date(msg.date).toLocaleString()}
                        </Typography>
                        {!msg.response && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ReplyIcon />}
                            onClick={() => handleReplyClick(msg._id, msg.message)}
                            sx={{
                              ml: 1,
                              borderRadius: '20px',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                            }}
                          >
                            Reply
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                {/* Admin Response */}
                {msg.response && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Box sx={{ maxWidth: '70%' }}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          bgcolor: '#2e7d32',
                          color: 'white',
                          borderRadius: '20px 20px 4px 20px',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CheckCircleIcon fontSize="small" sx={{ opacity: 0.8 }} />
                          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                            Admin Reply
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                          {msg.response}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem', mt: 1, display: 'block' }}>
                          {new Date(msg.responseDate).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Box>
                    <Avatar sx={{ bgcolor: '#2e7d32', width: 32, height: 32 }}>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </Avatar>
                  </Box>
                )}

                {/* Pending Status */}
                {!msg.response && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Chip
                      icon={<PendingIcon />}
                      label="Awaiting Admin Reply"
                      size="small"
                      sx={{
                        bgcolor: '#fff3e0',
                        color: '#f57c00',
                        fontSize: '0.7rem',
                        border: '1px solid #ffcc02',
                      }}
                    />
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                📭 No messages from this vendor
              </Typography>
              <Typography variant="body2">
                Messages will appear here when the vendor sends them
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialog.open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReplyIcon />
            <Typography variant="h6">Reply to Vendor Message</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Original Message:
            </Typography>
            <Paper sx={{ p: 2, borderLeft: '4px solid #1976d2' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{replyDialog.currentMessage}"
              </Typography>
            </Paper>
          </Box>
          
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Your Reply"
            placeholder="Type your reply to the vendor..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            variant="contained"
            color="success"
            disabled={!replyText.trim() || sending}
            startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Message;