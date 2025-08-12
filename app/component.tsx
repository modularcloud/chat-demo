"use client";

import { useRef } from "react";
import useSWR from "swr";
import { useAddress } from "@chopinframework/react";
import { 
  ChatMessages, 
  ChatInput 
} from "./chat-components";
import { TooltipProvider } from "../components/ui/tooltip";

export type Message = {
  id: number;
  text: string;
  timestamp: number;
  address: string;
};

export function ChatClientComponent({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  // Get the address of the logged in user on the client
  const address = useAddress();

  // Use your api like its you normally would
  const { mutate, data } = useSWR(
    "/api/messages",
    (url) => fetch(url).then((res) => res.json()),
    {
      fallbackData: initialMessages,
      refreshInterval: 500,
    }
  );
  const formRef = useRef<HTMLFormElement>(null);
  
  return (
    <TooltipProvider>
      <div className="flex flex-col h-full pb-3 px-3 text-sm leading-6">
        <ChatMessages messages={data} address={address || "anonymous"} />
        <ChatInput 
          address={address || "anonymous"} 
          data={data} 
          mutate={mutate}
          formRef={formRef} 
        />
      </div>
    </TooltipProvider>
  );
}
