import type { ForInteractingWithEventModel } from "../app/driven-port/for-interacting-with-event-model.ts";
import { AvailableHoursEntity } from "../app/entity/available-hours.entity.ts";
import { EventEntity } from "../app/entity/event.entity.ts";
import type { Connection, RowDataPacket } from "mysql2/promise";

export class EventModelAdapter implements ForInteractingWithEventModel {
  connection: Connection | undefined;

  async getById(id: number): Promise<EventEntity | Error> {
    if (!this.connection) {
      return new Error("Connection not set");
    }
    const prepare = await this.connection.prepare(`
      select * from event
      left join available_hour on (event.id = available_hour.event_id)
      where event.id = ?
    `);
    const [result] = await prepare.execute([id]);
    if (Array.isArray(result) && result.length < 1) {
      return new Error("Not found");
    }

    const event: EventEntity = new EventEntity({
      name: (result as RowDataPacket)[0].name,
      description: (result as RowDataPacket)[0].description,
      duration: (result as RowDataPacket)[0].duration,
    });
    event.schedule = [];

    for (const row of result as Array<any>) {
      event.schedule.push(
        new AvailableHoursEntity({ day: row.day, start: row.start, end: row.end }),
      );
    }
    return event;
  }

  save(_event: EventEntity): Promise<EventEntity | Error> {
    throw new Error("Method not implemented.");
  }

  setConnection(connection: Connection) {
    this.connection = connection;
  }
}
