import gpt from "./gpt";

export default async function fetchMessages(threadId, runId, setMessages) {
    try {
        // Initalize processed message counts
        let messageCount = 0;
        while (true) {
            // Check Steps
            const stepsResponse = await gpt.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}/steps`);
            const steps = stepsResponse.data.data;
            // Get all Messages
            const messagesResponse = await gpt.get(`https://api.openai.com/v1/threads/${threadId}/messages`);
            const newMessages = messagesResponse.data.data;

            /*
                Get new Messages from latest message
                messageCount : processed message counts
                passingCount : steps within two messages
            */
            let passingCount = 0
            for (let i = (steps.length-1)-messageCount; i >= 0; i--) {
                const step = steps[i];
                passingCount++;
                if (step.status !== "completed" || step.type !== "message_creation"){
                    continue;
                }
                
                // Extract step contains completed message
                const messageId = step.step_details.message_creation.message_id

                // Extract message from step infromation
                const newMessage = newMessages.find(el => el.id === messageId)
                if (!newMessage) break;

                // Get text from message
                const textContent = newMessage.content.find(content => content.type === "text");
                if (!textContent) break; 
                const latestMessageText = textContent.text.value;

                // Add Message with messageHandler
                setMessages(prevMessages => [...prevMessages, { text: latestMessageText, isUser: false }]);
                messageCount += passingCount;
            }

            // Check if GPT completed all tasks
            if (steps.length > 0 && steps[0].status === "completed") {
                const runResponse = await gpt.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`);
                if (runResponse.data.status === "completed") {
                    break;
                }
            }
    
            // Sleep 0.3 sec
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    } catch (error) {
        console.error('Failed to get message:', error);
    }
};