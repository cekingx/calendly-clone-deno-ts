import type { MeetingEntity } from "../entity/meeting.entity.ts";
import type { UserEntity } from "../entity/user.entity.ts";

export interface ForInteractingWithMeetingModel {
  save(meeting: MeetingEntity, booker: UserEntity): Promise<MeetingEntity | Error>;
}