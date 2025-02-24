import React from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';

const ContactFields = ({
  formData,
  handleChange,
  handleBlur,
  formError,
  isEmailVerified,         // Use parent's state
  onEmailVerificationClick // Use parent's handler
}) => {
  return (
    <Grid container spacing={2}>
      {/* Official Email Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Official Email Id"
          name="email"
          type="email"
          placeholder="@dataqinc.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.email}
          helperText={formError.email}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {!isEmailVerified ? (
                  <Tooltip title="Click to verify email">
                    <IconButton
                      onClick={onEmailVerificationClick}
                      color="primary"
                      disabled={!formData.email || !!formError.email}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <VerifiedIcon color="success" />
                )}
              </InputAdornment>
            ),
          }}
        />
        {/* Verification Info Message */}
        {!isEmailVerified && formData.email && !formError.email && (
          <Typography variant="caption" color="error">
            Please verify your email before proceeding.
          </Typography>
        )}
      </Grid>

      {/* Personal Email Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Employee Personal Email"
          name="personalemail"
          placeholder="@gmail.com"
          type="email"
          value={formData.personalemail}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.personalemail}
          helperText={formError.personalemail}
        />
      </Grid>

      {/* Phone Number Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          type="number"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.phoneNumber}
          helperText={formError.phoneNumber}
        />
      </Grid>
    </Grid>
  );
};

export default ContactFields;
