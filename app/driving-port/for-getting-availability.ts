import type { Timeslot } from "../entity/timeslot.ts";

export interface ForGettingAvailability {
  getAvailability(
    month: Date,
    eventId: number,
  ): Promise<Record<string, Timeslot[]> | Error>;
}
