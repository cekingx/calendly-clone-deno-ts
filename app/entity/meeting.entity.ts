import type { EventEntity } from "./event.entity.ts";

export class MeetingEntity {
  id: number | undefined;
  event: EventEntity | undefined;
  start: Date | undefined;

  constructor(data: Partial<MeetingEntity>) {
    this.id = data.id;
    this.event = data.event;
    this.start = data.start;
  }
}
