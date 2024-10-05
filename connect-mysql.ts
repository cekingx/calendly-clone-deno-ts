import { createConnection } from "mysql2/promise";
import { EventModelAdapter } from "./adapter/event-model.adapter.ts";
import "@std/dotenv/load"

async function main() {
  const connection = await createConnection({
    user: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASS'),
    database: Deno.env.get('DB_NAME'),
    host: Deno.env.get('DB_HOST')
  })
  const prepare = await connection.prepare(`
    select * from event
    left join available_hour on (event.id = available_hour.event_id)
    where event.id = ?
  `)
  const [result] = await prepare.execute([1])
  console.log('result', result)
  connection.destroy()
}

main().catch((error) => {
  console.log(error)
})