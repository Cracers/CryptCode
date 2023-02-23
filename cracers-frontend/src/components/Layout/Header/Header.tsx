import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.styles";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Breadcrumbs,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useWallet } from "@solana/wallet-adapter-react";
import Wallet from "../../Wallet";
import { useRouter } from "next/router";
import axios from "axios";
import { Race as RaceData } from "../../../types/index";
import AccountMenu from "./AccountMenu";
const AppHeader = styled(AppBar)(styles);

const pages = [
  {
    title: "Tutorial",
    url: "/tutorial",
  },
  {
    title: "Host Race",
    url: "/create",
  },
  {
    title: "My Races",
    url: "/my-races",
  },
];

type Props = {};

const Header = (props: Props) => {
  const { publicKey, wallet, disconnect } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.", event);
  }

  return (
    <AppHeader className="Header" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" passHref>
            <Image
              src="/assets/whiteLogo-768x177.png"
              width={206}
              height={46.74}
              alt="Cracers Logo"
            />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}></Box>
          <Box
            className="wallet-connect"
            sx={{
              display: { xs: "flex", md: "none" },
              color: "white",

              alignItems: "center",
              justifyContent: "center",
              "& button": {
                textShadow: " 0 0 25px #AAFBFB, 0 0 5px #AAFBFB",
                "&:hover": {
                  background: "-webkit-linear-gradient(#AAFBFB, #AAFBFB)",
                  "-webkit-background-clip": "text",
                  "-webkit-text-fill-color": "transparent",
                },
                background: "-webkit-linear-gradient(#fff, #f2f2f2)",
                "-webkit-background-clip": "text",
                "-webkit-text-fill-color": "transparent",
              },
            }}
          >
            <Wallet />
          </Box>
          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
            }}
            size="large"
            aria-label="mobile menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page) => (
              <Link key={page.url} href={page.url} passHref>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              </Link>
            ))}
          </Menu>

          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "flex-end",
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Link key={page.url} href={`${page.url}`} passHref>
                <Button
                  className="largeText"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.title}
                </Button>
              </Link>
            ))}
            {/* <Button
              className="largeText"
              href="https://twitter.com/CracersNft"
              sx={{
                my: 2,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TwitterIcon />
            </Button> */}
            <Box
              className="wallet-connect"
              sx={{
                display: { xs: "none", md: "flex" },
                color: "white",

                alignItems: "center",
                justifyContent: "center",
                "& button": {
                  textShadow: " 0 0 25px #AAFBFB, 0 0 5px #AAFBFB",
                  "&:hover": {
                    background: "-webkit-linear-gradient(#AAFBFB, #AAFBFB)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                  },
                  background: "-webkit-linear-gradient(#fff, #f2f2f2)",
                  "-webkit-background-clip": "text",
                  "-webkit-text-fill-color": "transparent",
                },
              }}
            >
              <Wallet />
            </Box>
          </Box>
        </Toolbar>
        {/* <Toolbar disableGutters>
          <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
              {getBreadcrumbs().map(
                (path: { uri: string; icon: ReactNode }) => (
                  <Link
                    key={path.uri}
                    style={{ display: "flex", alignItems: "center" }}
                    href="/"
                  >
                    <>
                      {path.icon}
                      {path.uri}
                    </>
                  </Link>
                )
              )}
            </Breadcrumbs>
          </div>
        </Toolbar> */}
      </Container>
    </AppHeader>
  );
};

export default Header;
