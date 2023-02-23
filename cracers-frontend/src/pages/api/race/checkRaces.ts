import { connectToDatabase } from "../../../Program/mongo";
import { ObjectId } from "mongodb";
import { getRaces } from "../../../program_sdk/methods";
import { Race } from "../../../types";
import axios from "axios";
export default async function handler(req: any, res: any) {
  const { raceId, variant } = req.query;

  let selectedRaceId = "";
  if (raceId) {
    selectedRaceId = raceId;
  }
  const { db } = await connectToDatabase();

  const currentRaces = (await getRaces(null, "previous")) as unknown as Race[];
  // @TODO refactor this function
  const currentTimestamp = new Date().getTime();
  let solPrice = 0;
  let btcPrice = 0;
  await axios
    .get(`https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT`)
    .then((res) => {
      // @ts-ignore
      solPrice = res.data.price;
    })
    .catch(console.log);
  await axios
    .get(`https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`)
    .then((res) => {
      // @ts-ignore
      btcPrice = res.data.price;
    })
    .catch(console.log);
  let prices = {
    sol: solPrice,
    btc: btcPrice,
  };
  for (const currentRace of currentRaces) {
    try {
      console.log("Try updating", currentRace.account.name);
      db.collection("Races").updateOne(
        { name: currentRace.account.name },
        {
          // Set on insert will only update if this value doesn't exist already
          $setOnInsert: {
            prices: prices,
            time: currentTimestamp,
          },
        },
        {
          upsert: true,
        }
      );
    } catch (err) {}
  }
  return res.status(200).json({ message: "Races" });
}
