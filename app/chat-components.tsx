"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "./component";
import { wrapServerAction } from "./lt-event";

// Component for displaying the sender's address
export function MessageSender({ 
  address, 
  fromSelf 
}: { 
  address: string; 
  fromSelf: boolean;
}) {
  return (
    <div
      className={cn(
        "text-[#909195] text-[0.75rem] w-full",
        fromSelf ? "pr-[0.62rem] text-right" : "pl-[0.62rem]"
      )}
    >
      <Tooltip>
        <TooltipTrigger className="cursor-default">
          {`${address.slice(0, 5)}...${address.slice(-3)}`}
        </TooltipTrigger>
        <TooltipContent align={fromSelf ? "end" : "start"}>
          {address}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// Component for the message bubble with directional arrow
export function MessageBubble({ 
  text, 
  fromSelf 
}: { 
  text: string; 
  fromSelf: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full flex items-end",
        fromSelf ? "flex-row-reverse" : "flex-row"
      )}
    >
      {fromSelf ? (
        <div className="pb-[.37rem] z-10 w-[0.75rem] overflow-hidden flex flex-col items-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="17"
            viewBox="0 0 14 17"
            fill="none"
          >
            <path
              d="M11.8342 16H1V2L7.5001 10.509C7.7487 10.8344 8.0458 11.1197 8.381 11.355L12.4086 14.1815C13.2084 14.7427 12.8113 16 11.8342 16Z"
              fill="#4378FF"
              stroke="#395BB1"
            />
          </svg>
        </div>
      ) : (
        <div className="pb-[.37rem] z-10 w-[0.75rem] overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="17"
            viewBox="0 0 14 17"
            fill="none"
          >
            <path
              d="M2.16579 16H13V2L6.4999 10.509C6.2513 10.8344 5.9542 11.1197 5.619 11.355L1.59136 14.1815C0.791551 14.7427 1.18869 16 2.16579 16Z"
              fill="#20232C"
              stroke="#242730"
            />
          </svg>
        </div>
      )}
      <div
        className={cn(
          "rounded-[0.5rem] border flex-shrink-0 px-[.75rem] py-[.25rem]",
          fromSelf
            ? "bg-[#4378FF] border-[#395BB1] mr-[-.0625rem]"
            : "bg-[#20232C] border-[#242730] ml-[-.0625rem]"
        )}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}

// Component for a complete message item
export function MessageItem({ 
  message, 
  currentAddress, 
  index 
}: { 
  message: Message; 
  currentAddress: string | null;
  index: number;
}) {
  const fromSelf = message.address === currentAddress;
  
  return (
    <div
      key={`${message.id}#${message.timestamp}`}
      className="flex flex-col mt-[-0.625rem]"
    >
      <MessageSender address={message.address} fromSelf={fromSelf} />
      <MessageBubble text={message.text} fromSelf={fromSelf} />
    </div>
  );
}

// Component for the messages container
export function ChatMessages({
  messages,
  address
}: {
  messages: Message[];
  address: string | null;
}) {
  return (
    <div className="flex flex-col-reverse gap-4 flex-grow overflow-scroll py-3">
      {messages.map((message, index) => (
        <MessageItem 
          key={`${message.id}#${message.timestamp}`}
          message={message} 
          currentAddress={address} 
          index={index} 
        />
      ))}
    </div>
  );
}

// Component for the chat input form
export function ChatInput({
  address,
  data,
  mutate,
  formRef
}: {
  address: string | null;
  data: Message[];
  mutate: any;
  formRef: React.RefObject<HTMLFormElement>;
}) {
  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        const text = formData.get("message") as string;
        if (text !== "" && address !== null) {
          formRef.current?.reset();
          await mutate(
            wrapServerAction(
              fetch("/api/messages", {
                method: "POST",
                body: text,
              }).then((res) => res.json())
            ),
            {
              optimisticData: [
                {
                  text,
                  id: -1,
                  timestamp: new Date().getTime(),
                  address: address!,
                },
                ...data,
              ],
            }
          );
        }
      }}
      className="rounded-[0.625rem] border border-[#1F222B] bg-[#11141D] flex flex-row gap-[0.25rem] p-[0.25rem]"
    >
      <input
        className="flex-grow border-none bg-transparent pl-[0.5rem] focus:outline-none focus:ring-0"
        placeholder="Send your message"
        name="message"
      />
      <Tooltip>
        <TooltipTrigger
          type="submit"
          className="px-[0.75rem] py-[0.12rem] bg-[#4378FF] rounded-[.375rem]"
        >
          Send
        </TooltipTrigger>
        <TooltipContent align="end">
          {`Your address is ${address}`}
        </TooltipContent>
      </Tooltip>
    </form>
  );
} 