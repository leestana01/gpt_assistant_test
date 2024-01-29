import axios from "axios";

export default async function fetchMessages(threadId, runId, updateMessages) {
    try {
        let response = await axios.get(
            `https://api.openai.com/v1/threads/${threadId}/runs/${runId}/steps`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                    'OpenAI-Beta': 'assistants=v1'
                }
            }
        );

        // 메시지 처리 및 화면 업데이트
        const updateScreen = (data) => {
            const completedMessages = data.filter(step => step.status === 'completed');
            completedMessages.forEach(step => {
            const botMessage = { text: step.text, isUser: false };
            updateMessages(prevMessages => [...prevMessages, botMessage]);
            });
        };
    
        // 체크: data가 비어있거나, 첫 메시지의 상태가 in_progress인 경우
        while (response.data.data.length === 0 || response.data.data[0].status === 'in_progress') {
            await new Promise(resolve => setTimeout(resolve, 1000))
            // 상태 확인을 위해 Run 정보를 가져옵니다.
            const runStatusResponse = await axios.get(
                `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
                {
                    headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                    'OpenAI-Beta': 'assistants=v1'
                    }
                }
            );
    
            if (runStatusResponse.data.status === 'in_progress') {
                // 다시 메시지를 가져옵니다.
                response = await axios.get(
                    `https://api.openai.com/v1/threads/${threadId}/runs/${runId}/steps`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                            'OpenAI-Beta': 'assistants=v1'
                        }
                    }
                );
            } else {
                break;
            }
        }
        updateScreen(response.data.data);
    } catch (error) {
    console.error('Error fetching messages:', error);
    }
};