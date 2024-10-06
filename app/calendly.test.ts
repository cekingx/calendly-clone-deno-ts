import { beforeEach, describe, it } from "@std/testing/bdd";
import { Event } from "./entity/event.ts";
import { expect } from "@std/expect";
import { HOUR, MINUTE } from "@std/datetime";
import { Calendly } from "./calendly.ts";
import { AvailableHours } from "./entity/available-hours.ts";
import type { ForInteractingWithEventModel } from "./driven-port/for-interacting-with-event-model.ts";

const event = new Event({
  name: "Meeting",
  duration: 60 * MINUTE,
  description: "Meeting description",
});
event.setSchedule([
  new AvailableHours({ day: 1, start: 8 * HOUR, end: 10 * HOUR }),
  new AvailableHours({ day: 1, start: 17 * HOUR, end: 18 * HOUR }),
  new AvailableHours({ day: 3, start: 17 * HOUR, end: 18 * HOUR }),
]);

const mockEventRepo: ForInteractingWithEventModel = {
  getById: function (_id: number): Promise<Event | Error> {
    return new Promise((resolve) => resolve(event));
  },
  save: function (_event: Event): Promise<Event | Error> {
    return new Promise((_resolve, reject) =>
      reject(new Error("Unimplemented"))
    );
  },
};

describe("Calendly", () => {
  let app: Calendly;

  beforeEach(function () {
    app = new Calendly();
    app.setEventRepo(mockEventRepo);
  });

  it("should console", async function () {
    console.log("event", await app.getEvent(1));
  });

  it("should get availability for a month", async () => {
    const availability = await app.getAvailability(
      new Date(Date.UTC(2024, 0, 1)),
      1,
    );
    expect(availability).toEqual({
      "2024-01-01T00:00:00.000Z": [
        { start: "2024-01-01T08:00:00.000Z", end: "2024-01-01T09:00:00.000Z" },
        { start: "2024-01-01T09:00:00.000Z", end: "2024-01-01T10:00:00.000Z" },
        { start: "2024-01-01T17:00:00.000Z", end: "2024-01-01T18:00:00.000Z" },
      ],
      "2024-01-03T00:00:00.000Z": [
        { start: "2024-01-03T17:00:00.000Z", end: "2024-01-03T18:00:00.000Z" },
      ],
      "2024-01-08T00:00:00.000Z": [
        { start: "2024-01-08T08:00:00.000Z", end: "2024-01-08T09:00:00.000Z" },
        { start: "2024-01-08T09:00:00.000Z", end: "2024-01-08T10:00:00.000Z" },
        { start: "2024-01-08T17:00:00.000Z", end: "2024-01-08T18:00:00.000Z" },
      ],
      "2024-01-10T00:00:00.000Z": [
        { start: "2024-01-10T17:00:00.000Z", end: "2024-01-10T18:00:00.000Z" },
      ],
      "2024-01-15T00:00:00.000Z": [
        { start: "2024-01-15T08:00:00.000Z", end: "2024-01-15T09:00:00.000Z" },
        { start: "2024-01-15T09:00:00.000Z", end: "2024-01-15T10:00:00.000Z" },
        { start: "2024-01-15T17:00:00.000Z", end: "2024-01-15T18:00:00.000Z" },
      ],
      "2024-01-17T00:00:00.000Z": [
        { start: "2024-01-17T17:00:00.000Z", end: "2024-01-17T18:00:00.000Z" },
      ],
      "2024-01-22T00:00:00.000Z": [
        { start: "2024-01-22T08:00:00.000Z", end: "2024-01-22T09:00:00.000Z" },
        { start: "2024-01-22T09:00:00.000Z", end: "2024-01-22T10:00:00.000Z" },
        { start: "2024-01-22T17:00:00.000Z", end: "2024-01-22T18:00:00.000Z" },
      ],
      "2024-01-24T00:00:00.000Z": [
        { start: "2024-01-24T17:00:00.000Z", end: "2024-01-24T18:00:00.000Z" },
      ],
      "2024-01-29T00:00:00.000Z": [
        { start: "2024-01-29T08:00:00.000Z", end: "2024-01-29T09:00:00.000Z" },
        { start: "2024-01-29T09:00:00.000Z", end: "2024-01-29T10:00:00.000Z" },
        { start: "2024-01-29T17:00:00.000Z", end: "2024-01-29T18:00:00.000Z" },
      ],
      "2024-01-31T00:00:00.000Z": [
        { start: "2024-01-31T17:00:00.000Z", end: "2024-01-31T18:00:00.000Z" },
      ],
    });
  });

  it("should get the end of the month", () => {
    const january = new Date(Date.UTC(2024, 0, 1));
    const endOfJanuary = app.getEndOfMonth(january);
    expect(endOfJanuary).toEqual(new Date(Date.UTC(2024, 0, 31)));

    const february = new Date(Date.UTC(2024, 1, 1));
    const endOfFebruary = app.getEndOfMonth(february);
    expect(endOfFebruary).toEqual(new Date(Date.UTC(2024, 1, 29)));

    const april = new Date(Date.UTC(2024, 3, 1));
    const endOfApril = app.getEndOfMonth(april);
    expect(endOfApril).toEqual(new Date(Date.UTC(2024, 3, 30)));
  });

  describe("Timeslot in a range", () => {
    it("should get two slot", () => {
      const slots = app.getSlotInRange(
        new Date(Date.UTC(2024, 0, 1)),
        { day: 1, start: 8 * HOUR, end: 10 * HOUR },
        event,
      );
      expect(slots).toEqual([
        {
          start: "2024-01-01T08:00:00.000Z",
          end: "2024-01-01T09:00:00.000Z",
        },
        {
          start: "2024-01-01T09:00:00.000Z",
          end: "2024-01-01T10:00:00.000Z",
        },
      ]);
    });

    it("should get one slot", () => {
      const slots = app.getSlotInRange(
        new Date(Date.UTC(2024, 0, 1)),
        { day: 1, start: 8 * HOUR, end: 9 * HOUR },
        event,
      );

      expect(slots).toEqual([
        {
          start: "2024-01-01T08:00:00.000Z",
          end: "2024-01-01T09:00:00.000Z",
        },
      ]);
    });
  });

  describe("Timeslot in a day", () => {
    it("should get three slot", () => {
      const slots = app.getAvailabilityInADay(
        new Date(Date.UTC(2024, 0, 1)),
        event,
      );

      expect(slots).toEqual([
        {
          start: "2024-01-01T08:00:00.000Z",
          end: "2024-01-01T09:00:00.000Z",
        },
        {
          start: "2024-01-01T09:00:00.000Z",
          end: "2024-01-01T10:00:00.000Z",
        },
        {
          start: "2024-01-01T17:00:00.000Z",
          end: "2024-01-01T18:00:00.000Z",
        },
      ]);
    });
  });
});
