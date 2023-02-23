import { connectToDatabase } from "../../Program/mongo";
let vault: any;

export default async function handler(req: any, res: any) {
  return res.status(200).json({ message: "sent" });
}
