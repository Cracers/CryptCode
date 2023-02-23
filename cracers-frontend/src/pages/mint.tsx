import * as React from "react";
import type { NextPage } from "next";
import "../styles/Mint.module.css";
import MintContainer from "../components/Mint";
import { Container } from "@mui/material";

import BackgroundUrl from "../../public/assets/Section-Bg2.png";

const Mint: NextPage = () => {
  return (
    <Container
      className="mint-page"
      maxWidth={false}
      sx={{
        background: `url(${BackgroundUrl.src}) no-repeat center center fixed`,
        "-webkit-background-size": "cover",
        "-moz-background-size": "cover",
        "-o-background-size": "cover",
        backgroundSize: "cover",
        height: "100%",

        minWidth: "482px",
      }}
    >
      <MintContainer />
    </Container>
  );
};

export default Mint;
