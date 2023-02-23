import { connectToDatabase } from "../../../Program/mongo";
import { ObjectId } from "mongodb";
import {
  getProgram,
  getRacerPDA,
  getRegistrantPDA,
} from "../../../program_sdk/methods";
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Racer } from "../../../types";
export default async function handler(req: any, res: any) {
  let { raceId, address } = req.query;

  const program = await getProgram();
  if (address) {
    try {
      address = new PublicKey(address);
      raceId = new PublicKey(raceId);
    } catch (e) {
      return res
        .status(400)
        .json({ message: "expected raceId & address to be a publickey" });
    }

    let racer = null;
    try {
      const [racerPDA] = await getRegistrantPDA(address, raceId);
      racer = await program.account.racer.fetchNullable(racerPDA);
      if (racer) {
        racer = {
          publicKey: address,
          account: {
            ...racer,
            // @ts-ignore
            checkpointEstimations: racer.checkpointEstimations.map(
              (estArr: BN[]) => {
                return estArr.map((est: BN) => est.toNumber() / 100);
              }
            ),
          },
        };
      }
    } catch (err) {
      // @ts-ignore
    }
    return res.status(200).json({ message: "registered racer", racers: racer });
  }
  const allRacers = await program.account.racer.all();

  const racers = [];
  for (const e of allRacers) {
    if (e.account.race.toString() === raceId) {
      racers.push({
        ...e,
        account: {
          ...e.account,
          // @ts-ignore
          checkpointEstimations: e.account.checkpointEstimations.map(
            (estArr: BN[]) => {
              return estArr.map((est: BN) => est.toNumber() / 100);
            }
          ),
        },
      });
    }
  }

  return res.status(200).json({ message: "Registered Racers", racers: racers });
}
