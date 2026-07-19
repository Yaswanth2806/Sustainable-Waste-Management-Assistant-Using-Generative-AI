import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getCenters } from "../services/api.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FILTERS = [
  { value: "", label: "All" },
  { value: "recycling", label: "Recycling" },
  { value: "ewaste", label: "E-Waste" },
  { value: "organic", label: "Organic" },
  { value: "hazardous", label: "Hazardous" },
];

function FlyToCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.latitude, center.longitude], 14, { duration: 0.8 });
  }, [center]);
  return null;
}

export default function MapPage() {
  const [centers, setCenters] = useState([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Leaflet.js map initialises only once; this effect re-runs on filter change
    getCenters(filter || undefined).then((data) => {
      setCenters(data);
      setSelected(null);
    });
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-condensed font-bold text-2xl mb-1 text-text-primary transition-colors">Collection Centers</h1>
      <p className="text-text-muted text-sm font-mono mb-4 transition-colors">
        Find the nearest facility for your waste type.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-colors shadow-sm ${
              filter === f.value
                ? "bg-accent text-white border-accent font-bold"
                : "bg-bg-surface text-text-muted border-border-color hover:text-text-primary hover:bg-bg-surface-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3 rounded-xl overflow-hidden border border-border-color shadow-sm bg-bg-surface transition-colors">
          <MapContainer center={[17.4399, 78.4983]} zoom={11} style={{ height: "480px", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors, &copy; CARTO"
            />
            {centers.map((c) => (
              <Marker
                key={c.center_id}
                position={[c.latitude, c.longitude]}
                eventHandlers={{ click: () => setSelected(c) }}
              >
                <Popup>
                  <strong>{c.name}</strong>
                  <br />
                  {c.address}
                </Popup>
              </Marker>
            ))}
            {selected && <FlyToCenter center={selected} />}
          </MapContainer>
        </div>

        <div className="md:col-span-2 space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {centers.map((c) => (
            <button
              key={c.center_id}
              onClick={() => setSelected(c)}
              className={`w-full text-left bg-bg-surface border rounded-lg p-3 shadow-sm transition-colors ${
                selected?.center_id === c.center_id ? "border-accent bg-accent-light" : "border-border-color hover:border-accent"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-text-primary">{c.name}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: c.color_code }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">{c.address}</p>
              <p className="text-xs text-text-muted mt-1 font-mono">{c.distance_km} km away</p>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="mt-5 bg-bg-surface border border-border-color shadow-sm rounded-xl p-5 transition-colors">
          <h3 className="font-condensed font-bold text-lg mb-2 text-text-primary">{selected.name}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-text-primary">
            <p><span className="text-text-muted font-mono text-xs block">Address</span>{selected.address}</p>
            <p><span className="text-text-muted font-mono text-xs block">Hours</span>{selected.opening_hours}</p>
            <p><span className="text-text-muted font-mono text-xs block">Contact</span>{selected.contact_number}</p>
            <p><span className="text-text-muted font-mono text-xs block">Distance</span>{selected.distance_km} km</p>
          </div>
          <div className="mt-3">
            <span className="text-text-muted font-mono text-xs block mb-1">Accepted Waste Types</span>
            <div className="flex flex-wrap gap-2">
              {selected.accepted_waste_types.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-bg-surface-hover border border-border-color text-xs font-mono text-text-muted transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
