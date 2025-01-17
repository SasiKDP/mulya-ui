import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import iconImage from '../assets/240_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg'

const Profile = () => {
  const user = {
    name: 'John Doe',
    phone: '+1234567890',
    address: '123 Main Street, City, Country',
    email: 'johndoe@example.com',
    designation: 'Software Engineer',
    gender: 'Male',
    dob: '1990-01-01',
    profilePicture: iconImage, // URL for rectangular image
  };

  return (
    <Box sx={{ maxWidth: "80%", margin: "auto", p: 3, minHeight: "60vh" }}>
      {/* Profile Card */}
      <Card sx={{ maxWidth: 420, margin: 'auto', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
        {/* Rectangular Profile Picture */}
        <Box
          sx={{
            width: '100%',
            height: 180, // Set height for rectangular shape
            backgroundImage: `url(${user.profilePicture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            margin: 'auto',
            borderRadius: 2,
            boxShadow: 1,
            
          }}
        />

        {/* User Details */}
        <CardContent sx={{ textAlign: 'left', p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {user.designation}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Email: </strong>{user.email}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Phone: </strong>{user.phone}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Address: </strong>{user.address}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Gender: </strong>{user.gender}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Date of Birth: </strong>{user.dob}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {/* Gradient Save Button */}
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6a1b9a, rgb(245, 106, 64))', // Gradient colors
              color: 'white',
              borderRadius: 3,
              fontWeight: 'bold',
              padding: '12px 25px',
              '&:hover': {
                background: 'linear-gradient(45deg, rgb(225, 85, 42), #6a1b9a)', // Reverse gradient on hover
              },
            }}
            fullWidth
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
