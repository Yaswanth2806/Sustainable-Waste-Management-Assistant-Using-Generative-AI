import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getHistory } from "../services/api.js";
import CategoryChip from "../components/CategoryChip.jsx";

export default function History() {
  const { userId } = useAuth();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory(userId)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.item_name || "").toLowerCase().includes(q) ||
      (l.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-condensed font-bold text-2xl mb-1 text-text-primary transition-colors">Scan History</h1>
      <p className="text-text-muted text-sm font-mono mb-4 transition-colors">
        Every item you've scanned, most recent first.
      </p>

      <input
        type="text"
        placeholder="Search by item name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-bg-surface border border-border-color text-text-primary text-sm mb-5 focus:outline-none focus:border-accent shadow-sm transition-colors"
      />

      {loading && <p className="text-text-muted font-mono text-sm transition-colors">Loading history...</p>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted font-mono text-sm border border-dashed border-border-color rounded-xl bg-bg-surface shadow-sm transition-colors">
          {logs.length === 0
            ? "No scans yet — head to the Scanner to analyze your first item."
            : "No results match your search."}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((log) => (
          <div
            key={log.log_id}
            className="bg-bg-surface border border-border-color shadow-sm rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap transition-colors"
          >
            <div>
              <p className="font-semibold capitalize text-text-primary">{log.item_name}</p>
              <p className="text-xs text-text-muted font-mono mt-1">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryChip category={log.category} icon={log.category_icon} />
              {log.is_recyclable && (
                <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent border border-accent text-[10px] font-mono uppercase transition-colors">
                  Recyclable
                </span>
              )}
              {log.is_hazardous && (
                <span className="px-2 py-0.5 rounded-full bg-danger-light text-danger border border-danger text-[10px] font-mono uppercase transition-colors">
                  Hazardous
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
