import { OpenAI } from 'openai';

const config = useRuntimeConfig();
const openai = new OpenAI({ apiKey: config.openaiApiKey });

export default defineEventHandler(async (event) => {
  const { message } = await readBody<{ message: string }>(event);

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: 'gpt-3.5-turbo',
  });

  if (completion.choices.length) {
    const { message } = completion.choices[0];
    return { data: message.content };
  }

  return { data: null };
});
