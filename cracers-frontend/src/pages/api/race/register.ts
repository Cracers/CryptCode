import * as anchor from "@project-serum/anchor";

import { PublicKey } from "@solana/web3.js";
import {
  getDevTreasury,
  getProgram,
  getRacePDA,
  getRacerPDA,
  getRegistrantPDA,
} from "../../../program_sdk/methods";
import { BN } from "bn.js";
export default async function handler(req: any, res: any) {
  if (req.method === "POST") return CreateRacerRegistration(req, res);

  if (req.method === "DELETE") return CloseRacerRegistration(req, res);
}

async function CreateRacerRegistration(req: any, res: any) {
  const { raceId, address, name, raceData, txn } = req.body;
  if (!raceId) {
    return res.status(400).json({ message: "Missing raceId" });
  }
  if (!address) {
    return res.status(400).json({ message: "Missing address" });
  }

  if (!txn && !raceData) {
    return res.status(400).json({ message: "Missing raceData" });
  }
  let raceDataArr = [];
  if (raceData) {
    raceDataArr = JSON.parse(raceData);
  }

  let racePublicKey;
  try {
    racePublicKey = new PublicKey(raceId);
  } catch (e) {
    return res.status(500).json({ message: "Could not load race account" });
  }

  let registereePublicKey;
  try {
    registereePublicKey = new PublicKey(address);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Expected address to be a public key" });
  }

  let treasuryPublicKey;
  try {
    treasuryPublicKey = new PublicKey(process.env.TREASURY_ADDRESS as string);
  } catch (e) {
    return res.status(500).json({ message: "Could not load treasury account" });
  }

  const data = raceDataArr.map((data: number[]) => {
    return Array.isArray(data)
      ? data.map((est: number) => new BN(est))
      : new BN(data);
  });

  const program = await getProgram();

  const [racerAccountPDA] = await getRacerPDA(registereePublicKey);

  const [registrationAccount] = await getRegistrantPDA(
    registereePublicKey,
    racePublicKey
  );

  let instruction = null;
  try {
    instruction = await program.methods
      .register(data)
      .accounts({
        signer: registereePublicKey,
        racer: registrationAccount,
        racerAccount: racerAccountPDA,
        race: racePublicKey,
        treasury: treasuryPublicKey,
        devTreasury: getDevTreasury(),
      })
      .instruction();
    return res
      .status(200)
      .json({ message: "register instruction", instruction });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

async function CloseRacerRegistration(req: any, res: any) {
  const { raceId, address } = req.query;
  if (!raceId) {
    return res.status(400).json({ message: "Missing raceId" });
  }
  if (!address) {
    return res.status(400).json({ message: "Missing address" });
  }

  let racePublicKey;
  try {
    racePublicKey = new PublicKey(raceId);
  } catch (e) {
    return res.status(500).json({ message: "Could not load race account" });
  }

  let registereePublicKey;
  try {
    registereePublicKey = new PublicKey(address);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Expected address to be a public key" });
  }

  const program = await getProgram();

  const [registrationAccount] = await getRegistrantPDA(
    registereePublicKey,
    racePublicKey
  );

  let instruction = null;
  try {
    instruction = await program.methods
      .closeRegistration()
      .accounts({
        signer: registereePublicKey,
        racer: registrationAccount,
      })
      .instruction();
    return res
      .status(200)
      .json({ message: "register instruction", instruction });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}
