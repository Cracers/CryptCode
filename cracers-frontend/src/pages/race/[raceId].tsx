import Link from "next/link";
import {
  Backdrop,
  Box,
  Container,
  CircularProgress,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import Race from "../../components/Race";
import RaceList from "../../components/RaceList";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Race as RaceData } from "../../types/index";

import { isRaceActive, isRaceEnded } from "../../lib/RaceMethods";
import Countdown from "../../components/Race/Countdown";
import toast from "react-hot-toast";
import Payout from "../../components/Race/Payout";

const RacePage = () => {
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [race, setRace] = useState<RaceData | null>(null);
  const [raceActive, setIsRaceActive] = useState<boolean>(false);
  const [raceEnded, setIsRaceEnded] = useState<boolean>(false);
  const timezone = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  const [raceStartsDiff, setRaceStartsDiff] = useState<number>(0);

  const [raceEndsDiff, setRaceEndsDiff] = useState<number>(0);

  const days = Math.trunc(raceEndsDiff / 86400000);
  const hours = Math.trunc(raceEndsDiff / 3600000) - days * 24;

  const [intervalId, setIntervalId] = useState<
    NodeJS.Timer | number | string | undefined
  >();

  const startDate = race
    ? new Date(race.account.raceStart).toLocaleDateString()
    : "";
  const startTime = race
    ? new Date(race.account.raceStart).toLocaleTimeString()
    : "";

  const endDate = race
    ? new Date(race.account.raceEnd).toLocaleDateString()
    : "";
  const endTime = race
    ? new Date(race.account.raceEnd).toLocaleTimeString()
    : "";

  useEffect(() => {
    const loadRaceData = async () => {
      const { raceId } = query;
      if (raceId) {
        axios
          .get(`/api/race/races?raceId=${raceId}`)
          .then(({ data }) => {
            if (data.races) {
              setRace(data.races);
              setIsLoading(false);
            } else {
              setRace(null);
              setIsLoading(false);
            }
          })
          .catch((e) => {
            setIsLoading(false);
          });
      }
    };
    loadRaceData();
  }, [query]);

  const updateTime = () => {
    const current = new Date().getTime();
    setRaceEndsDiff(race ? race?.account.raceEnd - current : 0);
    setRaceStartsDiff(race ? current - race?.account.raceEnd : 0);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race]);

  useEffect(() => {
    setIsRaceActive(isRaceActive(race));
    setIsRaceEnded(isRaceEnded(race));

    const interval = setInterval(() => {
      if (!isRaceEnded(race)) {
        setIsRaceActive(isRaceActive(race));
        setIsRaceEnded(isRaceEnded(race));
      }
    }, 950);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race]);

  if (!isLoading && race) {
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
          <div className="header-img-background">
            <Typography
              className="nasa-font header-img-text"
              variant="h3"
              component="h1"
              sx={{ textAlign: "center" }}
              gutterBottom
            >
              {raceActive
                ? "Live Race Stats"
                : raceEnded
                ? "Final Race Results"
                : "Pre Race Stats"}
            </Typography>
          </div>
          <Typography
            className="nasa-font"
            variant="h3"
            component="h3"
            gutterBottom
          >
            {race.account.name}
          </Typography>

          {raceActive ? (
            <Countdown race={race} />
          ) : raceEnded ? (
            <></>
          ) : (
            <>
              <Typography
                className="nasa-font"
                variant="h5"
                component="h5"
                sx={{ textAlign: "center", margin: "0" }}
                gutterBottom
              >
                Starts at
              </Typography>
              <Typography
                className="nasa-font"
                variant="h6"
                component="h6"
                color="primary"
                sx={{ textAlign: "center", margin: "0" }}
                gutterBottom
              >
                {startDate} {startTime} {timezone}
              </Typography>
            </>
          )}

          {!raceEnded && (
            <>
              <Typography
                className="nasa-font"
                variant="h5"
                component="h5"
                sx={{ textAlign: "center", margin: "0" }}
                gutterBottom
              >
                Race Closing Snapshot
              </Typography>
              <Typography
                className="nasa-font"
                variant="h6"
                component="h6"
                color="primary"
                sx={{ textAlign: "center", margin: "0" }}
                gutterBottom
              >
                {endDate} {endTime} {timezone}
              </Typography>
            </>
          )}

          <Race
            race={race}
            active={raceActive}
            ended={raceEnded}
            setIsRaceActive={setIsRaceActive}
          />
        </Box>
      </Container>
    );
  }
  return (
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
            Loading Race...
          </Typography>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default RacePage;
