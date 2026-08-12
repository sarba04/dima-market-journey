import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { DIMA_SYSTEM_PROMPT } from "@/lib/dima-knowledge";

type ChatRequestBody = {
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const incoming = Array.isArray(body.messages) ? body.messages : null;
        if (!incoming || incoming.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const messages: ModelMessage[] = [
          ...incoming
            .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
            .slice(-20)
            .map((m) => ({
              role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
              content: m.content.slice(0, 4000),
            })),
        ];

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-2.5-flash"),
            instructions: DIMA_SYSTEM_PROMPT,
            messages,
            temperature: 0.7,
          });
          return result.toTextStreamResponse();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          const status = message.includes("429") ? 429 : message.includes("402") ? 402 : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
