import type { TimeslotEntity } from "../entity/timeslot.entity.ts";

export type Availability = Record<string, TimeslotEntity[]>;

export interface ForGettingAvailability {
  getAvailability(
    month: Date,
    eventId: number,
  ): Promise<Availability | Error>;
}
