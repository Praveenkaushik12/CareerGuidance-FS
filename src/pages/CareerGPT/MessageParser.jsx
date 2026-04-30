import React from "react";
import axios from "axios";

const MessageParser = ({ children, actions }) => {
  const hasLoaded = React.useRef(false);
  const isRequesting = React.useRef(false);

  // 🔹 Load history ONLY once (prevents double calls)
  const loadHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/getHistory", {
        withCredentials: true,
      });

      const fetchedMessages = response.data.history.map((msg) => ({
        id: msg.msgId,
        message: msg.message,
        type: msg.type,
        delay: msg.type === "bot" ? undefined : null,
        loading: msg.type === "bot" ? false : null,
      }));

      if (fetchedMessages.length >= 1) {
        actions.setState((prev) => ({
          ...prev,
          messages: fetchedMessages,
        }));
      }
    } catch (error) {
      console.log("Error in getting history:", error);
    }
  };

  React.useEffect(() => {
    if (!hasLoaded.current) {
      loadHistory();
      hasLoaded.current = true;
    }
  }, []);

  // 🔹 Optimized parse function (NO spam, NO full history)
  const parse = async (message) => {
    if (isRequesting.current) return; // 🚫 block multiple requests
    isRequesting.current = true;

    try {
      actions.loadingMessage();

      const resp = await axios.post(
        "http://127.0.0.1:8000/askGemini/",
        {
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const botMessage =
        resp.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI";

      actions.generateResponse(botMessage);
    } catch (error) {
      console.error(
        "Error calling Gemini API:",
        error.response?.data || error.message,
      );
      actions.errorMessage();
    } finally {
      // ⏳ small delay to avoid rate limit
      setTimeout(() => {
        isRequesting.current = false;
      }, 1500);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { parse, actions }),
      )}
    </div>
  );
};

export default MessageParser;
