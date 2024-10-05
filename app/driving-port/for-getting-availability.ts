import type { Timeslot } from "../entity/timeslot.ts";

export interface ForGettingAvailability {
  getAvailability(month: Date): Record<string, Timeslot[]> | Error;
}
