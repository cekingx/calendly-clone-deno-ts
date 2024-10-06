import { DAY } from "@std/datetime";
import { ForGettingAvailability } from "./driving-port/for-getting-availability.ts";
import type { Event } from "./entity/event.ts";
import type { Timeslot } from "./entity/timeslot.ts";
import type { AvailableHours } from "./entity/available-hours.ts";
import type { ForInteractingWithEventModel } from "./driven-port/for-interacting-with-event-model.ts";

export class Calendly implements ForGettingAvailability {
  eventRepo: ForInteractingWithEventModel | undefined;

  async getAvailability(
    month: Date,
    eventId: number,
  ): Promise<Record<string, Timeslot[]> | Error> {
    if (!this.eventRepo) {
      return new Error("Repo not set");
    }
    const event = await this.eventRepo.getById(eventId);
    if (event instanceof Error) {
      return event;
    }
    if (!event.schedule) {
      return new Error("Days is not set");
    }
    const result: Record<string, Timeslot[]> = {};
    const daysOfWeek = event.schedule.reduce((acc: number[], item) => {
      if (item.day && !acc.includes(item.day)) {
        acc.push(item.day);
      }
      return acc;
    }, []);

    const startOfMonth = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth()),
    );
    const endOfMonth = this.getEndOfMonth(startOfMonth);
    for (let date = 1; date <= endOfMonth.getUTCDate(); date++) {
      const today = new Date(
        Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), date),
      );
      if (!daysOfWeek.includes(today.getUTCDay())) {
        continue;
      }
      const timeslots = this.getAvailabilityInADay(today, event);
      if (timeslots instanceof Error) {
        return timeslots;
      }
      result[today.toISOString()] = timeslots;
    }

    return result;
  }

  getAvailabilityInADay(date: Date, event: Event): Timeslot[] | Error {
    const timeslots: Timeslot[] = [];
    if (!event?.schedule) {
      return new Error("Days is not set");
    }
    const day = date.getUTCDay();
    const availabilityInADay = event.schedule
      .filter((item) => item.day == day);

    for (const availableSlot of availabilityInADay) {
      const slot = this.getSlotInRange(date, availableSlot, event);
      if (slot instanceof Error) {
        return slot;
      }
      timeslots.push(...slot);
    }

    return timeslots;
  }

  getSlotInRange(
    date: Date,
    availability: AvailableHours,
    event: Event,
  ): Timeslot[] | Error {
    const result: Timeslot[] = [];
    if (!event?.duration) {
      return new Error("Duration not set");
    }

    const availableSlot = Math.floor(
      (availability.end - availability.start) / event.duration,
    );
    for (let i = 0; i < availableSlot; i++) {
      const start = availability.start + (event.duration * i);
      const end = availability.start + (event.duration * (i + 1));

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

  async getEvent(id: number): Promise<Event | Error> {
    if (!this.eventRepo) {
      return new Error("Repo not set");
    }
    return this.eventRepo.getById(id);
  }

  setEventRepo(repo: ForInteractingWithEventModel) {
    this.eventRepo = repo;
  }
}
