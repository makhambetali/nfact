document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessageButton');

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'ai-message';
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; 
    }
    
    async function sendMessage() {
        const prompt = chatInput.value.trim();
        if (!prompt) return;
        
        addMessage(prompt, true);
        chatInput.value = ''; 
        
        try {
            const response = await fetch(`/api/v1/ask_ai/?prompt=${encodeURIComponent(prompt)}`);
            
            if (!response.ok) {
                throw new Error('Ошибка при запросе к API');
            }
            
            const data = await response.json();
            
            const aiResponse = data.response || "Не удалось получить ответ от AI";
            addMessage(aiResponse, false);
            
        } catch (error) {
            console.error('Ошибка:', error);
            addMessage("Произошла ошибка при обработке вашего запроса", false);
        }
    }
    

    sendButton.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    addMessage("Привет! Я ваш AI-ассистент. Можете задать мне любой вопрос касающегося Майнкрафта :)", false);
});