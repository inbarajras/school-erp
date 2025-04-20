import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

function AIAssistant() {
  const { t } = useTranslation();
  const { user, role } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const messagesEndRef = useRef(null);

  // Mock subjects list - in a real app, this could come from your backend
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'computer', name: 'Computer Science' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' }
  ];

  // Initial welcome message
  useEffect(() => {
    const initialMessage = {
      id: 1,
      sender: 'assistant',
      text: t('assistant.welcome', 'Hello! I\'m your AI Teaching Assistant. Choose a subject and ask me any questions you have.'),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [t]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let assistantResponse;
      
      if (!selectedSubject) {
        // Prompt to select a subject if none selected
        assistantResponse = {
          id: messages.length + 2,
          sender: 'assistant',
          text: t('assistant.selectSubject', 'Please select a subject first so I can help you better.'),
          timestamp: new Date()
        };
      } else {
        // Generate a mock response based on subject and query
        const response = generateMockResponse(selectedSubject, input);
        assistantResponse = {
          id: messages.length + 2,
          sender: 'assistant',
          text: response,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1000); // Simulate API delay
  };

  // Generate mock responses based on subject and query
  const generateMockResponse = (subject, query) => {
    // Lowercase the query for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Basic response templates based on subject
    const responses = {
      math: [
        {
          keywords: ['add', 'sum', 'plus', 'addition'],
          response: "Addition is the process of combining numbers. For example, 5 + 3 = 8. Is there a specific addition problem you need help with?"
        },
        {
          keywords: ['subtract', 'minus', 'difference', 'subtraction'],
          response: "Subtraction is finding the difference between numbers. For example, 8 - 3 = 5. Do you have a specific subtraction problem?"
        },
        {
          keywords: ['multiply', 'times', 'product', 'multiplication'],
          response: "Multiplication is repeated addition. For example, 5 × 3 means adding 5 three times: 5 + 5 + 5 = 15. What multiplication question do you have?"
        },
        {
          keywords: ['divide', 'division', 'quotient'],
          response: "Division is sharing equally. For example, 15 ÷ 3 = 5 means 15 can be divided into 3 equal groups of 5. What division concept are you working on?"
        },
        {
          keywords: ['equation', 'solve', 'equal'],
          response: "To solve an equation, you need to isolate the variable. For example, to solve x + 3 = 8, subtract 3 from both sides to get x = 5. What equation are you trying to solve?"
        }
      ],
      science: [
        {
          keywords: ['energy', 'force', 'motion'],
          response: "Energy, force, and motion are fundamental concepts in physics. Energy is the ability to do work, force causes objects to accelerate, and motion is the change in position. Which aspect would you like to learn more about?"
        },
        {
          keywords: ['matter', 'atom', 'molecule', 'element'],
          response: "Matter is anything that has mass and takes up space. It's made up of atoms, which combine to form molecules. Elements are substances that cannot be broken down into simpler substances. What specific question do you have about matter?"
        },
        {
          keywords: ['ecosystem', 'environment'],
          response: "An ecosystem is a community of living organisms interacting with each other and their physical environment. It includes both biotic (living) and abiotic (non-living) components. What aspect of ecosystems are you studying?"
        }
      ],
      english: [
        {
          keywords: ['grammar', 'verb', 'noun', 'adjective', 'adverb'],
          response: "Grammar is the set of rules that explain how words are used in a language. Nouns name people, places, or things. Verbs show action or state of being. Adjectives describe nouns. Adverbs modify verbs, adjectives, or other adverbs. What grammar concept are you working on?"
        },
        {
          keywords: ['essay', 'write', 'writing', 'paragraph'],
          response: "Essay writing involves structuring your thoughts with an introduction, body paragraphs, and conclusion. Each paragraph should focus on a single main idea. Are you working on a specific writing assignment?"
        },
        {
          keywords: ['literature', 'book', 'story', 'novel', 'poem'],
          response: "Literary analysis involves examining elements like plot, character, setting, theme, and style. What piece of literature are you studying?"
        }
      ],
      // Add default responses for other subjects...
      default: "That's an interesting question about {{subject}}. Could you provide more details so I can help you better?"
    };
    
    // Get the response templates for the selected subject
    const subjectResponses = responses[subject] || [];
    
    // Check if any keywords match the query
    for (const template of subjectResponses) {
      if (template.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return template.response;
      }
    }
    
    // Return default response if no keywords match
    return responses.default.replace('{{subject}}', getSubjectName(subject));
  };
  
  // Helper to get subject name from ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-assistant">
      <h1>{t('assistant.title', 'AI Teaching Assistant')}</h1>
      
      <div className="assistant-container">
        <div className="subject-selection">
          <label htmlFor="subject-select">{t('assistant.selectSubjectLabel', 'Select a subject:')}</label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">{t('assistant.choosePlaceholder', 'Choose a subject...')}</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="chat-container">
          <div className="messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="message-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('assistant.inputPlaceholder', 'Type your question here...')}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
            >
              <span className="send-icon">📤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;