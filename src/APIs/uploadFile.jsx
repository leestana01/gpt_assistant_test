import axios from "axios";

export default async function uploadFile(threadId, file) {
    try {
        const formData = new FormData();
        formData.append('purpose', 'assistants');
        formData.append('file', file);

        const response = await axios.post(
            `https://api.openai.com/v1/files`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API}`,
                    'OpenAI-Beta': 'assistants=v1'
                }
            }
        );
        return response.data.id;
    } catch (error) {
        console.error('Error running thread:', error);
        return null;
    }
};