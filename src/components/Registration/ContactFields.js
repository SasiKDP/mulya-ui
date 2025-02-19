import React from 'react';
import { Grid, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified'; // Correct import for the verified user icon
import EmailIcon from '@mui/icons-material/Email'; // Correct import for the email icon

const ContactFields = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  formError,
  isEmailVerified,
  onEmailVerificationClick 
}) => {
  return (
    <>
      <Grid item xs={12}>
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
                  <Tooltip title={isEmailVerified ? "Email Verified" : "Verify Email"}>
                    <IconButton
                      onClick={onEmailVerificationClick}
                      color={isEmailVerified ? "success" : "primary"}
                      disabled={!formData.email || !!formError.email}
                    >
                      {isEmailVerified ? <VerifiedIcon /> : <EmailIcon />}
                    </IconButton>
                  </Tooltip>
                ) : (
                  <VerifiedIcon color="success" />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
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
    </>
  );
};

export default ContactFields;
