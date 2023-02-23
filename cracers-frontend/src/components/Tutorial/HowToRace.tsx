import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";

type Props = {};

const HowToRace = (props: Props) => {
  return (
    <Box
      sx={{
        my: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        paddingTop: "1rem",
        // maxWidth: "880px",
      }}
    >
      <Box>
        <Typography variant="h1" color="secondary">
          HOW TO RACE
        </Typography>
        <Typography
          variant="body1"
          // sx={{
          //   maxWidth: "880px",
          // }}
        >
          In order to score points and advance in the race you need to forecast
          future price values and outcomes. The closer your forecast are to the
          actual outcome, the better your Cracer will rank in the race.
        </Typography>
        <Divider sx={{ margin: "35px 0", border: "1px solid #fff" }} />
      </Box>
      {/* Step 1 */}
      <Box sx={{ marginTop: "4rem" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          sx={{ fontWeight: "bold" }}
        >
          <span className="tutorial-index">1</span>
          <div className="tutorial-subheader">
            <p>{`SEARCH FOR YOUR PREFFERED RACE IN "UPCOMING RACES" AND CLICK "REGISTER"`}</p>
          </div>
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginLeft: "65px", maxWidth: "820px" }}
        >
          <b>RACE CLOSING SNAPSHOT:</b>
          {` This is the time when the race will end and the snapshot will be taken to calculate the final race results. Price snapshots are taken from Binance.`}
        </Typography>
        <Image
          src="/assets/HOW_TO_RACE/1.png"
          width={1200}
          height={880}
          alt="Tutorial 1 image"
        />
      </Box>

      {/* Step 2 */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          sx={{ fontWeight: "bold" }}
        >
          <span className="tutorial-index">2</span>
          <div className="tutorial-subheader">
            <p>{`VIEW AND TRACK RACE SCORES AND STANDINGS IN "ACTIVE RACES":`}</p>
          </div>
        </Typography>
        {/* <Typography variant="body1" sx={{ marginLeft: "65px" }}>
    {`This is the time when the race will end and the snapshot will be taken to calculate the final race results. Price snapshots are taken from Binance.`}
  </Typography> */}
        <Image
          src="/assets/HOW_TO_RACE/2.png"
          width={1200}
          height={880}
          alt="Tutorial 1 image"
        />
      </Box>

      {/* Step 3 */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          sx={{ fontWeight: "bold" }}
        >
          <span className="tutorial-index">3</span>
          <div className="tutorial-subheader">
            <p>{`VIEW PAST RACE RESULTS AND LEADERBOARD RANKINGS IN THE "RACE RESULTS" FOR THAT WEEK OR OTHER WEEKS.`}</p>
          </div>
        </Typography>
        {/* <Typography variant="body1" sx={{ marginLeft: "65px" }}>
    {`This is the time when the race will end and the snapshot will be taken to calculate the final race results. Price snapshots are taken from Binance.`}
  </Typography> */}
        <Image
          src="/assets/HOW_TO_RACE/2.png"
          width={1200}
          height={880}
          alt="Tutorial 1 image"
        />
      </Box>
    </Box>
  );
};

export default HowToRace;
