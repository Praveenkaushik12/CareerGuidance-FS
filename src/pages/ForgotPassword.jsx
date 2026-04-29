import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginCSS from "../assets/styles/Login.module.css";
import Robo from "../assets/images/Login_Robo.gif";

axios.defaults.withCredentials = true;
const BASE = "http://127.0.0.1:8000";

// ── Step indicator ──────────────────────────────────────────────────────────

function Steps({ current }) {
  const steps = ["Email", "Verify OTP", "New Password"];
  return (
    <div style={st.row}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={i < current ? st.done : i === current ? st.active : st.idle}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === current ? "#1a237e" : "#aaa", fontFamily: "var(--fontHeading)", whiteSpace: "nowrap" }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 36, height: 2, background: i < current ? "#3949ab" : "#ddd", margin: "0 6px", marginBottom: 18 }} />
          )}
        </div>
      ))}
    </div>
  );
}

const st = {
  row: { display: "flex", alignItems: "flex-start", justifyContent: "center", marginBottom: 28 },
  done: {
    width: 28, height: 28, borderRadius: "50%", background: "#3949ab",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: "bold",
  },
  active: {
    width: 28, height: 28, borderRadius: "50%", background: "#1a237e",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: "bold", boxShadow: "0 0 0 3px rgba(26,35,126,0.2)",
  },
  idle: {
    width: 28, height: 28, borderRadius: "50%", background: "#eee",
    color: "#999", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: "bold",
  },
};

// ── OTP 4-box input ─────────────────────────────────────────────────────────

function OtpInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const digits = (value + "    ").slice(0, 4).split("");

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, idx) + value.slice(idx + 1);
      onChange(next);
      if (idx > 0) refs[idx - 1].current?.focus();
    } else if (/^[0-9]$/.test(e.key)) {
      const next = (value.slice(0, idx) + e.key + value.slice(idx + 1)).slice(0, 4);
      onChange(next);
      if (idx < 3) refs[idx + 1].current?.focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={() => {}}
          onKeyDown={e => handleKey(e, i)}
          onFocus={e => e.target.select()}
          style={{
            width: 52, height: 58, textAlign: "center", fontSize: 24,
            fontWeight: "bold", border: "2px solid",
            borderColor: d.trim() ? "#3949ab" : "#ddd",
            borderRadius: 10, outline: "none",
            fontFamily: "var(--fontHeading)",
            color: "#1a237e",
            background: "#f8f9ff",
            transition: "border-color 0.2s",
          }}
        />
      ))}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=email, 1=otp, 2=password, 3=done

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  // ── Step 0: send OTP ──
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE}/forgotPasswordSendOTP`, { email });
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    setError("");
    setResendMsg("");
    setLoading(true);
    try {
      await axios.post(`${BASE}/forgotPasswordSendOTP`, { email });
      setOtp("");
      setResendMsg("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: verify OTP ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 4) { setError("Please enter the 4-digit OTP."); return; }
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE}/forgotPasswordVerifyOTP`, { otp });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: reset password ──
  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE}/forgotPasswordReset`, { password });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={LoginCSS.wrapper}>
      <div className={LoginCSS.inner}>
        <img src={Robo} alt="" className={LoginCSS.image1} />

        <div className={LoginCSS.form}>
          {/* Success state */}
          {step === 3 ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h2 className={LoginCSS.loginHeading} style={{ fontSize: 22 }}>Password Reset!</h2>
              <p style={{ color: "#555", fontFamily: "var(--fontHeading)", fontSize: 14, marginBottom: 28 }}>
                Your password has been updated. You can now log in with your new password.
              </p>
              <button
                className={LoginCSS.loginBtn}
                onClick={() => navigate("/login")}
              >
                <span>Go to Login</span>
              </button>
            </div>
          ) : (
            <>
              <h2 className={LoginCSS.loginHeading} style={{ fontSize: 24, marginBottom: 20 }}>
                {step === 0 && "Forgot Password"}
                {step === 1 && "Verify OTP"}
                {step === 2 && "New Password"}
              </h2>

              <Steps current={step} />

              {/* ── Step 0: email ── */}
              {step === 0 && (
                <form onSubmit={handleSendOTP}>
                  <p style={p.hint}>Enter your account email and we'll send you a reset code.</p>
                  <div className={LoginCSS.formHolder}>
                    <span><i className="fa-regular fa-envelope" /></span>
                    <input
                      type="email"
                      className={LoginCSS.formControl}
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className={LoginCSS.errorMsg}>{error}</div>}
                  <button className={LoginCSS.loginBtn} disabled={loading}>
                    <span>{loading ? "Sending…" : "Send OTP"}</span>
                  </button>
                  <p className={LoginCSS.accountExist}>
                    Remember it? <Link to="/login">Login</Link>
                  </p>
                </form>
              )}

              {/* ── Step 1: OTP ── */}
              {step === 1 && (
                <form onSubmit={handleVerifyOTP}>
                  <p style={p.hint}>
                    We sent a 4-digit code to <strong>{email}</strong>. Enter it below.
                  </p>
                  <OtpInput value={otp} onChange={setOtp} />
                  {error && <div className={LoginCSS.errorMsg}>{error}</div>}
                  {resendMsg && <div style={{ color: "#388e3c", textAlign: "center", fontSize: 13, fontFamily: "var(--fontHeading)", marginBottom: 8 }}>{resendMsg}</div>}
                  <button className={LoginCSS.loginBtn} disabled={loading || otp.length < 4}>
                    <span>{loading ? "Verifying…" : "Verify OTP"}</span>
                  </button>
                  <p style={{ textAlign: "center", fontFamily: "var(--fontHeading)", fontSize: 14, paddingTop: 16, color: "#666" }}>
                    Didn't receive it?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      style={{ background: "none", border: "none", color: "#3949ab", cursor: "pointer", fontFamily: "var(--fontHeading)", fontSize: 14, padding: 0, textDecoration: "underline" }}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}

              {/* ── Step 2: new password ── */}
              {step === 2 && (
                <form onSubmit={handleReset}>
                  <p style={p.hint}>Choose a new password for your account.</p>
                  <div className={LoginCSS.formHolder}>
                    <span><i className="fa-solid fa-lock" /></span>
                    <input
                      type={showPwd ? "text" : "password"}
                      className={LoginCSS.formControl}
                      placeholder="New password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 14, padding: "0 4px" }}
                      tabIndex={-1}
                    >
                      <i className={showPwd ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} />
                    </button>
                  </div>
                  <div className={LoginCSS.formHolder}>
                    <span><i className="fa-solid fa-lock" /></span>
                    <input
                      type={showPwd ? "text" : "password"}
                      className={LoginCSS.formControl}
                      placeholder="Confirm password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                  {/* Password strength bar */}
                  {password && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ height: 4, borderRadius: 4, background: "#eee", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 4, transition: "width 0.3s, background 0.3s",
                          width: password.length >= 10 ? "100%" : password.length >= 8 ? "66%" : password.length >= 6 ? "33%" : "10%",
                          background: password.length >= 10 ? "#388e3c" : password.length >= 8 ? "#f9a825" : "#e53935",
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 3, fontFamily: "var(--fontHeading)" }}>
                        Strength: {password.length >= 10 ? "Strong" : password.length >= 8 ? "Medium" : password.length >= 6 ? "Weak" : "Too short"}
                      </div>
                    </div>
                  )}
                  {error && <div className={LoginCSS.errorMsg}>{error}</div>}
                  <button className={LoginCSS.loginBtn} disabled={loading}>
                    <span>{loading ? "Saving…" : "Reset Password"}</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const p = {
  hint: { fontSize: 13, color: "#666", fontFamily: "var(--fontHeading)", textAlign: "center", marginBottom: 8 },
};
