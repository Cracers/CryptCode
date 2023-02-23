import { Box, Container, Tabs, Tab, Typography } from "@mui/material";

import { useState } from "react";

import HowToRace from "../components/Tutorial/HowToRace";
import Scoring from "../components/Tutorial/Scoring";
import Rewards from "../components/Tutorial/Rewards";

function a11yProps(index: number) {
  return {
    id: `tutorial-tab-${index}`,
    "aria-controls": `tutorial-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Home = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Container
      maxWidth="lg"
      // sx={{ display: "flex", justifyContent: "center" }}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Tutorial tabs"
          >
            <Tab label="How to race" {...a11yProps(0)} />
            <Tab label="Scoring" {...a11yProps(1)} />
            <Tab label="Ranking & Rewards" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <HowToRace />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Scoring />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Rewards />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Home;
