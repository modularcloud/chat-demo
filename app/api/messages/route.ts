import { sql } from "@vercel/postgres";

export async function GET() {
  const messages =
    await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  return new Response(JSON.stringify(messages.rows), { status: 200 });
}

export const revalidate = 0;
