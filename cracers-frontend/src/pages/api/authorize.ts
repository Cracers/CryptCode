import { connectToDatabase } from "../../Program/mongo";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  const { address } = req.query;

  let query = {};

  if (address) {
    query = { address: address };
  }

  try {
    const { db } = await connectToDatabase();
    const admins = await db.collection("Admins").find(query).toArray();

    const adminAccount = admins.filter((a: any) => a.address === address);

    if (adminAccount.length) {
      return res.status(200).json({ message: "Authorized", isAdmin: true });
    } else {
      return res.status(401).json({
        message: "Unauthorized",
        isAdmin: false,
      });
    }
  } catch (error) {}

  return res
    .status(200)
    .json({ message: "No admin accounts exist", isAdmin: false });
}
