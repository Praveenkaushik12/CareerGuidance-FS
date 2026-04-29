import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserCount,
  fetchBlogsCount,
  fetchCounsellorsCount,
  fetchReviewsCount,
} from "../../../features/dashboards/admin/adminDashboard/dashboardSlice";
import Chart from "./Chart";

function StatCard({ icon, label, value, color, to, sub }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => to && navigate(to)}
      style={{ ...styles.card, borderTop: `4px solid ${color}`, cursor: to ? "pointer" : "default" }}
    >
      <div style={{ ...styles.iconWrap, background: color + "18", color }}>
        <i className={icon} />
      </div>
      <div style={styles.cardBody}>
        <div style={styles.cardValue}>
          {value === null || value === undefined ? (
            <div style={styles.skeleton} />
          ) : value}
        </div>
        <div style={styles.cardLabel}>{label}</div>
        {sub && <div style={styles.cardSub}>{sub}</div>}
      </div>
      {to && <i className="fa-solid fa-arrow-right" style={{ fontSize: 11, color: "#ccc", alignSelf: "center" }} />}
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserCount());
    dispatch(fetchBlogsCount());
    dispatch(fetchCounsellorsCount());
    dispatch(fetchReviewsCount());
  }, [dispatch]);

  const userCount        = useSelector(s => s.dashboard.userCount);
  const blogsCount       = useSelector(s => s.dashboard.blogsCount);
  const counsellorsCount = useSelector(s => s.dashboard.counsellorsCount);
  const reviewsCount     = useSelector(s => s.dashboard.reviewsCount);

  const stats = [
    { icon: "fas fa-users",    label: "Total Users",     value: userCount,        color: "#3b82f6", to: "/admin/userReport",        sub: "registered accounts" },
    { icon: "fas fa-user-tie", label: "Counsellors",     value: counsellorsCount, color: "#8b5cf6", to: "/admin/counsellorsReport", sub: "approved counsellors" },
    { icon: "fas fa-file-alt", label: "Blogs Published", value: blogsCount,       color: "#10b981", to: "/admin/approveBlogs",       sub: "approved articles"   },
    { icon: "fas fa-star",     label: "Reviews",         value: reviewsCount,     color: "#f59e0b", to: "/admin/approveReviews",     sub: "platform testimonials" },
  ];

  const chartData = [
    { label: "Users",       count: userCount        ?? 0 },
    { label: "Counsellors", count: counsellorsCount  ?? 0 },
    { label: "Blogs",       count: blogsCount        ?? 0 },
    { label: "Reviews",     count: reviewsCount      ?? 0 },
  ];

  return (
    <div style={styles.page}>
      {/* Banner */}
      <div style={styles.banner}>
        <div>
          <div style={styles.bannerTitle}>Admin Dashboard</div>
          <div style={styles.bannerSub}>Platform overview at a glance</div>
        </div>
        <i className="fa-solid fa-shield-halved" style={styles.bannerIcon} />
      </div>

      {/* Stat cards */}
      <div style={styles.grid}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Chart */}
      <Chart data={chartData} />
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", fontFamily: "var(--fontHeading)", maxWidth: 1100, margin: "0 auto" },

  banner: {
    background: "linear-gradient(135deg, #1a237e 0%, #4a148c 100%)",
    borderRadius: 16,
    padding: "26px 32px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    boxShadow: "0 8px 32px rgba(26,35,126,0.22)",
  },
  bannerTitle: { fontSize: 24, fontWeight: 800, marginBottom: 4 },
  bannerSub:   { fontSize: 13, opacity: 0.7 },
  bannerIcon:  { fontSize: 52, opacity: 0.18 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 28,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f8",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  cardBody:  { flex: 1, minWidth: 0 },
  cardValue: { fontSize: 28, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.1 },
  cardLabel: { fontSize: 12, color: "#888", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 },
  cardSub:   { fontSize: 11, color: "#bbb", marginTop: 2 },
  skeleton:  { width: 44, height: 26, borderRadius: 6, background: "linear-gradient(90deg,#eef0f8 25%,#e4e6f4 50%,#eef0f8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" },
};
