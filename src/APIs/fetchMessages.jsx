import gpt from "./gpt";

export default async function fetchMessages(threadId, runId, setMessages) {
    try {
        let messageCount = 0;
        while (true) {
            // 현재 메시지 큐 상태 확인
            const stepsResponse = await gpt.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}/steps`);
            const steps = stepsResponse.data.data;
            // 새 메시지 가져오기
            const messagesResponse = await gpt.get(`https://api.openai.com/v1/threads/${threadId}/messages`);
            const newMessages = messagesResponse.data.data;

            console.log({
                메시지응답: messagesResponse,
                새로운메시지: newMessages,
                수신마지막메시지: messagesResponse.data.first_id, 
                수신최초메시지: messagesResponse.data.last_id,
                스탭확인: steps, 
                마지막체크메시지: messageCount
            })

            console.log('for문 집입...')
            let stack = 0
            // 새 메시지 처리
            for (let i = (steps.length-1)-messageCount; i >= 0; i--) {
                console.log(i,'번째 메시지 처리중...')
                // 처리 안된 메시지를 순서대로 불러옴
                const step = steps[i];
                stack++;
                if (step.status !== "completed" || step.type !== "message_creation"){
                    console.log(i,'번째 메시는 완료상태가 아니거나, 메시지 객체가 아닙니다.');
                    continue;
                }
                
                // Step에서 처리완료된 메시지 추출
                const messageId = step.step_details.message_creation.message_id

                // 메시지 목록에서 해당 step의 메시지 추출
                const newMessage = newMessages.find(el => el.id === messageId)
                if (!newMessage) break;

                const textContent = newMessage.content.find(content => content.type === "text");
                if (!textContent) break; 

                const latestMessageText = textContent.text.value;
                setMessages(prevMessages => [...prevMessages, { text: latestMessageText, isUser: false }]);
                messageCount += stack;
                console.log(i,'완료했습니다! ------------------------------------------------------------------------------------------------------');
            }

            if (steps.length > 0 && steps[0].status === "completed") {
                // GPT 작동 종료 여부 확인
                const runResponse = await gpt.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`);
                if (runResponse.data.status === "completed") {
                    break;
                }
            }
    
            // 잠시 대기
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    } catch (error) {
        console.error('메시지 수신 실패:', error);
    }
};