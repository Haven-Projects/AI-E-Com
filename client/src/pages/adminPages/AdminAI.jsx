import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaRobot, FaUser, FaPaperPlane, FaTrash, FaCopy, FaCheck } from 'react-icons/fa';
import { FcAssistant } from 'react-icons/fc';
import AdminNavBar from '../../components/common/adminComponents/adminNavbar';
import axios from 'axios';
import '../../assets/styles/AdminAI.css';

function AdminAI() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const exampleQueries = [
    "Show items with price between $500 and $1000",
    "Show me top 2 best-selling products",
    "How many orders were placed today?",
    "List products added in the last 30 days",
    "What's the average order value?",
  ];

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExampleClick = (query) => {
    setInputMessage(query);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Make API call to your Python backend
      const response = await axios.post('http://localhost:8000/query', {
        question: userMessage.content
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.answer || 'No response received.',
        status: response.data.status || 'success',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle error status from backend
      if (response.data.status === 'error') {
        setError('The AI service encountered an issue. Please try again.');
      }

    } catch (err) {
      console.error('Error querying AI:', err);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        status: 'error',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to connect to AI service. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className='adminNavbar'>
        <AdminNavBar />
      </div>
      <Container fluid className="admin-ai-container">
        {/* Header */}
        <div className="ai-header">
          <div className="header-content">
            <FcAssistant size={35} className="ai-icon" />
            <h2 className="ai-title">AI Assistant</h2>
          </div>
          {messages.length > 0 && (
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={clearChat}
              className="clear-chat-btn"
            >
              <FaTrash className="me-2" />
              Clear Chat
            </Button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Chat Container */}
        <Row className="chat-row">
          <Col lg={8} md={10} sm={12} className="mx-auto">
            <Card className="chat-card">
              {/* Messages Area */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="welcome-message">
                    <FcAssistant size={64} className="welcome-icon" />
                    <p className="welcome-description">
                      Ask me anything about your store data, transactions, inventory, or customers.
                    </p>
                    <div className="example-queries">
                      <h6 className="example-title">Try asking:</h6>
                      <div className="example-grid">
                        {exampleQueries.map((query, index) => (
                          <div key={index} className="example-item">
                            <div 
                              className="example-text"
                              onClick={() => handleExampleClick(query)}
                            >
                              "{query}"
                            </div>
                            <Button
                              variant="link"
                              size="sm"
                              className="copy-btn"
                              onClick={() => copyToClipboard(query, index)}
                              title="Copy to clipboard"
                            >
                              {copiedIndex === index ? (
                                <FaCheck className="copy-icon success" />
                              ) : (
                                <FaCopy className="copy-icon" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div key={message.id} className={`message ${message.type}-message`}>
                        <div className="message-avatar">
                          {message.type === 'user' ? (
                            <FaUser className="user-avatar" />
                          ) : (
                            <FcAssistant className="ai-avatar-icon" />
                          )}
                        </div>
                        <div className="message-content">
                          <div className={`message-bubble ${message.type}-bubble ${message.status === 'error' ? 'error-bubble' : ''}`}>
                            {message.content}
                          </div>
                          <div className="message-time">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="message ai-message">
                        <div className="message-avatar">
                          <FcAssistant className="ai-avatar-icon" />
                        </div>
                        <div className="message-content">
                          <div className="message-bubble ai-bubble loading-bubble">
                            <Spinner animation="grow" size="sm" className="me-2" />
                            <Spinner animation="grow" size="sm" className="me-2" />
                            <Spinner animation="grow" size="sm" />
                            <span className="ms-2">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="input-container">
                <Form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <Form.Control
                      ref={inputRef}
                      type="text"
                      placeholder="Ask me anything about your store data..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isLoading}
                      className="message-input"
                    />
                    <Button 
                      type="submit" 
                      disabled={!inputMessage.trim() || isLoading}
                      className="send-button"
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaPaperPlane />
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminAI;