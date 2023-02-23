import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, Theme } from "@mui/system";

import Image from "next/image";
import React from "react";
import HeaderLogo from "../../../public/assets/whiteLogo-768x177.png";
import DividerLogo from "../../../public/assets/Title-Bg.png";
import CollectionImage from "../../../public/assets/gen1-collection.gif";

import Wallet from "../Wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import SolidSvg from "../SolidSvg";
import CButton from "../CButton";
import MintFooter from "./MintFooter";
const MintText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontFamily: "PressStart",
}));

type Props = {};

const SUPPLY = "5555";
const MINT_PRICE = "1 SOL";

const MintContainer = (props: Props) => {
  const { publicKey } = useWallet();

  return (
    <Grid
      container
      sx={{ paddingTop: "25px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* HEADER */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <Image src={HeaderLogo.src} width={420} height={96.8} />
        </Box>
      </Grid>
      {/* User Address */}
      <Grid item xs={12} sx={{ paddingTop: "25px" }}>
        <Box display="flex" justifyContent="center">
          <Image src={DividerLogo.src} width={420} height={125} />
        </Box>
      </Grid>
      {/* Collection info */}
      <Grid item xs={12} sx={{ paddingTop: "25px" }}>
        <Box display="flex" justifyContent="center">
          <MintText variant="body2"> Max Supply </MintText>
        </Box>
        <Box display="flex" justifyContent="center">
          <MintText variant="body2"> {SUPPLY} </MintText>
        </Box>
      </Grid>
      {/* Collection Image */}
      <Grid item xs={12} sx={{ paddingTop: "25px" }}>
        <Box display="flex" justifyContent="center" sx={{ marginTop: "15px" }}>
          <Image src={CollectionImage.src} width={320.23} height={384} />
        </Box>
      </Grid>
      {/* Mint info */}
      <Grid item xs={12} sx={{ paddingTop: "25px" }}>
        <Box display="flex" justifyContent="center">
          <MintText variant="body2"> Mint For </MintText>
        </Box>
        <Box display="flex" justifyContent="center">
          <MintText variant="body2"> {MINT_PRICE} </MintText>
        </Box>
      </Grid>
      {/* Wallet/Mint Button*/}
      <Grid item xs={12} sx={{ paddingTop: "25px" }}>
        <Box display="flex" justifyContent="center">
          <Wallet custom />
        </Box>
      </Grid>
      {/* Footer */}
      <Grid
        item
        xs={12}
        sx={{
          paddingTop: "17px",
        }}
      >
        <MintFooter />
      </Grid>
    </Grid>
  );
};

export default MintContainer;
