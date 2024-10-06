export class AvailableHours {
  day: number;
  start: number;
  end: number;

  constructor(data: AvailableHours) {
    this.day = data.day;
    this.start = data.start;
    this.end = data.end;
  }
}
