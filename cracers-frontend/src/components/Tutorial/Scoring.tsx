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
        <Typography variant="h1" color="secondary">
          How does our scoring system work?
        </Typography>

        <Divider sx={{ margin: "35px 0", border: "1px solid #fff" }} />

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          The following formula will be used to calculate the pilots score per
          forecast:
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          sx={{
            fontWeight: "bold",
          }}
        >
          [I(forecasted price - real price) / real price) * 1000I]
        </Typography>
        <Typography variant="body1">
          The final race score will reflect the mean of the forecasted scores.
        </Typography>
      </Box>

      <Box sx={{ marginTop: "4rem" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          What does the race score show?
        </Typography>
        <Typography variant="body1">
          Race scores show the percentage of deviation when it comes to the
          input forecast compared to the real price (race closing snapshot). The
          lower your race score, the better!
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginTop: "4rem",
        }}
      >
        Take a look at these examples:
      </Typography>

      {/* Step 1 */}
      <Box sx={{ marginTop: "1.3rem" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          sx={{ fontWeight: "bold" }}
        >
          <span className="tutorial-index">1</span>
          <div className="tutorial-subheader">
            <p>{`bitcoin & solana`}</p>
          </div>
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  <Typography variant="h6">Racing for</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Forecasted price</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Real price</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Scoring formula</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Percent deviation</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Forecast score</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    $BTC
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    $20,000
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    $22,000
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    [I(20,000 - 22,000 / 22,000) * 1000I]
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    9.091%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    90.91
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    $SOL
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    $30.00
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    $28.00
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    [I(30 - 28 / 28) * 1000I]
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    9.091%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    90.91
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          FINAL RACE SCORE = 81.17
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          (calculated with the forecast score mean (90.91 + 71.43)/2))
        </Typography>
      </Box>

      {/* Step 2 */}
      <Box sx={{ marginTop: "3.5rem" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          sx={{ fontWeight: "bold" }}
        >
          <span className="tutorial-index">2</span>
          <div className="tutorial-subheader">
            <p>{`bitcoin only`}</p>
          </div>
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  <Typography variant="h6">Racing for</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Forecasted price</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Real price</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Scoring formula</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Percent deviation</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="h6">Forecast score</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                  <Typography variant="h6" component="p">
                    $BTC
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    $20,000
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    $22,000
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    [I(20,000 - 22,000 / 22,000) * 1000I]
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    9.091%
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <Typography variant="h6" component="p">
                    90.91
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
