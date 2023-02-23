import { Race } from "../types";

export function isRaceActive(race: Race | null): boolean {
  if (!race) return false;
  const now = new Date().getTime();
  return race.account.raceStart <= now && race.account.raceEnd >= now;
}

export function isRaceEnded(race: Race | null): boolean {
  if (!race) return false;

  return race.account.raceEnd <= new Date().getTime();
}
