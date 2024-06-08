"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { sendMessage } from "./action";
import useSWR from "swr";

export type Message = {
  id: number;
  text: string;
  timestamp: number;
  address: string;
};

export function ChatClientComponent({
  initialMessages,
  address,
}: {
  initialMessages: Message[];
  address: string | null;
}) {
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
    <div className="flex flex-col h-full pb-3 px-3 text-sm leading-6">
      <div className="flex flex-col-reverse gap-4 flex-grow overflow-scroll py-3">
        {data.map((message: Message, index: number) => {
          if (message.text === "") {
            return null;
          }
          const fromSelf = message.address === address;
          return (
            <div
              key={index}
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
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        ref={formRef}
        action={async (formData: FormData) => {
          const text = formData.get("message") as string;
          if (text !== "" && address !== null) {
            formRef.current?.reset();
            await mutate(sendMessage(text), {
              optimisticData: [
                {
                  text,
                  id: -1,
                  timestamp: new Date().getTime(),
                  address: address!,
                },
                ...data,
              ],
            });
          }
        }}
        className="rounded-[0.625rem] border border-[#1F222B] bg-[#11141D] flex flex-row gap-[0.25rem] p-[0.25rem]"
      >
        <input
          className="flex-grow border-none bg-transparent pl-[0.5rem] focus:outline-none focus:ring-0"
          placeholder="Send your message"
          name="message"
        />
        <button
          type="submit"
          className="px-[0.75rem] py-[0.12rem] bg-[#4378FF] rounded-[.375rem]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
