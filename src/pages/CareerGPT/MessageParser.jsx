import React from 'react';
import axios from 'axios';

const MessageParser = ({ children, actions }) => {

  const loadHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/getHistory');
      const fetchedMessages = response.data.history.map(msg => ({
        id: msg.msgId,
        message: msg.message,
        type: msg.type,
        delay: msg.type === "bot" ? undefined : null,
        loading: msg.type === "bot" ? false : null,
      }));

      if (fetchedMessages.length >= 1) {
        actions.setState(prev => ({
          ...prev,
          messages: fetchedMessages
        }));
      }
    } catch (error) {
      console.log("Error in getting history:", error);
    }
  };

  React.useEffect(() => {
    loadHistory();
  }, []);

  const parse = async (message) => {
    const responseHistory = actions.getHistory();

    const contents = [];

    responseHistory.forEach(([userMsg, botMsg]) => {
      contents.push(
        { role: "user", parts: [{ text: userMsg }] },
        { role: "model", parts: [{ text: botMsg }] }
      );
    });

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const jsonData = { contents };

    const apiKey = "AIzaSyCyXwy34sBE-TEzuva6Eu7ON2VuEwwPSt4"; // Replace with your actual key

    try {
      actions.loadingMessage();

      const resp = await axios.post(
        'http://127.0.0.1:8000/askGemini/',
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      

      const botMessage = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      actions.generateResponse(botMessage);
    } catch (error) {
      console.error("Error calling Gemini API:", error.response?.data || error.message);
      actions.errorMessage();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse,
          actions
        });
      })}
    </div>
  );
};

// ✅ Properly exporting the defined component
export default MessageParser;
