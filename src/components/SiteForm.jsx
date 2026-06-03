import { useState } from "react";
import { genId, tVal } from "../utils/helpers";
import { CATEGORIES, ROAD_CONDITIONS, WATER_VOLUME, CROWD_DENSITY, ELECTRICITY, AMENITY_TYPES, SEVERITY_LEVELS } from "../utils/constants";
import LocationPicker from "./LocationPicker";
import PhotoUploader from "./PhotoUploader";

const EMPTY = {
  name: "", category: "", subCategory: "", region: "", elevation: "",
  latitude: "", longitude: "", photos: [], description: "",
  peakWaterMonths: "", bestVisitMonths: "", worstVisitMonths: "",
  peakCrowdTimes: "", idealWeatherNotes: "",
  events: [], // [{ name, window, significance, impact }]
  roadCondition: "", waterVolume: "", crowdDensity: "", electricity: "",
  amenities: [], // [{ type, name, distance, notes }]
  conservationIssue: "", conservationSeverity: "",
  personalNotes: "",
};

const SECTIONS_DEFAULT = { basic: true, location: true, photos: true, history: false, seasonal: false, events: false, practical: false, amenities: false, conservation: false, notes: false };

// Stable sub-components outside to prevent focus loss
const Field = ({ label, children, opt = true, t, isRtl }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "var(--text-dim)", fontWeight: 500 }}>
      {label}
      {opt && <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: isRtl ? 0 : 6, marginRight: isRtl ? 6 : 0 }}>({t.optional})</span>}
    </label>
    {children}
  </div>
);

const Section = ({ id, icon, title, children, hint, isOpen, toggle, isRtl }) => (
  <div style={{ marginBottom: 6 }}>
    <button onClick={() => toggle(id)} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 0", border: "none", borderBottom: "1px solid var(--border)",
      background: "transparent", cursor: "pointer", fontFamily: "inherit",
      color: isOpen ? "var(--accent)" : "var(--text-dim)", fontSize: 15, fontWeight: 600,
      textAlign: isRtl ? "right" : "left", direction: isRtl ? "rtl" : "ltr", transition: "color 0.2s",
    }}>
      <span>{icon} {title}</span>
      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>
        {isOpen ? "▲" : `▼ ${hint || ""}`}
      </span>
    </button>
    {isOpen && <div style={{ paddingTop: 16 }}>{children}</div>}
  </div>
);

