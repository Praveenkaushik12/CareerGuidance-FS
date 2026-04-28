import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;

function StudentProfileDrawer({ user, onClose }) {
  if (!user) return null;
  const hasDetails = user.school || user.stream || user.age || user.gender;
  return (
    <>
      <div style={styles.drawerBackdrop} onClick={onClose} />
      <div style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <span style={styles.drawerTitle}>Student Profile</span>
          <button style={styles.drawerClose} onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div style={styles.drawerAvatar}>{user.name.charAt(0).toUpperCase()}</div>
        <div style={styles.drawerName}>{user.name}</div>
        <div style={styles.drawerEmail}>{user.email}</div>
        <div style={styles.drawerDivider} />
        {hasDetails ? (
          <div style={styles.drawerFields}>
            {user.school && <InfoLine label="School" value={user.school} />}
            {user.stream && <InfoLine label="Stream" value={user.stream} />}
            {user.age    && <InfoLine label="Age"    value={user.age} />}
            {user.gender && <InfoLine label="Gender" value={user.gender} />}
          </div>
        ) : (
          <div style={styles.noDetails}>No profile details added yet.</div>
        )}
      </div>
    </>
  );
}

function InfoLine({ label, value }) {
  return (
    <div style={styles.infoLine}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

export default function CounsellorChat() {
  const { user_id } = useSelector((store) => store.authentication);
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/getCounsellorConversations")
      .then(res => setConversations(res.data.conversations))
      .catch(e => console.error("Failed to load conversations", e));
  }, []);

  const fetchMessages = async (partnerId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/getMessages?receiver_id=${partnerId}`);
      setMessages(res.data.messages);
    } catch (e) {
      console.error("Failed to fetch messages", e);
    }
  };

  const openConversation = (user) => {
    setActiveUser(user);
    setMessages([]);
    setDrawerOpen(false);
    clearInterval(pollRef.current);
    fetchMessages(user.id);
    pollRef.current = setInterval(() => fetchMessages(user.id), 3000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !activeUser) return;
    setSending(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/sendMessage", {
        receiver_id: activeUser.id,
        content: text,
      });
      setMessages(prev => [...prev, res.data]);
      setInput("");
    } catch (e) {
      console.error("Failed to send", e);
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

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={styles.wrapper}>
      {/* Conversations sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Conversations</div>
        {conversations.length === 0 && (
          <div style={styles.empty}>No conversations yet</div>
        )}
        {conversations.map(u => (
          <div
            key={u.id}
            style={{ ...styles.convoItem, background: activeUser?.id === u.id ? "#e8eaf6" : "#fff" }}
            onClick={() => openConversation(u)}
          >
            <div style={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: "bold", fontSize: 14, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
              <div style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat panel */}
      <div style={styles.chatPanel}>
        {!activeUser ? (
          <div style={styles.placeholder}>Select a conversation to start chatting</div>
        ) : (
          <>
            <div style={styles.chatHeader}>
              {/* Clicking avatar or name opens the profile drawer */}
              <button style={styles.headerAvatarBtn} onClick={() => setDrawerOpen(true)} title="View student profile">
                {activeUser.name.charAt(0).toUpperCase()}
              </button>
              <button style={styles.headerNameBtn} onClick={() => setDrawerOpen(true)} title="View student profile">
                {activeUser.name}
              </button>
            </div>

            <div style={styles.messageArea}>
              {messages.length === 0 && (
                <div style={styles.empty}>No messages yet</div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender_id === user_id;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8 }}>
                    <div style={{ maxWidth: "70%" }}>
                      {!isMe && <div style={styles.senderName}>{msg.sender__name}</div>}
                      <div style={isMe ? styles.bubbleMe : styles.bubbleThem}>{msg.content}</div>
                      <div style={{ fontSize: 11, color: "#999", textAlign: isMe ? "right" : "left", marginTop: 2 }}>
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div style={styles.inputRow}>
              <textarea
                style={styles.input}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
              />
              <button onClick={handleSend} disabled={sending || !input.trim()} style={styles.sendBtn}>
                {sending ? "…" : "Send"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Student profile drawer */}
      {drawerOpen && activeUser && (
        <StudentProfileDrawer user={activeUser} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", height: "calc(100vh - 80px)", fontFamily: "inherit", position: "relative", overflow: "hidden" },
  sidebar: { width: 280, borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", background: "#fff", overflowY: "auto", flexShrink: 0 },
  sidebarHeader: { padding: "16px 18px", fontWeight: "bold", fontSize: 16, borderBottom: "1px solid #e0e0e0", background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", flexShrink: 0 },
  convoItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", flexShrink: 0 },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16, flexShrink: 0 },

  chatPanel: { flex: 1, display: "flex", flexDirection: "column", background: "#f5f7fb", minWidth: 0 },
  chatHeader: { display: "flex", alignItems: "center", padding: "12px 18px", background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", flexShrink: 0, gap: 12 },
  headerAvatarBtn: { width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.5)", color: "#fff", fontWeight: "bold", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  headerNameBtn: { background: "none", border: "none", color: "#fff", fontWeight: "bold", fontSize: 16, cursor: "pointer", padding: 0, textDecoration: "underline dotted rgba(255,255,255,0.5)", fontFamily: "inherit" },

  messageArea: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column" },
  inputRow: { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #e0e0e0", background: "#fff", flexShrink: 0 },
  input: { flex: 1, resize: "none", border: "1px solid #ccc", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", outline: "none" },
  sendBtn: { background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", fontWeight: "bold", cursor: "pointer", fontSize: 14 },
  placeholder: { margin: "auto", color: "#aaa", fontSize: 15 },
  empty: { margin: "20px auto", color: "#aaa", fontSize: 14, textAlign: "center" },
  senderName: { fontSize: 11, color: "#666", marginBottom: 2, marginLeft: 4 },
  bubbleMe: { background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: 14, wordBreak: "break-word" },
  bubbleThem: { background: "#fff", color: "#222", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", wordBreak: "break-word" },

  // Profile drawer
  drawerBackdrop: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 10 },
  drawer: { position: "absolute", top: 0, right: 0, bottom: 0, width: 300, background: "#fff", zIndex: 11, display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", overflowY: "auto" },
  drawerHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", flexShrink: 0 },
  drawerTitle: { fontWeight: "bold", fontSize: 15, fontFamily: "var(--fontHeading)" },
  drawerClose: { background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0 },
  drawerAvatar: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #4a148c, #1a237e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 30, margin: "24px auto 10px" },
  drawerName: { textAlign: "center", fontWeight: "bold", fontSize: 17, fontFamily: "var(--fontHeading)" },
  drawerEmail: { textAlign: "center", fontSize: 13, color: "#888", marginTop: 4, marginBottom: 4 },
  drawerDivider: { height: 1, background: "#e8eaf6", margin: "16px 18px" },
  drawerFields: { padding: "0 18px" },
  infoLine: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" },
  infoLabel: { fontSize: 12, color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  infoValue: { fontSize: 14, color: "#333", textAlign: "right", maxWidth: "60%", wordBreak: "break-word" },
  noDetails: { padding: "0 18px", fontSize: 13, color: "#aaa", fontStyle: "italic" },
};
