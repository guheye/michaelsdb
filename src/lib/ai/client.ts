import Anthropic from "@anthropic-ai/sdk";

export const AI_MODEL = "claude-haiku-4-5-20251001";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}
