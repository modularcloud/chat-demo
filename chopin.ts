import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

/*
 * Placeholders until we install chopin
 */

export async function getAddress() {
  const address = cookies().get("address");
  if (address) {
    return address.value;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  if (!request.cookies.has("address")) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(20));
    const address = "0x" + Buffer.from(randomBytes).toString("hex");
    request.cookies.set("address", address);
    const response = await fetch(request);
    response.headers.set("Set-Cookie", "address=" + address + ";");
    return response;
  }
}
