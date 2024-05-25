import React, { useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Message } from "ai"
import Markdown from "react-markdown"
import { DBMessage } from "@/@types/main"

export default function Chat({
  fileId,
  prevMessages,
}: {
  fileId: string
  prevMessages: DBMessage[]
}) {
  const formattedPrevMessages: Message[] = prevMessages.map(
    (item: DBMessage) => ({
      id: item.id,
      content: item.text,
      role: item.isUserMessage ? "user" : "assistant",
    })
  )
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: formattedPrevMessages,
    body: { fileId },
  })
  const chatParent = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const domNode = chatParent.current
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight
    }
  })

  return (
    <div className="flex flex-col w-full h-[500px] lg:w-3/4 lg:h-full">
      <ul ref={chatParent} className="flex-1 flex-col overflow-y-auto px-4">
        {messages.map((m) => (
          <>
            {m.role === "user" ? (
              <li key={m.id} className="flex flex-row-reverse my-4">
                <div className="flex shadow rounded-lg p-4 bg-green-600">
                  <Markdown>{m.content}</Markdown>
                </div>
              </li>
            ) : (
              <li key={m.id} className="flex flex-row my-4">
                <div className="flex shadow rounded-lg p-4 bg-gray-300">
                  <Markdown>{m.content}</Markdown>
                </div>
              </li>
            )}
          </>
        ))}
      </ul>
      <section className="p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl mx-auto items-center"
        >
          <Input
            className="flex-1 min-h-[40px]"
            placeholder="Type your question here..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button className="ml-2" type="submit">
            Submit
          </Button>
        </form>
      </section>
    </div>
  )
}
