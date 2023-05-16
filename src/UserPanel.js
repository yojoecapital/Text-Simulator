import React, { useRef, useState, useEffect } from 'react';
import sendSfx from './send-sfx.mp3';
import receivedSfx from './received-sfx.mp3';


function UserPanel({ setIsDarkMode, isDarkMode, messages, setMessages, visibleMessages, setVisibleMessages, scrollRef, setProfileImage, setProfileName, setClockTime }) {
  const inputRefs = useRef([]);
  const [actionTriggered, setActionTriggered] = useState(null);

  const addMessage = () => {
    const newMessage = {
      text: '',
      fromMe: messages.length > 0 ? messages[messages.length - 1].fromMe : false,
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setVisibleMessages(updatedMessages);
    setActionTriggered('add');
  };

  const removeMessage = (index) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
    if (updatedMessages.length == visibleMessages.length - 1)
      setVisibleMessages(updatedMessages);
    else setVisibleMessages([]);
    setActionTriggered('remove');
  };

  useEffect(() => {
    if (actionTriggered === 'add') {
      if (messages.length > 0) {
        inputRefs.current[messages.length - 1]?.focus();
      }
    } else if (actionTriggered === 'remove') {
      if (messages.length > 0) {
        inputRefs.current[messages.length - 1]?.focus();
      } else if (messages.length === 0 && inputRefs.current.length > 0) {
        // If all messages are removed, focus on the last remaining input
        inputRefs.current[0]?.focus();
      }
    }
    if (scrollRef.current) {
      const { scrollHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
    setActionTriggered(null);
  }, [messages, visibleMessages, actionTriggered]);

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      addMessage();
    }
    if (event.key === 'Backspace' && event.shiftKey) {
      event.preventDefault();
      removeMessage(index);
    }
  };

  const handleForward = () => {
    if (visibleMessages.length < messages.length) {
      const nextMessage = messages[visibleMessages.length];
      setVisibleMessages((prevVisibleMessages) => [...prevVisibleMessages, nextMessage]);
      const audio = nextMessage.fromMe ? new Audio(sendSfx) : new Audio(receivedSfx);
      audio.play();
    }
  };

  const handleBack = () => {
    if (visibleMessages.length > 0) {
      setVisibleMessages((prevVisibleMessages) => prevVisibleMessages.slice(0, prevVisibleMessages.length - 1));
    }
  };

  const handleFill = () => {
    setVisibleMessages(messages);
  }

  const handleClear = () => setVisibleMessages([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
  };

  const downloadMessages = () => {
    const updatedMessages = messages.map((message) => {
      if (message.hasOwnProperty('file')) {
        return { ...message, file: null };
      }
      return message;
    });
    const json = JSON.stringify(updatedMessages);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'messages.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadMessages = (event) => {
    const file = event.target.files[0];
    event.target.value = null;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const uploadedMessages = JSON.parse(e.target.result);
        setMessages(uploadedMessages);
        setVisibleMessages(uploadedMessages);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="user-panel container-fluid d-flex flex-column">
      <div>
        <h1>Text Simulator <a href="https://github.com/yojoecapital/Text-Simulator" target="_blank" rel="noopener noreferrer" className="badge bg-dark bi-github"> /yojoecapital</a></h1>
      </div>
      <div className="d-flex justify-content-between">
        <div className='btn-group m-2' role='group'>
          <button type="button" className="btn btn-primary" onClick={handleClear} disabled={visibleMessages.length === 0}>
            <span className='bi-skip-start-fill'/>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleBack} disabled={visibleMessages.length === 0}>
            <span className='bi-caret-left-fill'/>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleForward} disabled={visibleMessages.length === messages.length}>
            <span className='bi-caret-right-fill'/>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleFill} disabled={visibleMessages.length === messages.length}>
            <span className='bi-skip-end-fill'/>
          </button>
        </div>
        <button type="button" className="btn btn-primary m-2" onClick={() => setIsDarkMode(!isDarkMode)}><span className={isDarkMode ? 'bi-moon' : 'bi-sun'}/></button>
        <div className="input-group m-2">
          <input
            type="text"
            className="form-control"
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Profile Name"
          />
          <input
            type="time"
            className="form-control"
            onChange={(e) => setClockTime(e.target.value)}
          />
        </div>
        <div className="m-2">
          <label className="input-group-text btn btn-primary" htmlFor="profile-image-input">
            <span className='bi-person-circle'> Choose Profile</span>
          </label>
          <input
            type="file"
            className="d-none"
            id="profile-image-input"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <div className="flex-grow-1" style={{ overflow: 'auto' }}>
        {messages.map((message, index) => (
          <div key={index} className="input-group mt-1 mb-1">
            <div className={`input-group-text ${index == visibleMessages.length - 1 ? 'bg-warning' : ''} `}>
              <label className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={message.fromMe}
                  onChange={(e) => {
                    const updatedMessages = [...messages];
                    updatedMessages[index].fromMe = e.target.checked;
                    setMessages(updatedMessages);
                  }}
                />
                <span className="bi-person" />
              </label>
            </div>
            {!message.isImage ? (
              <input
                type="text"
                value={message.text}
                onChange={(e) => {
                  const updatedMessages = [...messages];
                  updatedMessages[index].text = e.target.value;
                  setMessages(updatedMessages);
                }}
                onKeyDown={(e) => handleKeyPress(e, index)}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className="form-control"
              />
            ) : (
              <div className="input-group-text flex-grow-1">
                <input
                  type="file"
                  className="form-control"
                  id="profile-image-input"
                  accept="image/*"
                  onChange={(event) => {
                    const updatedMessages = [...messages];
                    const file = event.target.files[0];
                    const fileURL = URL.createObjectURL(file);
                    updatedMessages[index].file = fileURL;
                    setMessages(updatedMessages);
                  }}
                />
              </div>
            )}
            <div className="input-group-text">
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={message.isImage}
                  onChange={(e) => {
                    const updatedMessages = [...messages];
                    updatedMessages[index].isImage = e.target.checked;
                    setMessages(updatedMessages);
                  }}
                />
                <span className="bi-image" />
              </label>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeMessage(index)}
            >
              <span className="bi-x" />
            </button>
          </div>
        ))}
      </div>
      <div className='input-group m-2'>
        <button type="button" className="btn btn-primary" onClick={addMessage}>
          <span className='bi-plus'> Add Message</span>
        </button>
        <button type="button" className="btn btn-primary" onClick={downloadMessages}>
          <span className='bi-download'> Download</span>
        </button>
        <label className="btn btn-primary">
          <span className='bi-upload'> Upload</span>
          <input type="file" accept=".json" onChange={uploadMessages} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
}

export default UserPanel;
