import { AvailableHours } from './available-hours.ts'

export class Schedule {
  days: Record<number, AvailableHours[]> | undefined;

  setHours(days: Record<number, AvailableHours[]>) {
    this.days = days;
  }
}
