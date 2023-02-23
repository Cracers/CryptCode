import { Race, Racer, Price } from "../types";

export const getRacerStats = (
  race: Race,
  racer: Racer,
  prices: Price,
  currentCheckpoint: number
) => {
  if (!racer) {
    return {
      address: "",
      name: "",
      level: 0,
      p1EstimationLabel: "",
      p1Estimation: 0,
      p1Score: Number.MAX_SAFE_INTEGER,
      p2EstimationLabel: "",
      p2Estimation: 0,
      p2Score: Number.MAX_SAFE_INTEGER,
      score: Number.MAX_SAFE_INTEGER,
    };
  }
  const raceEstimations: string[] = race.account.estimations;
  const p1Score = getCheckpointScore(
    // @ts-ignore
    prices[raceEstimations[0]],
    racer.account.checkpointEstimations[currentCheckpoint][0]
  );
  let p2Score = 0;
  if (
    racer.account.checkpointEstimations[currentCheckpoint].length > 1 &&
    raceEstimations.length > 1
  ) {
    p2Score = getCheckpointScore(
      // @ts-ignore
      prices[raceEstimations[1]],
      racer.account.checkpointEstimations[currentCheckpoint][1]
    );
  }

  return {
    address: racer.publicKey.toString(),
    name: racer.account.name,
    level: racer.account.level,
    p1EstimationLabel: raceEstimations[0],
    p1Estimation: racer.account.checkpointEstimations[currentCheckpoint][0],
    p1Score: Number.isFinite(p1Score) ? p1Score : 0,
    p2EstimationLabel: raceEstimations[1],
    p2Estimation: racer.account.checkpointEstimations[currentCheckpoint][1],
    p2Score: Number.isFinite(p2Score) ? p2Score : 0,
    score: Number.isFinite(getFinalCheckoutScore(p1Score, p2Score))
      ? getFinalCheckoutScore(p1Score, p2Score)
      : 0,
  };
};

export const getCheckpointScore = (
  realPrice: number,
  predictedPrice: number,
  checkpoint?: number
) => {
  return Math.abs(((predictedPrice - realPrice) / realPrice) * 1000);
};

export const getFinalCheckoutScore = (p1Score: number, p2Score: number) => {
  return (p1Score + p2Score) / 2;
};
