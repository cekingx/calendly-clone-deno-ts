import type { AvailableHoursEntity } from "./available-hours.entity.ts";

export class EventEntity {
  id: number | undefined;
  name: string | undefined;
  duration: number | undefined;
  description: string | undefined;
  schedule: AvailableHoursEntity[] | undefined;

  constructor(data: Partial<EventEntity>) {
    this.id = data.id;
    this.name = data.name;
    this.duration = data.duration;
    this.description = data.description;
  }

  setSchedule(schedule: AvailableHoursEntity[]) {
    this.schedule = schedule;
  }
}
