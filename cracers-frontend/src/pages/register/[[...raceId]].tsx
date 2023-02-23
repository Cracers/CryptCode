import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RaceList from "../../components/RaceList";
import axios from "axios";
import Register from "../../components/Register/Register";
import { Race } from "../../types";
import { useEffect, useState } from "react";
import { Backdrop, Button, CircularProgress, Grid } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import Wallet from "../../components/Wallet";
import CreateAccount from "../../components/Account/CreateAccount";
import { PublicKey } from "@solana/web3.js";
import CloseAccount from "../../components/Account/CloseAccount";

type RacePageProps = {
  raceId: string | null;
};

const loadRaceData = async (raceId: string, callback: Function) => {
  axios
    .get(`/api/race/races?raceId=${raceId}`)
    .then((response) => {
      callback(response.data.races);
    })
    .catch((e) => {
      console.error("Register:: get race error", e);
    });
};

const loadUserData = async (address: PublicKey, callback: Function) => {
  axios
    .get(`/api/race/user?address=${address}`)
    .then((response) => {
      callback(response.data.user);
    })
    .catch((e) => {
      console.error("Register:: get race error", e);
    });
};

const Home = ({ raceId }: RacePageProps) => {
  const { publicKey } = useWallet();
  const [raceData, setRaceData] = useState<Race | null>();

  const [user, setUser] = useState<any | null>();
  const [txn, setTxn] = useState<string | boolean>(false);
  const [loadingAccount, setLoadingAccount] = useState<boolean>(true);
  useEffect(() => {
    if (
      raceId
      // && !raceData
    ) {
      loadRaceData(raceId, (race: Race) => {
        setRaceData(race);
      });
    }

    if (publicKey) {
      loadUserData(publicKey, (racer: any) => {
        setUser(racer);
        setLoadingAccount(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceId, publicKey, txn]);

  if (!publicKey) {
    return (
      <Backdrop
        sx={{ color: "cyan", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!publicKey}
      >
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography className="nasa-font" variant="h4">
              Connection Required
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Wallet variant="outlined">Connect</Wallet>
          </Grid>
        </Grid>
      </Backdrop>
    );
  }

  if (publicKey && loadingAccount) {
    return (
      <Backdrop
        sx={{ color: "cyan", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingAccount}
      >
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="inherit" />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography className="nasa-font" variant="h3">
              Loading Account...
            </Typography>
          </Grid>
        </Grid>
      </Backdrop>
    );
  }

  if (publicKey && !user) {
    return (
      <Backdrop
        sx={{ color: "cyan", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={publicKey && !user}
      >
        {" "}
        <CreateAccount callback={setTxn} />
      </Backdrop>
    );
  }

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
          variant="h3"
          component="h1"
          gutterBottom
        >
          CRacer Registration
        </Typography>

        <>{raceData && <Register raceData={raceData} />}</>
      </Box>
    </Container>
  );
};

export default Home;

export async function getServerSideProps(ctx: any) {
  const { raceId } = ctx.params;

  return {
    props: {
      raceId: raceId || null,
    },
  };
}
