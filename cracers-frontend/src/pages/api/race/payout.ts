import { connectToDatabase } from "../../../Program/mongo";
import { ObjectId } from "mongodb";
import { getRaces, payoutRace } from "../../../program_sdk/methods";
import { PublicKey } from "@solana/web3.js";
export default async function handler(req: any, res: any) {
  const { authority, raceId, prices } = req.body;

  if (!authority) {
    return res.status(400).json({ message: "Missing authority" });
  }

  if (!raceId) {
    return res.status(400).json({ message: "Missing raceId" });
  }

  if (!prices) {
    // TODO get prices right from DB
    return res.status(400).json({ message: "Missing prices" });
  }

  let racePublicKey;
  try {
    racePublicKey = new PublicKey(raceId);
  } catch (e) {
    return res.status(500).json({ message: "Could not load race account" });
  }

  let authorityPublicKey;
  try {
    authorityPublicKey = new PublicKey(authority);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Expected authority to be a PublicKey" });
  }

  console.log("race payout");
  const payoutInstructions = await payoutRace(
    authorityPublicKey,
    racePublicKey,
    prices
  );
  return res.status(200).json({
    message: "Payout",
    instructions: payoutInstructions,
  });
}
