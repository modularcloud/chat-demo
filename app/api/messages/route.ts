import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  // Simply query using the SQL client
  const messages =
    await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  return NextResponse.json(messages.rows);
}

export async function POST(request: NextRequest) {
  const text = await request.text();
  if (text === "") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // For docs demo purposes, we do not depend on Chopin runtime APIs here
  const address = "anonymous";

  // Use server time for demo purposes
  const timestamp = new Date(Date.now()).toISOString();

  // Insert the message into the database
  await sql`INSERT INTO messages (text, timestamp, address) VALUES (${text}, ${timestamp}, ${address});`;

  // Returning new result
  return GET();
}

export const revalidate = 0;
