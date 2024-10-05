import { DAY } from "@std/datetime";
import { ForGettingAvailability } from "./driving-port/for-getting-availability.ts";
import type { Event } from "./entity/event.ts";
import { AvailableHours, Timeslot } from "./entity/schedule.ts";

export class Availability implements ForGettingAvailability {
  event: Event | undefined;

  getAvailability(month: Date): Record<string, Timeslot[]> | Error {
    const result: Record<string, Timeslot[]> = {};
    if (!this.event) {
      return new Error("Event is not set");
    }
    if (!this.event?.schedule?.days) {
      return new Error("Days is not set");
    }
    const daysArray = Object.keys(this.event.schedule?.days).map((item) =>
      Number(item)
    );

    const startOfMonth = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth()),
    );
    const endOfMonth = this.getEndOfMonth(startOfMonth);
    for (let date = 1; date <= endOfMonth.getUTCDate(); date++) {
      const today = new Date(
        Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), date),
      );
      if (!daysArray.includes(today.getUTCDay())) {
        continue;
      }
      const timeslots = this.getAvailabilityInADay(today);
      if (timeslots instanceof Error) {
        return timeslots;
      }
      result[today.toISOString()] = timeslots;
    }

    return result;
  }

  getAvailabilityInADay(date: Date): Timeslot[] | Error {
    const timeslots: Timeslot[] = [];
    if (!this.event?.schedule?.days) {
      return new Error("Days is not set");
    }
    const day = date.getUTCDay();
    for (const dayOfWeek of Object.keys(this.event?.schedule?.days)) {
      if (day != Number(dayOfWeek)) {
        continue;
      }

      for (const availableHour of this.event.schedule.days[Number(dayOfWeek)]) {
        const slot = this.getSlotInRange(date, availableHour);
        if (slot instanceof Error) {
          return slot;
        }
        timeslots.push(...slot);
      }
    }

    return timeslots;
  }

  getSlotInRange(date: Date, availability: AvailableHours): Timeslot[] | Error {
    const result: Timeslot[] = [];
    if (!this.event?.duration) {
      return new Error("Duration not set");
    }

    const availableSlot = Math.floor(
      (availability.end - availability.start) / this.event?.duration,
    );
    for (let i = 0; i < availableSlot; i++) {
      const start = availability.start + (this.event.duration * i);
      const end = availability.start + (this.event.duration * (i + 1));

      result.push({
        start: (new Date(date.getTime() + start)).toISOString(),
        end: (new Date(date.getTime() + end)).toISOString(),
      });
    }

    return result;
  }

  getEndOfMonth(date: Date): Date {
    const nextMonth = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1),
    );
    const endOfMonth = new Date(nextMonth.getTime() - 1 * DAY);
    return endOfMonth;
  }

  setEvent(event: Event) {
    this.event = event;
  }
}
