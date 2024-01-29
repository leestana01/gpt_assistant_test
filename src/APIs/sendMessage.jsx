import createThread from "./createThread";
import runThread from "./runThread";
import fetchMessages from "./fetchMessages";

export default async function sendMessage(input, messages, setInput, setMessages) {
    if (!input) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    // 쓰레드 생성
    const threadId = await createThread();
    if (!threadId) return;

    // 메시지 업로드
    await postMessage(threadId);

    // 쓰레드 실행
    const runId = await runThread(threadId);
    if (!runId) return;

    // 메시지 불러오기 및 화면에 표시
    await fetchMessages(threadId, runId, setMessages);
};