import type { Schedule } from "./schedule.ts";

export class Event {
  name: string | undefined;
  duration: number | undefined;
  description: string | undefined;
  schedule: Schedule | undefined;

  constructor(data: Partial<Event>) {
    this.name = data.name;
    this.duration = data.duration;
    this.description = data.description;
  }

  setSchedule(schedule: Schedule) {
    this.schedule = schedule;
  }
}