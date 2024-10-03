import { AvailableHours } from '../entity/schedule.ts';

export interface ForGettingAvailability {
  getAvailability(month: Date): Record<string, AvailableHours[]>;
}