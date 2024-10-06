import type { Timeslot } from "../entity/timeslot.ts";

type Availability = Record<string, Timeslot[]>;

export interface ForGettingAvailability {
  getAvailability(
    month: Date,
    eventId: number,
  ): Promise<Availability | Error>;
}
