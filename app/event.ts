import { DAY } from "@std/datetime";
import { ForGettingAvailability } from "./driving-port/for-getting-availability.ts";
import type { EventEntity } from "./entity/event.entity.ts";
import type { TimeslotEntity } from "./entity/timeslot.entity.ts";
import type { AvailableHoursEntity } from "./entity/available-hours.entity.ts";
import type { ForInteractingWithEventModel } from "./driven-port/for-interacting-with-event-model.ts";
import { TimeslotStatus } from "./enum/timeslot-status.enum.ts";

export class Event implements ForGettingAvailability {
  eventRepo: ForInteractingWithEventModel | undefined;

  async getAvailability(
    month: Date,
    eventId: number,
  ): Promise<Record<string, TimeslotEntity[]> | Error> {
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
    const result: Record<string, TimeslotEntity[]> = {};
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

  getAvailabilityInADay(
    date: Date,
    event: EventEntity,
  ): TimeslotEntity[] | Error {
    const timeslots: TimeslotEntity[] = [];
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
    availability: AvailableHoursEntity,
    event: EventEntity,
  ): TimeslotEntity[] | Error {
    const result: TimeslotEntity[] = [];
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
        status: this.getSlotStatus(new Date(date.getTime() + start)),
      });
    }

    return result;
  }

  getSlotStatus(date: Date): TimeslotStatus {
    const today = new Date();
    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );
    if (date.getTime() < todayUTC) {
      return TimeslotStatus.UNAVAILABLE;
    }

    return TimeslotStatus.AVAILABLE;
  }

  getEndOfMonth(date: Date): Date {
    const nextMonth = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1),
    );
    const endOfMonth = new Date(nextMonth.getTime() - 1 * DAY);
    return endOfMonth;
  }

  async getEvent(id: number): Promise<EventEntity | Error> {
    if (!this.eventRepo) {
      return new Error("Repo not set");
    }
    return this.eventRepo.getById(id);
  }

  setEventRepo(repo: ForInteractingWithEventModel) {
    this.eventRepo = repo;
  }
}
