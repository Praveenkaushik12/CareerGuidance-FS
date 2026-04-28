import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { authenticate } from "../features/authentication/authenticationSlice"

axios.defaults.withCredentials = true
const BASE = "http://127.0.0.1:8000"

// ─── helpers ────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
    return (
        <div style={s.infoRow}>
            <span style={s.infoLabel}>{label}</span>
            <span style={s.infoValue}>{value || <em style={{ color: "#bbb" }}>—</em>}</span>
        </div>
    )
}

function SectionCard({ title, children }) {
    return (
        <div style={s.sectionCard}>
            <div style={s.sectionTitle}>{title}</div>
            {children}
        </div>
    )
}

// ─── Counsellor profile ──────────────────────────────────────────────────────

function CounsellorProfile({ profile }) {
    const c = profile.counsellor
    const qual = c?.qualification
    const experiences = c?.working_experiences || []

    const [form, setForm] = useState({ name: profile.name, phone_no: c?.phone_no || "", password: "" })
    const [picFile, setPicFile] = useState(null)
    const [picPreview, setPicPreview] = useState(null)
    const [status, setStatus] = useState(null)
    const [saving, setSaving] = useState(false)
    const fileRef = useRef()

    const profilePicSrc = picPreview ||
        (c?.profile_pic ? `../../career_counselling_portal/Counsellors/${profile.email}/${c.profile_pic}` : null)

    const handleChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setStatus(null) }
    const handlePic = (e) => { const f = e.target.files[0]; if (!f) return; setPicFile(f); setPicPreview(URL.createObjectURL(f)); setStatus(null) }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true); setStatus(null)
        try {
            const data = new FormData()
            if (form.name.trim()) data.append("name", form.name.trim())
            if (form.password.trim()) data.append("password", form.password.trim())
            if (form.phone_no.trim()) data.append("phone_no", form.phone_no.trim())
            if (picFile) data.append("profilePic", picFile)
            await axios.post(`${BASE}/updateUserProfile`, data)
            setStatus("success")
            setForm(f => ({ ...f, password: "" }))
            setPicFile(null)
        } catch { setStatus("error") }
        finally { setSaving(false) }
    }

    return (
        <div style={s.twoCol}>
            {/* ── Left column ── */}
            <div style={s.leftCol}>
                <div style={s.avatarWrap}>
                    {profilePicSrc
                        ? <img src={profilePicSrc} alt="Profile" style={s.avatarImg} />
                        : <div style={s.avatarInitials}>{profile.name.charAt(0).toUpperCase()}</div>}
                    <button style={s.changePicBtn} type="button" onClick={() => fileRef.current.click()}>
                        Change Photo
                    </button>
                    <input type="file" accept="image/*" ref={fileRef} style={{ display: "none" }} onChange={handlePic} />
                    <div style={s.roleTag}>Counsellor</div>
                </div>

                <SectionCard title="Verification Documents">
                    <p style={s.verifiedNote}>Verified at registration — cannot be changed.</p>
                    <div style={s.infoRow}><span style={s.infoLabel}>Gender</span><span style={s.infoValue}>{c?.gender}</span></div>
                    <div style={{ marginTop: 6, ...s.infoRow }}><span style={s.infoLabel}>CNIC</span><span style={s.infoValue}>{c?.cnic}</span></div>
                    {c?.cnic_front_img && (
                        <div style={{ marginTop: 10 }}>
                            <div style={s.docLabel}>CNIC Front</div>
                            <img src={`../../career_counselling_portal/Counsellors/${profile.email}/${c.cnic_front_img}`} style={s.docImg} alt="CNIC Front" />
                        </div>
                    )}
                    {c?.cninc_back_img && (
                        <div style={{ marginTop: 10 }}>
                            <div style={s.docLabel}>CNIC Back</div>
                            <img src={`../../career_counselling_portal/Counsellors/${profile.email}/${c.cninc_back_img}`} style={s.docImg} alt="CNIC Back" />
                        </div>
                    )}
                </SectionCard>
            </div>

            {/* ── Right column ── */}
            <div style={s.rightCol}>
                <SectionCard title="Personal Information">
                    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={s.formRow}>
                            <label style={s.label}>Full Name</label>
                            <input style={s.input} name="name" value={form.name} onChange={handleChange} />
                        </div>
                        <div style={s.formRow}>
                            <label style={s.label}>Email</label>
                            <input style={{ ...s.input, ...s.readonlyInput }} value={profile.email} readOnly />
                        </div>
                        <div style={s.formRow}>
                            <label style={s.label}>Phone</label>
                            <input style={s.input} name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Phone number" />
                        </div>
                        <div style={s.formRow}>
                            <label style={s.label}>New Password</label>
                            <input style={s.input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
                        </div>
                        {status === "success" && <div style={s.success}>Profile updated successfully.</div>}
                        {status === "error" && <div style={s.error}>Something went wrong. Please try again.</div>}
                        <button type="submit" disabled={saving} style={s.saveBtn}>{saving ? "Saving…" : "Save Changes"}</button>
                    </form>
                </SectionCard>

                {qual && (
                    <SectionCard title="Qualification">
                        <InfoRow label="Degree" value={qual.qualification} />
                        <InfoRow label="Field of Study" value={qual.field_of_study} />
                        {qual.transcript_img && (
                            <div style={{ marginTop: 10 }}>
                                <div style={s.docLabel}>Transcript</div>
                                <img src={`../../career_counselling_portal/Counsellors/${profile.email}/${qual.transcript_img}`} style={s.docImg} alt="Transcript" />
                            </div>
                        )}
                    </SectionCard>
                )}

                {experiences.map((exp, i) => (
                    <SectionCard key={i} title={`Working Experience${experiences.length > 1 ? ` ${i + 1}` : ""}`}>
                        <InfoRow label="Institute" value={exp.institute_name} />
                        <InfoRow label="Period" value={`${exp.starting_year} – ${exp.ending_year}`} />
                        {exp.certificates_image && (
                            <div style={{ marginTop: 10 }}>
                                <div style={s.docLabel}>Certificate</div>
                                <img src={`../../career_counselling_portal/Counsellors/${profile.email}/WorkingExperience/${exp.certificates_image}`} style={s.docImg} alt="Certificate" />
                            </div>
                        )}
                    </SectionCard>
                ))}
            </div>
        </div>
    )
}

