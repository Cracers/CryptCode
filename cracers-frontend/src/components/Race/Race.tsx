import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaderBoard from "./LeaderBoard";
import { Typography } from "@mui/material";
import { Race } from "../../types";
import { isRaceActive } from "../../lib/RaceMethods";

type Props = {
  race: Race | null;
  active: boolean;
  ended: boolean;
  setIsRaceActive: (active: boolean) => void;
};

const Race = ({ race, active, ended, setIsRaceActive }: Props) => {
  return (
    <div>
      {race && (
        <LeaderBoard
          race={race}
          isActive={active}
          isEnded={ended}
        />
      )}
      {!race && (
        <Typography
          className="nasa-font"
          variant="h3"
          sx={{ textAlign: "center" }}
        >
          Race loading...
        </Typography>
      )}
    </div>
  );
};

export default Race;
