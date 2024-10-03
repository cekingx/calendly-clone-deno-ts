export class Schedule {
  days: Record<number, AvailableHours[]> | undefined;

  setHours(days: Record<number, AvailableHours[]>) {
    this.days = days;
  }
}

export class AvailableHours {
  start: number;
  end: number;

  constructor(data: AvailableHours) {
    this.start = data.start;
    this.end = data.end;
  }
}