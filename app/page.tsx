import { sql } from "@vercel/postgres";
import { ChatClientComponent, type Message } from "./component";

export default async function Page() {
  let messages;

  try {
    messages =
      await sql<Message>`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
  } catch (e: any) {
    if (e.message.includes('relation "messages" does not exist')) {
      await sql`CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL,
            address VARCHAR(255) NOT NULL
        );`;

      messages =
        await sql<Message>`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20;`;
    } else {
      throw e;
    }
  }
  return (
    <ChatClientComponent initialMessages={messages.rows} />
  );
}

export const revalidate = 0;
