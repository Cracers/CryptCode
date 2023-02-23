import { connectToDatabase } from "../../../Program/mongo";
import * as anchor from "@project-serum/anchor";
import { getProgram, getRacePDA } from "../../../program_sdk/methods";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
let vault: any;

export default async function handler(req: any, res: any) {
  if (!req.body) {
    return res.status(400).json({ message: "not sent, no query passed" });
  }
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing Parameter: name" });
  }
  if (!req.body.entryFee) {
    return res.status(400).json({ message: "Missing Parameter: entryFee" });
  }
  if (!req.body.rank) {
    return res.status(400).json({ message: "Missing Parameter: rank" });
  }
  if (!req.body.numberOfCheckpoints) {
    return res
      .status(400)
      .json({ message: "Missing Parameter: numberOfCheckpoints" });
  }
  if (!req.body.checkpointEstimations) {
    return res
      .status(400)
      .json({ message: "Missing Parameter: checkpointEstimations" });
  }
  if (!req.body.startDate) {
    return res.status(400).json({ message: "Missing Parameter: startDate" });
  }
  if (!req.body.endDate) {
    return res.status(400).json({ message: "Missing Parameter: endDate" });
  }
  if (!req.body.address) {
    return res.status(400).json({ message: "Missing Parameter: address" });
  }

  const secondsInDay = 86400;

  const {
    name,
    entryFee,
    rank,
    numberOfCheckpoints,
    checkpointEstimations,
    address,
  } = req.body;
  let { startDate, endDate } = req.body;
  // convert startDate and duration to number and convert to seconds
  startDate = Number(startDate);
  endDate = Number(endDate);

  const program = await getProgram();
  const [racePDA] = await getRacePDA(name);
  let instruction = null;
  try {
    instruction = await program.methods
      .createRace(
        name,
        new anchor.BN(entryFee * LAMPORTS_PER_SOL),
        rank,
        new anchor.BN(startDate),
        new anchor.BN(endDate),
        numberOfCheckpoints,
        checkpointEstimations,
        0
      )
      .accounts({
        signer: address,
        race: racePDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  return res.status(200).json({ instruction: instruction });
}
