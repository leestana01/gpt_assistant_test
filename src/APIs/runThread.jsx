import gpt from "./gpt";

export default async function runThread(threadId) {
    try {
        const response = await gpt.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
            { 
                assistant_id: process.env.REACT_APP_ASSISTANT
            }
        );
        return response.data.id;
    } catch (error) {
        console.error('쓰레드 실행 실패:', error);
        return null;
    }
};