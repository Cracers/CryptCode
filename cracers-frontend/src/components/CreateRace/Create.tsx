import React, { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Alert,
  Button,
  Checkbox,
  InputAdornment,
  Typography,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { connectToDatabase } from "../../Program/mongo";
import axios from "axios";
import DatetimePicker from "./DatetimePicker";
import Wallet from "../CustomWallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { decodeInstruction } from "../../Program/decode";
import { SendTransactionError, Transaction } from "@solana/web3.js";
import transaction from "@project-serum/anchor/dist/cjs/program/namespace/transaction";
import { callTransaction } from "../../program_sdk/clientMethods";

type Props = {};

type RaceData = {
  name: string;
  cost: number;
  rank: number;
  startDate: number;
  endDate: number;
  checkpoints: number;
  checkpointEstimations: string[];
};

const Create = (props: Props) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [validName, setValidName] = useState<boolean>(true);
  const [validCost, setValidCost] = useState<boolean>(true);
  const [validRank, setValidRank] = useState<boolean>(true);
  const [validCheckpoints, setValidCheckpoints] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now()));

  const [raceData, setRaceData] = useState<RaceData>({
    name: "",
    cost: 0.1,
    rank: 1,
    startDate: new Date(Date.now()).getTime(),
    endDate: new Date(Date.now()).getTime(),
    checkpoints: 1,
    checkpointEstimations: [],
  });

  const validate = () => {
    setValidName(raceData.name !== "");
    setValidCost(raceData.cost > 0);
    setValidRank(raceData.rank > 0);
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let newRaceData: RaceData = raceData;
    switch (event.target.name) {
      case "name":
        newRaceData.name = event.target.value;
        break;
      case "cost":
        newRaceData.cost = parseFloat(event.target.value);
        break;

      case "rank":
        newRaceData.rank = parseInt(event.target.value);
        break;

      case "checkpoints":
        newRaceData.checkpoints = parseInt(event.target.value);
        break;
    }
    setRaceData(newRaceData);
    validate();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newRaceData: RaceData = raceData;

    if (
      !newRaceData.checkpointEstimations.includes(event.target.name) &&
      event.target.checked
    ) {
      newRaceData.checkpointEstimations.push(event.target.name);
    }
    if (
      newRaceData.checkpointEstimations.includes(event.target.name) &&
      !event.target.checked
    ) {
      const index = newRaceData.checkpointEstimations.indexOf(
        event.target.name
      );
      if (index > -1) {
        // only splice array when item is found
        newRaceData.checkpointEstimations.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    setRaceData(newRaceData);
  };

  const handleStartDateChange = (date: Date | null) => {
    let newRaceData: RaceData = raceData;
    if (!date) {
      toast.error("Invalid date");
      return;
    }

    newRaceData.startDate = date.getTime();
    setRaceData(newRaceData);
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    let newRaceData: RaceData = raceData;
    if (!date) {
      toast.error("Invalid date");
      return;
    }

    newRaceData.endDate = date.getTime();
    setRaceData(newRaceData);
    setEndDate(date);
  };

  const handleSubmit = async () => {
    if (!raceData.name) {
      setValidName(false);
      toast.error("Invalid race name");
      return;
    }
    if (raceData.checkpointEstimations.length <= 0) {
      setValidCheckpoints(false);
      toast.error("You must select an estimation currency!");
      return;
    }

    if (raceData.endDate <= raceData.startDate) {
      toast.error("You must select an ending date past the start date");
      return;
    }

    if (wallet.publicKey) {
      try {
        const instructionResponse = await axios.post(`/api/race/create`, {
          address: wallet.publicKey,
          name: raceData.name,
          entryFee: raceData.cost,
          rank: raceData.rank,
          startDate: raceData.startDate,
          endDate: raceData.endDate,
          numberOfCheckpoints: raceData.checkpoints,
          checkpointEstimations: raceData.checkpointEstimations,
        });

        if (instructionResponse.data.instruction) {
          const instruction = decodeInstruction(
            instructionResponse.data.instruction
          );
          const blockhash = await (
            await connection.getLatestBlockhash()
          ).blockhash;
          const transaction = new Transaction();
          transaction.add(instruction);
          transaction.recentBlockhash = blockhash;

          toast.promise(
            callTransaction(wallet, transaction, connection),
            {
              loading: "Creating Race...",
              success: (txn) => {
                router.push("/");
                return <>Race Created!</>;
              },
              error: (err) => {
                console.error(err);
                return (
                  <>There was a problem creating your race {err?.message}</>
                );
              },
            },
            {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            }
          );
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Unexpected error submitting race data");
        // @ts-ignore
        return;
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          error={!validName}
          onBlur={handleOnBlur}
          id="raceName"
          name="name"
          label="Race Name"
          helperText="Enter the name for the race."
          variant="filled"
        />
      </div>

      <div>
        <TextField
          type="number"
          error={!validCost}
          onBlur={handleOnBlur}
          id="raceEntryCost"
          name="cost"
          label="Entry Cost"
          defaultValue={raceData.cost}
          helperText="Enter the entry cost for the race."
          variant="filled"
          InputProps={{
            endAdornment: <InputAdornment position="start">SOL</InputAdornment>,
          }}
        />
      </div>

      <div>
        <TextField
          type="number"
          error={!validRank}
          onBlur={handleOnBlur}
          id="raceRank"
          name="rank"
          label="Rank"
          defaultValue={raceData.rank}
          helperText="Enter the rank for the race."
          variant="filled"
        />
      </div>

      <div>
        <DatetimePicker label="Start Date" onChange={handleStartDateChange} />
      </div>

      <div>
        <DatetimePicker label="End Date" onChange={handleEndDateChange} />
      </div>

      <div>
        <TextField
          type="number"
          error={!validCheckpoints}
          onBlur={handleOnBlur}
          id="raceCheckpoints"
          name="checkpoints"
          label="Number of checkpoints"
          defaultValue={raceData.checkpoints}
          helperText="Enter the number of checkpoints."
          variant="filled"
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,

            endAdornment: (
              <InputAdornment position="start">Checkpoints</InputAdornment>
            ),
          }}
        />
      </div>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <div style={{ padding: " 0 15px" }}>
          <Typography variant="body1">Price Forecasts</Typography>
          <Typography variant="body2" sx={{ display: "inline" }}>
            SOL
          </Typography>
          <Checkbox onChange={handleChange} name="sol" />
          {/* <Typography variant="body2" sx={{ display: "inline" }}>
          ETH
        </Typography>
        <Checkbox onChange={handleChange} name="eth" /> */}
          <Typography variant="body2" sx={{ display: "inline" }}>
            BTC
          </Typography>
          <Checkbox onChange={handleChange} name="btc" />
        </div>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          // disabled={raceData.name === ""}
          variant="contained"
          onClick={handleSubmit}
          sx={{ margin: "15px auto" }}
        >
          Create Race
        </Button>
      </Box>
    </Box>
  );
};

export default Create;
