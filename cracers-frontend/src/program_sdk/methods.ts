import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

import { CracersProgram } from "./target/types/cracers_programv2";
import MainnetIDL from "./target/idl/mainnet.json";
import DevnetIDL from "./target/idl/cracers_program.json";
import { WalletContextState } from "@solana/wallet-adapter-react";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { program } from "@project-serum/anchor/dist/cjs/spl/associated-token";
import { Estimation, Race, Racer, Price } from "../types";
import { NumbersOutlined } from "@mui/icons-material";
import { ratingClasses } from "@mui/material";
import { getRacerStats } from "./stats";

const mainnet = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

export async function createRace(
  name: string,
  entryFee: number,
  rank: number,
  numberOfCheckpoints: number,
  checkpointEstimations: string[],
  startDate: number,
  endDate: number,
  wallet: WalletContextState
) {
  if (wallet.publicKey) {
    const program = await getProgram();
    const [racePDA] = await getRacePDA(name);

    const instruction = await program.methods
      .createRace(
        name,
        new anchor.BN(entryFee),
        rank,
        new anchor.BN(startDate),
        new anchor.BN(endDate),
        numberOfCheckpoints,
        checkpointEstimations,
        0
      )
      .accounts({
        signer: wallet.publicKey,
        race: racePDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);
    let tx;
    try {
      tx = await wallet.sendTransaction(
        transaction,
        program.provider.connection
      );
    } catch (error) {
      return false;
    }
    return tx;
  }
}

const SITE_KEYPAIR = [
  8, 89, 98, 198, 253, 97, 203, 70, 5, 185, 138, 36, 90, 183, 197, 123, 232,
  148, 91, 43, 244, 212, 99, 87, 33, 220, 60, 10, 221, 107, 151, 213, 242, 192,
  157, 87, 159, 251, 80, 149, 94, 153, 8, 123, 201, 79, 116, 233, 216, 188, 131,
  121, 84, 68, 206, 169, 71, 251, 164, 252, 133, 228, 143, 14,
];

export function getCluster() {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
}

export function getProgramIdl() {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta" ||
    process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet"
    ? MainnetIDL
    : DevnetIDL;
}

/**
 * Get Anchor Program
 * @returns Cracer Solana Program
 */
export async function getProgram() {
  const idl = getProgramIdl();
  const cluster = getCluster() as Cluster;
  const payer = Keypair.fromSecretKey(Buffer.from(SITE_KEYPAIR));
  const wallet = new NodeWallet(payer);
  const selectedNetwork =
    cluster === "devnet"
      ? clusterApiUrl(cluster)
      : mainnet
      ? mainnet
      : clusterApiUrl("mainnet-beta");
  const connection = new Connection(selectedNetwork, "recent");

  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "recent",
  });

  const program = new Program(
    idl as anchor.Idl,
    idl.metadata.address,
    provider
  );

  return program as unknown as Program<CracersProgram>;
}

export const getDevTreasury = () => {
  return new PublicKey("6R7Q8jQyVDJfk7FWd4hn4FmdFRcXr78BYgEPBpC481NW");
};

export const getTreasury = () => {
  const { TREASURY_ADDRESS } = process.env;
  return TREASURY_ADDRESS
    ? new PublicKey(TREASURY_ADDRESS)
    : new PublicKey("GfJYbnVe6MqVAqLFMi287GEz87SEVkBr6RKHgx1TWr23");
};

/**
 * Get PDA Account for Race
 * @param name
 * @param authority
 * @param programId
 * @returns
 */
export const getRacePDA = async (name: string) => {
  let PROGRAM = getProgramIdl();

  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("race"), Buffer.from(name)],
    new PublicKey(PROGRAM.metadata.address)
  );
};

export const getRegistrantPDA = async (racer: PublicKey, race: PublicKey) => {
  let PROGRAM = getProgramIdl();
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("racer"), racer.toBuffer(), race.toBuffer()],
    new PublicKey(PROGRAM.metadata.address)
  );
};

export const getRacerPDA = async (racer: PublicKey) => {
  let PROGRAM = getProgramIdl();
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("account"), racer.toBuffer()],
    new PublicKey(PROGRAM.metadata.address)
  );
};

export const formatRaceObject = (race: any) => {
  const entryFee = Number(race.account.entryFee.toString());
  const raceStart = Number(race.account.raceStart.toString());
  const raceEnd = Number(race.account.raceEnd.toString());

  const registeredRacers = Number(race.account.registeredRacers.toString());

  return {
    publicKey: race.publicKey,
    account: {
      ...race.account,
      entryFee,
      raceStart,
      raceEnd,
      registeredRacers,
    },
  };
};

