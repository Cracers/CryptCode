import React, { useEffect } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import {
  Grid,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Stack,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Badge,
  Chip,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme";
import axios from "axios";
import Link from "next/link";
import { Race } from "../../types";
import { isRaceActive } from "../../lib/RaceMethods";

import { getRaceDuration } from "../../program_sdk/clientMethods";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Loader from "../Loader";
import RegisterButton from "./RegisterButton";
import RaceCard from "./RaceCard";

type Props = {
  variant?: "active" | "upcoming" | "previous";
};

const RaceList = ({ variant = "active" }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [races, setRaces] = React.useState<Race[] | []>([]);
  const [raceChange, setRaceChange] = React.useState<
    string | null | undefined
  >();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/race/races?variant=${variant}`)
      .then((response) => {
        setRaces(response.data.races);
        setLoading(false);
      })
      .catch((e) => {});
  }, [variant, raceChange]);

  return (
    <>
      <div className={`nasa-font ${!smallScreen && `header-img-background`}`}>
        <Typography
          className={`nasa-font ${!smallScreen && `header-img-text`}`}
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          {variant === "previous" ? (
            <>Race Results</>
          ) : (
            <>{`${variant.toUpperCase()} Races`}</>
          )}
        </Typography>
      </div>

      {loading ? (
        <Loader variant="spinner" />
      ) : (
        <Grid sx={{ flexGrow: 1, marginTop: "3rem" }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={4} rowSpacing={4}>
              {races.length <= 0 && (
                <Grid item xs={12}>
                  <Typography variant="h4" className="nasa-font">
                    There are currently no races available
                  </Typography>
                </Grid>
              )}
              {races.map((race: Race) => (
                <Grid key={race.account.name} item>
                  <RaceCard
                    race={race}
                    siblingCount={races.length}
                    onRaceChange={setRaceChange}
                    showEndDate={variant === "previous"}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default RaceList;
