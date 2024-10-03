import { describe, it } from "@std/testing/bdd";
import { AvailableHours, Schedule } from "./entity/schedule.ts";
import { Calendly } from "./calendly.ts";
import { Event } from "./entity/event.ts";

describe("Calendly", () => {
  it("should get availability for a month", () => {
    const schedule = new Schedule();
    schedule.setHours({
      2: [
        new AvailableHours({ start: 1, end: 2 }),
        new AvailableHours({ start: 3, end: 4 }),
      ],
      3: [
        new AvailableHours({ start: 2, end: 3 }),
        new AvailableHours({ start: 4, end: 5 }),
      ]
    })

    const event = new Event({
      name: "Meeting",
      duration: 1,
      description: "Meeting description",
    })
    event.setSchedule(schedule);

    const calendly = new Calendly();
    calendly.setEvent(event);

    const availability = calendly.getAvailability(new Date(2021, 2, 1));
  });
})