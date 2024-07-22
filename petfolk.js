// Create and inject CSS
const style = document.createElement('style');
style.textContent = `
  .chatbot-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-left: auto;
    margin-right: 26px;
    position: fixed;
    top: 30px;
    right: 0;
    z-index: 200;
  }

  .chatbot-container {
    width: 370px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    display: flex;
    height: 80vh;
    flex-direction: column;
    position: relative;
    transition: width 0.3s ease, height 0.3s ease;
  }

  .chatbot-container.collapsed {
    width: 50px;
    height: 50px;
    transition: height 0.3s;
    margin-top: 65vh;
  }

  .chatbot-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px;
    background-color: #007bff;
    color: #fff;
  }

  .chatbot-header2 {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    background-color: #007bff;
    color: #fff;
  }

  .profile-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;
  }

  .profile-icon:hover {
    transform: scale(1.1);
  }

  .header-icons {
    display: flex;
    gap: 10px;
  }

  .hide-icons {
    display: none;
  }

  .chatbot-body {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f9f9f9;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chatbox {
    padding: 8px 12px;
    margin-bottom: 10px;
    border-radius: 18px;
    max-width: 75%;
    word-wrap: break-word;
  }

  .questionBox {
    align-self: flex-end;
    background-color: #007bff;
    color: #fff;
    text-align: left;
    margin-left: auto;
  }

  .answerBox {
    align-self: flex-start;
    background-color: #e9ecef;
    color: #000;
    text-align: left;
    margin-right: auto;
  }

  .chatbot-input {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ccc;
  }

  .chat-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 20px;
    margin-right: 10px;
  }

  .typing {
    font-style: italic;
    color: #aaa;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .typing::after {
    content: '...';
    display: inline-block;
    animation: blink 1s infinite;
  }

  .chatbox-typing {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .chatbox-typing p {
    font-style: italic;
    color: #aaa;
    margin-right: 6px;
  }

  .chatbot-wrapper::webkit-scrollbar {
    display: none;
  }

  .chatbot-body {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin-left: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .chatbox-typing p {
    margin: 0;
    margin-right: 10px;
    margin-top: 5px;
  }

  .typing-dots {
    display: inline-block;
    position: relative;
    width: 60px;
    height: 20px;
    padding-top: 8px;
  }

  .typing-dots div {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #aaa;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .typing-dots div:nth-child(1) {
    left: 8px;
    animation: typing-dots1 0.8s infinite;
  }

  .typing-dots div:nth-child(2) {
    left: 24px;
    animation: typing-dots2 0.8s infinite;
  }

  .typing-dots div:nth-child(3) {
    left: 40px;
    animation: typing-dots2 0.8s infinite;
  }

  @keyframes typing-dots1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes typing-dots2 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
`;
document.head.appendChild(style);

// Create and inject HTML
const chatbotWrapper = document.createElement('div');
chatbotWrapper.className = 'chatbot-wrapper';
chatbotWrapper.innerHTML = `
  <div class="chatbot-container">
    <div class="chatbot-header">
      <img src="petfolk.jpeg" alt="profile-icon" class="profile-icon" style="cursor: pointer;" onclick="setIsCollapsed(false)" />
      <div class="header-icons" id="header-icons">
        <span style="cursor: pointer;">&#9776;</span>
        <span style="cursor: pointer;" onclick="setIsCollapsed(true)">&#10006;</span>
      </div>
    </div>
    <div class="chatbot-body" id="chatBody">
      <!-- Chat messages will be appended here dynamically -->
    </div>
    <div class="chatbot-input">
      <input type="text" id="chatInput" placeholder="Type your question here..." class="chat-input" onkeydown="handleKeyDown(event)" />
      <span style="cursor: pointer;" onclick="sendQuery()">&#9658;</span>
    </div>
  </div>
`;
document.body.appendChild(chatbotWrapper);

// Add JavaScript functionality
let chatData = [{ "answer": "Hello! How can I help you today?" }];
let query = "";
let isCollapsed = false;
let isTyping = false;

const chatBodyRef = document.getElementById('chatBody');
const chatInputRef = document.getElementById('chatInput');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const formatAnswerToHtml = (answer) => {
  let formattedAnswer = answer.replace(/\n/g, '<br/>');
  formattedAnswer = formattedAnswer.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$2</a>');
  formattedAnswer = formattedAnswer.replace(/(\+91 \d{5} \d{5})/g, '<br/>Contact: $1');
  formattedAnswer = formattedAnswer.replace(/([a-zA-Z0-9._%+-]+@gmail\.com)/g, '<br/>Email: <a href="mailto:$1">$1</a>');
  formattedAnswer = formattedAnswer.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  return formattedAnswer;
};

const sendQuery = async () => {
  query = chatInputRef.value;
  const tempDataWithQuestion = [...chatData, { "question": query }];
  if (!query || query.length < 5) {
    alert('Please enter a valid query');
    updateChat();
    return;
  }
  chatData = tempDataWithQuestion;
  chatInputRef.value = "";
  isTyping = true;
  updateChat();

  const response = await fetch(`https://wizzmedias-buzz-backend.vercel.app/api/chatbot-test/${query}`);
  let { answer } = await response.json();
  let converter = new showdown.Converter();
  answer = converter.makeHtml(answer);

  isTyping = false;

  let currentAnswer = "";
  const typingSpeed = 8;

  for (let i = 0; i < answer.length; i++) {
    currentAnswer += answer[i];
    await sleep(typingSpeed);

    chatData = tempDataWithQuestion.concat({ "answer": currentAnswer });
    updateChat();
  }
};

const updateChat = () => {
  chatBodyRef.innerHTML = "";
  chatData.forEach((chat, idx) => {
    const chatBox = document.createElement('div');
    chatBox.className = `chatbox ${chat.question ? 'questionBox' : 'answerBox'}`;
    chatBox.innerHTML = chat.question ? chat.question : chat.answer;
    chatBodyRef.appendChild(chatBox);
  });

  if (isTyping) {
    const typingBox = document.createElement('div');
    typingBox.className = 'chatbox-typing';
    typingBox.innerHTML = `<p class=''>Typing</p>
      <div class="typing-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>`;
    chatBodyRef.appendChild(typingBox);
  }

  chatBodyRef.scrollTop = chatBodyRef.scrollHeight;
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    sendQuery();
  }
};

const setIsCollapsed = (state) => {
  isCollapsed = state;
  document.querySelector('.chatbot-container').classList.toggle('collapsed', isCollapsed);
  if (!isCollapsed) updateChat();
  const headerIcons = document.getElementById("header-icons");
  headerIcons.className = `header-icons ${isCollapsed ? 'hide-icons' : ''}`;
};

document.addEventListener('DOMContentLoaded', () => {
  updateChat();
});
