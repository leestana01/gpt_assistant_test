import gpt from "./gpt";

export default async function uploadFile(file) {
    const maxRetries = 3; // 최대 재시도 횟수 설정
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const formData = new FormData();
            formData.append('purpose', 'assistants');
            formData.append('file', file);

            const response = await gpt.file(
                `https://api.openai.com/v1/files`,
                formData
            );
            return response.data.id;
        } catch (error) {
            console.error('오류 발생:', error);
            if (error.response && error.response.status === 500) {
                currentRetry++;
                console.error(`재시도 횟수 ${currentRetry}`);
            } else {
                return null;
            }
        }
    }
    // 재시도 계속 실패 시 null 반환
    return null;
};
