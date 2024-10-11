import type { AvailableHoursEntity } from "./available-hours.entity.ts";

export class EventEntity {
  name: string | undefined;
  duration: number | undefined;
  description: string | undefined;
  schedule: AvailableHoursEntity[] | undefined;

  constructor(data: Partial<EventEntity>) {
    this.name = data.name;
    this.duration = data.duration;
    this.description = data.description;
  }

  setSchedule(schedule: AvailableHoursEntity[]) {
    this.schedule = schedule;
  }
}
