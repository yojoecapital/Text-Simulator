import React, { useState, useRef } from 'react';
import './App.css';
import './bootstrap.min.css';
import './TextSimulator.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import defaultProfileImage from './profile.jpg'; 
import UserPanel from './UserPanel';
import TextSimulator from './TextSimulator';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [profileName, setProfileName] = useState('');
  const [clockTime, setClockTime] = useState('');
  const scrollRef = useRef(null);

  return (
    <div className="app">
      <div className="container-fluid">
        <div className="row h-100">

          <div className="col-md-6 bg-light">
            <div className="user-panel">
              <UserPanel 
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                messages={messages} 
                setMessages={setMessages} 
                visibleMessages={visibleMessages} 
                setVisibleMessages={setVisibleMessages} 
                scrollRef={scrollRef}
                setProfileImage={setProfileImage}
                setProfileName={setProfileName}
                setClockTime={setClockTime}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-sim">
              <TextSimulator
                isDarkMode={isDarkMode}
                visibleMessages={visibleMessages}
                scrollRef={scrollRef}
                profileImage={profileImage}
                profileName={profileName}
                clockTime={clockTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default App;