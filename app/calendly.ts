import { ForGettingAvailability } from './driving-port/for-getting-availability.ts';
import type { Event } from "./entity/event.ts";
import { AvailableHours } from './entity/schedule.ts';

export class Calendly implements ForGettingAvailability {
  event: Event | undefined;

  getAvailability(month: Date): Record<string, AvailableHours[]> {
    console.log('Getting availability for month:', month);
    console.log('Event:', this.event);
    return {};
  }

  setEvent(event: Event) {
    this.event = event;
  }
}