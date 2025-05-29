// TODO: Integrate OpenAI API for persona summary
// npm install openai
// import { Configuration, OpenAIApi } from 'openai';

export async function generateAISummary(tags, scores) {
  // const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
  // const prompt = `Given the tags: ${JSON.stringify(tags)} and scores: ${JSON.stringify(scores)}, write a short, fun persona description.`;
  // const response = await openai.createChatCompletion({ ... });
  // return response.data.choices[0].message.content;
  return "AI summary placeholder. Integrate OpenAI here.";
}
