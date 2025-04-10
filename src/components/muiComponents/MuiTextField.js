import React from "react";
import { TextField } from "@mui/material";

const MuiTextField = function (props) {
  const {
    label,
    value,
    onChange,
    type = "text",
    variant = "outlined",
    size = "medium",
    fullWidth = false,
    ...restProps // Use restProps to gather remaining props
  } = props;

  return React.createElement(TextField, {
    label: label,
    value: value,
    onChange: onChange,
    type: type,
    variant: variant,
    size: size,
    fullWidth: fullWidth,
    ...restProps, // Spread the restProps
  });
};

export default MuiTextField;
