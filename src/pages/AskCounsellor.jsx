import AskCounsellorCSS from "../assets/styles/AskCounsellor.module.css";
import { getTopCounsellors } from "../features/askCounsellor/askCounsellorSlice";
import { useEffect, useState, useRef, useMemo } from "react";
import defaultAvatar from "../assets/images/default_avatar.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../features/authentication/authenticationSlice";
import ChatModal from "./ChatModal";
import axios from "axios";

axios.defaults.withCredentials = true;
const BASE = "http://127.0.0.1:8000";

const STREAMS = ["Science", "Arts", "Commerce", "Computer Science", "Medical", "Engineering", "Other"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

// ── Profile gate modal ──

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

// ── Star generator ──

function Stars({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`fa-solid fa-star ${i <= rating ? AskCounsellorCSS.starsFilled : AskCounsellorCSS.starEmpty}`}
        />
      ))}
      <span style={{ fontSize: 13, color: "#888", marginLeft: 6, fontWeight: 500 }}>
        {rating ? Number(rating).toFixed(1) : "No rating"}
      </span>
    </span>
  );
}

// ── Search + Filter bar ──

function FilterBar({ search, onSearch, fieldFilter, onField, ratingFilter, onRating, fields }) {
  return (
    <div style={fb.wrap}>
      {/* Search */}
      <div style={fb.inputWrap}>
        <i className="fa-solid fa-magnifying-glass" style={fb.icon} />
        <input
          style={fb.input}
          placeholder="Search by name or specialty…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <button style={fb.clear} onClick={() => onSearch("")} title="Clear">✕</button>
        )}
      </div>

      {/* Field filter */}
      <select style={fb.select} value={fieldFilter} onChange={e => onField(e.target.value)}>
        <option value="">All fields</option>
        {fields.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      {/* Min rating filter */}
      <select style={fb.select} value={ratingFilter} onChange={e => onRating(e.target.value)}>
        <option value="">Any rating</option>
        <option value="4">4+ stars</option>
        <option value="3">3+ stars</option>
        <option value="2">2+ stars</option>
      </select>
    </div>
  );
}

const fb = {
  wrap: {
    display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28,
    alignItems: "center", justifyContent: "center",
  },
  inputWrap: {
    position: "relative", display: "flex", alignItems: "center",
    flex: "1 1 260px", maxWidth: 360,
  },
  icon: {
    position: "absolute", left: 12, color: "#3949ab", fontSize: 14,
  },
  input: {
    width: "100%", border: "1.5px solid #c5cae9", borderRadius: 10,
    padding: "10px 36px 10px 36px", fontSize: 14,
    fontFamily: "var(--fontHeading)", outline: "none", background: "#fff",
  },
  clear: {
    position: "absolute", right: 10, background: "none", border: "none",
    cursor: "pointer", color: "#999", fontSize: 16, lineHeight: 1,
  },
  select: {
    border: "1.5px solid #c5cae9", borderRadius: 10, padding: "10px 14px",
    fontSize: 14, fontFamily: "var(--fontHeading)", outline: "none",
    background: "#fff", cursor: "pointer", minWidth: 130,
    color: "#444",
  },
};

// ── Counsellor Card ──

