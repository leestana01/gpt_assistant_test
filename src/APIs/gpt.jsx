import axios from 'axios';

const assistantHeader = {
    'Authorization': `Bearer ${process.env.REACT_APP_API}`,
    'OpenAI-Beta': 'assistants=v1',
    "type": "json_object"
};

const gpt = {
    get: (url) => axios.get(url, { headers: assistantHeader }),
    post: (url, data) => axios.post(url, data, { headers: assistantHeader }),
    file: (url, data) => {
        const uploadHeader = {
            ...assistantHeader,
            'Content-Type': 'multipart/form-data'
        };
        return axios.post(url, data, { headers: uploadHeader });
    }
};

export default gpt;