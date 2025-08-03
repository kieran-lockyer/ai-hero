import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { model } from "~/model";
import { auth } from "~/server/auth";
import { searchSerper } from "~/serper";

export const maxDuration = 30;

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = await streamText({
    model,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    system: `You are a helpful AI assistant with the ability to search the web for information.

Follow these steps for each user message:
1. First, identify the most effective search query based on the user's question
2. Use the searchWeb tool with that query
3. Analyze the search results
4. Formulate your response based on the search results

When providing information from web searches, always cite your sources with inline links in the format [source](URL).

Be helpful, accurate, and concise in your responses.`,
    tools: {
      searchWeb: {
        description: "Search the web for information",
        inputSchema: z.object({
          query: z.string().describe("The query to search the web for"),
        }),
        execute: async ({ query }) => {
          const results = await searchSerper(
            { q: query, num: 10 },
            undefined,
          );

          return results.organic.map((result) => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet,
          }));
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
