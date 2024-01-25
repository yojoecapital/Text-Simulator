import React from 'react';
import { isEmoji, isWhiteSpace, convertToStandardTime } from './Helpers';
import defaultImage from './image.jpg'; 

function TextSimulator({ isDarkMode, visibleMessages, scrollRef, profileImage, profileName, clockTime, containerWidth,  containerHeight }) {
  return (
    <div className={`imessage-container ${isDarkMode ? 'dark-mode' : ''}`} style={{height: containerHeight, width: containerWidth}} ref={scrollRef}>
      <div className="imessage-profile">
        <div className="row justify-content-between align-items-center mb-1" style={{width: '100%'}}>
          <div className="col-auto">
            <span className="bi-wifi"/>
          </div>
          <div className="col-auto mx-auto">
            {convertToStandardTime(clockTime)}
          </div>
          <div className="col-auto">
            <span className="bi-battery-full"/>
          </div>
        </div>
        <img src={profileImage} alt="Profile" className="profile-image" />
        <span>{profileName}</span>
      </div>
      <div className="imessage">
        {visibleMessages.map((message, index) => (
          message.isImage?
          <div
            key={index}
            className={`${message.fromMe ? 'from-me-img' : 'from-them-img'} fade-in`}
          >
            {
              message.file ? (
                <img
                  src={message.file}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null; // Reset the error handler to prevent potential infinite loop
                    e.target.src = defaultImage; 
                  }}
                />
              ) : (
                <img src={defaultImage} alt="" />
              )
            }
          </div>
          :
          <p
            key={index}
            className={`${message.fromMe ? 'from-me' : 'from-them'} fade-in ${isEmoji(message.text)? 'no-tail emoji' : ''}`}
          >
            {isWhiteSpace(message.text)? <span className='bi-fonts'/> : message.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default TextSimulator;