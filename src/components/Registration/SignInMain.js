import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../../redux/features/authSlice";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Link,
  Card,
  Grid,
  TextField,
  Divider,
  Paper,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff, Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const SignInMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = credentials;
    
    dispatch(loginAsync({ email, password }))
      .then((action) => {
        const roles = action.payload.roles;
        console.log("User Roles:", roles);
        if (roles && roles.length) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("Login failed:", error);
      });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleCreateAccount = () => {
    navigate("/register");
  };

  return (
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f7fa"
      }}
    >
      <Card
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2A4DBD",
              mb: 1
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            Sign in to continue to your account
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            {error}
          </Alert>
        )}

        {isAuthenticated && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 1 
            }}
          >
            Login successful!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            placeholder="yourname@dataqinc.com"
            value={credentials.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
            variant="outlined"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                '&:hover fieldset': {
                  borderColor: '#2A4DBD',
                },
              }
            }}
          />

          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={credentials.password}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                '&:hover fieldset': {
                  borderColor: '#2A4DBD',
                },
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={handleForgotPassword}
              sx={{ 
                fontWeight: 500,
                textDecoration: "none",
                color: "#2A4DBD",
                '&:hover': {
                  textDecoration: "underline"
                }
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={status === "loading"}
            sx={{
              py: 1.5,
              mb: 3,
              backgroundColor: "#2A4DBD",
              fontWeight: 600,
              borderRadius: 1.5,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(42, 77, 189, 0.2)",
              '&:hover': {
                backgroundColor: "#1a3aa8",
                boxShadow: "0 6px 16px rgba(42, 77, 189, 0.3)",
              }
            }}
          >
            {status === "loading" ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              variant="outlined"
              onClick={handleCreateAccount}
              sx={{
                py: 1.5,
                px: 4,
                borderColor: "#2A4DBD",
                color: "#2A4DBD",
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
                '&:hover': {
                  borderColor: "#1a3aa8",
                  backgroundColor: "rgba(42, 77, 189, 0.04)"
                }
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Card>
      <ToastContainer />
    </Box>
  );
};

export default SignInMain;