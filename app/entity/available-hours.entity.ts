export class AvailableHoursEntity {
  day: number;
  start: number;
  end: number;

  constructor(data: AvailableHoursEntity) {
    this.day = data.day;
    this.start = data.start;
    this.end = data.end;
  }
}
