import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { analyzeWaste, saveHistory } from "../services/api.js";
import ResultCard from "../components/ResultCard.jsx";

const QUICK_SELECT_ITEMS = [
  { label: "Plastic Bottle", icon: "🧴" },
  { label: "Battery", icon: "🔋" },
  { label: "Newspaper", icon: "📰" },
  { label: "Banana Peel", icon: "🍌" },
  { label: "Old Charger", icon: "🔌" },
  { label: "Glass Jar", icon: "🫙" },
  { label: "Medicine Bottle", icon: "💊" },
  { label: "Aluminium Can", icon: "🥫" },
  { label: "Cardboard Box", icon: "📦" },
  { label: "Mobile Phone", icon: "📱" },
  { label: "Paint Can", icon: "🎨" },
  { label: "Food Wrapper", icon: "🍬" },
];

const STATUS_MESSAGES = [
  "Scanning waste database...",
  "Consulting Llama 3.3 70B...",
  "Analyzing disposal options...",
  "Generating recycling guide...",
];

export default function Home() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [source, setSource] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const intervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setStatusIndex(0);
      intervalRef.current = setInterval(() => {
        setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
      }, 1100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [loading]);

  const runScan = async (name, base64Image = null) => {
    if (!name.trim() && !base64Image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = base64Image ? { image: base64Image } : name.trim();
      const { result: aiResult, source: aiSource } = await analyzeWaste(payload);
      setResult(aiResult);
      setSource(aiSource);

      // Auto-save to history
      await saveHistory(userId, aiResult);
      sessionStorage.setItem("lastScan", JSON.stringify(aiResult));
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong while analyzing this item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imagePreview) {
      runScan("", imagePreview);
    } else {
      runScan(itemName);
    }
  };

  const handleQuickSelect = (label) => {
    setItemName(label);
    setImagePreview(null);
    runScan(label);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setItemName("");
      runScan("", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setError(null);
    setResult(null);
  };

  const goToMap = () => navigate("/map");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="font-condensed font-bold text-3xl sm:text-4xl text-text-primary transition-colors">
          Dispose Smart. <span className="text-accent transition-colors">Recycle Right.</span>
        </h1>
        <p className="text-text-muted mt-2 font-mono text-sm transition-colors">
          Type a waste item, upload an image, or pick a quick-select below to get an instant AI disposal guide.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
              if (imagePreview) setImagePreview(null);
            }}
            placeholder={imagePreview ? "Scanning selected image..." : "e.g. old battery, plastic bottle..."}
            disabled={loading || !!imagePreview}
            className="w-full pl-4 pr-10 py-3 rounded-lg bg-bg-surface border border-border-color text-text-primary text-sm focus:outline-none focus:border-accent shadow-sm disabled:opacity-70 disabled:bg-bg-surface-hover transition-colors"
          />
          {imagePreview ? (
            <button
              type="button"
              onClick={handleClearImage}
              className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
              title="Remove image"
            >
              ✕
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-3 text-text-muted hover:text-accent flex items-center justify-center text-lg transition-colors"
              title="Upload image"
            >
              📷
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="submit"
          disabled={loading || (!itemName.trim() && !imagePreview)}
          className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Scanning..." : "SCAN"}
        </button>
      </form>

      {imagePreview && (
        <div className="mb-5 p-3 bg-bg-surface border border-border-color shadow-sm rounded-lg flex items-center gap-4 relative animate-fade-in transition-colors">
          <div className="w-12 h-12 rounded overflow-hidden border border-border-color bg-bg-surface-hover flex items-center justify-center shrink-0">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">Uploaded Image</p>
            <p className="text-[10px] text-text-muted font-mono">Vision processing active</p>
          </div>
          {!loading && (
            <button
              type="button"
              onClick={handleClearImage}
              className="p-1 text-text-muted hover:text-text-primary border border-border-color hover:border-border-hover rounded-full w-5 h-5 flex items-center justify-center text-[10px] bg-bg-surface-hover transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
        {QUICK_SELECT_ITEMS.map((q) => (
          <button
            key={q.label}
            onClick={() => handleQuickSelect(q.label)}
            disabled={loading}
            className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg bg-bg-surface border border-border-color hover:border-accent shadow-sm text-xs font-mono text-text-muted hover:text-accent hover:bg-accent-light transition-all disabled:opacity-50"
          >
            <span className="text-lg">{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 text-accent font-mono text-sm mb-4 bg-accent-light py-3 rounded-lg border border-accent transition-colors">
          <span className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
          </span>
          {STATUS_MESSAGES[statusIndex]}
        </div>
      )}

      {error && (
        <div className="bg-danger-light border border-danger text-danger rounded-lg px-4 py-3 text-sm mb-4 shadow-sm transition-colors">
          {error}
        </div>
      )}

      <ResultCard result={result} source={source} />

      {result && (
        <button
          onClick={goToMap}
          className="mt-6 w-full py-3 rounded-lg bg-accent-light border border-accent text-accent font-bold text-sm hover:bg-accent transition-colors hover:text-white shadow-sm"
        >
          📍 Find Collection Centers
        </button>
      )}
    </div>
  );
}
