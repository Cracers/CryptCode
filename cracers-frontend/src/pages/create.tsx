import React, { useState } from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Create from "../components/CreateRace";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

const Home: NextPage = () => {
  const { publicKey } = useWallet();
  const [isAdmin, setIsAdmin] = useState(true);
  React.useEffect(() => {
    if (publicKey) {
      axios.get(`/api/authorize?address=${publicKey}`).then((res) => {
        if (res.data.isAdmin) {
          setIsAdmin(true);
        }
      });
    }
  }, [publicKey]);
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          paddingTop: "1rem",
        }}
      >
        <Typography
          className="nasa-font"
          variant="h2"
          component="h1"
          gutterBottom
        >
          Race Creation
        </Typography>
        {!publicKey && (
          <>
            <Typography
              className="nasa-font"
              variant="h5"
              component="h1"
              gutterBottom
            >
              Connect wallet to continue
            </Typography>
          </>
        )}
        {publicKey && !isAdmin && (
          <Typography
            className="nasa-font"
            variant="h4"
            component="h1"
            sx={{ color: "orange" }}
            gutterBottom
          >
            Unauthorized
          </Typography>
        )}
        {publicKey && isAdmin && <Create />}
      </Box>
    </Container>
  );
};

export default Home;
