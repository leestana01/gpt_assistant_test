import axios from "axios";

export default async function runThread(threadId) {
    try {
        const response = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
            { 
                assistant_id: process.env.REACT_APP_ASSISTANT
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