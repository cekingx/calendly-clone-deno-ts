export class Timeslot {
  start: string;
  end: string;

  constructor(data: Timeslot) {
    this.start = data.start;
    this.end = data.end;
  }
}
