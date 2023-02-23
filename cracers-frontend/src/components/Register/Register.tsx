import Link from "next/link";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Estimation, Race, Racer } from "../../types";
import styles from "./Register.styles";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { decodeInstruction } from "../../Program/decode";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";
import { getRaceDuration } from "../../program_sdk/clientMethods";
import ExistingRegistration from "./ExistingRegistration";
import NewRegistrationData from "./NewRegistrationData";
import { callTransaction } from "../../program_sdk/clientMethods";
import { isRaceActive } from "../../lib/RaceMethods";
import ConfirmationDialog from "./ConfirmationDialog";

type Props = {
  raceData: Race;
};

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const getFillData = (numberOfCheckpoints: number) => {
  let array = [];
  for (let i = 0; i < numberOfCheckpoints; i++) {
    array.push(0);
  }
  return array;
};

const RegisterContainer = styled(Box)(styles);

const Register = ({ raceData }: Props) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [txn, setTxn] = React.useState("");
  const [racerEstimations, setRacerEstimations] = useState<number[][]>(
    Array(raceData.account.numberOfCheckpoints).fill(
      getFillData(raceData.account.estimations.length)
    )
  );
  const [existingRacerData, setExistingRacerData] = useState<Racer | null>();
  const timezone = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  const registrationOpen = !isRaceActive(raceData);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRegistration = async () => {
    if (wallet.publicKey) {
      const response = await axios.delete(
        `/api/race/register?raceId=${
          raceData.publicKey
        }&address=${wallet.publicKey.toString()}`
      );

      if (response.data) {
        if (response.data.instruction) {
          const transaction = new Transaction();
          transaction.add(decodeInstruction(response.data.instruction));
          toast.promise(
            callTransaction(wallet, transaction, connection, setTxn),
            {
              loading: "Closing Registration...",
              success: (txn) => {
                let clusterQuery = "?cluster=devnet";
                if (
                  process.env.NEXT_PUBLIC_SOLANA_NETWORK &&
                  process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
                ) {
                  clusterQuery = "";
                }
                return (
                  <b>
                    Registration Closed!
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
              error: <b>Could not register for race.</b>,
            }
          );
        }
      }
    }
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const estNameArr = event.target.name.split("-");
    const currentEstimations = racerEstimations;
    const newArrayElement = [...currentEstimations[parseInt(estNameArr[1])]];

    newArrayElement[raceData.account.estimations.indexOf(estNameArr[0])] =
      parseFloat(event.target.value) * 100;
    currentEstimations[parseInt(estNameArr[1])] = newArrayElement;

    setRacerEstimations([...currentEstimations]);
  };

  useEffect(() => {
    const loadRegistrationForUser = async () => {
      if (wallet.publicKey) {
        axios
          .get(
            `/api/race/registrations?raceId=${raceData.publicKey}&address=${wallet.publicKey}`
          )
          .then(({ data }) => {
            setExistingRacerData(data.racers);
            setIsLoading(false);
          })
          .catch((e) => {
            setIsLoading(false);
          });
      }
    };
    loadRegistrationForUser();
  }, [wallet.publicKey, txn, raceData.publicKey]);

  return (
    <RegisterContainer
      sx={{
        maxWidth: "660px",
        backgroundColor: "#0006",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0}
      >
        <Grid item xs={12}>
          <Typography
            variant="h4"
            className="nasa-font"
            sx={{ textAlign: "center", margin: "0 0 1.5rem 0" }}
          >
            {raceData.account.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0}
          >
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "0 0 0 0" }}
              >
                Entry Cost:
              </Typography>
              <Typography
                variant="h6"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "0 0 0 0" }}
              >
                <b style={{ color: "#00FFF8", fontSize: "1.5rem" }}>
                  {raceData.account.entryFee / LAMPORTS_PER_SOL}
                </b>{" "}
                SOl
              </Typography>
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "0 0 0 0" }}
              >
                Checkpoints:{" "}
                <b style={{ color: "#00FFF8", fontSize: "1.5rem" }}>
                  {raceData.account.numberOfCheckpoints}
                </b>
              </Typography>
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "0 0 0 0" }}
              >
                Duration:
              </Typography>

              <Typography
                variant="h6"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "0 0 0 0" }}
              >
                <b style={{ color: "#00FFF8", fontSize: "1.5rem" }}>
                  {getRaceDuration(raceData)}
                </b>{" "}
                Day(s)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "1rem 0 1rem 0" }}
              >
                Registration Deadline
              </Typography>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{
                  textAlign: "center",
                  margin: "1rem 0 1rem 0",
                  color: "#00FFF8",
                }}
              >
                {new Date(raceData.account.raceStart).toLocaleString()}{" "}
                {timezone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "1rem 0 1rem 0" }}
              >
                Race Closing Snapshot
              </Typography>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{
                  textAlign: "center",
                  margin: "1rem 0 1rem 0",
                  color: "#00FFF8",
                }}
              >
                {new Date(raceData.account.raceEnd).toLocaleString()} {timezone}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography
                variant="h5"
                className="nasa-font"
                sx={{ textAlign: "center", margin: "1rem 0 1rem 0" }}
              >
                Price Forecasts
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Registration form display */}
        {existingRacerData ? (
          <ExistingRegistration
            registrationOpen={registrationOpen}
            existingRacerData={existingRacerData}
            raceData={raceData}
          />
        ) : (
          <NewRegistrationData
            registrationOpen={registrationOpen}
            raceData={raceData}
            onBlur={handleOnBlur}
          />
        )}

        <Grid item xs={12}>
          {existingRacerData ? (
            <>
              <Typography
                variant="h6"
                className="nasa-font"
                color="secondary"
                sx={{ marginTop: "1.2rem", textAlign: "center" }}
              >
                You&apos;re already registered
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Link href={`/race/${raceData.publicKey}`}>
                  <Button
                    className="nasa-font"
                    variant="outlined"
                    sx={{
                      fontSize: "1.3rem",
                      width: "100%",
                      maxWidth: "220px",
                      margin: "25px auto 45px",
                    }}
                  >
                    View Race
                  </Button>
                </Link>

                {/* <Button
                  className="nasa-font"
                  variant="outlined"
                  color="error"
                  onClick={handleCloseRegistration}
                  sx={{
                    fontSize: "1.3rem",
                    width: "100%",
                    maxWidth: "220px",
                    padding: "0",
                    margin: "25px auto 45px",
                  }}
                >
                  Close Registration
                </Button> */}
              </Box>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="nasa-font"
                variant="outlined"
                sx={{
                  fontSize: "1.3rem",
                  width: "100%",
                  maxWidth: "220px",
                  margin: "25px 0 45px",
                }}
                onClick={handleClickOpen}
                disabled={!registrationOpen}
              >
                Register
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <ConfirmationDialog
        raceData={raceData}
        racerEstimations={racerEstimations}
        setTxn={setTxn}
        open={open}
        setOpen={setOpen}
      />

      <Backdrop
        sx={{ color: "cyan", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="inherit" />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography className="nasa-font" variant="h3">
              Loading...
            </Typography>
          </Grid>
        </Grid>
      </Backdrop>
    </RegisterContainer>
  );
};

export default Register;