const formatFetchRaceObject = (raceId: PublicKey, race: any) => {
  const raceKey = new PublicKey(raceId);

  const entryFee = Number(race.entryFee.toString());
  const raceStart = Number(race.raceStart.toString());
  const raceEnd = Number(race.raceEnd.toString());

  const registeredRacers = Number(race.registeredRacers.toString());
  return {
    publicKey: raceKey,
    account: {
      ...race,
      entryFee,
      raceStart,
      raceEnd,
      registeredRacers,
    },
  };
};

export const getRaces = async (
  raceId: string | undefined | null,
  variant: "active" | "upcoming" | "previous" = "active",
  network?: string | undefined
) => {
  const program = await getProgram();

  if (raceId) {
    try {
      const raceKey = new PublicKey(raceId);
      const race = await program.account.race.fetch(raceKey);
      return formatFetchRaceObject(raceKey, race);
    } catch (e) {
      console.error("Error::getRaces(id)", e);
    }
  } else {
    try {
      const races = await program.account.race.all();
      const currentTimestamp = new Date().getTime();
      return races
        .filter((race) => {
          if (variant === "previous") {
            return race.account.raceEnd.toNumber() < currentTimestamp;
          }
          if (variant === "upcoming") {
            return race.account.raceStart.toNumber() > currentTimestamp;
          }

          return (
            race.account.raceStart.toNumber() <= currentTimestamp &&
            race.account.raceEnd.toNumber() >= currentTimestamp
          );
        })
        .map((race) => {
          return formatRaceObject(race);
        });
    } catch (e) {
      console.error("Error::getRaces()", e);
    }
  }

  return [];
};

type TierPercentagesType = {
  Champion: number;
  One: number;
  Two: number;
  Three: number;
  Four: number;
  Treasury: number;
};

const TierPercentages = {
  Champion: 7,
  One: 33,
  Two: 24,
  Three: 18,
  Four: 13,
  Treasury: 5,
};
enum TierScores {
  One = 30,
  Two = 75,
  Three = 120,
  Four = 150,
}

