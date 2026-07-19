const CATEGORY_STYLES = {
  "Organic Waste": "bg-amber-100 text-amber-800 border-amber-200",
  "Plastic Waste": "bg-blue-100 text-blue-800 border-blue-200",
  "Paper Waste": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Glass Waste": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Metal Waste": "bg-slate-200 text-slate-800 border-slate-300",
  "E-waste": "bg-purple-100 text-purple-800 border-purple-200",
  "Hazardous Waste": "bg-red-100 text-red-800 border-red-200",
  "General Waste": "bg-stone-100 text-stone-700 border-stone-200",
};

export default function CategoryChip({ category, icon }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES["General Waste"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wide ${style}`}
    >
      {icon && <span>{icon}</span>}
      {category}
    </span>
  );
}
