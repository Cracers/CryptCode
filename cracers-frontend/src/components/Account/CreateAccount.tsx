import { Container, Box, Typography, Button, TextField } from "@mui/material";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { decodeInstruction } from "../../Program/decode";
import { callTransaction } from "../../program_sdk/clientMethods";

type Props = {
  callback?: (e: any) => void;
};

const CreateAccount = ({ callback }: Props) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [username, setUsername] = useState("");

  const createAccount = () => {
    axios
      .post(`/api/race/user`, {
        address: wallet.publicKey,
        name: username,
      })
      .then(async (res) => {
        const instruction = decodeInstruction(res.data.instruction);
        const blockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.add(instruction);
        transaction.recentBlockhash = blockhash.blockhash;

        toast.promise(
          callTransaction(wallet, transaction, connection, callback),
          {
            loading: "Creating Account...",
            success: (txn: string) => {
              let clusterQuery = "?cluster=devnet";
              if (
                process.env.NEXT_PUBLIC_SOLANA_NETWORK &&
                process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
              ) {
                clusterQuery = "";
              }
              return (
                <b>
                  Account Created!
                  <br />
                  <a
                    href={`https://solscan.io/tx/${txn}${clusterQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "teal" }}
                  >
                    View TXN
                  </a>
                </b>
              );
            },
            error: (error: any) => {
              return (
                <b>
                  There was a problem creating your account.
                  <br />
                  Please try again later.
                  <br />
                  {error?.message}
                </b>
              );
            },
          },
          {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
      })
      .catch((err) => {
        toast.error(`Solana Transaction Error: ${err}`);
      });
  };

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
          Create an account
        </Typography>

        {/* <Box sx={{ margin: "20px 0" }}> */}
        {/* <Typography variant="h5" component="p">
            It appears you do not have an account with CRacers
          </Typography>
          <Typography variant="h6" component="p">
            Your account will be used when entering a race. <br />
            It also contains your racer level, and username.
          </Typography> */}

        {/* </Box> */}
        <Box sx={{ margin: "20px 0" }}>
          <TextField
            id="username"
            label="Enter a username"
            variant="outlined"
            onChange={(e: any) => {
              setUsername(e.target.value);
            }}
          />
        </Box>

        <Button
          disabled={!username}
          variant="contained"
          onClick={createAccount}
        >
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default CreateAccount;
