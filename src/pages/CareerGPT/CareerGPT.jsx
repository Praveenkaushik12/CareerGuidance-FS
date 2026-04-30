import config from "./config.jsx";
import MessageParser from "./MessageParser.jsx";
import ActionProvider from "./ActionProvider.jsx";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./styles/CareerGPT.css";
import React from "react";
import axios from "axios";

const CareerGPT = () => {
  // 🔹 Save messages (optimized)
  const saveMessages = async (messages) => {
    try {
      await axios.post("http://127.0.0.1:8000/saveHistory", messages, {
        withCredentials: true,
      });
    } catch (error) {
      console.log("Error in Saving History:", error);
    }
  };

  return (
    <div className="careerGPTPage">
      <div className="careerGPTHero">
        <div className="careerGPTBadge">
          <i className="fa-solid fa-robot"></i> AI-Powered
        </div>

        <h1 className="careerGPTTitle">
          Career<span>GPT</span>
        </h1>

        <p className="careerGPTSubtitle">
          Your personal AI career counsellor — ask anything about your future
        </p>
      </div>

      <div className="careerGPTContainer">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          saveMessages={saveMessages}
        />
      </div>
    </div>
  );
};

export default CareerGPT;
