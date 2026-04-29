import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function FloatingChatBubble() {
  const { is_exist, role, counsellor_approved } = useSelector((s) => s.authentication);
  const { notificationData } = useSelector((s) => s.header);
  const navigate = useNavigate();

  // Only show for logged-in non-admin users
  if (!is_exist || role === "A") return null;

  const isCounsellor = role === "C" || (role === "B" && counsellor_approved);
  const totalUnread = notificationData
    ? notificationData.reduce((sum, n) => sum + (n.channel_unread_message_count || 0), 0)
    : 0;

  const destination = isCounsellor ? "/counsellor/counsellorChat" : "/chat";

  return (
    <button
      onClick={() => navigate(destination)}
      title={totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? "s" : ""}` : "Open chat"}
      style={styles.bubble}
      aria-label="Open chat"
    >
      <i className="fa-solid fa-comment-dots" style={{ fontSize: 24 }}></i>
      {totalUnread > 0 && (
        <span style={styles.badge}>{totalUnread > 99 ? "99+" : totalUnread}</span>
      )}
    </button>
  );
}

const styles = {
  bubble: {
    position: "fixed",
    bottom: 28,
    right: 28,
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1a237e, #3949ab)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(26,35,126,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    transition: "transform 0.18s, box-shadow 0.18s",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#e53935",
    color: "#fff",
    borderRadius: "50%",
    minWidth: 20,
    height: 20,
    fontSize: 11,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    fontFamily: "var(--fontHeading)",
    border: "2px solid #fff",
  },
};
