import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActions,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { isRaceActive } from "../../lib/RaceMethods";
import { getRaceDuration } from "../../program_sdk/clientMethods";
import { Race } from "../../types";
import RegisterButton from "./RegisterButton";
import Image from "next/image";
import Countdown from "../Race/Countdown";

type Props = {
  race: Race;
  showEndDate?: boolean;
  siblingCount?: number;
  onRaceChange: (raceAddress: string) => void;
};

type RaceState = "current" | "upcoming" | "previous" | null;

const getRaceState = (race: Race) => {
  const currentTimestamp = new Date().getTime();
  if (race.account.raceEnd < currentTimestamp) {
    return "previous";
  }
  if (race.account.raceStart > currentTimestamp) {
    return "upcoming";
  }
  if (
    race.account.raceStart <= currentTimestamp &&
    race.account.raceEnd >= currentTimestamp
  ) {
    return "current";
  }
  return null;
};

const RaceCard = ({
  race,
  showEndDate = false,
  siblingCount = 1,
  onRaceChange,
}: Props) => {
  const [initialState, setInitialState] = useState<RaceState>(null);
  const [raceState, setRaceState] = useState<RaceState>(null);
  const raceStartDate = new Date(race.account.raceStart);
  const timezone = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  const [raceStartsDiff, setRaceStartsDiff] = useState<number>(0);

  const [raceEndsDiff, setRaceEndsDiff] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<
    NodeJS.Timer | number | string | undefined
  >();

  const updateTime = () => {
    const current = new Date().getTime();
    setRaceEndsDiff(race ? race?.account.raceEnd - current : 0);
    setRaceStartsDiff(race ? current - race?.account.raceEnd : 0);
  };

  useEffect(() => {
    if (!raceState && !initialState) {
      setInitialState(getRaceState(race));
      setRaceState(getRaceState(race));
    }
    const interval = setInterval(() => {
      if (initialState !== getRaceState(race)) {
        setRaceState(getRaceState(race));
      }
    }, 950);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialState && initialState !== raceState) {
      onRaceChange(race.publicKey.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceState]);

  useEffect(() => {
    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race]);

  return (
    <Paper
      className="raceCard"
      sx={{
        border: "1px solid black",
        background: "#0002!important",
        width: `${raceState === "previous" ? "250px" : "230px"}`,
        height: "100%",
      }}
    >
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography
            className="nasa-font"
            variant="h5"
            component="div"
            sx={{
              minHeight: `${siblingCount > 1 ? "70px" : "0"}`,
            }}
          >
            {race.account.name}
          </Typography>

          <Divider sx={{ margin: "7px" }} />

          <Typography className="nasa-font" color="text.secondary">
            {getRaceDuration(race)} Day Race
          </Typography>

          <Divider sx={{ margin: "7px", border: "none" }} />

          {/* Show Closing Snapshot Countdown */}
          {raceState === "current" && (
            <>
              <Countdown race={race} variant="small" />
              <Divider sx={{ margin: "5px", border: "none" }} />
            </>
          )}

          {raceState === "upcoming" && (
            <>
              <Typography className="nasa-font">
                Registration Deadline
              </Typography>
              <Typography
                className="nasa-font"
                variant="body1"
                sx={{ mb: 1.5 }}
              >
                {raceStartDate.toLocaleDateString()}{" "}
                {raceStartDate.toLocaleTimeString()} {timezone}
              </Typography>
              <Divider sx={{ margin: "7px", border: "none" }} />
            </>
          )}

          {showEndDate && (
            <>
              <Typography className="nasa-font" color="text.secondary">
                Closing Date
              </Typography>
              <Typography
                className="nasa-font"
                variant="body1"
                sx={{ mb: 1.5 }}
              >
                {new Date(race.account.raceEnd).toLocaleDateString()}{" "}
                {new Date(race.account.raceEnd).toLocaleTimeString()}
              </Typography>
              <Divider sx={{ margin: "7px", border: "none" }} />
            </>
          )}

          <Typography className="nasa-font" variant="body1">
            Entry Fee:{" "}
            <b style={{ color: "cyan" }}>
              {race.account.entryFee / LAMPORTS_PER_SOL} SOL
            </b>
          </Typography>

          {/* <Typography className="nasa-font" variant="body1" color="primary">
            {race.account.entryFee / LAMPORTS_PER_SOL} SOL
          </Typography> */}
          <Divider sx={{ margin: "7px", border: "none" }} />

          {/* {raceState === "current" && (
            <Typography variant="body1" color="text.secondary">
              {race.account.numberOfCheckpoints}{" "}
              {race.account.numberOfCheckpoints > 1
                ? "Checkpoints"
                : "Checkpoint"}
            </Typography>
          )} */}

          <Box>
            {race.account.estimations.map((checkpointEstimation: string) => (
              <Chip
                className="nasa-font"
                key={checkpointEstimation}
                icon={
                  <Image
                    src={`/assets/crypto/${checkpointEstimation}.png`}
                    alt={checkpointEstimation}
                    height={25}
                    width={25}
                  />
                }
                label={checkpointEstimation.toLocaleUpperCase()}
                sx={{ padding: "5px" }}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <RegisterButton race={race} />
            </Grid>
            <Grid item xs={12}>
              <Link href={`/race/${race.publicKey}`}>
                <Button
                  className="nasa-font"
                  color="primary"
                  variant="text"
                  sx={{
                    fontSize: "1.2rem",
                    margin: "0 auto",
                    width: "100%",
                  }}
                >
                  {raceState === "previous" ? "View Results" : "View Race >"}
                </Button>
              </Link>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Paper>
  );
};

export default RaceCard;
