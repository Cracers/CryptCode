import { Typography } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  price: number;
  color?: "primary" | "success" | "error";
};
const getFormattedPrice = (price: number) => price.toFixed(2);

const Price = ({ label, price, color = "primary" }: Props) => {
  let colorHEX = "#FFF";

  if (color === "success") {
    colorHEX = "green";
  }
  if (color === "error") {
    colorHEX = "red";
  }

  return (
    <Typography
      className="nasa-font"
      variant="h6"
      component="h6"
      gutterBottom
      sx={{ color: colorHEX }}
    >
      {label}
      <b style={{ color: "cyan", letterSpacing: "3px" }}>
        {" $"}
        {getFormattedPrice(price)}
      </b>
    </Typography>
  );
};

export default Price;
