import { getAddress } from "@/chopin";

export default async function Home() {
  return <main>Hello, {(await getAddress()) ?? "Anon"}</main>;
}
