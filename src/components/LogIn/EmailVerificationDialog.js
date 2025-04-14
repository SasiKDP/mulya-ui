import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import VerifiedIcon from "@mui/icons-material/Verified";
import httpService from "../../Services/httpService";
import { showToast } from "../../utils/ToastNotification";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 2,
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(2),
    },
  },
}));

const StyledOtpInput = styled(TextField)(({ theme }) => ({
  width: "52px",
  margin: theme.spacing(0, 0.5),
  "& .MuiInputBase-root": {
    height: "52px",
  },
  "& input": {
    textAlign: "center",
    fontSize: "1.5rem",
    padding: theme.spacing(1),
    fontWeight: "bold",
    caretColor: theme.palette.primary.main,
  },
}));

const EmailVerificationDialog = ({
  open,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const theme = useTheme();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (open && email) {
      handleSendOtp();
    }
  }, [open, email]);

  useEffect(() => {
    if (timeLeft > 0 && open) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, open]);

  const handleSendOtp = async () => {
    if (!email || email.trim() === "") {
      showToast("Email cannot be empty.", "error");
      return;
    }
  
    setIsSending(true);
    try {
      const response = await httpService.post(`/users/sendOtp?email=${encodeURIComponent(email)}`);
      
      // Check if response exists and has data
      if (!response || !response.data) {
        throw new Error("No response received from server");
      }
  
      // Check success status
      if (response.data.success) {
        setTimeLeft(300);
        showToast(response.data.message || "OTP sent successfully!", "success");
      } else {
        // Handle case where email is already registered
        if (response.data.message && response.data.message.includes("already registered")) {
          showToast(response.data.message, "error");
          onClose(); // Close the dialog if email is already registered
        } else {
          throw new Error(response.data.message || "Failed to send OTP");
        }
      }
    } catch (err) {
      showToast(err.message || "Failed to send OTP. Please try again.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast("Please enter the complete OTP.", "error");
      return;
    }
  
    setIsVerifying(true);
    try {
      const requestBody = {
        email: email,
        otp: otpString
      };
      
      const response = await httpService.post(`/users/verifyOtp`, requestBody);
      
      if (response.data.success) {
        showToast("OTP verified successfully!", "success");
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      showToast(
        err.response?.data?.error?.errorMessage || 
        err.response?.data?.message || 
        "Invalid OTP. Please try again.", 
        "error"
      );
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleClose = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(300);
    onClose();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="600">Verify Your Email</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            We've sent a verification code to:
          </Typography>
          <Typography variant="body1" fontWeight="600" color="primary" sx={{ mt: 0.5 }}>
            {email}
          </Typography>

          <Box sx={{ my: 4, display: "flex", justifyContent: "center", gap: 1 }}>
            {otp.map((digit, index) => (
              <StyledOtpInput
                key={index}
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputProps={{ maxLength: 1 }}
                autoFocus={index === 0}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Time remaining:{" "}
              <Typography component="span" fontWeight="600" color="error" sx={{ ml: 0.5 }}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </Typography>
            </Typography>

            <Button
              variant="outlined"
              onClick={handleSendOtp}
              disabled={timeLeft > 0 || isSending}
              startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <AutorenewIcon />}
              sx={{ minWidth: 120 }}
            >
              {isSending ? "Sending..." : "Resend OTP"}
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, justifyContent: "center", gap: 1 }}>
        <Button variant="outlined" onClick={handleClose} sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleVerifyOtp}
          disabled={otp.join("").length !== 6 || isVerifying}
          startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
          sx={{ minWidth: 100 }}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EmailVerificationDialog;