import gpt from "./gpt";

export default async function addMessage(sendMessage, selectedFile, threadId) {
    try {
        let requestBody = {
            "role": "user",
            "content": sendMessage
        };

        if (!sendMessage) {
            requestBody.content = "";
        }
        if (selectedFile) {
            requestBody.file_ids = [selectedFile];
        }

        const response = await gpt.post(
            `https://api.openai.com/v1/threads/${threadId}/messages`, requestBody
        );
        return response.data.id;
    } catch (error) {
        console.error('메시지 추가 실패:', error);
        return null;
    }
};