import React, { useEffect, useState } from 'react';

const Message = (msg: string, key: number) => {
  const [, author, content] = msg.match(/\[(.+)\] (.+)/) || [];

  return (
    <div className="message" key={key}>
      <span className="messageAuthor">{author}</span>
      <p className="messageContent">{content}</p>
    </div>
  );
};

window.ws = new WebSocket('ws://localhost:3001/ws');

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  const scrollDown = (smooth = true) => {
    const messagesContainer = document.getElementById('messageBox');
    messagesContainer?.scrollBy({ top: 999999, behavior: smooth ? 'smooth' : undefined });
  };

  useEffect(() => {
    scrollDown();
  }, [messages]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      setMessages([...messages, e.data]);
    };

    window.ws!.addEventListener('message', listener);
    
    return () => window.ws?.removeEventListener('message', listener);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    fetch('http://localhost:3001/api/chatHistory')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      });
  }, []);

  if (!localStorage.getItem('username')) {
    let username = prompt('Please enter your username');

    while (!username || username.trim().length === 0) {
      username = prompt('A username is required! Please enter your username');
    }

    localStorage.setItem('username', username);
  }

  const onMessageSend = () => {
    const input = document.getElementById('messageInput') as HTMLInputElement;
    const message = input.value;

    if (message.trim().length > 0) {
      window.ws!.send(`[${localStorage.getItem('username')}] ${message}`);
      input.value = '';
    }
  };

  return (
    <div className="app">
      <div className="chat">
        <h1 className="title">Chat App</h1>
        <div className="messageBox" id="messageBox">
          {messages.map(Message)}
        </div>
        <div className="messageSendBox">
          <input className="messageInput" id="messageInput" onKeyDown={(e) => e.key === 'Enter' ? onMessageSend() : null}></input>
          <button className="messageSendButton" onClick={onMessageSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
