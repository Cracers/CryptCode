import React from "react";
import { styled, Theme } from "@mui/system";
import { Button } from "@mui/material";
import Bar from "../../../public/assets/Button-Bg-2.png";
type Props = {
  children: React.ReactNode;
  theme?: Theme;
};

const CustomButton = styled(Button)(({ theme }: Props) => ({
  fontSize: "0.8rem",
  fontFamily: "PressStart",
  color: "#fff",
  backgroundColor: "#ffffff00",
  background: `url(${Bar.src})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  padding: "0",
  borderRadius: "5px",
  height: "60px",
  width: "217px",
}));

const CButton = ({ children, ...rest }: Props) => {
  return <CustomButton {...rest}>{children}</CustomButton>;
};

export default CButton;