function CounsellorCard({ counsellor, isCounsellor, onChat }) {
  return (
    <div className={`card ${AskCounsellorCSS.CounsellorCard}`} style={{ height: "100%" }}>
      <div className="row no-gutters" style={{ height: "100%" }}>
        {/* Photo column */}
        <div className="col-md-4 d-flex flex-column justify-content-center align-items-center" style={{ padding: "20px 10px" }}>
          <img
            src={`/career_counselling_portal/Counsellors/${counsellor.email}/${counsellor.profile_pic}`}
            className={`${AskCounsellorCSS.image} card-img rounded-circle`}
            alt={counsellor.name}
            style={{ width: 90, height: 90, objectFit: "cover" }}
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = defaultAvatar; }}
          />
          {/* Rating badge under photo */}
          <div style={card.ratingBadge}>
            <i className="fa-solid fa-star" style={{ color: "#fdd835", fontSize: 13, marginRight: 4 }} />
            {counsellor.avg_rating ? Number(counsellor.avg_rating).toFixed(1) : "—"}
          </div>
        </div>

        {/* Info column */}
        <div className="col-md-8">
          <div className="card-body" style={{ padding: "18px 16px 14px" }}>
            <h5 className="card-title" style={{ marginBottom: 4, fontSize: 17, fontWeight: 700 }}>
              {counsellor.name}
            </h5>

            {/* Specialty chip */}
            <div style={card.chip}>
              <i className="fa-solid fa-graduation-cap" style={{ fontSize: 11, marginRight: 5 }} />
              {counsellor.qualification} · {counsellor.field_of_study}
            </div>

            {/* Stars */}
            <div style={{ marginBottom: 8 }}>
              <Stars rating={counsellor.avg_rating} />
            </div>

            {/* Last review snippet */}
            {counsellor.review_description && (
              <p style={card.review}>
                <i className="fa-solid fa-quote-left" style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }} />
                {counsellor.review_description}
              </p>
            )}

            {!isCounsellor && (
              <button
                onClick={() => onChat(counsellor)}
                className={`btn ${AskCounsellorCSS.ChatButton}`}
                style={{ marginTop: 8, fontSize: 13, padding: "7px 16px" }}
              >
                <i className="fa-solid fa-comment-dots" style={{ marginRight: 6 }} />
                Chat with {counsellor.name.split(" ")[0]}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const card = {
  ratingBadge: {
    marginTop: 8, background: "#1a237e", color: "#fff", borderRadius: 20,
    padding: "3px 10px", fontSize: 12, fontFamily: "var(--fontHeading)", fontWeight: 600,
    display: "flex", alignItems: "center",
  },
  chip: {
    display: "inline-block", background: "#e8eaf6", color: "#3949ab",
    borderRadius: 20, padding: "3px 10px", fontSize: 12,
    fontFamily: "var(--fontHeading)", marginBottom: 8, fontWeight: 600,
  },
  review: {
    fontSize: 12, color: "#666", fontStyle: "italic",
    lineHeight: 1.5, marginBottom: 4,
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
};

// ── Main component ──

export default function AskCounsellor() {
  const { user_id, is_exist, role, counsellor_approved } = useSelector((store) => store.authentication);
  const { topCounsellorsList } = useSelector((store) => store.askCounsellor);

  const [activeCounsellor, setActiveCounsellor] = useState(null);
  const [pendingCounsellor, setPendingCounsellor] = useState(null);
  const [modal, setModal] = useState(null); // null | 'pending' | 'gate'

  const [gateSaving, setGateSaving] = useState(false);
  const [gateError, setGateError] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCounsellor = role === 'C' || (role === 'B' && counsellor_approved);
  const isPendingCounsellor = role === 'B' && !counsellor_approved;

  useEffect(() => {
    dispatch(getTopCounsellors());
    dispatch(authenticate());
  }, [dispatch]);

  useEffect(() => {
    if (is_exist && !isCounsellor) {
      axios.get(`${BASE}/getUserProfile`)
        .then(res => { profileRef.current = res.data.profile; })
        .catch(() => {});
    }
  }, [is_exist, isCounsellor]);

  // Unique field-of-study values for the filter dropdown
  const uniqueFields = useMemo(() => {
    if (!topCounsellorsList) return [];
    return [...new Set(topCounsellorsList.map(c => c.field_of_study).filter(Boolean))].sort();
  }, [topCounsellorsList]);

  // Filtered & searched list
  const filteredList = useMemo(() => {
    if (!topCounsellorsList) return [];
    return topCounsellorsList.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name?.toLowerCase().includes(q) ||
        c.field_of_study?.toLowerCase().includes(q) ||
        c.qualification?.toLowerCase().includes(q);
      const matchField = !fieldFilter || c.field_of_study === fieldFilter;
      const matchRating = !ratingFilter || (c.avg_rating && Number(c.avg_rating) >= Number(ratingFilter));
      return matchSearch && matchField && matchRating;
    });
  }, [topCounsellorsList, search, fieldFilter, ratingFilter]);

  const handleChatButtonClick = (counsellor) => {
    if (!is_exist) { navigate("/login"); return; }

    if (isPendingCounsellor) {
      setPendingCounsellor(counsellor);
      setModal('pending');
      return;
    }

    const p = profileRef.current;
    const needsProfile = !p || !p.school || !p.stream || !p.age || !p.gender;
    if (needsProfile) {
      setPendingCounsellor(counsellor);
      setModal('gate');
    } else {
      setActiveCounsellor(counsellor);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    setWithdrawError(false);
    try {
      await axios.post(`${BASE}/cancelCounsellorRequest`);
      await dispatch(authenticate());
      setModal(null);
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

  const handleKeepRequest = () => {
    setModal(null);
    setPendingCounsellor(null);
    setWithdrawError(false);
  };

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

  const hasFilters = search || fieldFilter || ratingFilter;

  return (
    <main role="main" className={AskCounsellorCSS.MainDiv}>
      {/* ── Hero section ── */}
      <div style={hero.wrap}>
        <div style={hero.inner}>
          <h1 style={hero.title}>
            {isCounsellor ? "Browse Counsellors" : "Find Your Perfect Counsellor"}
          </h1>
          <p style={hero.sub}>
            {isCounsellor
              ? "View and explore counsellor profiles on the platform."
              : "Connect with expert career counsellors and get personalised guidance for your future."}
          </p>
          {/* Stats bar */}
          {topCounsellorsList && (
            <div style={hero.statsRow}>
              <div style={hero.stat}>
                <span style={hero.statNum}>{topCounsellorsList.length}</span>
                <span style={hero.statLabel}>Counsellors</span>
              </div>
              <div style={hero.statDivider} />
              <div style={hero.stat}>
                <span style={hero.statNum}>{uniqueFields.length}</span>
                <span style={hero.statLabel}>Specialties</span>
              </div>
              <div style={hero.statDivider} />
              <div style={hero.stat}>
                <span style={hero.statNum}>
                  {topCounsellorsList.filter(c => c.avg_rating >= 4).length}
                </span>
                <span style={hero.statLabel}>Top Rated</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 8 }}>
        {/* ── Filter bar ── */}
        <FilterBar
          search={search} onSearch={setSearch}
          fieldFilter={fieldFilter} onField={setFieldFilter}
          ratingFilter={ratingFilter} onRating={setRatingFilter}
          fields={uniqueFields}
        />

        {/* ── Results count ── */}
        {topCounsellorsList && (
          <div style={{ fontSize: 13, color: "#888", marginBottom: 16, fontFamily: "var(--fontHeading)" }}>
            {hasFilters
              ? `${filteredList.length} of ${topCounsellorsList.length} counsellors`
              : `${topCounsellorsList.length} counsellors`}
          </div>
        )}

        {/* ── Cards grid ── */}
        <div className="row">
          {filteredList.length > 0
            ? filteredList.map((counsellor) => (
              <div className="col-md-6 mb-4" key={counsellor.id}>
                <CounsellorCard
                  counsellor={counsellor}
                  isCounsellor={isCounsellor}
                  onChat={handleChatButtonClick}
                />
              </div>
            ))
            : (
              <div style={empty.wrap}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div style={empty.title}>No counsellors found</div>
                <div style={empty.sub}>Try adjusting your search or filters.</div>
                {hasFilters && (
                  <button
                    style={empty.resetBtn}
                    onClick={() => { setSearch(""); setFieldFilter(""); setRatingFilter(""); }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )
          }
        </div>
      </div>

      {/* Modals */}
      {modal === 'pending' && (
        <PendingCounsellorModal
          onCancel={handleKeepRequest}
          onWithdraw={handleWithdraw}
          withdrawing={withdrawing}
          error={withdrawError}
        />
      )}

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

// ── Hero styles ──

const hero = {
  wrap: {
    background: "linear-gradient(135deg, #1a237e 0%, #3949ab 60%, #7c4dff 100%)",
    padding: "48px 20px 56px",
    textAlign: "center",
    marginBottom: 32,
    clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
  },
  inner: { maxWidth: 640, margin: "0 auto" },
  title: {
    fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, color: "#fff",
    fontFamily: "var(--fontHeading)", marginBottom: 10, letterSpacing: -0.5,
  },
  sub: {
    fontSize: 15, color: "rgba(255,255,255,0.82)", fontFamily: "var(--fontHeading)",
    lineHeight: 1.6, marginBottom: 24,
  },
  statsRow: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: 0, background: "rgba(255,255,255,0.12)", borderRadius: 14,
    padding: "14px 24px", display: "inline-flex",
  },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px" },
  statNum: { fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1 },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2, fontFamily: "var(--fontHeading)", textTransform: "uppercase", letterSpacing: 0.5 },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,0.3)" },
};

// ── Empty state styles ──
const empty = {
  wrap: { textAlign: "center", padding: "60px 20px", width: "100%" },
  title: { fontSize: 18, fontWeight: 700, color: "#444", fontFamily: "var(--fontHeading)", marginBottom: 6 },
  sub: { fontSize: 14, color: "#999", fontFamily: "var(--fontHeading)", marginBottom: 20 },
  resetBtn: {
    background: "linear-gradient(135deg, #1a237e, #3949ab)", color: "#fff",
    border: "none", borderRadius: 8, padding: "10px 22px",
    fontSize: 14, fontFamily: "var(--fontHeading)", cursor: "pointer",
  },
};

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
