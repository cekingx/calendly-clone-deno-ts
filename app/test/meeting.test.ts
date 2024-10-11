import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertSpyCall, spy } from "@std/testing/mock";
import { Meeting } from "../meeting.ts";
import { Event } from "../event.ts";
import { EventEntity } from "../entity/event.entity.ts";
import { HOUR, MINUTE } from "@std/datetime";
import { AvailableHoursEntity } from "../entity/available-hours.entity.ts";
import type { ForInteractingWithEventModel } from "../driven-port/for-interacting-with-event-model.ts";
import { UserEntity } from "../entity/user.entity.ts";
import type { ForInteractingWithMeetingModel } from "../driven-port/for-interacting-with-meeting-model.ts";
import { MeetingEntity } from "../entity/meeting.entity.ts";

const eventEntity = new EventEntity({
  id: 1,
  name: "Meeting",
  duration: 60 * MINUTE,
  description: "Meeting description",
});
const today = new Date();
eventEntity.setSchedule([
  new AvailableHoursEntity({
    day: today.getUTCDay(),
    start: 8 * HOUR,
    end: 9 * HOUR,
  }),
]);
const mockEventRepo: ForInteractingWithEventModel = {
  getById: function (_id: number): Promise<EventEntity | Error> {
    return new Promise((resolve) => resolve(eventEntity));
  },
  save: function (_event: EventEntity): Promise<EventEntity | Error> {
    return new Promise((_resolve, reject) =>
      reject(new Error("Unimplemented"))
    );
  },
};
const event = new Event();
event.setEventRepo(mockEventRepo);

const toSpy = spy(
  function (
    _meeting: MeetingEntity,
    _booker: UserEntity,
  ): Promise<MeetingEntity | Error> {
    return new Promise((resolve, _reject) =>
      resolve(new Error("Unimplementedddd"))
    );
  },
);

const mockMeetingRepo: ForInteractingWithMeetingModel = {
  save: toSpy,
};

describe("Meeting", () => {
  let meeting: Meeting;

  beforeEach(() => {
    meeting = new Meeting();
    meeting.setEvent(event);
    meeting.setMeetingModel(mockMeetingRepo);
  });

  describe("Book a slot", () => {
    it("should not get a slot", async () => {
      const userEntity: UserEntity = new UserEntity({
        id: 1,
        name: "John Doe",
        username: "john.doe",
      });
      const meetingEntity: MeetingEntity = new MeetingEntity({
        start: new Date(
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            8,
            0,
            0,
          ),
        ),
        event: eventEntity,
      });

      await meeting.book(
        1,
        new Date(
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            8,
            0,
            0,
          ),
        ),
        userEntity,
      );
      assertSpyCall(toSpy, 0, {
        args: [meetingEntity, userEntity],
      });
    });
  });
});
