import { useState, useRef } from "react";
import { MAX_PHOTOS } from "../utils/constants";
import { resizeImage } from "../utils/helpers";

export default function PhotoUploader({ t, photos, setPhotos, isRtl }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
    if (!files.length) return;
    setBusy(true);
    try {
      const np = [];
      for (const f of files) np.push(await resizeImage(f));
      setPhotos([...photos, ...np]);
    } catch (err) { console.error(err); }
    setBusy(false);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div>
      {photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8, marginBottom: 12 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "1", background: "#080a0d" }}>
              <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{
                position: "absolute", top: 5, right: isRtl ? "auto" : 5, left: isRtl ? 5 : "auto",
                width: 24, height: 24, borderRadius: "50%", border: "none", display: "flex",
                alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.75)", color: "var(--red)", cursor: "pointer",
                fontSize: 12, fontWeight: 700, backdropFilter: "blur(4px)",
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
      {photos.length < MAX_PHOTOS && (
        <div>
          <input ref={ref} type="file" accept="image/*" multiple onChange={handle} style={{ display: "none" }} />
          <button onClick={() => ref.current?.click()} disabled={busy} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px", borderRadius: "var(--radius)", width: "100%",
            border: "2px dashed var(--border)", background: "var(--accent-glow)",
            color: "var(--text-dim)", cursor: busy ? "wait" : "pointer",
            fontFamily: "inherit", fontSize: 13, transition: "all 0.2s",
          }}>
            {busy ? "⏳ Processing..." : `📷 ${t.addPhotos}`}
          </button>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
            {t.photoLimit} — {photos.length}/{MAX_PHOTOS}
          </p>
        </div>
      )}
    </div>
  );
}
