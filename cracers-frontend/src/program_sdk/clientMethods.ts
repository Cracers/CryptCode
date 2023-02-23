import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { Estimation, Race } from "../types";

export const getRaceDuration = (race: Race): number => {
  const duration = (race.account.raceEnd - race.account.raceStart) / 86400000;

  return duration >= 1 ? Math.round(duration) : 0.5;
};

export const getEstimationCurrencyDecimals = (currency: Estimation): number => {
  let currencySymbol = currency.toLowerCase();
  if (currencySymbol === "sol") {
    return LAMPORTS_PER_SOL;
  } else if (currencySymbol === "btc") {
    return 100000000; // 1 Satoshi
  } else if (currencySymbol === "eth") {
    return 1000000000000000000; // 1 wei
  }
  return 0;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const callTransaction = async (
  wallet: WalletContextState,
  transaction: Transaction,
  connection: Connection,
  callback?: (e: any) => void
) => {
  const txn = await wallet.sendTransaction(transaction, connection);
  let txnValidated = false;
  let count = 0;
  while (!txnValidated) {
    const signatureStatus = await connection.getSignatureStatus(txn);

    await sleep(500);
    if (
      signatureStatus?.value?.confirmationStatus === "confirmed" ||
      ++count > 50
    )
      txnValidated = true;
  }
  callback && callback(txn);
  return txn;
};
