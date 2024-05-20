import React, { useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export default function Chat({ fileId }: { fileId: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {},
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
        {messages.map((m, index) => (
          <>
            {m.role === "user" ? (
              <li key={index} className="flex flex-row-reverse my-4">
                <div className="flex shadow rounded-lg p-4 bg-green-600">
                  {m.content}
                </div>
              </li>
            ) : (
              <li key={index} className="flex flex-row my-4">
                <div className="flex shadow rounded-lg p-4 bg-gray-300">
                  {m.content}
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
