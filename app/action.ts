"use server";
import { sql } from "@vercel/postgres";

export async function sendMessage(text: string) {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  const timestamp = new Date().toISOString();
  await sql`INSERT INTO messages (text, timestamp, address) VALUES (${text}, ${timestamp}, ${address});`;

  // Returning new result
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  return rows;
}
