import { useEffect, useRef, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function ChatModal({ counsellor, currentUserId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/getMessages?receiver_id=${counsellor.id}`);
      setMessages(res.data.messages);
    } catch (e) {
      console.error("Failed to fetch messages", e);
    }
  };

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [counsellor.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/sendMessage", {
        receiver_id: counsellor.id,
        content: text,
      });
      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.avatar}>{counsellor.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>{counsellor.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{counsellor.field_of_study}</div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Messages */}
        <div style={styles.messageArea}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              Start a conversation with {counsellor.name}
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8 }}>
                <div style={{ maxWidth: "70%" }}>
                  {!isMe && (
                    <div style={styles.senderName}>{msg.sender__name}</div>
                  )}
                  <div style={isMe ? styles.bubbleMe : styles.bubbleThem}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", textAlign: isMe ? "right" : "left", marginTop: 2 }}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={styles.inputRow}>
          <textarea
            style={styles.input}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
          />
          <button onClick={handleSend} disabled={sending || !input.trim()} style={styles.sendBtn}>
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "min(500px, 95vw)",
    height: "min(600px, 90vh)", display: "flex", flexDirection: "column",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)", overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #1a237e, #3949ab)",
    color: "#fff", padding: "14px 18px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  avatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "rgba(255,255,255,0.25)", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontWeight: "bold", fontSize: 18,
  },
  closeBtn: {
    background: "none", border: "none", color: "#fff",
    fontSize: 20, cursor: "pointer", lineHeight: 1,
  },
  messageArea: {
    flex: 1, overflowY: "auto", padding: "16px",
    background: "#f5f7fb", display: "flex", flexDirection: "column",
  },
  emptyState: {
    margin: "auto", color: "#aaa", fontSize: 14, textAlign: "center",
  },
  senderName: {
    fontSize: 11, color: "#666", marginBottom: 2, marginLeft: 4,
  },
  bubbleMe: {
    background: "linear-gradient(135deg, #1a237e, #3949ab)",
    color: "#fff", borderRadius: "18px 18px 4px 18px",
    padding: "10px 14px", fontSize: 14, wordBreak: "break-word",
  },
  bubbleThem: {
    background: "#fff", color: "#222",
    borderRadius: "18px 18px 18px 4px",
    padding: "10px 14px", fontSize: 14,
    border: "1px solid #e0e0e0", wordBreak: "break-word",
  },
  inputRow: {
    display: "flex", gap: 8, padding: "12px 16px",
    borderTop: "1px solid #e0e0e0", background: "#fff",
  },
  input: {
    flex: 1, resize: "none", border: "1px solid #ccc",
    borderRadius: 10, padding: "10px 12px", fontSize: 14,
    fontFamily: "inherit", outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #1a237e, #3949ab)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "0 20px", fontWeight: "bold", cursor: "pointer",
    fontSize: 14, opacity: 1, transition: "opacity 0.2s",
  },
};
