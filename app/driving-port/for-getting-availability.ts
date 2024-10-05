import { AvailableHours, Timeslot } from "../entity/schedule.ts";

export interface ForGettingAvailability {
  getAvailability(month: Date): Record<string, Timeslot[]> | Error;
}
