import {
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Leaderboard as LeaderBoardIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Race, Racer, Price } from "../../types";
import LivePrices from "./LivePrices";
import { isRaceActive, isRaceEnded } from "../../lib/RaceMethods";
import toast from "react-hot-toast";
import {
  getCheckpointScore,
  getFinalCheckoutScore,
  getRacerStats
} from "../../program_sdk/stats";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const getPlacement = (place: number) => {
  if (place === 1) {
    return `${place}st`;
  }
  if (place === 2) {
    return `${place}nd`;
  }
  if (place === 3) {
    return `${place}rd`;
  }

  return `${place}th`;
};

type Props = {
  race: Race;
  isEnded: boolean;
  isActive: boolean;
  prices: Price;
  callback?: (currency: string, price: number) => void;
};

const LeaderTable = ({ race, prices, isEnded, isActive, callback }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<string[]>([]);
  const [racers, setRacers] = useState<Racer[] | []>([]);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<number>(0);

  useEffect(() => {
    const { raceId } = router.query;

    if (isLoading && raceId) {
      axios
        .get(`/api/race/registrations?raceId=${raceId}`)
        .then(({ data }) => {
          setRacers(data.racers);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (racers.length) {
    return (
      <>
        {!isEnded && (
          <>
            <Typography
              className="nasa-font"
              variant="h5"
              component="h5"
              sx={{ textAlign: "center", margin: "0" }}
              gutterBottom
            >
              Total Registered
            </Typography>
            <Typography
              className="nasa-font"
              variant="h5"
              color="primary"
              component="h5"
              sx={{ textAlign: "center", margin: "0" }}
              gutterBottom
            >
              {racers.length}
            </Typography>
            <Divider sx={{ margin: "15px", border: "none" }} />
          </>
        )}

        <LivePrices
          displayPrices={race.account.estimations}
          racers={racers}
          race={race}
          active={isActive}
          hidden={!isActive}
          callback={callback}
        />

        {isEnded ? (
          <>
            <Typography
              className="nasa-font"
              variant="h5"
              component="h5"
              sx={{ textAlign: "center" }}
              gutterBottom
            >
              Race Participants
            </Typography>
          </>
        ) : (
          <Typography
            className="nasa-font"
            variant="h5"
            component="h5"
            sx={{ textAlign: "center" }}
            gutterBottom
          >
            Registered Racers
          </Typography>
        )}

        <TableContainer
          className="leaderboard"
          component={Paper}
          sx={{
            background: "#161c3894",
          }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="Race Leaderboard">
            <TableHead sx={{ backgroundColor: "#3b0259cc" }}>
              <TableRow>
                <StyledTableCell align="center">
                  <LeaderBoardIcon />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography
                    className="nasa-font"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Racer
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography
                    className="nasa-font"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Level
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography
                    className="nasa-font"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Score
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {racers
                .map((racer: Racer) =>
                  getRacerStats(race, racer, prices, currentCheckpoint)
                )
                .slice()
                .sort(getComparator("asc", "score"))
                .map((racer, place) => (
                  <>
                    <StyledTableRow key={racer.name}>
                      <IconButton
                        disableRipple
                        aria-label="expand row"
                        onClick={() => {
                          let openedRacerTabs = open;
                          // Hide racer predictions if race is not active
                          if (!isRaceActive(race) && !isRaceEnded(race)) {
                            toast.error(
                              "Can only view racer predictions once race has begun."
                            );
                            return;
                          }
                          if (open.includes(racer.address)) {
                            openedRacerTabs = openedRacerTabs.filter(
                              (openRacerAddress: string) =>
                                openRacerAddress !== racer.address
                            );
                            setOpen([...openedRacerTabs]);
                            return;
                          }
                          setOpen([...openedRacerTabs, racer.address]);
                        }}
                        sx={{
                          width: "100%",
                          display: "contents",
                          cursor:
                            isRaceActive(race) || isRaceEnded(race)
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        <StyledTableCell scope="row" align="center">
                          <Typography
                            className="nasa-font"
                            variant="h5"
                            sx={{ textAlign: "center" }}
                          >
                            {getPlacement(place + 1)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Typography
                            className="nasa-font"
                            variant="h5"
                            sx={{ textAlign: "center" }}
                          >
                            {racer.name}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Typography
                            className="nasa-font"
                            variant="h5"
                            sx={{ textAlign: "center" }}
                          >
                            {racer.level || "1"}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Typography
                            className="nasa-font"
                            variant="h5"
                            sx={{ textAlign: "center" }}
                          >
                            {racer.score.toFixed(2)}
                          </Typography>
                        </StyledTableCell>
                      </IconButton>
                    </StyledTableRow>
                    <TableRow className="leaderboard-expand">
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={open.includes(racer.address)}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                              <TableBody>
                                <TableRow>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Typography
                                      className="nasa-font"
                                      variant="subtitle1"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {racer.p1EstimationLabel}
                                      {" Prediction"}
                                    </Typography>
                                    <Typography
                                      className="nasa-font"
                                      variant="subtitle1"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {racer.p1Estimation}
                                      {" $"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography
                                      className="nasa-font"
                                      variant="subtitle1"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {racer.p1EstimationLabel}
                                      {" Score"}
                                    </Typography>
                                    <Typography
                                      className="nasa-font"
                                      variant="subtitle1"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {racer.p1Score.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                  {racer.p2Estimation && (
                                    <>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{ borderBottom: "none" }}
                                      >
                                        <Typography
                                          className="nasa-font"
                                          variant="subtitle1"
                                          sx={{ textAlign: "center" }}
                                        >
                                          {racer.p2EstimationLabel}
                                          {" Prediction"}
                                        </Typography>
                                        <Typography
                                          className="nasa-font"
                                          variant="subtitle1"
                                          sx={{ textAlign: "center" }}
                                        >
                                          {racer.p2Estimation}
                                          {" $"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ borderBottom: "none" }}>
                                        <Typography
                                          className="nasa-font"
                                          variant="subtitle1"
                                          sx={{ textAlign: "center" }}
                                        >
                                          {racer.p2EstimationLabel}
                                          {" Score"}
                                        </Typography>
                                        <Typography
                                          className="nasa-font"
                                          variant="subtitle1"
                                          sx={{ textAlign: "center" }}
                                        >
                                          {racer.p2Score.toFixed(2)}
                                        </Typography>
                                      </TableCell>
                                    </>
                                  )}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  return (
    <Typography className="nasa-font" variant="h4" component="h4" gutterBottom>
      No racers have arrived yet
    </Typography>
  );
};

export default LeaderTable;
