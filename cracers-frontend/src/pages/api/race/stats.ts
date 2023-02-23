import { connectToDatabase } from "../../../Program/mongo";
import { MongoAPIError, ObjectId } from "mongodb";
import { getRaces } from "../../../program_sdk/methods";
export default async function handler(req: any, res: any) {
  const { name } = req.query;
  try {
    const { db } = await connectToDatabase();

    const raceStatsRes = await db
      .collection("Races")
      .find({
        name,
      })
      .toArray();

    let raceStats = {};
    if (raceStatsRes.length) {
      return res.status(200).json({
        message: "stats",
        stats: raceStatsRes[0].prices,
      });
    }
    return res.status(400).json({
      message: "missing race data",
      stats: {},
    });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      message: "There was a problem loading race stats",
    });
  }
}
