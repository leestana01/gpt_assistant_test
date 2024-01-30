import createThread from "./createThread";
import addMessage from "./addMessage";
import runThread from "./runThread";
import fetchMessages from "./fetchMessages";

export default async function sendMessage(sendMessage, selectedFile, setMessages) {
    // Create Thread
    const threadId = await createThread();
    if (!threadId) return;

    // Add Message in Thread
    await addMessage(sendMessage, selectedFile, threadId);

    // Run Thread
    const runId = await runThread(threadId);
    if (!runId) return;

    // Load and Display Messages
    // setMessages : Message State Handler
    await fetchMessages(threadId, runId, setMessages);
};