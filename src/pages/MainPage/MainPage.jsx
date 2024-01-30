// src/App.js
import React, { useState } from 'react';
import styled from 'styled-components';
import sendMessage from '../../APIs/sendMessage';
import uploadFile from '../../APIs/uploadFile';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const ChatWindow = styled.div`
  width: 400px;
  height: calc(100vh - 200px);
  border: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
`;

const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  background-color: ${props => props.$isUser ? '#dcf8c6' : '#D6E4F7'};
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
`;

const FileInput = styled.input`
  // display: none; // 파일 입력은 숨김
`;

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOnClick = () => {
    if (!input && !selectedFile) return;
    const userMessage = { text: input ? input : "파일 업로드", isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    sendMessage(input, selectedFile, setMessages);
    setInput('');
    setSelectedFile('');
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 형식 확인 (pdf, 이미지 파일만 허용)
      if (/\.pdf$|\.jpg$|\.jpeg$|\.png$/.test(file.name.toLowerCase())) {
        uploadFile(file).then(fileId => {
          if (fileId) {
            setSelectedFile(fileId);
          }
        });
      } else {
        alert('지원되지 않는 파일 형식입니다.');
      }
    }
  };

  return (
    <Container>
      <ChatWindow>
        {messages.map((message, index) => (
          <Message key={index} $isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
      </ChatWindow>
      {
        selectedFile ? <p>{selectedFile}</p> : <p>업로드 없음</p>
      }
      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <FileInput
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          accept="application/pdf, image/jpeg, image/png" // 지원하는 파일 형식
        />
        
        <Button onClick={handleOnClick}>전송</Button>
      </InputContainer>
    </Container>
  );
};

export default App;
