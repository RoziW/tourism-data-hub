import { useState, useCallback, useRef } from "react";

export default function LocationPicker({ t, data, set, isRtl }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timer = useRef(null);

  const search = useCallback(async (q) => {
    if (!q || q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`);
      const d = await r.json();
      setResults(d); setShowResults(true);
    } catch { setResults([]); }
    setLoading(false);
  }, []);

  const onInput = (v) => { setQuery(v); clearTimeout(timer.current); timer.current = setTimeout(() => search(v), 500); };

  const pick = (r) => {
    set("latitude", parseFloat(r.lat).toFixed(6));
    set("longitude", parseFloat(r.lon).toFixed(6));
    setQuery(r.display_name.split(",").slice(0, 3).join(", "));
    setShowResults(false);
  };

  const clearLoc = () => { set("latitude", ""); set("longitude", ""); setQuery(""); };

  const useGPS = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { set("latitude", p.coords.latitude.toFixed(6)); set("longitude", p.coords.longitude.toFixed(6)); setQuery("📍 My location"); setLoading(false); },
      () => setLoading(false)
    );
  };

  const has = data.latitude && data.longitude;
  const inp = { width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input value={query} onChange={e => onInput(e.target.value)} onFocus={() => results.length > 0 && setShowResults(true)} placeholder={t.searchLocation} style={inp} />
        {loading && <div style={{ position: "absolute", top: 12, right: isRtl ? "auto" : 14, left: isRtl ? 14 : "auto", fontSize: 12, color: "var(--text-dim)", animation: "pulse 1s infinite" }}>{t.searching}</div>}
        {showResults && results.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginTop: 4, maxHeight: 240, overflow: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
            {results.map((r, i) => (
              <button key={i} onClick={() => pick(r)} style={{ width: "100%", padding: "10px 14px", border: "none", borderBottom: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontSize: 13, fontFamily: "inherit", cursor: "pointer", textAlign: isRtl ? "right" : "left" }}
                onMouseEnter={e => e.target.style.background = "var(--accent-dim)"}
                onMouseLeave={e => e.target.style.background = "transparent"}>
                <span style={{ color: "var(--accent)" }}>📍</span> {r.display_name.length > 80 ? r.display_name.slice(0, 80) + "..." : r.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={useGPS} style={{ marginTop: 8, padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--accent-dim)", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500 }}>
        📍 {t.useMyLocation}
      </button>

      {has && (
        <div style={{ marginTop: 12, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
          <iframe title="map" width="100%" height="220" frameBorder="0" style={{ display: "block", filter: "brightness(0.9) contrast(1.05)" }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(parseFloat(data.longitude)-0.02).toFixed(4)}%2C${(parseFloat(data.latitude)-0.01).toFixed(4)}%2C${(parseFloat(data.longitude)+0.02).toFixed(4)}%2C${(parseFloat(data.latitude)+0.01).toFixed(4)}&layer=mapnik&marker=${data.latitude}%2C${data.longitude}`} />
          <div style={{ padding: "10px 14px", background: "var(--bg-input)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-dim)", gap: 8, flexWrap: "wrap" }}>
            <span>📍 {data.latitude}, {data.longitude}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${data.latitude},${data.longitude}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>🔭 {t.streetView}</a>
              <a href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>🗺 {t.googleMaps}</a>
              <button onClick={clearLoc} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500 }}>✕ {t.clear}</button>
            </div>
          </div>
        </div>
      )}
      {!has && <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--text-muted)" }}>{t.mapHint}</p>}
    </div>
  );
}
