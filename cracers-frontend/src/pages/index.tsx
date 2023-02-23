import { Box, Container, CircularProgress, Tabs, Tab } from "@mui/material";
import Race from "../components/Race";
import RaceList from "../components/RaceList";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Race as RaceData } from "../types/index";
import Loader from "../components/Loader";
import { useWallet } from "@solana/wallet-adapter-react";
const Home = () => {
  const { query } = useRouter();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [value, setValue] = useState<"active" | "upcoming" | "previous">(
    "active"
  );

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: "active" | "upcoming" | "previous"
  ) => {
    setValue(newValue);
    setIsLoading(true);
  };

  function a11yProps(variant: string) {
    return {
      id: `race-tab-${variant}`,
      "aria-controls": `race-tabpanel-${variant}`,
    };
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Race Tabs">
          <Tab label="Active Races" value="active" {...a11yProps(value)} />
          <Tab label="Upcoming Races" value="upcoming" {...a11yProps(value)} />
          <Tab label="Race Results" value="previous" {...a11yProps(value)} />
        </Tabs>
      </Box>

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
        <RaceList variant={value} />
      </Box>
    </Container>
  );
};

export default Home;