export default function SiteForm({ t, lang, user, contributions,addContribution, updateContribution, showToast,editingId, setPage, setEditingId, isRtl }) {
  const existing = editingId ? contributions.find(c => c.id === editingId) : null;
  const [data, setData] = useState(existing?.data ? { ...EMPTY, ...existing.data } : { ...EMPTY });
  const [sections, setSections] = useState({ ...SECTIONS_DEFAULT });

  const s = (k, v) => setData(p => ({ ...p, [k]: v }));
  const toggle = (id) => setSections(p => ({ ...p, [id]: !p[id] }));

  const submit = async () => {
  if (!data.name) { showToast(t.requiredField); return; }
  if (editingId) {
    await updateContribution(editingId, { data });
    showToast(t.successEdit); setPage("contributions"); setEditingId(null);
  } else {
    const newContrib = { id: genId(), userId: user.id, date: new Date().toISOString().split("T")[0], status: user.role === "admin" ? "approved" : "pending", data };
    
    await addContribution(newContrib);
    await addContribution(newContrib);
    showToast(t.successAdd); setData({ ...EMPTY }); setSections({ ...SECTIONS_DEFAULT });
  }
};
  const inp = { width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border 0.2s" };
  const sel = { ...inp, cursor: "pointer" };
  const ta = { ...inp, minHeight: 80, resize: "vertical" };

  // Dynamic arrays helpers
  const addEvent = () => s("events", [...data.events, { name: "", window: "", significance: "", impact: "" }]);
  const removeEvent = (i) => s("events", data.events.filter((_, j) => j !== i));
  const setEvent = (i, k, v) => s("events", data.events.map((e, j) => j === i ? { ...e, [k]: v } : e));

  const addAmenity = () => s("amenities", [...data.amenities, { type: "", name: "", distance: "", notes: "" }]);
  const removeAmenity = (i) => s("amenities", data.amenities.filter((_, j) => j !== i));
  const setAmenity = (i, k, v) => s("amenities", data.amenities.map((a, j) => j === i ? { ...a, [k]: v } : a));

  const enumSelect = (value, onChange, obj) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={sel}>
      <option value="">—</option>
      {Object.entries(obj).map(([k, v]) => <option key={k} value={k}>{tVal(v, lang)}</option>)}
    </select>
  );

  return (
    <div>
      {editingId && <button onClick={() => { setPage("contributions"); setEditingId(null); }} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontSize: 14, marginBottom: 16, padding: 0 }}>← {t.back}</button>}

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px", animation: "fadeUp 0.3s ease" }}>

        {/* BASIC */}
        <Section id="basic" icon="📍" title={t.secBasic} isOpen={sections.basic} toggle={toggle} isRtl={isRtl}>
          <Field label={t.siteName} opt={false} t={t} isRtl={isRtl}>
            <input value={data.name} onChange={e => s("name", e.target.value)} style={inp} placeholder="e.g. Shanidar Cave / ئەشکەوتی شانەدەر" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.category} t={t} isRtl={isRtl}>
              <select value={data.category} onChange={e => s("category", e.target.value)} style={sel}>
                <option value="">—</option>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {tVal(v, lang)}</option>)}
              </select>
            </Field>
            <Field label={t.subCategory} t={t} isRtl={isRtl}>
              <input value={data.subCategory} onChange={e => s("subCategory", e.target.value)} style={inp} placeholder="e.g. Citadel, Alpine, Waterfall" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.region} t={t} isRtl={isRtl}>
              <input value={data.region} onChange={e => s("region", e.target.value)} style={inp} />
            </Field>
            <Field label={t.elevation} t={t} isRtl={isRtl}>
              <input value={data.elevation} onChange={e => s("elevation", e.target.value)} style={inp} type="number" placeholder="e.g. 1200" />
            </Field>
          </div>
        </Section>

        {/* LOCATION */}
        <Section id="location" icon="🗺" title={t.secLocation} isOpen={sections.location} toggle={toggle} isRtl={isRtl}>
          <LocationPicker t={t} data={data} set={s} isRtl={isRtl} />
        </Section>

        {/* PHOTOS */}
        <Section id="photos" icon="📷" title={t.secPhotos} isOpen={sections.photos} toggle={toggle} isRtl={isRtl}>
          <PhotoUploader t={t} photos={data.photos || []} setPhotos={p => s("photos", p)} isRtl={isRtl} />
        </Section>

        {/* DESCRIPTION */}
        <Section id="history" icon="📜" title={t.secHistory} hint={t.optional} isOpen={sections.history} toggle={toggle} isRtl={isRtl}>
          <Field label={t.description} t={t} isRtl={isRtl}>
            <textarea value={data.description} onChange={e => s("description", e.target.value)} style={ta} rows={4} />
          </Field>
        </Section>

        {/* SEASONAL */}
        <Section id="seasonal" icon="🌦" title={t.secSeasonal} hint={t.optional} isOpen={sections.seasonal} toggle={toggle} isRtl={isRtl}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.bestVisit} t={t} isRtl={isRtl}><input value={data.bestVisitMonths} onChange={e => s("bestVisitMonths", e.target.value)} style={inp} placeholder="e.g. April–June" /></Field>
            <Field label={t.worstVisit} t={t} isRtl={isRtl}><input value={data.worstVisitMonths} onChange={e => s("worstVisitMonths", e.target.value)} style={inp} placeholder="e.g. December–February" /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.peakWater} t={t} isRtl={isRtl}><input value={data.peakWaterMonths} onChange={e => s("peakWaterMonths", e.target.value)} style={inp} placeholder="e.g. April–June" /></Field>
            <Field label={t.crowdPeaks} t={t} isRtl={isRtl}><input value={data.peakCrowdTimes} onChange={e => s("peakCrowdTimes", e.target.value)} style={inp} placeholder="e.g. Weekends in Spring" /></Field>
          </div>
          <Field label={t.weatherNotes} t={t} isRtl={isRtl}>
            <textarea value={data.idealWeatherNotes} onChange={e => s("idealWeatherNotes", e.target.value)} style={ta} placeholder="e.g. Best viewed at sunrise to avoid valley fog" />
          </Field>
        </Section>

        {/* EVENTS */}
        <Section id="events" icon="🎪" title={t.secEvents} hint={t.optional} isOpen={sections.events} toggle={toggle} isRtl={isRtl}>
          {data.events.map((ev, i) => (
            <div key={i} style={{ background: "var(--bg-input)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>🎭 Event {i + 1}</span>
                <button onClick={() => removeEvent(i)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>✕ {t.removeEvent}</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input value={ev.name} onChange={e => setEvent(i, "name", e.target.value)} placeholder={t.eventName} style={inp} />
                <input value={ev.window} onChange={e => setEvent(i, "window", e.target.value)} placeholder={t.eventWindow} style={inp} />
              </div>
              <textarea value={ev.significance} onChange={e => setEvent(i, "significance", e.target.value)} placeholder={t.eventSignificance} style={{ ...ta, marginTop: 10, minHeight: 50 }} />
              <input value={ev.impact} onChange={e => setEvent(i, "impact", e.target.value)} placeholder={t.eventImpact} style={{ ...inp, marginTop: 10 }} />
            </div>
          ))}
          <button onClick={addEvent} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border)", background: "var(--accent-glow)", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, width: "100%" }}>{t.addEvent}</button>
        </Section>

        {/* PRACTICAL */}
        <Section id="practical" icon="🚗" title={t.secPractical} hint={t.optional} isOpen={sections.practical} toggle={toggle} isRtl={isRtl}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.roadCondition} t={t} isRtl={isRtl}>{enumSelect(data.roadCondition, v => s("roadCondition", v), ROAD_CONDITIONS)}</Field>
            <Field label={t.waterVolume} t={t} isRtl={isRtl}>{enumSelect(data.waterVolume, v => s("waterVolume", v), WATER_VOLUME)}</Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.crowdDensity} t={t} isRtl={isRtl}>{enumSelect(data.crowdDensity, v => s("crowdDensity", v), CROWD_DENSITY)}</Field>
            <Field label={t.electricity} t={t} isRtl={isRtl}>{enumSelect(data.electricity, v => s("electricity", v), ELECTRICITY)}</Field>
          </div>
        </Section>

        {/* AMENITIES */}
        <Section id="amenities" icon="🏪" title={t.secAmenities} hint={t.optional} isOpen={sections.amenities} toggle={toggle} isRtl={isRtl}>
          {data.amenities.map((am, i) => (
            <div key={i} style={{ background: "var(--bg-input)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>🏪 Amenity {i + 1}</span>
                <button onClick={() => removeAmenity(i)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <select value={am.type} onChange={e => setAmenity(i, "type", e.target.value)} style={sel}>
                  <option value="">— {t.amenityType} —</option>
                  {Object.entries(AMENITY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {tVal(v, lang)}</option>)}
                </select>
                <input value={am.name} onChange={e => setAmenity(i, "name", e.target.value)} placeholder={t.amenityName} style={inp} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginTop: 10 }}>
                <input value={am.distance} onChange={e => setAmenity(i, "distance", e.target.value)} placeholder={t.amenityDistance} type="number" style={inp} />
                <input value={am.notes} onChange={e => setAmenity(i, "notes", e.target.value)} placeholder={t.amenityNotes} style={inp} />
              </div>
            </div>
          ))}
          <button onClick={addAmenity} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border)", background: "var(--accent-glow)", color: "var(--green)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, width: "100%" }}>{t.addAmenity}</button>
        </Section>

        {/* CONSERVATION */}
        <Section id="conservation" icon="🛡" title={t.secConservation} hint={t.optional} isOpen={sections.conservation} toggle={toggle} isRtl={isRtl}>
          <Field label={t.conservationIssue} t={t} isRtl={isRtl}>
            <textarea value={data.conservationIssue} onChange={e => s("conservationIssue", e.target.value)} style={ta} />
          </Field>
          <Field label={t.conservationSeverity} t={t} isRtl={isRtl}>
            {enumSelect(data.conservationSeverity, v => s("conservationSeverity", v), SEVERITY_LEVELS)}
          </Field>
        </Section>

        {/* NOTES */}
        <Section id="notes" icon="📝" title={t.secNotes} hint={t.optional} isOpen={sections.notes} toggle={toggle} isRtl={isRtl}>
          <Field label={t.personalNotes} t={t} isRtl={isRtl}>
            <textarea value={data.personalNotes} onChange={e => s("personalNotes", e.target.value)} style={ta} />
          </Field>
        </Section>

        {/* SUBMIT */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button onClick={submit} style={{
            padding: "14px 36px", borderRadius: "var(--radius-sm)", border: "none",
            background: "linear-gradient(135deg, var(--accent), #a07820)", color: "var(--bg-deep)",
            fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(212,164,74,0.2)", transition: "transform 0.15s",
          }}>{editingId ? t.save : t.submit}</button>
          {editingId && <button onClick={() => { setPage("contributions"); setEditingId(null); }} style={{ padding: "14px 24px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "transparent", color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>{t.cancel}</button>}
        </div>
      </div>
    </div>
  );
}
