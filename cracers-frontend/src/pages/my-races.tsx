import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import RaceList from "../components/RaceList";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Race } from "../types";

const MyRaces = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [races, setRaces] = useState<Race[]>([]);
  const { publicKey } = useWallet();
  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      axios
        .get(`/api/race/races?variant=previous`)
        .then((response) => {
          setRaces(
            response.data.races
            // .filter(
            //   (race: Race) =>
            //     race.account.authority.toString() === publicKey.toString()
            // )
          );
          setLoading(false);
        })
        .catch((e) => {});
    }
  }, [publicKey]);

  console.log("races", races);

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
        <Typography variant="h1">My Races</Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Registered Racers</TableCell>
                <TableCell align="center">Currency</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {races.map((race: Race) => (
                <TableRow
                  key={race.publicKey.toString()}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {race.account.name}
                  </TableCell>
                  <TableCell align="center">
                    {race.account.registeredRacers}
                  </TableCell>
                  <TableCell align="center">
                    {race.account.estimations.toString()}
                  </TableCell>
                  <TableCell align="right">
                    <Link href={`/race/${race.publicKey.toString()}`}>
                      <Button variant="outlined">View Race</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default MyRaces;
