import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Typography,
  Button,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Race } from "../../types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

import toast from "react-hot-toast";
import { decodeInstruction } from "../../Program/decode";
import { callTransaction } from "../../program_sdk/clientMethods";
import { Transaction } from "@solana/web3.js";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            background: "#000",
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type Props = {
  raceData: Race;
  racerEstimations: number[][];
  open: boolean;
  setOpen: (open: boolean) => void;
  setTxn: (txn: string) => void;
};

const ConfirmationDialog = ({
  raceData,
  racerEstimations,
  open,
  setOpen,
  setTxn,
}: Props) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayAndRegister = async () => {
    handleClose();

    const raceDataString = JSON.stringify(racerEstimations);

    if (wallet.publicKey) {
      const response = await axios.post(`/api/race/register`, {
        raceId: raceData.publicKey,
        address: wallet.publicKey.toString(),
        raceData: raceDataString,
      });

      if (response.data) {
        if (response.data.instruction) {
          const transaction = new Transaction();
          transaction.add(decodeInstruction(response.data.instruction));
          toast.promise(
            callTransaction(wallet, transaction, connection, setTxn),
            {
              loading: "Registering...",
              success: (txn) => {
                let clusterQuery = "?cluster=devnet";
                if (
                  process.env.NEXT_PUBLIC_SOLANA_NETWORK &&
                  process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
                ) {
                  clusterQuery = "";
                }
                return (
                  <>
                    <Typography>Registration Created!</Typography>

                    <a
                      href={`https://solscan.io/tx/${txn}${clusterQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "teal" }}
                    >
                      <Button>View TXN</Button>
                    </a>
                  </>
                );
              },
              error: (err) => {
                if (err?.message && err.message.includes("0x1")) {
                  return <>Insufficient funds for race entry</>;
                }
                return <>Could not register for race.</>;
              },
            }
          );
        }
      }
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Typography variant="h4" className="nasa-font">
          {raceData.account.name} Registration
        </Typography>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          You are about to lock in your estimations, once locked they cannot be
          changed! <b>Please review carefully before continuing.</b>
        </Typography>
        <Typography gutterBottom>
          <i style={{ fontSize: "0.8rem" }}>
            CRACERS will not be able to change this data if you make a mistake.
          </i>
        </Typography>
        <Typography
          gutterBottom
          sx={{
            marginTop: "15px",
            borderBottom: "1px solid #00ffff1a",
          }}
        >
          Your current estimations:
        </Typography>
        <>
          {racerEstimations.map(
            (checkpoint: number[], checkpointIndex: number) => {
              return (
                <Typography
                  key={checkpointIndex}
                  gutterBottom
                  sx={{
                    borderBottom: "1px solid #00ffff1a",
                  }}
                >
                  <b>Checkpoint</b>{" "}
                  <b style={{ color: "cyan" }}>{checkpointIndex + 1}</b>{" "}
                  {checkpoint.map((entry: number, index: number) => {
                    return (
                      <b
                        key={entry}
                        style={{ padding: "10px", display: "inline-block" }}
                      >
                        <b>
                          {raceData.account.estimations[index] &&
                            raceData.account.estimations[index].toUpperCase()}
                        </b>{" "}
                        <b style={{ color: "cyan" }}>{entry / 100}</b>
                        {"$ "}
                      </b>
                    );
                  })}
                </Typography>
              );
            }
          )}
        </>
        <Typography gutterBottom>
          If all your estimations look correct click <b>Pay & Register</b> to
          enter into the race. Good Luck Cracer!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={handlePayAndRegister}>
          Pay & Register
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ConfirmationDialog;
