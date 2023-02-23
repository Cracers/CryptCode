import { Grid, Box, IconButton } from "@mui/material";
import React from "react";
import Image from "next/image";
import CButton from "../CButton";
import SolidSvg from "../SolidSvg";
import FooterImage from "../../../public/assets/barra22.png";
import ColorLogo from "../../../public/assets/colorLogo.png";
import TwitterIcon from "../../../public/assets//fontawesome/svgs/brands/twitter.svg";
import InstagramIcon from "../../../public/assets//fontawesome/svgs/brands/instagram.svg";
import BookIcon from "../../../public/assets//fontawesome/svgs/solid/book.svg";
import DiscordIcon from "../../../public/assets//fontawesome/svgs/brands/discord.svg";

type Props = {};

function FooterContent() {
  return (
    <>
      <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
        <Box
          display="flex"
          justifyContent="center"
          sx={{ position: "relative", top: "-10px" }}
        >
          <CButton>WHITEPAPER</CButton>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box display="flex" justifyContent="center">
          <Image src={ColorLogo.src} width={202} height={75} />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box
          display="flex"
          justifyContent="center"
          sx={{ position: "relative", top: "-10px" }}
        >
          <IconButton aria-label="twitter">
            <SolidSvg
              path={InstagramIcon.src}
              width={25}
              height={25}
              color={"white"}
            />
          </IconButton>
          <IconButton aria-label="twitter">
            <SolidSvg
              path={TwitterIcon.src}
              width={25}
              height={25}
              color={"white"}
            />
          </IconButton>
          <IconButton aria-label="twitter">
            <SolidSvg
              path={BookIcon.src}
              width={25}
              height={25}
              color={"white"}
            />
          </IconButton>
          <IconButton aria-label="twitter">
            <SolidSvg
              path={DiscordIcon.src}
              width={25}
              height={25}
              color={"white"}
            />
          </IconButton>
        </Box>
      </Grid>
    </>
  );
}

const MintFooter = (props: Props) => {
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          paddingTop: "25px",
          display: { xs: "none", md: "flex" },
          backgroundImage: `url(${FooterImage.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // backgroundPositionY: "-55px",
          backgroundSize: "100%",
          height: "150px",
        }}
      >
        <FooterContent />
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          paddingTop: "25px",
          display: { xs: "flex", md: "none" },
        }}
      >
        <FooterContent />
      </Grid>
    </>
  );
};

export default MintFooter;
