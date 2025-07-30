import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import logo from "../../assets/Mulyafinalnew-Copy.svg";

const LoginLeft = () => {
  const theme = useTheme();

  return (
    <Grid container style={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={12}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(246, 245, 245, 0.8)",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <Box sx={{ mb: 2, maxWidth: "80%", width: "auto" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              width: "80%",
            }}
          />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, fontWeight: 500 }}
        >
          Powered by Adroit Innovative Solutions
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LoginLeft;
