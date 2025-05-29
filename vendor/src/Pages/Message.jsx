import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { VendorContext } from '../Context/Context';
import axios from 'axios';

const Messages = () => {
  const { MessageSend, deleteMessage } = useContext(VendorContext);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:9000/vendor/messages', {
        headers: {
          'auth-token': localStorage.getItem('vendorToken'),
        },
      });
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const res = await MessageSend({ message: messageText });
    if (res?.success) {
      setMessageText('');
      fetchMessages();
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteMessage(id);
    if (res?.success) {
      fetchMessages();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        mx: 'auto',
      }}
    >
      {/* Chat Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 0,
          bgcolor: '#1976d2',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          💬 Messages  
          (Chat with Admin)
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {messages?.length || 0} conversation{messages?.length !== 1 ? 's' : ''}
        </Typography>
      </Paper>

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
                {/* User Message */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Box sx={{ maxWidth: '70%' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        bgcolor: '#1976d2',
                        color: 'white',
                        borderRadius: '20px 20px 4px 20px',
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
                        }}
                      >
                        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                          {new Date(msg.date).toLocaleString()}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(msg._id)}
                          sx={{
                            color: 'white',
                            opacity: 0.8,
                            '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' },
                            ml: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Box>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </Box>

                {/* Response Message */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}>
                    <SupportAgentIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ maxWidth: '70%' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: '20px 20px 20px 4px',
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      {msg.response ? (
                        <>
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {msg.response}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.75rem' }}>
                            {new Date(msg.responseDate).toLocaleString()}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label="Pending"
                              size="small"
                              sx={{
                                bgcolor: '#fff3e0',
                                color: '#f57c00',
                                fontSize: '0.7rem',
                                height: '20px',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No response yet
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.75rem' }}>
                            {new Date(msg.date).toLocaleString()}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                💭 No messages yet
              </Typography>
              <Typography variant="body2">
                Start a conversation by typing a message below
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Message Input */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: '1px solid black',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
                color: 'black',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                '&:hover': {
                  bgcolor: 'black',
                },
                '&.Mui-focused': {
                  bgcolor: 'black',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!messageText.trim()}
            sx={{
              minWidth: 'auto',
              borderRadius: '50%',
              width: 56,
              height: 56,
              bgcolor: '#green',
              '&:hover': {
                bgcolor: '#1565c0',
              },
              '&:disabled': {
                bgcolor: '#e0e0e0',
              },
            }}
          >
            <SendIcon />
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Messages;