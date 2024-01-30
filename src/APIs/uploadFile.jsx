import gpt from "./gpt";

export default async function uploadFile(file) {
    const maxRetries = 3; // Maximum Retries
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
            console.error('Failed to upload file:', error);
            if (error.response && error.response.status === 500) {
                currentRetry++;
                console.error(`Retry counts: ${currentRetry}`);
            } else {
                return null;
            }
        }
    }
    // Return null after maxRetires
    return null;
};
