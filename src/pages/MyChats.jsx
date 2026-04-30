import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;
const BASE = "http://127.0.0.1:8000";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

function formatFull(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MyChats() {
  const { user_id } = useSelector((store) => store.authentication);

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const convPollRef = useRef(null);

  const loadConversations = () => {
    axios.get(`${BASE}/getCounsellorConversations`)
      .then(res => setConversations(res.data.conversations))
      .catch(() => {});
  };

  useEffect(() => {
    loadConversations();
    convPollRef.current = setInterval(loadConversations, 10000);
    return () => clearInterval(convPollRef.current);
  }, []);

  const fetchMessages = (partnerId) => {
    axios.get(`${BASE}/getMessages?receiver_id=${partnerId}`)
      .then(res => setMessages(res.data.messages))
      .catch(() => {});
  };

  const openConversation = (counsellor) => {
    setActiveUser(counsellor);
    setMessages([]);
    clearInterval(pollRef.current);
    fetchMessages(counsellor.id);
    pollRef.current = setInterval(() => fetchMessages(counsellor.id), 3000);
    if (counsellor.unread_count > 0) {
      axios.post(`${BASE}/markMessagesRead`, { sender_id: counsellor.id })
        .then(() => {
          setConversations(prev =>
            prev.map(c => c.id === counsellor.id ? { ...c, unread_count: 0 } : c)
          );
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => {
    clearInterval(pollRef.current);
    clearInterval(convPollRef.current);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !activeUser) return;
    setSending(true);
    try {
      const res = await axios.post(`${BASE}/sendMessage`, { receiver_id: activeUser.id, content: text });
      setMessages(prev => [...prev, res.data]);
      setInput("");
      setConversations(prev => {
        const updated = prev.map(c =>
          c.id === activeUser.id
            ? { ...c, last_message_at: res.data.created_at, last_message: text }
            : c
        );
        return [...updated].sort((a, b) => (b.last_message_at || "").localeCompare(a.last_message_at || ""));
      });
    } catch (e) {
      console.error("Failed to send", e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={s.wrapper}>

      {/* ── Conversations sidebar ── */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <i className="fa-solid fa-comments" style={{ marginRight: 8, opacity: 0.85 }} />
          My Chats
        </div>

        {conversations.length === 0 ? (
          <div style={s.emptyList}>
            <i className="fa-solid fa-comment-slash" style={{ fontSize: 28, marginBottom: 10, color: "#ddd" }} />
            <div>No conversations yet.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Start a chat from the Ask Counsellor page.</div>
          </div>
        ) : (
          conversations.map(c => {
            const isActive = activeUser?.id === c.id;
            const unread = isActive ? 0 : (c.unread_count || 0);
            const hasUnread = unread > 0;

            return (
              <div
                key={c.id}
                style={{
                  ...s.convoItem,
                  background: isActive ? "#e8eaf6" : hasUnread ? "#f3e5f5" : "#fff",
                  borderLeft: isActive
                    ? "3px solid #1a237e"
                    : hasUnread
                    ? "3px solid #ce93d8"
                    : "3px solid transparent",
                }}
                onClick={() => openConversation(c)}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ ...s.avatar, background: hasUnread ? "linear-gradient(135deg,#6a1b9a,#1a237e)" : "linear-gradient(135deg,#1a237e,#3949ab)" }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  {hasUnread && (
                    <span style={s.unreadDot}>{unread > 9 ? "9+" : unread}</span>
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
                    <div style={{ fontWeight: hasUnread ? 800 : 600, fontSize: 13.5, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </div>
                    {c.last_message_at && (
                      <div style={{ fontSize: 10, color: hasUnread ? "#7b1fa2" : "#bbb", flexShrink: 0, fontWeight: hasUnread ? 700 : 400 }}>
                        {formatTime(c.last_message_at)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: hasUnread ? "#6a1b9a" : "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: hasUnread ? 600 : 400 }}>
                    {c.last_message || c.email}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Chat panel ── */}
      <div style={s.chatPanel}>
        {!activeUser ? (
          <div style={s.placeholder}>
            <i className="fa-solid fa-comment-dots" style={{ fontSize: 48, marginBottom: 14, color: "#d1c4e9" }} />
            <div style={{ fontSize: 16, color: "#aaa" }}>Select a conversation to start chatting</div>
          </div>
        ) : (
          <>
            <div style={s.chatHeader}>
              <div style={s.headerAvatar}>
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{activeUser.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>
                  {activeUser.email}
                </div>
              </div>
            </div>

            <div style={s.messageArea}>
              {messages.length === 0 && (
                <div style={s.emptyMessages}>
                  <i className="fa-regular fa-comment" style={{ fontSize: 32, marginBottom: 8, color: "#ddd" }} />
                  <div>No messages yet</div>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender_id === user_id;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 10 }}>
                    {!isMe && (
                      <div style={s.theirAvatar}>{msg.sender__name?.charAt(0).toUpperCase()}</div>
                    )}
                    <div style={{ maxWidth: "68%" }}>
                      {!isMe && <div style={s.senderName}>{msg.sender__name}</div>}
                      <div style={isMe ? s.bubbleMe : s.bubbleThem}>{msg.content}</div>
                      <div style={{ fontSize: 10, color: "#bbb", textAlign: isMe ? "right" : "left", marginTop: 3 }}>
                        {formatFull(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div style={s.inputRow}>
              <textarea
                style={s.input}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim()}
                style={{ ...s.sendBtn, opacity: sending || !input.trim() ? 0.5 : 1 }}
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  wrapper:       { display: "flex", height: "calc(100vh - 64px)", fontFamily: "var(--fontHeading)", overflow: "hidden", background: "#f0f2ff" },
  sidebar:       { width: 300, borderRight: "1px solid #e8eaf6", display: "flex", flexDirection: "column", background: "#fff", overflowY: "auto", flexShrink: 0 },
  sidebarHeader: { padding: "16px 18px", fontWeight: 800, fontSize: 15, borderBottom: "1px solid #e8eaf6", background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", flexShrink: 0, letterSpacing: 0.3 },
  emptyList:     { padding: "48px 20px", color: "#bbb", fontSize: 13, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  convoItem:     { display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", cursor: "pointer", borderBottom: "1px solid #f5f5f5", transition: "background 0.15s", flexShrink: 0 },
  avatar:        { width: 40, height: 40, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16 },
  unreadDot:     { position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 99, background: "#e53935", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #fff" },
  chatPanel:     { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#f5f7fb" },
  chatHeader:    { display: "flex", alignItems: "center", padding: "12px 18px", background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", flexShrink: 0, gap: 12 },
  headerAvatar:  { width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", fontWeight: "bold", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  placeholder:   { margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", color: "#aaa", fontSize: 15 },
  emptyMessages: { margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", color: "#ccc", fontSize: 13 },
  messageArea:   { flex: 1, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column" },
  theirAvatar:   { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, flexShrink: 0, marginRight: 8, marginTop: 4, alignSelf: "flex-start" },
  senderName:    { fontSize: 11, color: "#999", marginBottom: 2, marginLeft: 2 },
  bubbleMe:      { background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: 14, wordBreak: "break-word", lineHeight: 1.5 },
  bubbleThem:    { background: "#fff", color: "#222", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, border: "1px solid #e8eaf6", wordBreak: "break-word", lineHeight: 1.5 },
  inputRow:      { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #e8eaf6", background: "#fff", flexShrink: 0, alignItems: "flex-end" },
  input:         { flex: 1, resize: "none", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "10px 14px", fontSize: 14, fontFamily: "var(--fontHeading)", outline: "none", lineHeight: 1.5 },
  sendBtn:       { background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", border: "none", borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, flexShrink: 0, transition: "opacity 0.2s" },
};
