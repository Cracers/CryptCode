import { Account, PublicKey } from "@solana/web3.js";
import {
  getDevTreasury,
  getProgram,
  getRacePDA,
  getRacerPDA,
} from "../../../program_sdk/methods";
import * as anchor from "@project-serum/anchor";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    getAccount(req, res);
  }

  if (req.method === "POST") {
    createAccount(req, res);
  }

  if (req.method === "DELETE") {
    closeAccount(req, res);
  }
}

const getAccount = async (req: any, res: any) => {
  let { address } = req.query;

  if (address) {
    try {
      address = new PublicKey(address);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Expected address to be a public key" });
    }
  }

  const program = await getProgram();
  const [racerAccount] = await getRacerPDA(address);
  const userAccount = await program.account.racerAccount
    .fetch(racerAccount)
    .catch((err) => {
      return res.status(200).json({ message: "No user found", user: false });
    });

  return res.status(200).json({ message: "User Account", user: userAccount });
};

const createAccount = async (req: any, res: any) => {
  let { address, name } = req.body;

  if (address) {
    try {
      address = new PublicKey(address);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Expected address to be a public key" });
    }
  }

  const treasury = getDevTreasury();

  const [racerAccount] = await getRacerPDA(address);

  const program = await getProgram();
  try {
    const instruction = await program.methods
      .createAccount(name)
      .accounts({
        signer: address,
        racerAccount,
        treasury,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();
    return res.status(200).json({ message: "Create Account", instruction });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error retrieving account create intstruction" });
  }
};

const closeAccount = async (req: any, res: any) => {
  let { address } = req.query;

  if (address) {
    try {
      address = new PublicKey(address);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Expected address to be a public key" });
    }
  }

  const [racerAccount] = await getRacerPDA(address);

  const program = await getProgram();
  try {
    const instruction = await program.methods
      .closeAccount()
      .accounts({
        signer: address,
        racerAccount,
      })
      .instruction();
    return res.status(200).json({ message: "Close Account", instruction });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error retrieving account close intstruction" });
  }
};
