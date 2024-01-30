import gpt from "./gpt";

export default async function createThread() {
  try {
    const response = await gpt.post('https://api.openai.com/v1/threads',{});
    return response.data.id;
  } catch (error) {
    console.error('쓰레드 생성 실패:', error);
    return null;
  }
};