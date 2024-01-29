import axios from "axios";

export default async function createThread() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/threads',
      {},
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      }
    );
    return response.data.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    return null;
  }
};