import axios from "axios";

export default async function fetchMessages(threadId, runId, setMessages) {
    try {
        while (true) {
            // 현재 메시지 큐 상태 확인
            const stepsResponse = await axios.get(
                `https://api.openai.com/v1/threads/${threadId}/runs/${runId}/steps`,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                        'OpenAI-Beta': 'assistants=v1'
                    }
                });
            const steps = stepsResponse.data.data;
    
            if (steps.length > 0 && steps[0].status === "completed") {
                // 새 메시지 가져오기
                const messagesResponse = await axios.get(
                    `https://api.openai.com/v1/threads/${threadId}/messages`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                            'OpenAI-Beta': 'assistants=v1'
                        }
                    });
                const newMessages = messagesResponse.data.data;
    
                if (newMessages.length > 0) {
                    const latestMessage = newMessages[0].content.find(c => c.type === "text")?.text.value;
                    if (latestMessage) {
                        setMessages(prevMessages => [...prevMessages, { text: latestMessage, isUser: false }]);
                    }
                }
    
                // GPT 작동 종료 여부 확인
                const runResponse = await axios.get(
                    `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                            'OpenAI-Beta': 'assistants=v1'
                        }
                    });
                if (runResponse.data.data[0].status === "completed") {
                    break;
                }
            }
    
            // 잠시 대기
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};