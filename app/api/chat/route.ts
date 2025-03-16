// This file will proxy requests to your FastAPI backend
import { NextResponse } from "next/server";

// Your FastAPI endpoint URL
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000/chat";

export async function POST(req: Request) {
  try {
    // Get the request body
    const body = await req.json();

    // Check if the FastAPI endpoint supports streaming
    const supportsStreaming = process.env.FASTAPI_SUPPORTS_STREAMING === "true";

    if (supportsStreaming) {
      // If your FastAPI endpoint supports streaming responses
      const response = await fetch(FASTAPI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Return the stream directly
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // If your FastAPI endpoint doesn't support streaming, we'll simulate it
      const response = await fetch(FASTAPI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`FastAPI responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Create a simple stream that sends the entire response at once
      const stream = new ReadableStream({
        start(controller) {
          // Format the response to match what the AI SDK expects
          const message = {
            id: Date.now().toString(),
            role: "assistant",
            content: data.response || data.message || data.content || "",
          };

          // Send the message as a stream event
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "message", message })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }
  } catch (error) {
    console.error("Error communicating with FastAPI:", error);
    return NextResponse.json({ error: "Failed to communicate with chat API" }, { status: 500 });
  }
}
