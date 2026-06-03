import { useState } from "react";
import SmallBtn from "./SmallBtn";
import { CATEGORIES, ROAD_CONDITIONS, WATER_VOLUME, CROWD_DENSITY, ELECTRICITY } from "../utils/constants";
import { tVal } from "../utils/helpers";

function Detail({ label, value, link }) {
  return (
    <div>
      <span style={{ fontWeight: 600, color: "var(--text)", fontSize: 12 }}>{label}: </span>
      {link
        ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>{value}</a>
        : <span style={{ color: "var(--text-dim)" }}>{value}</span>
      }
    </div>
  );
}

export default function ContribRow({ c, t, lang, users, isAdmin, updateContribution, deleteContribution, showToast, setPage, setEditingId }) {
  const who = users.find(u => u.id === c.userId);
  const photos = c.data.photos?.length || 0;
  const colors = { pending: "var(--accent)", approved: "var(--green)", rejected: "var(--red)" };
  const [expanded, setExpanded] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const cat = c.data.category ? CATEGORIES[c.data.category] : null;

  const setStatus = async (st) => { await updateContribution(c.id, { status: st }); showToast(st === "approved" ? t.approved : t.rejected); };
const del = async () => { if (confirm(t.confirmDelete)) await deleteContribution(c.id); };
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {cat && <span style={{ fontSize: 16 }}>{cat.icon}</span>}
<span onClick={() => setExpanded(!expanded)} style={{ fontWeight: 600, color: "var(--text)", fontSize: 14, cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--border)", textUnderlineOffset: 3 }}>{c.data.name || "—"}</span>          <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", background: `${colors[c.status]}18`, color: colors[c.status] }}>{t[c.status]}</span>
          {photos > 0 && <span style={{ fontSize: 11, color: "var(--blue)", background: "var(--blue-dim)", padding: "2px 8px", borderRadius: 6 }}>📷 {photos}</span>}
          {c.data.events?.length > 0 && <span style={{ fontSize: 11, color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 8px", borderRadius: 6 }}>🎪 {c.data.events.length}</span>}
          {c.data.amenities?.length > 0 && <span style={{ fontSize: 11, color: "var(--green)", background: "var(--green-dim)", padding: "2px 8px", borderRadius: 6 }}>🏪 {c.data.amenities.length}</span>}
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-dim)" }}>
  {t.by}{" "}
  <span
    onClick={() => setShowUser(!showUser)}
    style={{ color: "var(--blue)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
  >
    {who?.name || "Unknown"}
  </span>
  {" "}· {c.date}{c.data.region && ` · ${c.data.region}`}{cat && ` · ${tVal(cat, lang)}`}
</p>

{showUser && who && (
  <div style={{
    marginTop: 8, padding: 12, background: "var(--bg-input)",
    borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
    fontSize: 13, display: "flex", flexDirection: "column", gap: 4,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: who.role === "admin" ? "var(--accent-dim)" : "var(--green-dim)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
        color: who.role === "admin" ? "var(--accent)" : "var(--green)",
      }}>{who.name?.[0]?.toUpperCase()}</div>
      <span style={{ fontWeight: 600, color: "var(--text)" }}>{who.name}</span>
      <span style={{
        padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.03em",
        background: who.role === "admin" ? "var(--accent-dim)" : "var(--green-dim)",
        color: who.role === "admin" ? "var(--accent)" : "var(--green)",
      }}>{who.role}</span>
    </div>
    <span>📧 {who.email || "—"}</span>
    <span>📱 {who.phone || "—"}</span>
    <span>🆔 {who.id}</span>
    <span>📅 Joined: {who.joinDate || "—"}</span>
  </div>
)}
        {photos > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {c.data.photos.slice(0, 4).map((p, i) => <img key={i} src={p} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", border: "1px solid var(--border)" }} />)}
            {photos > 4 && <div style={{ width: 44, height: 44, borderRadius: 6, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>+{photos - 4}</div>}
          </div>
        )}
      </div>
      {expanded && (
  <div style={{ width: "100%", marginTop: 12, padding: 16, background: "var(--bg-input)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 13, color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: 10 }}>
    {photos > 0 && (
  <div>
    <p style={{ fontWeight: 600, color: "var(--blue)", marginBottom: 8 }}>📷 Photos ({photos})</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
      {c.data.photos.map((p, i) => (
        <img key={i} src={p} alt="" onClick={() => window.open(p, "_blank")}
          style={{ width: "100%", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", cursor: "pointer", aspectRatio: "4/3", objectFit: "cover" }} />
      ))}
    </div>
  </div>
)}
    {c.data.category && <Detail label="Category" value={`${cat?.icon || ""} ${tVal(cat, lang)}`} />}
    {c.data.subCategory && <Detail label="Sub-category" value={c.data.subCategory} />}
    {c.data.region && <Detail label="Region" value={c.data.region} />}
    {c.data.elevation && <Detail label="Elevation" value={`${c.data.elevation}m`} />}
    {c.data.latitude && (
  <div>
    <Detail label="Coordinates" value={`${c.data.latitude}, ${c.data.longitude}`} link={`https://www.google.com/maps?q=${c.data.latitude},${c.data.longitude}`} />
    <div style={{ marginTop: 8, borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)" }}>
      <iframe title="map" width="100%" height="180" frameBorder="0" style={{ display: "block", filter: "brightness(0.9) contrast(1.05)" }}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(parseFloat(c.data.longitude)-0.02).toFixed(4)}%2C${(parseFloat(c.data.latitude)-0.01).toFixed(4)}%2C${(parseFloat(c.data.longitude)+0.02).toFixed(4)}%2C${(parseFloat(c.data.latitude)+0.01).toFixed(4)}&layer=mapnik&marker=${c.data.latitude}%2C${c.data.longitude}`} />
      <div style={{ display: "flex", gap: 10, padding: "8px 12px", background: "var(--bg-card)", fontSize: 12 }}>
        <a href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${c.data.latitude},${c.data.longitude}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>🔭 Street View</a>
        <a href={`https://www.google.com/maps?q=${c.data.latitude},${c.data.longitude}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", textDecoration: "none" }}>🗺 Google Maps</a>
      </div>
    </div>
  </div>
)}
    {c.data.description && <Detail label="Description" value={c.data.description} />}
    {c.data.bestVisitMonths && <Detail label="Best visit" value={c.data.bestVisitMonths} />}
    {c.data.worstVisitMonths && <Detail label="Worst visit" value={c.data.worstVisitMonths} />}
    {c.data.peakWaterMonths && <Detail label="Peak water" value={c.data.peakWaterMonths} />}
    {c.data.peakCrowdTimes && <Detail label="Crowd peaks" value={c.data.peakCrowdTimes} />}
    {c.data.idealWeatherNotes && <Detail label="Weather notes" value={c.data.idealWeatherNotes} />}
    {c.data.roadCondition && <Detail label="Road" value={tVal(ROAD_CONDITIONS[c.data.roadCondition], lang)} />}
    {c.data.waterVolume && <Detail label="Water volume" value={tVal(WATER_VOLUME[c.data.waterVolume], lang)} />}
    {c.data.crowdDensity && <Detail label="Crowd density" value={tVal(CROWD_DENSITY[c.data.crowdDensity], lang)} />}
    {c.data.electricity && <Detail label="Electricity" value={tVal(ELECTRICITY[c.data.electricity], lang)} />}

    {c.data.events?.length > 0 && (
      <div>
        <p style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 6 }}>🎪 Events & Festivals</p>
        {c.data.events.map((ev, i) => (
          <div key={i} style={{ padding: "8px 12px", marginBottom: 4, background: "var(--bg-card)", borderRadius: 6, border: "1px solid var(--border)" }}>
            <span style={{ fontWeight: 600, color: "var(--text)" }}>{ev.name}</span>
            {ev.window && <span style={{ marginLeft: 8, color: "var(--text-dim)" }}>· {ev.window}</span>}
            {ev.significance && <p style={{ margin: "4px 0 0", fontSize: 12 }}>{ev.significance}</p>}
            {ev.impact && <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--red)" }}>⚠ {ev.impact}</p>}
          </div>
        ))}
      </div>
    )}

    {c.data.amenities?.length > 0 && (
      <div>
        <p style={{ fontWeight: 600, color: "var(--green)", marginBottom: 6 }}>🏪 Amenities</p>
        {c.data.amenities.map((am, i) => (
          <div key={i} style={{ padding: "6px 12px", marginBottom: 4, background: "var(--bg-card)", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12 }}>
            <span style={{ fontWeight: 600, color: "var(--text)" }}>{am.name || am.type}</span>
            {am.distance && <span style={{ marginLeft: 8, color: "var(--text-dim)" }}>· {am.distance}m away</span>}
            {am.notes && <p style={{ margin: "2px 0 0", color: "var(--text-dim)" }}>{am.notes}</p>}
          </div>
        ))}
      </div>
    )}

    {c.data.conservationIssue && <Detail label="🛡 Conservation" value={c.data.conservationIssue} />}
    {c.data.personalNotes && <Detail label="📝 Notes" value={c.data.personalNotes} />}
  </div>
)}
      {isAdmin && (
        <div style={{ display: "flex", gap: 6 }}>
          {c.status === "pending" && <><SmallBtn label={t.approve} color="var(--green)" onClick={() => setStatus("approved")} /><SmallBtn label={t.reject} color="var(--red)" onClick={() => setStatus("rejected")} /></>}
          {setEditingId && <SmallBtn label={t.edit} color="var(--blue)" onClick={() => { setEditingId(c.id); setPage("editContribution"); }} />}
          <SmallBtn label={t.delete} color="#6b3a3a" onClick={del} />
        </div>
      )}
    </div>
  );
}
