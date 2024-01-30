import gpt from "./gpt";

export default async function createThread() {
  try {
    const response = await gpt.post('https://api.openai.com/v1/threads',{});
    return response.data.id;
  } catch (error) {
    console.error('Failed to create Thread:', error);
    return null;
  }
};