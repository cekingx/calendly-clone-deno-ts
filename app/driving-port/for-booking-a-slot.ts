import type { UserEntity } from "../entity/user.entity.ts";

export interface ForBookingASlot {
  book(eventId: number, start: Date, booker: UserEntity): Promise<boolean | Error>
}