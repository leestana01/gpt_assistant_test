import createThread from "./createThread";
import addMessage from "./addMessage";
import runThread from "./runThread";
import fetchMessages from "./fetchMessages";

export default async function sendMessage(sendMessage, selectedFile, setMessages) {
    // 쓰레드 생성
    const threadId = await createThread();
    if (!threadId) return;

    // 메시지 업로드
    await addMessage(sendMessage, selectedFile, threadId);

    // 쓰레드 실행
    const runId = await runThread(threadId);
    if (!runId) return;

    // 메시지 불러오기 및 화면에 표시
    await fetchMessages(threadId, runId, setMessages);
};