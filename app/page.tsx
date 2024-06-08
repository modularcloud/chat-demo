import { getAddress } from "@/chopin";
import { sql } from "@vercel/postgres";
import { ChatClientComponent, Message } from "./client-component";

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
  const address = await getAddress();
  return <ChatClientComponent initialMessages={messages.rows} address={address} />;
}

export const revalidate = 0;
