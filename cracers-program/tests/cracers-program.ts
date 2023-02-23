import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CracersProgram } from "../target/types/cracers_program";
import {
  Keypair,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import CracersIDL from "../target/idl/cracers_program.json";
import { BN } from "bn.js";
import { assert } from "chai";

const authorityKeypair = require("./authority.json");
const authority = Keypair.fromSecretKey(new Uint8Array(authorityKeypair));
const treasuryKeypair = require("./treasury.json");
const treasury = Keypair.fromSecretKey(new Uint8Array(treasuryKeypair));
const devTreasuryKeypair = require("./devtreasury.json");
const devTreasury = Keypair.fromSecretKey(new Uint8Array(treasuryKeypair));

describe("cracers-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CracersProgram as Program<CracersProgram>;

  before("Prepare for tests", async () => {
    const txn = await program.provider.connection.requestAirdrop(
      authority.publicKey,
      LAMPORTS_PER_SOL
    );
    console.log("Airdrop TXN", txn);
    await new Promise((r) => setTimeout(r, 1000));
  });

  it("INFO", async () => {
    let races;
    try {
      races = await program.account.race.all();
      console.log("races", races);
      console.log("publicKey", races[0].publicKey.toString());
      console.log("authority", races[0].account.authority.toString());
      console.log("treasury", races[0].account.treasuryAddress.toString());
      console.log("entryFee", races[0].account.entryFee);
      console.log("estimations", races[0].account.estimations);
      console.log("bump", races[0].account.bump);
    } catch (e) {}
  });

  it("Can create race", async () => {
    console.log(CracersIDL.metadata.address);
    console.log(authority.publicKey.toString());
    const [racePDA, _0] = await getRacePDA("test", authority.publicKey);
    console.log("racePDA", racePDA.toString());

    // Add your test here.
    const instruction = await program.methods
      .createRace(
        "test",
        new anchor.BN(1_000_000),
        1,
        new anchor.BN(Date.now() / 1000),
        new anchor.BN((Date.now() + 86_400_000) / 1000),
        1,
        ["sol", "btc"],
        1000
      )
      .accounts({
        signer: authority.publicKey,
        race: racePDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);
    let tx;
    try {
      tx = await program.provider.sendAndConfirm!(transaction, [authority]);
    } catch (error) {
      console.log("Create Race Error", error);
      return false;
    }

    console.log("Your transaction signature", tx);
  });

  it("Can create account", async () => {
    const [racerPDA, _1] = await getRacerPDA(authority.publicKey);
    console.log("racer PDA", racerPDA.toString());
    const instruction = await program.methods
      .createAccount("Test Racer")
      .accounts({
        signer: authority.publicKey,
        racerAccount: racerPDA,
        treasury: devTreasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);
    let tx;
    try {
      tx = await program.provider.sendAndConfirm!(transaction, [authority]);
    } catch (error) {
      console.log("Account Create Error", error);
      return false;
    }

    console.log("Your transaction signature", tx);
  });

  it("Can register for race", async () => {
    const [racePDA, _0] = await getRacePDA("test", authority.publicKey);
    const [racerAccountPDA, _1] = await getRacerPDA(authority.publicKey);
    const [racerPDA, _2] = await getRegistrantPDA(authority.publicKey, racePDA);
    console.log("racer PDA", racerPDA.toString());
    const instruction = await program.methods
      .register([[new BN(45000000000), new BN(1200000000000)]])
      .accounts({
        signer: authority.publicKey,
        racer: racerPDA,
        racerAccount: racerAccountPDA,
        race: racePDA,
        treasury: treasury.publicKey,
        devTreasury: devTreasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);
    let tx;
    try {
      tx = await program.provider.sendAndConfirm!(transaction, [authority]);
    } catch (error) {
      console.log("Register Racer Error", error);
      return false;
    }

    console.log("Your transaction signature", tx);
  });

  it("Can claim xp from race", async () => {
    const [racePDA, _0] = await getRacePDA("test", authority.publicKey);
    const [racerAccountPDA, _1] = await getRacerPDA(authority.publicKey);
    let racerAccount = await program.account.racerAccount.fetch(
      racerAccountPDA
    );
    assert(racerAccount.xp === 0, "Racer has no xp");
    const instruction = await program.methods
      .claimXp()
      .accounts({
        signer: authority.publicKey,
        racerAccount: racerAccountPDA,
        race: racePDA,
        treasury: treasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();
    const transaction = new Transaction();
    transaction.add(instruction);
    let tx;
    try {
      tx = await program.provider.sendAndConfirm!(transaction, [authority]);
    } catch (error) {
      console.log("Claim XP Error", error);
      return false;
    }

    racerAccount = await program.account.racerAccount.fetch(racerAccountPDA);
    assert(racerAccount.xp > 0, "Racer earned XP");
  });
});
/**
 * Get PDA Account for Race
 * @param name
 * @param authority
 * @param programId
 * @returns
 */
const getRacePDA = async (
  name: string,
  authority: PublicKey,
  programId: PublicKey = new PublicKey(CracersIDL.metadata.address)
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("race"), Buffer.from(name)],
    programId
  );
};

const getRegistrantPDA = async (
  racer: PublicKey,
  race: PublicKey,
  programId: PublicKey = new PublicKey(CracersIDL.metadata.address)
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("racer"), racer.toBuffer(), race.toBuffer()],
    programId
  );
};

const getRacerPDA = async (
  racer: PublicKey,
  programId: PublicKey = new PublicKey(CracersIDL.metadata.address)
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("account"), racer.toBuffer()],
    programId
  );
};
