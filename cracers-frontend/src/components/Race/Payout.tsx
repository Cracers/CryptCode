import { Button, Grid, Typography } from "@mui/material";
import { isRaceEnded } from "../../lib/RaceMethods";
import { Race, Price } from "../../types";
import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { decodeInstruction } from "../../Program/decode";
import { Transaction } from "@solana/web3.js";
import { toast } from "react-hot-toast";

type Props = {
  race: Race;
  prices: Price;
};

const Payout = ({ race, prices }: Props) => {
  const { publicKey, sendTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const handlePayout = async () => {
    if (!signAllTransactions || !publicKey) {
      return;
    }
    console.log("Payout Mutha fucker");
    axios
      .post(`/api/race/payout`, {
        authority: publicKey,
        raceId: race.publicKey,
        prices,
      })
      .then(async (res) => {
        toast("Preparing payout transactions...");
        const instructions = res.data.instructions.map((instruction: any) => {
          const decoded = decodeInstruction(instruction);
          return decoded;
        });

        const transactions: Transaction[] = [];

        let transaction = new Transaction();
        let counter = 1;
        for (const ins of instructions) {
          if (counter % 10 === 0) {
            await connection.getLatestBlockhash().then((block) => {
              transaction.recentBlockhash = block.blockhash;
              transaction.feePayer = publicKey;
              transactions.push(transaction);
              transaction = new Transaction();
            });
          }
          transaction.add(ins);
          counter++;
        }

        const signedTransactions = await signAllTransactions(transactions);
        for (const transaction of signedTransactions) {
          const txn = await connection.sendRawTransaction(
            transaction.serialize()
          );
        }

        toast.success("Transactions sent");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.message);
      });
  };

  console.log("authority", race.account.authority.toString());

  if (!isRaceEnded(race)) {
    return <></>;
  }
  return (
    <>
      {publicKey?.toString() === race.account.authority.toString() && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "25px 0",
          }}
        >
          <Button variant="outlined" color="success" onClick={handlePayout}>
            <Typography variant="h6">Payout Racers</Typography>
          </Button>
        </div>
      )}
    </>
  );
};

export default Payout;
