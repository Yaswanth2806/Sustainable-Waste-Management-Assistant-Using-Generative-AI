import CategoryChip from "./CategoryChip.jsx";

export default function ResultCard({ result, source }) {
  if (!result) return null;

  return (
    <div className="bg-bg-surface border border-border-color shadow-sm rounded-xl p-5 md:p-6 animate-fade-in transition-colors mt-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border-color pb-5 mb-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-condensed font-bold capitalize text-text-primary transition-colors">{result.item}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-bg-surface-hover border border-border-color text-text-muted transition-colors">
              {source === "groq_ai_vision" ? "Vision AI" : "AI"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <CategoryChip category={result.category} icon={result.category_icon} />
            {result.is_recyclable && (
              <span className="px-2.5 py-1 rounded-full bg-accent-light text-accent border border-accent text-xs font-mono font-semibold uppercase transition-colors">
                Recyclable
              </span>
            )}
            {result.is_hazardous && (
              <span className="px-2.5 py-1 rounded-full bg-danger-light text-danger border border-danger text-xs font-mono font-semibold uppercase transition-colors">
                Hazardous
              </span>
            )}
            {result.is_reusable && (
              <span className="px-2.5 py-1 rounded-full bg-info-light text-info border border-info text-xs font-mono font-semibold uppercase transition-colors">
                Reusable
              </span>
            )}
          </div>
        </div>
      </div>

      {source === "static_fallback" && (
        <div className="mb-4 text-xs font-mono text-warn transition-colors">
          ⚠ AI service unavailable — showing a general fallback guide.
        </div>
      )}

      {result.is_hazardous && result.hazard_warning && (
        <div className="mb-5 p-4 rounded-lg bg-danger-light border border-danger text-danger text-sm font-bold flex items-start gap-3 shadow-sm transition-colors">
          <span className="text-xl">⚠️</span>
          <p>{result.hazard_warning}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-text-muted font-mono text-xs uppercase mb-2 transition-colors">Disposal Instructions</h3>
        <p className="text-text-primary text-sm leading-relaxed transition-colors">{result.disposal_instructions}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.recycling_steps && result.recycling_steps.length > 0 && (
          <div>
            <h3 className="text-text-muted font-mono text-xs uppercase mb-3 transition-colors">Action Steps</h3>
            <ul className="space-y-2">
              {result.recycling_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-primary transition-colors">
                  <span className="text-accent font-mono shrink-0 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.eco_suggestions && result.eco_suggestions.length > 0 && (
          <div>
            <h3 className="text-text-muted font-mono text-xs uppercase mb-3 transition-colors">Eco Alternatives</h3>
            <ul className="space-y-2">
              {result.eco_suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-primary transition-colors">
                  <span className="text-accent shrink-0">💡</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {result.accepted_at && result.accepted_at.length > 0 && (
        <div className="mt-6 border-t border-border-color pt-5 transition-colors">
          <h3 className="text-text-muted font-mono text-xs uppercase mb-3 transition-colors">Accepted At</h3>
          <div className="flex flex-wrap gap-2">
            {result.accepted_at.map((facility, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-bg-surface-hover border border-border-color text-xs font-mono text-text-primary transition-colors"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
