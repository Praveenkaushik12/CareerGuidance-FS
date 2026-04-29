import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCounsellorCardsData } from "../../features/dashboards/counsellor/dashboardSlice"

function StatCard({ icon, label, value, color, sub }) {
    return (
        <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
            <div style={{ ...styles.statIcon, background: color + "18", color }}>
                <i className={icon} />
            </div>
            <div style={styles.statBody}>
                <div style={styles.statValue}>
                    {value === null || value === undefined ? (
                        <div style={styles.skeleton} />
                    ) : (
                        typeof value === "number" && !Number.isInteger(value)
                            ? value.toFixed(1)
                            : value
                    )}
                </div>
                <div style={styles.statLabel}>{label}</div>
                {sub && <div style={styles.statSub}>{sub}</div>}
            </div>
        </div>
    )
}

function QuickLink({ icon, label, to, color }) {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate(to)} style={{ ...styles.quickLink, borderColor: color + "40" }}>
            <span style={{ ...styles.quickIcon, background: color + "18", color }}>
                <i className={icon} />
            </span>
            <span style={styles.quickLabel}>{label}</span>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: 11, color: "#bbb", marginLeft: "auto" }} />
        </button>
    )
}

export default function Dashboard() {
    const dispatch = useDispatch()
    const { approvedBlogs, pendingApprovalBlogs, averageRating } = useSelector(s => s.counsellorDashboard)
    const { name } = useSelector(s => s.counsellor)

    useEffect(() => { dispatch(getCounsellorCardsData()) }, [])

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

    return (
        <div style={styles.page}>
            {/* Welcome banner */}
            <div style={styles.banner}>
                <div>
                    <div style={styles.bannerGreeting}>{greeting} 👋</div>
                    <div style={styles.bannerName}>{name || "Counsellor"}</div>
                    <div style={styles.bannerSub}>Here's a snapshot of your activity</div>
                </div>
                <i className="fa-solid fa-graduation-cap" style={styles.bannerIcon} />
            </div>

            {/* Stats row */}
            <div style={styles.statsRow}>
                <StatCard
                    icon="fa-solid fa-star"
                    label="Average Rating"
                    value={averageRating}
                    color="#f59e0b"
                    sub={averageRating > 0 ? "out of 5.0" : "No ratings yet"}
                />
                <StatCard
                    icon="fa-solid fa-circle-check"
                    label="Approved Blogs"
                    value={approvedBlogs}
                    color="#10b981"
                    sub="published & live"
                />
                <StatCard
                    icon="fa-solid fa-clock"
                    label="Pending Approval"
                    value={pendingApprovalBlogs}
                    color="#8b5cf6"
                    sub="awaiting review"
                />
            </div>

            {/* Quick actions */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>Quick Actions</div>
                <div style={styles.quickGrid}>
                    <QuickLink icon="fa-solid fa-pen-to-square" label="Write a new blog" to="/counsellor/addBlog" color="#8b5cf6" />
                    <QuickLink icon="fa-solid fa-newspaper"     label="View my blogs"    to="/counsellor/showBlogs" color="#10b981" />
                    <QuickLink icon="fa-solid fa-comment-dots"  label="Open chat"        to="/counsellor/counsellorChat" color="#3b82f6" />
                    <QuickLink icon="fa-solid fa-user"          label="Edit profile"     to="/counsellor/profile" color="#f59e0b" />
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        padding: "28px 32px",
        fontFamily: "var(--fontHeading)",
        maxWidth: 900,
        margin: "0 auto",
    },

    // Banner
    banner: {
        background: "linear-gradient(135deg, #4a148c 0%, #1a237e 100%)",
        borderRadius: 16,
        padding: "28px 32px",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
        boxShadow: "0 8px 32px rgba(74,20,140,0.22)",
    },
    bannerGreeting: { fontSize: 14, opacity: 0.8, marginBottom: 4, fontWeight: 500 },
    bannerName:     { fontSize: 26, fontWeight: 800, marginBottom: 4 },
    bannerSub:      { fontSize: 13, opacity: 0.7 },
    bannerIcon:     { fontSize: 56, opacity: 0.18 },

    // Stats
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 18,
        marginBottom: 28,
    },
    statCard: {
        background: "#fff",
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f0f0f8",
    },
    statIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        flexShrink: 0,
    },
    statBody:  { minWidth: 0 },
    statValue: { fontSize: 30, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.1 },
    statLabel: { fontSize: 13, color: "#888", marginTop: 3, fontWeight: 600 },
    statSub:   { fontSize: 11, color: "#bbb", marginTop: 2 },
    skeleton:  { width: 48, height: 28, borderRadius: 6, background: "linear-gradient(90deg,#eef0f8 25%,#e4e6f4 50%,#eef0f8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" },

    // Quick actions
    section:      { marginBottom: 28 },
    sectionTitle: { fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 14, letterSpacing: 0.2 },
    quickGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12,
    },
    quickLink: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#fff",
        border: "1.5px solid",
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "box-shadow 0.15s, transform 0.15s",
        textAlign: "left",
        fontFamily: "var(--fontHeading)",
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
    },
    quickIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        flexShrink: 0,
    },
    quickLabel: { fontSize: 13.5, fontWeight: 600, color: "#333" },
}
