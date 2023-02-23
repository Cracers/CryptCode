import { Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
// Mock Data
import data from "./mocks/LeaderBoardData";
import { useRouter } from "next/router";
import LeaderTable from "./LeaderTable";
import { getEstimationCurrencyDecimals } from "../../program_sdk/clientMethods";
import { Estimation, Race } from "../../types";
import LivePrices from "./LivePrices";
import { useState } from "react";
import Payout from "./Payout";

type Props = {
  race: Race;
  isActive: boolean;
  isEnded: boolean;
};

type Racer = {
  name: string;
  price1Predictions: number[];
  price2Predictions: number[];
};

const LeaderBoard = ({ race, isActive, isEnded }: Props) => {
  const [solPrice, setSolPrice] = useState<number>(0);
  const [btcPrice, setBtcPrice] = useState<number>(0);

  return (
    <div>
      <Payout race={race} prices={{ sol: solPrice, btc: btcPrice }} />
      <LeaderTable
        race={race}
        isEnded={isEnded}
        isActive={isActive}
        prices={{ sol: solPrice, btc: btcPrice }}
        callback={(currency: string, price: number) => {
          currency === "sol" && setSolPrice(price);
          currency === "btc" && setBtcPrice(price);
        }}
      />
    </div>
  );
};

export default LeaderBoard;
