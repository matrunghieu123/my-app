import React, { useState } from 'react';
import { Button, Input, Upload } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faSmile, faPaperclip, faPaperPlane, faTimes, faFile, faFileImage, faFileVideo } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import './App.css';

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messages, setMessages] = useState<{ text: string; time: string; images?: string[]; videos?: string[]; files?: { name: string; url: string; type: string }[] }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() || selectedFiles.length > 0) {
      const newMessage = {
        text: inputValue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        images: selectedFiles.filter(file => file.type.startsWith('image/')).map(file => URL.createObjectURL(file)),
        videos: selectedFiles.filter(file => file.type.startsWith('video/')).map(file => URL.createObjectURL(file)),
        files: selectedFiles.filter(file => !file.type.startsWith('image/') && !file.type.startsWith('video/')).map(file => ({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
        })),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      setSelectedFiles([]);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    if (emojiObject && emojiObject.emoji) {
      setInputValue(inputValue + emojiObject.emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (file: File) => {
    setSelectedFiles([...selectedFiles, file]);
    return false;
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
  };

  const handleOpenChat = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    let valid = true;

    if (!phoneRegex.test(phone)) {
      setPhoneError('Số điện thoại phải là số và có 10 chữ số!');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (email && !emailRegex.test(email)) {
      setEmailError('Email phải có định dạng @gmail.com!');
      valid = false;
    } else {
      setEmailError('');
    }

    if (valid) {
      setIsChatVisible(true);
    }
  };

  const shouldDisplayTimestamp = (index: number) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    const currentTime = new Date(`1970-01-01T${currentMessage.time}:00`);
    const previousTime = new Date(`1970-01-01T${previousMessage.time}:00`);
    const timeDifference = (currentTime.getTime() - previousTime.getTime()) / 60000; // difference in minutes
    return timeDifference > 5; // display timestamp if more than 5 minutes have passed
  };

  return (
    <div className="App">
      <h1 className="center-text">Test</h1>
      <Button
        type="primary"
        shape="circle"
        className="floating-button"
        onClick={showModal}
      >
        <FontAwesomeIcon icon={faPhone} />
      </Button>
      {isModalVisible && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <button className="close-button" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {!isChatVisible ? (
              <div className="user-info-form">
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', marginBottom: '5px' }}>Tên</label>
                  <Input
                    placeholder="Nhập tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', marginBottom: '5px' }}>
                    Số điện thoại <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    placeholder="Nhập số điện thoại (Bắt buộc)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%' }}
                  />
                  {phoneError && <div style={{ color: 'red', marginTop: '5px' }}>{phoneError}</div>}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', marginBottom: '5px' }}>Email</label>
                  <Input
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%' }}
                  />
                  {emailError && <div style={{ color: 'red', marginTop: '5px' }}>{emailError}</div>}
                </div>
                <Button type="primary" onClick={handleOpenChat}>
                  Xác nhận
                </Button>
              </div>
            ) : (
              <div className="chat-container">
                <div style={{ marginBottom: '20px', textAlign: 'center', color: '#888' }}>
                  Cảm ơn bạn đã cung cấp thông tin
                  <div style={{ color: '#00f', marginTop: '5px' }}>
                    {name} | {phone} | {email}
                  </div>
                </div>
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px', textAlign: 'right' }}>
                      {shouldDisplayTimestamp(index) && (
                        <div style={{ color: '#888', fontSize: '12px' }}>Tôi, {msg.time}</div>
                      )}
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: '#1e3a8a',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '15px',
                        maxWidth: '60%',
                        wordWrap: 'break-word',
                      }}>
                        {msg.text}
                        {msg.images && msg.images.map((image, idx) => (
                          <div key={idx} style={{ marginTop: '10px' }}>
                            <img src={image} alt={`uploaded-${idx}`} style={{ maxWidth: '100%', borderRadius: '10px' }} />
                          </div>
                        ))}
                        {msg.videos && msg.videos.map((video, idx) => (
                          <div key={idx} style={{ marginTop: '10px' }}>
                            <video controls style={{ maxWidth: '100%', borderRadius: '10px' }}>
                              <source src={video} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ))}
                        {msg.files && msg.files.map((file, idx) => (
                          <div key={idx} style={{ marginTop: '10px' }}>
                            <a href={file.url} download={file.name} style={{ color: '#fff', textDecoration: 'none' }}>
                              <FontAwesomeIcon icon={file.type.startsWith('image/') ? faFileImage : file.type.startsWith('video/') ? faFileVideo : faFile} />
                              <span style={{ marginLeft: '5px' }}>{file.name}</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="file-preview-container" style={{ marginBottom: '10px' }}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} style={{
                      display: 'inline-block',
                      marginRight: '10px',
                      position: 'relative',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '5px',
                      backgroundColor: '#f0f0f0'
                    }}>
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      ) : file.type.startsWith('video/') ? (
                        <video controls style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}>
                          <source src={URL.createObjectURL(file)} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faFile} />
                          <span style={{ marginLeft: '5px' }}>{file.name}</span>
                        </>
                      )}
                      <FontAwesomeIcon
                        icon={faTimes}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          cursor: 'pointer',
                          color: 'red'
                        }}
                        onClick={() => handleRemoveFile(file)}
                      />
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <Input
                    placeholder="Nhập tin nhắn"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={handleSendMessage}
                    style={{ fontSize: '16px', height: '40px' }}
                    suffix={
                      <>
                        <FontAwesomeIcon icon={faSmile} style={{ marginRight: 12 }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                        <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                          <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: 5 }} />
                        </Upload>
                        <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} />
                      </>
                    }
                  />
                  {showEmojiPicker && (
                    <div className="emoji-picker-container">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
