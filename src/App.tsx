import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Upload } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faSmile, faPaperclip, faPaperPlane, faTimes, faFile, faFileImage, faFileVideo } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import './App.css';

function App() {
  // Khai báo các state để quản lý trạng thái của ứng dụng
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messages, setMessages] = useState<{ text: string; time: string; images?: string[]; videos?: string[]; files?: { name: string; url: string; type: string }[] }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [nameError, setNameError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect để ẩn chat khi khởi tạo
  useEffect(() => {
    setIsChatVisible(false);
  }, []);

  // useEffect để cuộn đến tin nhắn cuối cùng khi danh sách tin nhắn thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hàm hiển thị modal
  const showModal = () => {
    console.log('showModal called');
    console.log('isRegistered:', isRegistered);
    setIsModalVisible(true);
    if (!isRegistered) {
      setIsChatVisible(false);
    }
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (!isRegistered) {
      setIsChatVisible(false);
      return;
    }

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

  // Hàm xử lý khi input được focus
  const handleInputFocus = () => {
    if (!isRegistered) {
      setIsChatVisible(false);
      setIsModalVisible(true);
    }
  };

  // Hàm xử lý khi chọn emoji
  const handleEmojiClick = (emojiObject: any) => {
    if (emojiObject && emojiObject.emoji) {
      setInputValue(inputValue + emojiObject.emoji);
    }
    setShowEmojiPicker(false);
  };

  // Hàm xử lý khi tải file lên
  const handleFileUpload = (file: File) => {
    setSelectedFiles([...selectedFiles, file]);
    return false;
  };

  // Hàm xử lý khi xóa file
  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
  };

  // Hàm mở chat sau khi kiểm tra thông tin người dùng
  const handleOpenChat = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    let valid = true;

    if (!name.trim()) {
      setNameError('Vui lòng nhập tên!');
      valid = false;
    } else {
      setNameError('');
    }

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
      setIsRegistered(true);
    }
  };

  // Hàm hủy đăng ký
  const handleCancelRegistration = () => {
    setIsChatVisible(true);
  };

  // Hàm kiểm tra xem có nên hiển thị timestamp hay không
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
            <div className="chat-container">
              {/* Thêm phần tiêu đề màu xanh đậm */}
              <div style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '10px', textAlign: 'center', borderRadius: '20px 20px 0 0' }}>
                <h2>Live chat</h2>
              </div>
              <div className="messages">
                {isRegistered && (
                  <div style={{ marginBottom: '20px', textAlign: 'center', color: '#888' }}>
                    Cảm ơn bạn đã cung cấp thông tin
                    <div style={{ color: '#00f', marginTop: '5px' }}>
                      {name} | {phone} | {email}
                    </div>
                  </div>
                )}
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
                <div ref={messagesEndRef} />
              </div>
              <div className="file-preview-container">
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
                  onFocus={handleInputFocus}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={handleSendMessage}
                  style={{ fontSize: '16px', height: '40px', border: 'none', backgroundColor: 'white'}}
                  suffix={
                    <>
                      <FontAwesomeIcon icon={faSmile} style={{ marginRight: 12 }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                      <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                        <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: 5 }} />
                      </Upload>
                      <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} />
                    </>
                  }
                  disabled={!isChatVisible}
                />
                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              {!isChatVisible && !isRegistered && (
                <div className="overlay">
                  <div className="user-info-form" style={{ marginTop: '170px' }}>
                    <div className="header">
                      <p>Vui lòng cho chúng tôi biết thêm một số thông tin của Quý Khách</p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', marginBottom: '5px' }}>Tên đầy đủ</label>
                      <Input
                        placeholder="Nhập tên đầy đủ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      {nameError && <div className="error-message">{nameError}</div>}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', marginBottom: '10px' }}>
                        Số điện thoại <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      {phoneError && <div className="error-message">{phoneError}</div>}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', marginBottom: '5px' }}>Email</label>
                      <Input
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      {emailError && <div className="error-message">{emailError}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
                      <Button type="primary" onClick={handleOpenChat}>
                        Gửi thông tin
                      </Button>
                      <Button onClick={handleCancelRegistration}>
                        Để sau
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
