import type { AvailableHours } from "./available-hours.ts";

export class Event {
  name: string | undefined;
  duration: number | undefined;
  description: string | undefined;
  schedule: AvailableHours[] | undefined;

  constructor(data: Partial<Event>) {
    this.name = data.name;
    this.duration = data.duration;
    this.description = data.description;
  }

  setSchedule(schedule: AvailableHours[]) {
    this.schedule = schedule;
  }
}
