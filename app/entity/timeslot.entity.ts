import type { TimeslotStatus } from "../enum/timeslot-status.enum.ts";

export class TimeslotEntity {
  start: string;
  end: string;
  status: TimeslotStatus;

  constructor(data: TimeslotEntity) {
    this.start = data.start;
    this.end = data.end;
    this.status = data.status;
  }
}
