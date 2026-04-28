import AskCounsellorCSS from "../assets/styles/AskCounsellor.module.css";
import { getTopCounsellors } from "../features/askCounsellor/askCounsellorSlice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../features/authentication/authenticationSlice";
import ChatModal from "./ChatModal";
import axios from "axios";

axios.defaults.withCredentials = true;
const BASE = "http://127.0.0.1:8000";

const STREAMS = ["Science", "Arts", "Commerce", "Computer Science", "Medical", "Engineering", "Other"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

// ── Profile gate modal (collect school/stream/age/gender before first chat) ──

function ProfileGateModal({ onSave, onCancel, saving, error }) {
  const [form, setForm] = useState({ school: "", stream: "", age: "", gender: "" });
  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div style={ms.overlay}>
      <div style={ms.modal}>
        <div style={ms.header}>Tell us about yourself</div>
        <p style={ms.sub}>This helps your counsellor give you more relevant guidance.</p>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={ms.row}>
            <label style={ms.label}>School / Institution</label>
            <input style={ms.input} name="school" value={form.school} onChange={handle} placeholder="e.g. City Grammar School" required />
          </div>
          <div style={ms.row}>
            <label style={ms.label}>Stream / Subject Area</label>
            <select style={ms.input} name="stream" value={form.stream} onChange={handle} required>
              <option value="">Select stream…</option>
              {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={ms.row}>
            <label style={ms.label}>Age</label>
            <input style={ms.input} name="age" type="number" min="10" max="30" value={form.age} onChange={handle} placeholder="Your age" required />
          </div>
          <div style={ms.row}>
            <label style={ms.label}>Gender</label>
            <select style={ms.input} name="gender" value={form.gender} onChange={handle} required>
              <option value="">Select gender…</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {error && <div style={ms.error}>Something went wrong. Please try again.</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onCancel} style={ms.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={ms.saveBtn}>{saving ? "Saving…" : "Continue to Chat"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Pending counsellor confirmation dialog ──

function PendingCounsellorModal({ onCancel, onWithdraw, withdrawing, error }) {
  return (
    <div style={ms.overlay}>
      <div style={{ ...ms.modal, maxWidth: 420 }}>
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>⚠️</div>
        <div style={{ ...ms.header, textAlign: "center", fontSize: 18 }}>Counsellor Request Pending</div>
        <p style={{ ...ms.sub, textAlign: "center", marginBottom: 20 }}>
          You have submitted a counsellor application that is still under review.
          Would you like to <strong>withdraw your application</strong> and chat as a student?
        </p>
        {error && <div style={{ ...ms.error, marginBottom: 12 }}>Something went wrong. Please try again.</div>}
        <div style={{ background: "#fff3e0", border: "1px solid #ffe0b2", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#e65100", marginBottom: 20, fontFamily: "var(--fontHeading)" }}>
          If you withdraw, your application and all submitted documents will be permanently deleted.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={ms.cancelBtn}>Keep my request</button>
          <button onClick={onWithdraw} disabled={withdrawing} style={{ ...ms.saveBtn, background: "linear-gradient(135deg, #b71c1c, #e53935)" }}>
            {withdrawing ? "Withdrawing…" : "Withdraw & Chat"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──

export default function AskCounsellor() {
  const { user_id, is_exist, role, counsellor_approved } = useSelector((store) => store.authentication);
  const { topCounsellorsList } = useSelector((store) => store.askCounsellor);

  const [activeCounsellor, setActiveCounsellor] = useState(null);
  const [pendingCounsellor, setPendingCounsellor] = useState(null);

  // Which modal is open: null | 'pending' | 'gate'
  const [modal, setModal] = useState(null);

  const [gateSaving, setGateSaving] = useState(false);
  const [gateError, setGateError] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);

  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Verified counsellors browse only — no chat
  const isCounsellor = role === 'C' || (role === 'B' && counsellor_approved);
  // Pending applicant: submitted but not yet approved
  const isPendingCounsellor = role === 'B' && !counsellor_approved;

  useEffect(() => {
    dispatch(getTopCounsellors());
    dispatch(authenticate());
  }, [dispatch]);

  // Pre-fetch student profile to know if gate is needed
  useEffect(() => {
    if (is_exist && !isCounsellor) {
      axios.get(`${BASE}/getUserProfile`)
        .then(res => { profileRef.current = res.data.profile; })
        .catch(() => {});
    }
  }, [is_exist, isCounsellor]);

  const generateStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`fa-solid fa-star ${i <= rating ? AskCounsellorCSS.starsFilled : AskCounsellorCSS.starEmpty}`}></span>
      );
    }
    return stars;
  };

  const handleChatButtonClick = (counsellor) => {
    if (!is_exist) { navigate("/login"); return; }

    // Pending counsellor applicant → show withdrawal confirmation
    if (isPendingCounsellor) {
      setPendingCounsellor(counsellor);
      setModal('pending');
      return;
    }

    // Normal student → check if profile is filled
    const p = profileRef.current;
    const needsProfile = !p || !p.school || !p.stream || !p.age || !p.gender;
    if (needsProfile) {
      setPendingCounsellor(counsellor);
      setModal('gate');
    } else {
      setActiveCounsellor(counsellor);
    }
  };

  // User chose to withdraw their counsellor application
  const handleWithdraw = async () => {
    setWithdrawing(true);
    setWithdrawError(false);
    try {
      await axios.post(`${BASE}/cancelCounsellorRequest`);
      // Re-sync auth state so role updates to 'U' everywhere
      await dispatch(authenticate());
      setModal(null);
      // Now check if profile gate is needed
      const p = profileRef.current;
      const needsProfile = !p || !p.school || !p.stream || !p.age || !p.gender;
      if (needsProfile) {
        setModal('gate');
      } else {
        setActiveCounsellor(pendingCounsellor);
        setPendingCounsellor(null);
      }
    } catch {
      setWithdrawError(true);
    } finally {
      setWithdrawing(false);
    }
  };

  // User chose not to withdraw
  const handleKeepRequest = () => {
    setModal(null);
    setPendingCounsellor(null);
    setWithdrawError(false);
  };

  // Profile gate saved
  const handleGateSave = async (form) => {
    setGateSaving(true);
    setGateError(false);
    try {
      const data = new FormData();
      data.append("school", form.school.trim());
      data.append("stream", form.stream);
      data.append("age", form.age);
      data.append("gender", form.gender);
      await axios.post(`${BASE}/updateUserProfile`, data);
      profileRef.current = { ...(profileRef.current || {}), ...form };
      setModal(null);
      setActiveCounsellor(pendingCounsellor);
      setPendingCounsellor(null);
    } catch {
      setGateError(true);
    } finally {
      setGateSaving(false);
    }
  };

  const handleGateCancel = () => {
    setModal(null);
    setPendingCounsellor(null);
    setGateError(false);
  };

  return (
    <main role="main" className={AskCounsellorCSS.MainDiv}>
      <div className="text-center m-3">
        <h1 className={AskCounsellorCSS.CounsellorsHeading}>
          {isCounsellor ? "Browse Counsellors" : "CareerGuidance Counsellors"}
        </h1>
        {isCounsellor && (
          <p style={{ color: "#888", fontSize: 14, fontFamily: "var(--fontHeading)", marginTop: 4 }}>
            Browse and view counsellor profiles.
          </p>
        )}
        <hr className={AskCounsellorCSS.mainHR} />
      </div>

      <div className="container">
        <div className="row">
          {topCounsellorsList &&
            topCounsellorsList.map((counsellor) => (
              <div className="col-md-6 mb-4" key={counsellor.id}>
                <div className={`card ${AskCounsellorCSS.CounsellorCard}`}>
                  <div className="row no-gutters">
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                      <img
                        src={`/career_counselling_portal/Counsellors/${counsellor.email}/${counsellor.profile_pic}`}
                        className={`${AskCounsellorCSS.image} card-img rounded-circle ms-4 mt-3`}
                        alt="Counselor"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title"><strong>{counsellor.name}</strong></h5>
                        <p className="card-text">
                          <strong>Specialty:</strong>{" "}
                          {counsellor.qualification} in {counsellor.field_of_study}
                        </p>
                        <p className="card-text">
                          <strong>Last Review:</strong> {counsellor.review_description}
                        </p>
                        <p className="card-text">
                          <strong>Rating:</strong> {generateStars(counsellor.avg_rating)}
                        </p>

                        {/* Verified counsellors: view only */}
                        {isCounsellor ? null : (
                          <button
                            onClick={() => handleChatButtonClick(counsellor)}
                            className={`btn ${AskCounsellorCSS.ChatButton}`}
                          >
                            💬 Chat With {counsellor.name}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Pending counsellor withdrawal confirmation */}
      {modal === 'pending' && (
        <PendingCounsellorModal
          onCancel={handleKeepRequest}
          onWithdraw={handleWithdraw}
          withdrawing={withdrawing}
          error={withdrawError}
        />
      )}

      {/* Student profile gate */}
      {modal === 'gate' && (
        <ProfileGateModal
          onSave={handleGateSave}
          onCancel={handleGateCancel}
          saving={gateSaving}
          error={gateError}
        />
      )}

      {activeCounsellor && (
        <ChatModal
          counsellor={activeCounsellor}
          currentUserId={user_id}
          onClose={() => setActiveCounsellor(null)}
        />
      )}
    </main>
  );
}

// ── Shared modal styles ──

const ms = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200,
  },
  modal: {
    background: "#fff", borderRadius: 16, padding: "32px 36px",
    width: "100%", maxWidth: 460, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  },
  header: { fontFamily: "var(--fontHeading)", fontSize: 20, fontWeight: "bold", color: "#1a237e", marginBottom: 6 },
  sub: { fontSize: 13, color: "#666", marginBottom: 20, fontFamily: "var(--fontHeading)" },
  row: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, color: "#555", fontFamily: "var(--fontHeading)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "var(--fontHeading)", outline: "none" },
  error: { background: "#ffebee", color: "#c62828", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "var(--fontHeading)" },
  cancelBtn: { flex: 1, border: "1px solid #ccc", background: "#fff", borderRadius: 8, padding: "11px", fontSize: 14, fontFamily: "var(--fontHeading)", cursor: "pointer", color: "#555" },
  saveBtn: { flex: 2, background: "linear-gradient(135deg, #1a237e, #3949ab)", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontFamily: "var(--fontHeading)", cursor: "pointer" },
};
