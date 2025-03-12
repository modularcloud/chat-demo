"use server";
import { sql } from "@vercel/postgres";
import { getAddress, Oracle } from "@chopinframework/next";

export async function sendMessage(text: string) {
  // Get the address of the logged in user
  const address = await getAddress();

  // Securely get the current timestamp
  const now = await Oracle.now();
  const timestamp = new Date(now).toISOString();

  // Insert the message into the database
  await sql`INSERT INTO messages (text, timestamp, address) VALUES (${text}, ${timestamp}, ${address});`;

  // Returning new result
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  return rows;
}