export const payoutRace = async (
  authority: PublicKey,
  raceId: PublicKey,
  prices: Price
) => {
  const program = await getProgram();

  // 1 Get the race participants
  const allRacers = await program.account.racer.all();

  // console.log("allRacers", allRacers);
  const raceFetched = await program.account.race.fetch(raceId);
  const race = formatFetchRaceObject(raceId, raceFetched);
  // TODO Think of a better way to not fetch EVERY single racer ever.
  const racers = allRacers
    .filter((racer) => racer.account.race.toString() === raceId.toString())
    .map((racer) => ({
      ...racer,
      account: {
        ...racer.account,
        // @ts-ignore
        checkpointEstimations: racer.account.checkpointEstimations.map(
          (estArr: anchor.BN[]) => {
            return estArr.map((est: anchor.BN) => est.toNumber() / 100);
          }
        ),
      },
    })) as unknown as Racer[];

  const raceRewardPot = racers.length * race.account.entryFee;
  let unclaimedPot = 0;

  /**
   * Ranking and rewards:
    Each pilot will be rewarded based on the TIER in which their final median score falls into.
    Each TIER percentage reward will be divided equally amongst the total pilot scores that fall in that TIER.
    From the reward pool, prices are dis
    TIER 1 (0-30) 33% (</= 3% deviation from real price)
    TIER 2 (31-75) 24% (<7.5% deviation from real price)
    TIER 3 (76-120) 18% (<12% deviation from real price)
    TIER 4 (121-150) 13% (<15% deviation from real price)
    *The race keepers will also distribute the following quantities for this race track:
    5% - Planetary Race Vault
    7% - Race Champion
    Planetary Race Development Vault: 5% of the total pooled entry amount will go towards the community project wallet. The earnings on this wallet will serve with project development, marketing, promotional, operational and giveaway related costs/expenses.
   */
  const tier1Racers = racers.filter((racer: Racer) => {
    const racerStats = getRacerStats(race, racer, prices, 0);
    return racerStats.score <= TierScores.One;
  });

  const tier2Racers = racers.filter((racer: Racer) => {
    const racerStats = getRacerStats(race, racer, prices, 0);
    return (
      racerStats.score > TierScores.One && racerStats.score <= TierScores.Two
    );
  });

  const tier3Racers = racers.filter((racer: Racer) => {
    const racerStats = getRacerStats(race, racer, prices, 0);
    return (
      racerStats.score > TierScores.Two && racerStats.score <= TierScores.Three
    );
  });

  const tier4Racers = racers.filter((racer: Racer) => {
    const racerStats = getRacerStats(race, racer, prices, 0);
    return (
      racerStats.score > TierScores.Three && racerStats.score <= TierScores.Four
    );
  });

  const tieredRacersCount =
    tier1Racers.length +
    tier2Racers.length +
    tier3Racers.length +
    tier4Racers.length;

  if (tier1Racers.length <= 0) {
    unclaimedPot += getTierPayoutTotal(TierPercentages.One, raceRewardPot);
  }
  if (tier2Racers.length <= 0) {
    unclaimedPot += getTierPayoutTotal(TierPercentages.Two, raceRewardPot);
  }
  if (tier3Racers.length <= 0) {
    unclaimedPot += getTierPayoutTotal(TierPercentages.Three, raceRewardPot);
  }
  if (tier4Racers.length <= 0) {
    unclaimedPot += getTierPayoutTotal(TierPercentages.Four, raceRewardPot);
  }

  const unclaimedPotModifier = parseInt(
    (unclaimedPot / tieredRacersCount).toFixed(0)
  );

  const raceChampion = tier1Racers.sort((r1: Racer, r2: Racer) => {
    const r1Stats = getRacerStats(race, r1, prices, 0);
    const r2Stats = getRacerStats(race, r2, prices, 0);
    return r1Stats.score - r2Stats.score;
  })[0];

  const tier1Payouts = calculatePayouts(
    TierPercentages.One,
    tier1Racers,
    raceRewardPot,
    unclaimedPotModifier
  );
  const tier2Payouts = calculatePayouts(
    TierPercentages.Two,
    tier2Racers,
    raceRewardPot,
    unclaimedPotModifier
  );
  const tier3Payouts = calculatePayouts(
    TierPercentages.Three,
    tier3Racers,
    raceRewardPot,
    unclaimedPotModifier
  );
  const tier4Payouts = calculatePayouts(
    TierPercentages.Four,
    tier4Racers,
    raceRewardPot,
    unclaimedPotModifier
  );

  /**
   * [{
   *  receiver: PublicKey
   *  amount: number
   * }]
   */
  // 4 loop the array and build an Instruction[]

  // Payout the Race Champion
  const instructionsPromise = [];
  instructionsPromise.push(
    getPayoutInstruction(
      authority,
      raceChampion.account.address,
      raceId,
      getTierPayoutTotal(TierPercentages.Champion, raceRewardPot)
    )
  );

  instructionsPromise.push(
    ...tier1Payouts.map(async (payout) => {
      const instruction = getPayoutInstruction(
        authority,
        payout.recipient,
        raceId,
        payout.amount
      );

      return instruction;
    })
  );

  instructionsPromise.push(
    ...tier2Payouts.map(async (payout) => {
      const instruction = getPayoutInstruction(
        authority,
        payout.recipient,
        raceId,
        payout.amount
      );

      return instruction;
    })
  );

  instructionsPromise.push(
    ...tier3Payouts.map(async (payout) => {
      const instruction = getPayoutInstruction(
        authority,
        payout.recipient,
        raceId,
        payout.amount
      );

      return instruction;
    })
  );

  instructionsPromise.push(
    ...tier4Payouts.map(async (payout) => {
      const instruction = getPayoutInstruction(
        authority,
        payout.recipient,
        raceId,
        payout.amount
      );

      return instruction;
    })
  );

  // Take 5% for Treasury
  instructionsPromise.push(
    getPayoutInstruction(
      authority,
      getTreasury(),
      raceId,
      getTierPayoutTotal(TierPercentages.Treasury, raceRewardPot)
    )
  );

  return await Promise.all(instructionsPromise);
};

function calculatePayouts(
  tierPercentage: number,
  racers: Racer[],
  pot: number,
  unclaimedAmount: number
) {
  return racers.map((racer: Racer) => {
    return {
      recipient: racer.account.address,
      amount:
        getTierPayoutTotal(tierPercentage, pot) / racers.length +
        unclaimedAmount,
    };
  });
}

function getTierPayoutTotal(percentage: number, pot: number): number {
  return (pot * percentage) / 100;
}

async function getPayoutInstruction(
  authority: PublicKey,
  recipient: PublicKey,
  racePDA: PublicKey,
  amount: number
) {
  const program = await getProgram();
  return await program.methods
    .payout(new anchor.BN(amount))
    .accounts({
      signer: authority,
      recipient: recipient,
      race: racePDA,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction();
}
