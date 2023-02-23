import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export type Estimation = "sol" | "btc" | "eth";

export type Race = {
  publicKey: PublicKey;
  account: {
    name: string;
    authority: PublicKey;
    treasuryAddress: PublicKey;
    entryFee: number;
    raceRank: number;
    raceStart: number;
    raceEnd: number;
    registeredRacers: number;
    numberOfCheckpoints: number;
    estimations: string[];
    bump: number;
  };
};

export type RacerEstimations = number[];

export type Racer = {
  publicKey: PublicKey;
  account: {
    name: string;
    address: PublicKey;
    race: PublicKey;
    checkpointEstimations: RacerEstimations[];
    level: number;
    bump: number;
  };
};

export type Price = {
  [key: string]: number;
};