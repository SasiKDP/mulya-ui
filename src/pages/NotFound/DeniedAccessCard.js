import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { AlertOctagon } from 'lucide-react';

const DeniedAccessCard = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="#f3f4f6"
      p={3}
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderTop: '4px solid #dc2626',
          borderRadius: '8px',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" mb={3}>
            <AlertOctagon size={64} color="#dc2626" />
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Access Denied
          </Typography>
          
          <Typography variant="body1" color="textSecondary" mb={4}>
            You don't have permission to access this resource. Please contact your administrator .
          </Typography>
          
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeniedAccessCard;