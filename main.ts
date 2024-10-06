import { createConnection } from "mysql2/promise";
import { EventModelAdapter } from "./adapter/event-model.adapter.ts";
import { Calendly } from "./app/calendly.ts";
import "@std/dotenv/load";

async function main() {
  const connection = await createConnection({
    user: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASS"),
    database: Deno.env.get("DB_NAME"),
  });

  const eventModelAdapter = new EventModelAdapter();
  eventModelAdapter.setConnection(connection);

  const calendly = new Calendly();
  calendly.setEventRepo(eventModelAdapter);

  const eventId = 1;
  const month = new Date(Date.UTC(2024, 0));
  const result = await calendly.getAvailability(month, eventId);
  console.log("result", result);
  connection.destroy();
}

main().catch((error) => {
  console.log(error);
  Deno.exitCode = 1;
});
