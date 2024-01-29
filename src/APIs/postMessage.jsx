import axios from "axios";

export default async function postMessage(threadId) {
    try {
        const response = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
                "role": "user",
                "content": "just reply 'hello' five letters",
                // "file_ids": [
                //     "file-Uqa4Hygw33I7OIFvtuJt0wy6"
                // ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                    'OpenAI-Beta': 'assistants=v1'
                }
            }
        );
        return response.data.id;
    } catch (error) {
        console.error('Error running thread:', error);
        return null;
    }
};