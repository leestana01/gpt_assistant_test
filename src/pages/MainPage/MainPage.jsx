// src/App.js
import React, { useState } from 'react';
import styled from 'styled-components';
import sendMessage from '../../APIs/sendMessage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const ChatWindow = styled.div`
  width: 400px;
  height: 500px;
  border: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
`;

const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  background-color: ${props => props.$isUser ? '#dcf8c6' : '#fff'};
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

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleOnClick = () => {
    sendMessage(input, messages, setInput, setMessages);
  }

  return (
    <Container>
      <ChatWindow>
        {messages.map((message, index) => (
          <Message key={index} $isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
      </ChatWindow>
      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleOnClick}>Send</Button>
      </InputContainer>
    </Container>
  );
};

export default App;
