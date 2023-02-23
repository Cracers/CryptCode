import React from "react";
import {
  WalletMultiButton,
  WalletConnectButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-material-ui";
import { Box, styled, Theme } from "@mui/system";
import ButtonImage from "../../../public/assets/Button-Bg.png";
import ButtonImage2 from "../../../public/assets/Button-Bg-2.png";

import "./Wallet.module.css";

const WalletButton = styled(WalletMultiButton)(
  ({ theme, variant }: { theme: Theme; variant: string }) => ({
    fontSize: "0.8rem",
    // fontFamily: "PressStart",
    color: "#00feff",
    background: `url(${variant ? ButtonImage2.src : ButtonImage.src})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    boxShadow: "none!important",
    padding: "10px",
    borderRadius: "5px",
    height: 70,
    width: 260,

    "&:hover, &.Mui-disabled": {
      color: "#00feff",
      textShadow: "0 0 6px cyan",
      backgroundColor: `#fff0!important`,
      boxShadow: "none!important",
      filter: "brightness(1.3)",
    },
    "&.Mui-disabled": {
      filter: "brightness(0.8)",
    },

    img: {
      display: "none",
    },
  })
);

const WalletButtonText = styled("span")(({ theme }: { theme: Theme }) => ({
  fontSize: "1.1rem",
  lineHeight: "1.1rem",
  color: "#000",
  background: "-webkit-linear-gradient(#fff, #f2f2f2)",
  "-webkit-background-clip": "text",
  "-webkit-text-fill-color": "transparent",
  padding: "0 10px",
  borderRadius: "5px",

  "&:hover": {
    background: "-webkit-linear-gradient(#3f0, #002203)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  },
}));

type Props = {
  children?: React.ReactNode;
  custom?: boolean;
  variant?: "contained" | "outlined" | "text";
};

const Wallet = ({ children, custom, variant = "contained" }: Props) => {
  if (custom) {
    return (
      <Box component="span" sx={{ p: 2 }}>
        {/* <WalletButton>{children}</WalletButton> */}
      </Box>
    );
  }

  return (
    <Box component="span" sx={{ p: 2 }}>
      <WalletMultiButton variant={variant}>{children}</WalletMultiButton>
    </Box>
  );
};

export default Wallet;
