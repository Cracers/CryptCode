import { connectToDatabase } from "../../../Program/mongo";
import { ObjectId } from "mongodb";
import { getRaces } from "../../../program_sdk/methods";
export default async function handler(req: any, res: any) {
  const { raceId, variant } = req.query;

  let selectedRaceId = "";
  if (raceId) {
    selectedRaceId = raceId;
  }

  const races = (await getRaces(selectedRaceId, variant)) as any[];
  console.log("race", races);

  if (Array.isArray(races)) {
    return res.status(200).json({
      message: "Races",
      races: races
        // .filter((race) => {
        //   if (race.account.name.includes("Test")) {
        //     return false;
        //   }
        //   if (race.account.name.includes("Example")) {
        //     return false;
        //   }
        //   return true;
        // })
        .sort(function (a, b) {
          return b.account.raceEnd - a.account.raceEnd;
        }),
    });
  }

  return res.status(200).json({
    message: "Races",
    races: races,
  });
}
