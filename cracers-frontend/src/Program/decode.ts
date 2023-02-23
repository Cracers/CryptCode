import { PublicKey } from "@solana/web3.js";

/**
 * Decodes the API instruction data replacing the publickey strings with real publickeys.
 * @param instructionData
 * @returns
 */
export function decodeInstruction(instructionData: any) {
  let index = 0;
  console.log("DECODE INSTRUCTION");
  for (const key of instructionData.keys) {
    console.log("key.pubkey 1", key.pubkey);

    instructionData.keys[index++].pubkey = new PublicKey(key.pubkey);
    console.log(
      "key.pubkey 2",
      instructionData.keys[index - 1].pubkey.toString()
    );
  }
  console.log("programId 1", instructionData.keys[index - 1].pubkey.toString());
  instructionData.programId = new PublicKey(instructionData.programId);
  console.log("programId 1", instructionData.programId.toString());
  return instructionData;
}
