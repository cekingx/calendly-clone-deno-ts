import type { ForInteractingWithMeetingModel } from "../app/driven-port/for-interacting-with-meeting-model.ts";
import type { MeetingEntity } from "../app/entity/meeting.entity.ts";
import type { UserEntity } from "../app/entity/user.entity.ts";
import { AbstractModel } from "./abstract-model.ts";

export class MeetingModelAdapter extends AbstractModel
  implements ForInteractingWithMeetingModel {
  async save(
    meeting: MeetingEntity,
    booker: UserEntity,
  ): Promise<MeetingEntity | Error> {
    if (!this.connection) {
      return new Error("Connection not set");
    }
    if (!meeting.event) {
      return new Error("Event not set");
    }

    const prepare = await this.connection.prepare(`
      insert into meeting (start, event_id, booker_id)   
      values (?, ?, ?)
    `);
    const [result] = await prepare.execute([
      meeting.start,
      meeting.event.id,
      booker.id,
    ]);
    return new Error("Method not implemented.");
  }
}
