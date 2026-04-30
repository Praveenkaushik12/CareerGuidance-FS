import { useState, useEffect, useRef } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function useUnreadMessages(enabled = true, intervalMs = 15000) {
  const [hasUnread, setHasUnread] = useState(false);
  const timerRef = useRef(null);

  const check = () => {
    axios.get("http://127.0.0.1:8000/getCounsellorConversations")
      .then(res => {
        const convs = res.data.conversations || [];
        setHasUnread(convs.some(c => c.unread_count > 0));
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!enabled) return;
    check();
    timerRef.current = setInterval(check, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [enabled]);

  return hasUnread;
}
