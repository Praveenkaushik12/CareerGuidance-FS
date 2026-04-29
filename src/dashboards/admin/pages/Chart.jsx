import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e8eaf6", borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontFamily: "var(--fontHeading)" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: payload[0].fill }}>{payload[0].value}</div>
    </div>
  );
}

export default function Chart({ data }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <i className="fas fa-chart-bar" style={{ marginRight: 8, color: "#8b5cf6" }} />
        Platform Overview
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={48} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: "var(--fontHeading)", fontSize: 13, fontWeight: 600, fill: "#888" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: "var(--fontHeading)", fontSize: 12, fill: "#bbb" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)", radius: 8 }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#fff",
    borderRadius: 16,
    padding: "22px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f8",
  },
  header: {
    fontFamily: "var(--fontHeading)",
    fontWeight: 700,
    fontSize: 15,
    color: "#333",
    marginBottom: 18,
  },
};
