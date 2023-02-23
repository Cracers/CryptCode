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

const CloseAccount = ({ callback }: Props) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const closeAccount = () => {
    axios
      .delete(`/api/race/user?address=${wallet.publicKey}`)
      .then(async (res) => {
        const instruction = decodeInstruction(res.data.instruction);
        const blockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.add(instruction);
        transaction.recentBlockhash = blockhash.blockhash;

        toast.promise(
          callTransaction(wallet, transaction, connection, callback),
          {
            loading: "Closing Account...",
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
                  Account Closed!
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
                  There was a problem closing your account.
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
          variant="h6"
          component="p"
          gutterBottom
        >
          Close Account
        </Typography>

        <Button variant="contained" onClick={closeAccount}>
          Close Account
        </Button>
      </Box>
    </Container>
  );
};

export default CloseAccount;