// ─── Student profile — name + password only ──────────────────────────────────

function StudentProfile({ profile, isPending }) {
    const dispatch = useDispatch()
    const [form, setForm] = useState({ name: profile.name || "", password: "" })
    const [status, setStatus] = useState(null)
    const [saving, setSaving] = useState(false)
    const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)
    const [withdrawing, setWithdrawing] = useState(false)
    const [withdrawStatus, setWithdrawStatus] = useState(null) // null | 'error'

    const initials = (profile.name || profile.email || "S").charAt(0).toUpperCase()

    const handleChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setStatus(null) }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true); setStatus(null)
        try {
            const data = new FormData()
            data.append("name", form.name.trim())
            if (form.password.trim()) data.append("password", form.password.trim())
            await axios.post(`${BASE}/updateUserProfile`, data)
            setStatus("success")
            setForm(f => ({ ...f, password: "" }))
        } catch { setStatus("error") }
        finally { setSaving(false) }
    }

    const handleWithdraw = async () => {
        setWithdrawing(true)
        setWithdrawStatus(null)
        try {
            await axios.post(`${BASE}/cancelCounsellorRequest`)
            // Re-sync auth so navbar + role updates everywhere
            await dispatch(authenticate())
            // No need to close modal — component will re-render as non-pending student
        } catch {
            setWithdrawStatus('error')
        } finally {
            setWithdrawing(false)
        }
    }

    return (
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={s.avatarWrap}>
                <div style={s.avatarInitials}>{initials}</div>
                {isPending
                    ? <div style={{ ...s.roleTag, background: "linear-gradient(135deg, #e65100, #ef6c00)" }}>Counsellor Request Pending</div>
                    : <div style={s.roleTag}>Student</div>}
            </div>

            {isPending && (
                <>
                    <div style={s.pendingNote}>
                        Your counsellor application is under review. You'll get an email once approved.
                    </div>

                    {/* Withdraw section */}
                    {!showWithdrawConfirm ? (
                        <div style={s.withdrawRow}>
                            <button
                                type="button"
                                style={s.withdrawBtn}
                                onClick={() => { setShowWithdrawConfirm(true); setWithdrawStatus(null) }}
                            >
                                Withdraw Application
                            </button>
                        </div>
                    ) : (
                        <div style={s.withdrawCard}>
                            <div style={s.withdrawWarningTitle}>⚠ Withdraw your application?</div>
                            <p style={s.withdrawWarningText}>
                                This will permanently delete your submitted documents and reset your account to a regular student account.
                            </p>
                            {withdrawStatus === 'error' && (
                                <div style={{ ...s.error, marginBottom: 10 }}>Something went wrong. Please try again.</div>
                            )}
                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    type="button"
                                    style={s.withdrawCancelBtn}
                                    onClick={() => { setShowWithdrawConfirm(false); setWithdrawStatus(null) }}
                                    disabled={withdrawing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    style={s.withdrawConfirmBtn}
                                    onClick={handleWithdraw}
                                    disabled={withdrawing}
                                >
                                    {withdrawing ? "Withdrawing…" : "Yes, Withdraw"}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <SectionCard title="My Details">
                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={s.formRow}>
                        <label style={s.label}>Full Name</label>
                        <input style={s.input} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                    </div>
                    <div style={s.formRow}>
                        <label style={s.label}>Email</label>
                        <input style={{ ...s.input, ...s.readonlyInput }} value={profile.email} readOnly />
                    </div>
                    <div style={s.formRow}>
                        <label style={s.label}>New Password</label>
                        <input style={s.input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
                    </div>
                    {status === "success" && <div style={s.success}>Profile updated successfully.</div>}
                    {status === "error" && <div style={s.error}>Something went wrong. Please try again.</div>}
                    <button type="submit" disabled={saving} style={s.saveBtn}>{saving ? "Saving…" : "Save Changes"}</button>
                </form>
            </SectionCard>
        </div>
    )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function UserProfile() {
    const { role, counsellor_approved } = useSelector((store) => store.authentication)
    const [profile, setProfile] = useState(null)
    const [loadErr, setLoadErr] = useState(false)

    useEffect(() => {
        axios.get(`${BASE}/getUserProfile`)
            .then(res => setProfile(res.data.profile))
            .catch(() => setLoadErr(true))
    }, [])

    if (loadErr) return <div style={s.centered}><div style={{ color: "#c62828" }}>Failed to load profile. Please try again.</div></div>
    if (!profile) return <div style={s.centered}><div style={{ color: "#888" }}>Loading…</div></div>

    // Only show counsellor view once the admin has approved them
    const isApprovedCounsellor = role === "C" || (role === "B" && counsellor_approved)
    const isPendingCounsellor = role === "B" && !counsellor_approved

    return (
        <div style={s.page}>
            <div style={s.pageInner}>
                <h2 style={s.pageHeading}>My Profile</h2>
                <hr style={{ borderColor: "#e0e0e0", margin: "0 0 28px" }} />
                {isApprovedCounsellor
                    ? <CounsellorProfile profile={profile} />
                    : <StudentProfile profile={profile} isPending={isPendingCounsellor} />}
            </div>
        </div>
    )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
    page: { minHeight: "calc(100vh - 80px)", background: "#f5f7fb", padding: "36px 16px" },
    pageInner: { maxWidth: 960, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "36px 40px" },
    pageHeading: { fontFamily: "var(--fontHeading)", color: "#1a237e", fontSize: 26, margin: "0 0 12px" },

    twoCol: { display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" },
    leftCol: { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 },
    rightCol: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 },

    avatarWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 16 },
    avatarImg: { width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: "3px solid #3949ab" },
    avatarInitials: { width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg, #1a237e, #3949ab)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: "bold", fontFamily: "var(--fontHeading)" },
    changePicBtn: { background: "none", border: "1px solid #3949ab", color: "#3949ab", borderRadius: 6, padding: "4px 14px", fontSize: 13, cursor: "pointer", fontFamily: "var(--fontHeading)" },
    roleTag: { background: "linear-gradient(135deg, #1a237e, #3949ab)", color: "#fff", borderRadius: 20, padding: "4px 18px", fontSize: 12, fontFamily: "var(--fontHeading)", letterSpacing: 1, textTransform: "uppercase" },

    pendingNote: { background: "#fff3e0", border: "1px solid #ffe0b2", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#e65100", fontFamily: "var(--fontHeading)", marginBottom: 20, textAlign: "center" },

    sectionCard: { background: "#fafbff", border: "1px solid #e8eaf6", borderRadius: 12, padding: "18px 20px" },
    sectionTitle: { fontFamily: "var(--fontHeading)", fontWeight: "bold", fontSize: 15, color: "#1a237e", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #e8eaf6" },
    verifiedNote: { fontSize: 12, color: "#888", marginBottom: 10, fontFamily: "var(--fontHeading)" },

    infoRow: { display: "flex", alignItems: "baseline", gap: 8, padding: "5px 0", borderBottom: "1px solid #f0f0f0" },
    infoLabel: { fontFamily: "var(--fontHeading)", fontSize: 12, color: "#888", width: 120, flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.5 },
    infoValue: { fontFamily: "var(--fontHeading)", fontSize: 14, color: "#333" },

    docLabel: { fontFamily: "var(--fontHeading)", fontSize: 12, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
    docImg: { width: "100%", maxWidth: 280, borderRadius: 8, border: "1px solid #e0e0e0" },

    formRow: { display: "flex", flexDirection: "column", gap: 4 },
    label: { fontSize: 12, color: "#555", fontFamily: "var(--fontHeading)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
    input: { border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "var(--fontHeading)", outline: "none" },
    readonlyInput: { background: "#f5f5f5", color: "#999", cursor: "not-allowed" },
    saveBtn: { background: "linear-gradient(135deg, #1a237e, #3949ab)", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontFamily: "var(--fontHeading)", cursor: "pointer", marginTop: 4 },
    success: { background: "#e8f5e9", color: "#2e7d32", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "var(--fontHeading)" },
    error: { background: "#ffebee", color: "#c62828", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "var(--fontHeading)" },
    centered: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" },

    // Withdraw application
    withdrawRow: { display: "flex", justifyContent: "flex-end", marginBottom: 16 },
    withdrawBtn: { background: "none", border: "1px solid #e53935", color: "#e53935", borderRadius: 7, padding: "6px 16px", fontSize: 13, fontFamily: "var(--fontHeading)", cursor: "pointer", fontWeight: 600 },
    withdrawCard: { background: "#fff8f8", border: "1px solid #ffcdd2", borderRadius: 12, padding: "16px 18px", marginBottom: 18 },
    withdrawWarningTitle: { fontFamily: "var(--fontHeading)", fontWeight: "bold", color: "#b71c1c", fontSize: 14, marginBottom: 8 },
    withdrawWarningText: { fontSize: 13, color: "#555", fontFamily: "var(--fontHeading)", marginBottom: 14 },
    withdrawCancelBtn: { flex: 1, border: "1px solid #ccc", background: "#fff", borderRadius: 8, padding: "9px", fontSize: 13, fontFamily: "var(--fontHeading)", cursor: "pointer", color: "#555" },
    withdrawConfirmBtn: { flex: 1, background: "linear-gradient(135deg, #b71c1c, #e53935)", color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontFamily: "var(--fontHeading)", cursor: "pointer", fontWeight: 600 },
}
