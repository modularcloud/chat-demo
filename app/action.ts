"use server";
import { getAddress } from "@/chopin";
import { sql } from "@vercel/postgres";

export async function sendMessage(text: string) {
  const address = await getAddress();
  const timestamp = new Date().toISOString();
  await sql`INSERT INTO messages (text, timestamp, address) VALUES (${text}, ${timestamp}, ${address});`;

  // Returning new result
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  return rows;
}

