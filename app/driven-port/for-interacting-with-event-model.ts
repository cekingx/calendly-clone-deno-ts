import type { EventEntity } from "../entity/event.entity.ts";

export interface ForInteractingWithEventModel {
  getById(id: number): Promise<EventEntity | Error>;
  save(event: EventEntity): Promise<EventEntity | Error>;
}
