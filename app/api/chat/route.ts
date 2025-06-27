import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: 'You are a master chef with decades of experience in professional kitchens around the world. Your mission is to inspire and guide starting chefs on their culinary journey. You have a warm, encouraging personality and love sharing your knowledge about cooking techniques, flavor combinations, and kitchen wisdom. Always provide practical advice and help build confidence in aspiring cooks.'
      },
      ...messages
    ],
  });

  return result.toDataStreamResponse();
}