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

    // 쓰레드 실행
    const runId = await runThread(threadId);
    if (!runId) return;

    // 메시지 불러오기 및 화면에 표시
    await fetchMessages(threadId, runId, setMessages);
    // // 메시지 불러오기
    // const steps = await fetchMessages(threadId, runId);
    // // GPT-3의 응답 메시지를 처리합니다.
    // // 예시: 마지막 step의 메시지를 사용합니다.
    // const botMessage = { text: steps[steps.length - 1].text, isUser: false };
    // setMessages([...messages, userMessage, botMessage]);
};