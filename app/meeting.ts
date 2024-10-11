import type { ForInteractingWithMeetingModel } from "./driven-port/for-interacting-with-meeting-model.ts";
import type { ForBookingASlot } from "./driving-port/for-booking-a-slot.ts";
import type { Availability } from "./driving-port/for-getting-availability.ts";
import { EventEntity } from "./entity/event.entity.ts";
import { MeetingEntity } from "./entity/meeting.entity.ts";
import type { UserEntity } from "./entity/user.entity.ts";
import { TimeslotStatus } from "./enum/timeslot-status.enum.ts";
import type { Event } from "./event.ts";

export class Meeting implements ForBookingASlot {
  private meetingModel: ForInteractingWithMeetingModel | undefined;
  private event: Event | undefined;

  async book(
    eventId: number,
    start: Date,
    booker: UserEntity,
  ): Promise<boolean | Error> {
    if (!this.meetingModel) {
      return new Error("Meeting model not set");
    }
    if (!this.event) {
      return new Error("Event not set");
    }

    const eventEntity = await this.event.getEvent(eventId);
    if (eventEntity instanceof Error) {
      return eventEntity;
    }

    const month = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth()),
    );
    const availability = await this.event.getAvailability(month, eventId);
    if (availability instanceof Error) {
      return availability;
    }

    const startDay = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
    );
    const slots = availability[startDay.toISOString()];
    if (!slots) {
      return new Error("Slot not available");
    }

    const slot = slots.find((slot) =>
      new Date(slot.start).getTime() === start.getTime()
    );
    if (!slot || slot.status !== TimeslotStatus.AVAILABLE) {
      return new Error("Slot not available");
    }

    const meeting = new MeetingEntity({
      start,
      event: eventEntity,
    });

    const result = await this.meetingModel.save(meeting, booker);
    if (result instanceof Error) {
      return result;
    }

    return true;
  }

  setMeetingModel(meetingModel: ForInteractingWithMeetingModel): void {
    this.meetingModel = meetingModel;
  }

  setEvent(event: Event): void {
    this.event = event;
  }
}
