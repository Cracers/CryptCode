import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import { Box, Divider, Typography } from "@mui/material";
type Props = {};

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

const Scoring = (props: Props) => {
  return (
    <Box
      sx={{
        my: 4,
        margin: 0,
        paddingTop: "1rem",
        // maxWidth: "880px",
      }}
    >
      <Box>
        <Typography variant="h1" color="secondary" sx={{}}>
          Rankings and Rewards
        </Typography>
        <Divider sx={{ margin: "35px 0", border: "1px solid #fff" }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          Each pilot will be rewared based on the TIER in which their final
          median score falls into. Each TIER percentage reward will be divided
          equally amongst the total pilot scores that fall in that TIER.
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  <Typography variant="h6">TIER</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">SCORE</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Reward Pool %</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">
                    Forecasted deviation from real price
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    1
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    0 - 30
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    33%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    {`<=3%`}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    2
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    31 - 75
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    24%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    {`<7.5%`}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    3
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    76 - 120
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    18%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    {`<12%`}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    4
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    121 - 150
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    13%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    {`<15%`}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          marginTop: "3.5rem",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          Race keepers will distribute the following quantities for each race
          track:
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  <Typography variant="h6">%</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Where?</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Distribution</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    5%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    Planetary Race Development Vault
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    The total pooled entry amount will go towards the community
                    project&apos;s wallet. The earnings on this wallet will
                    serve for project development, marketing, promotional,
                    operational and giveaway related costs/expenses.
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    7%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    Race Champion
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    The total accumlated entry fee will be destined to the top
                    final score of the race. Race Champion also earns all other
                    rewards applicable. In case of a tie; the race champion
                    prize will be distributed equally amongst the top racers.
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          marginTop: "3.5rem",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          What is tier reward rotation?
        </Typography>
        <Typography variant="body1">
          {`If for the week NO scores fall into one or more TIERS, the "dead" TIER rewards will be
          distributed equally over each of the active TIERS.`}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            marginTop: "3.5rem",
            fontWeight: "bold",
          }}
        >
          Let&apos;s put it into perspective:
        </Typography>
        <Typography variant="body1">
          {`There is a week in which there are no scores that fall in TIER 1 (0-30).
          The 33% rewards from TIER 1 would be distributed in the following way: 33% / 3 (number of active remaining TIERS)
          = 11% more rewards from the pool to each active TIER pool`}
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  <Typography variant="h6">TIER</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">SCORE</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">REWARD POOL %</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    2
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    31 - 75
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    35%
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    3
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    76 - 120
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    29%
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    4
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    121 - 150
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6" component="p">
                    24%
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Scoring;
