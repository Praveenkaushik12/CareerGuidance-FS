import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;
const BASE = "http://127.0.0.1:8000";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

function formatFull(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Student profile drawer ────────────────────────────────────────────────────

function InfoLine({ label, value }) {
  return (
    <div style={s.infoLine}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  );
}

function StudentProfileDrawer({ user, onClose }) {
  if (!user) return null;
  const hasDetails = user.school || user.stream || user.age || user.gender;
  return (
    <>
      <div style={s.drawerBackdrop} onClick={onClose} />
      <div style={s.drawer}>
        <div style={s.drawerHeader}>
          <span style={s.drawerTitle}>Student Profile</span>
          <button style={s.drawerClose} onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div style={s.drawerAvatar}>{user.name.charAt(0).toUpperCase()}</div>
        <div style={s.drawerName}>{user.name}</div>
        <div style={s.drawerEmail}>{user.email}</div>
        <div style={s.drawerDivider} />
        {hasDetails ? (
          <div style={s.drawerFields}>
            {user.school && <InfoLine label="School" value={user.school} />}
            {user.stream && <InfoLine label="Stream" value={user.stream} />}
            {user.age    && <InfoLine label="Age"    value={user.age} />}
            {user.gender && <InfoLine label="Gender" value={user.gender} />}
          </div>
        ) : (
          <div style={s.noDetails}>No profile details added yet.</div>
        )}
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CounsellorChat() {
  const { user_id } = useSelector((store) => store.authentication);

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState("");
  const [sending, setSending]             = useState(false);
  const [drawerOpen, setDrawerOpen]       = useState(false);

  const bottomRef  = useRef(null);
  const pollRef    = useRef(null);
  const convPollRef = useRef(null);

  const loadConversations = () => {
    axios.get(`${BASE}/getCounsellorConversations`)
      .then(res => setConversations(res.data.conversations))
      .catch(() => {});
  };

  useEffect(() => {
    loadConversations();
    // Re-poll conversation list every 10s so order stays fresh
    convPollRef.current = setInterval(loadConversations, 10000);
    return () => clearInterval(convPollRef.current);
  }, []);

  const fetchMessages = (partnerId) => {
    axios.get(`${BASE}/getMessages?receiver_id=${partnerId}`)
      .then(res => setMessages(res.data.messages))
      .catch(() => {});
  };

  const openConversation = (user) => {
    setActiveUser(user);
    setMessages([]);
    setDrawerOpen(false);
    clearInterval(pollRef.current);
    fetchMessages(user.id);
    pollRef.current = setInterval(() => fetchMessages(user.id), 3000);
    // Mark this partner's messages as read immediately
    if (user.unread_count > 0) {
      axios.post(`${BASE}/markMessagesRead`, { sender_id: user.id })
        .then(() => {
          setConversations(prev =>
            prev.map(c => c.id === user.id ? { ...c, unread_count: 0 } : c)
          );
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => clearInterval(pollRef.current), []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !activeUser) return;
    setSending(true);
    try {
      const res = await axios.post(`${BASE}/sendMessage`, { receiver_id: activeUser.id, content: text });
      setMessages(prev => [...prev, res.data]);
      setInput("");
      // bump this conversation to top in local state
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
          Conversations
        </div>

        {conversations.length === 0 ? (
          <div style={s.emptyList}>No conversations yet</div>
        ) : (
          conversations.map(u => {
            const isActive  = activeUser?.id === u.id;
            const unread    = isActive ? 0 : (u.unread_count || 0);
            const hasUnread = unread > 0;

            return (
              <div
                key={u.id}
                style={{
                  ...s.convoItem,
                  background: isActive ? "#ede7f6" : hasUnread ? "#f3e5f5" : "#fff",
                  borderLeft: isActive
                    ? "3px solid #4a148c"
                    : hasUnread
                    ? "3px solid #ce93d8"
                    : "3px solid transparent",
                }}
                onClick={() => openConversation(u)}
              >
                {/* Avatar with unread dot */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ ...s.avatar, background: hasUnread ? "linear-gradient(135deg,#6a1b9a,#4a148c)" : "linear-gradient(135deg,#4a148c,#1a237e)" }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  {hasUnread && (
                    <span style={s.unreadDot}>{unread > 9 ? "9+" : unread}</span>
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
                    <div style={{ fontWeight: hasUnread ? 800 : 600, fontSize: 13.5, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.name}
                    </div>
                    {u.last_message_at && (
                      <div style={{ fontSize: 10, color: hasUnread ? "#7b1fa2" : "#bbb", flexShrink: 0, fontWeight: hasUnread ? 700 : 400 }}>
                        {formatTime(u.last_message_at)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: hasUnread ? "#6a1b9a" : "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: hasUnread ? 600 : 400 }}>
                    {u.last_message || u.email}
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
            {/* Header */}
            <div style={s.chatHeader}>
              <button style={s.headerAvatarBtn} onClick={() => setDrawerOpen(true)} title="View student profile">
                {activeUser.name.charAt(0).toUpperCase()}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <button style={s.headerNameBtn} onClick={() => setDrawerOpen(true)}>
                  {activeUser.name}
                </button>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>
                  {activeUser.email}
                </div>
              </div>
              <button style={s.profileBtn} onClick={() => setDrawerOpen(true)} title="View profile">
                <i className="fa-solid fa-circle-info" />
              </button>
            </div>

            {/* Messages */}
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

            {/* Input */}
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

      {/* Profile drawer */}
      {drawerOpen && activeUser && (
        <StudentProfileDrawer user={activeUser} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  wrapper:    { display: "flex", height: "calc(100vh - 64px)", fontFamily: "var(--fontHeading)", position: "relative", overflow: "hidden", background: "#f0f2ff" },

  // Sidebar
  sidebar:       { width: 300, borderRight: "1px solid #e8eaf6", display: "flex", flexDirection: "column", background: "#fff", overflowY: "auto", flexShrink: 0 },
  sidebarHeader: { padding: "16px 18px", fontWeight: 800, fontSize: 15, borderBottom: "1px solid #e8eaf6", background: "linear-gradient(135deg,#4a148c,#1a237e)", color: "#fff", flexShrink: 0, letterSpacing: 0.3 },
  emptyList:     { padding: "32px 20px", color: "#bbb", fontSize: 13, textAlign: "center" },
  convoItem:     { display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", cursor: "pointer", borderBottom: "1px solid #f5f5f5", transition: "background 0.15s", flexShrink: 0 },
  avatar:        { width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#4a148c,#1a237e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16 },
  unreadDot:     { position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 99, background: "#e53935", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #fff" },

  // Chat panel
  chatPanel:   { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#f5f7fb" },
  chatHeader:  { display: "flex", alignItems: "center", padding: "12px 18px", background: "linear-gradient(135deg,#4a148c,#1a237e)", color: "#fff", flexShrink: 0, gap: 12 },
  headerAvatarBtn: { width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", fontWeight: "bold", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  headerNameBtn:   { background: "none", border: "none", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", padding: 0, fontFamily: "var(--fontHeading)", textAlign: "left" },
  profileBtn:      { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, padding: "6px 10px", fontSize: 16, flexShrink: 0 },

  placeholder:    { margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", color: "#aaa", fontSize: 15 },
  emptyMessages:  { margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", color: "#ccc", fontSize: 13 },

  messageArea: { flex: 1, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column" },
  theirAvatar: { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#4a148c,#1a237e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, flexShrink: 0, marginRight: 8, marginTop: 4, alignSelf: "flex-start" },
  senderName:  { fontSize: 11, color: "#999", marginBottom: 2, marginLeft: 2 },
  bubbleMe:    { background: "linear-gradient(135deg,#6a1b9a,#4a148c)", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: 14, wordBreak: "break-word", lineHeight: 1.5 },
  bubbleThem:  { background: "#fff", color: "#222", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, border: "1px solid #e8eaf6", wordBreak: "break-word", lineHeight: 1.5 },

  inputRow: { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #e8eaf6", background: "#fff", flexShrink: 0, alignItems: "flex-end" },
  input:    { flex: 1, resize: "none", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "10px 14px", fontSize: 14, fontFamily: "var(--fontHeading)", outline: "none", lineHeight: 1.5, transition: "border-color 0.2s" },
  sendBtn:  { background: "linear-gradient(135deg,#6a1b9a,#1a237e)", color: "#fff", border: "none", borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, flexShrink: 0, transition: "opacity 0.2s" },

  // Drawer
  drawerBackdrop: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 10 },
  drawer:         { position: "absolute", top: 0, right: 0, bottom: 0, width: 300, background: "#fff", zIndex: 11, display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", overflowY: "auto" },
  drawerHeader:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "linear-gradient(135deg,#4a148c,#1a237e)", color: "#fff", flexShrink: 0 },
  drawerTitle:    { fontWeight: "bold", fontSize: 15, fontFamily: "var(--fontHeading)" },
  drawerClose:    { background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0 },
  drawerAvatar:   { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#4a148c,#1a237e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 30, margin: "24px auto 10px" },
  drawerName:     { textAlign: "center", fontWeight: "bold", fontSize: 17, fontFamily: "var(--fontHeading)" },
  drawerEmail:    { textAlign: "center", fontSize: 13, color: "#888", marginTop: 4 },
  drawerDivider:  { height: 1, background: "#e8eaf6", margin: "16px 18px" },
  drawerFields:   { padding: "0 18px" },
  infoLine:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" },
  infoLabel:      { fontSize: 12, color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  infoValue:      { fontSize: 14, color: "#333", textAlign: "right", maxWidth: "60%", wordBreak: "break-word" },
  noDetails:      { padding: "0 18px", fontSize: 13, color: "#aaa", fontStyle: "italic" },
};
