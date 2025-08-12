"use server";
import { sql } from "@vercel/postgres";

export async function sendMessage(text: string) {
  const address = "anonymous";
  const timestamp = new Date(Date.now()).toISOString();

  // Insert the message into the database
  await sql`INSERT INTO messages (text, timestamp, address) VALUES (${text}, ${timestamp}, ${address});`;

  // Returning new result
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  return rows;
}
