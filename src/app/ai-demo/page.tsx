"use client";

import { useChat } from "@ai-sdk/react";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Page() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    onFinish: (message, { usage, finishReason }) => {
      console.log("[AI SDK] Finished with message:", message);
      console.log("[AI SDK] Finished with usage:", usage);
      console.log("[AI SDK] Finished with reason:", finishReason);
    },
    onError: (error) => {
      console.log("[AI SDK] Error:", error);
    },
    onResponse: (response) => {
      console.log("[AI SDK] Received HTTP response from server:", response);
    },
  });

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, index) => {
            // text parts:
            if (part.type === "text") {
              return <div key={index}>{part.text}</div>;
            }

            // reasoning parts:
            if (part.type === "reasoning") {
              return (
                <pre key={index}>
                  {part.details.map((detail) =>
                    detail.type === "text" ? detail.text : "<redacted>",
                  )}
                </pre>
              );
            }
          })}
        </div>
      ))}

      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}

      {(status === "submitted" || status === "streaming") && (
        <div>
          {status === "submitted" && <SpinnerLoading />}
          <Button onClick={() => stop()}>Stop</Button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={status !== "ready"}
        />
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
