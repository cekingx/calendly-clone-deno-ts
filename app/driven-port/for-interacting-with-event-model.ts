import type { Event } from "../entity/event.ts";

export interface ForInteractingWithEventModel {
  getById(id: number): Promise<Event | Error>;
  save(event: Event): Promise<Event | Error>;
}
