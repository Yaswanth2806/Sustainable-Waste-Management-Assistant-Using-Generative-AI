import { useEffect, useState } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getDashboardData } from "../services/api.js";

ChartJS.register(ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const CHART_TEXT_COLOR = "var(--text-muted)";
const CHART_GRID_COLOR = "var(--border-color)";

function StatCard({ label, value }) {
  return (
    <div className="bg-bg-surface border border-border-color shadow-sm rounded-xl p-4 text-center transition-colors">
      <div className="text-2xl font-bold text-accent font-condensed">{value}</div>
      <div className="text-text-muted text-xs font-mono mt-1">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { userId } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardData(userId).then(setData);
  }, [userId]);

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-text-muted font-mono text-sm transition-colors">
        Loading dashboard...
      </div>
    );
  }

  const { summary, doughnut, category_breakdown, weekly_trend } = data;
  const hasData = summary.total_items_scanned > 0;

  const doughnutData = {
    labels: ["Recyclable", "Non-Recyclable", "Hazardous"],
    datasets: [
      {
        data: [doughnut.recyclable, doughnut.non_recyclable, doughnut.hazardous],
        backgroundColor: ["#10b981", "#94a3b8", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: weekly_trend.labels.map((d) => d.slice(5)),
    datasets: [
      {
        label: "Items Scanned",
        data: weekly_trend.counts,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const categoryLabels = Object.keys(category_breakdown);
  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Items",
        data: categoryLabels.map((k) => category_breakdown[k]),
        backgroundColor: "#8b5cf6",
        borderRadius: 4,
      },
    ],
  };

  const commonOptions = {
    plugins: { legend: { labels: { color: CHART_TEXT_COLOR } } },
    scales: {
      x: { ticks: { color: CHART_TEXT_COLOR }, grid: { color: CHART_GRID_COLOR } },
      y: { ticks: { color: CHART_TEXT_COLOR }, grid: { color: CHART_GRID_COLOR } },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-condensed font-bold text-2xl mb-1 text-text-primary transition-colors">Eco Dashboard</h1>
      <p className="text-text-muted text-sm font-mono mb-6 transition-colors">
        Your waste scanning habits at a glance.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Scanned" value={summary.total_items_scanned} />
        <StatCard label="Recyclable" value={summary.recyclable_count} />
        <StatCard label="Recycle Rate" value={`${summary.recycle_rate_percent}%`} />
        <StatCard label="Hazardous" value={summary.hazardous_item_count} />
      </div>

      {!hasData ? (
        <div className="text-center py-16 text-text-muted font-mono text-sm border border-dashed border-border-color rounded-xl bg-bg-surface shadow-sm transition-colors">
          No scan data yet — your charts will appear here after your first scan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-bg-surface border border-border-color shadow-sm rounded-xl p-4 transition-colors">
            <h3 className="text-text-muted font-mono text-xs uppercase mb-3">Recyclable vs Non-Recyclable vs Hazardous</h3>
            <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: CHART_TEXT_COLOR } } } }} />
          </div>
          <div className="bg-bg-surface border border-border-color shadow-sm rounded-xl p-4 transition-colors">
            <h3 className="text-text-muted font-mono text-xs uppercase mb-3">7-Day Scan Frequency</h3>
            <Line data={lineData} options={commonOptions} />
          </div>
          <div className="bg-bg-surface border border-border-color shadow-sm rounded-xl p-4 sm:col-span-2 transition-colors">
            <h3 className="text-text-muted font-mono text-xs uppercase mb-3">Items by Waste Category</h3>
            <Bar data={barData} options={commonOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
