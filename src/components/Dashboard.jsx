import ContribRow from "./ContribRow";
export default function Dashboard({ t, lang, contributions, users, setPage, setFilter, updateContribution, deleteContribution, showToast, isRtl }) {  const stats = [
    { l: t.totalDest, v: contributions.filter(c => c.status === "approved").length, icon: "📍", color: "var(--green)" },
    { l: t.totalContrib, v: contributions.length, icon: "📋", color: "var(--accent)" },
    { l: t.pendingReview, v: contributions.filter(c => c.status === "pending").length, icon: "⏳", color: "#e0a030" },
    { l: t.totalUsers, v: users.length, icon: "👥", color: "var(--blue)" },
  ];
  const recent = [...contributions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
            padding: "20px 18px", animation: `fadeUp ${0.2 + i * 0.08}s ease`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 48, opacity: 0.04 }}>{s.icon}</div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-dim)", fontWeight: 500 }}>{s.l}</p>
            <p style={{ margin: "6px 0 0", fontSize: 32, fontWeight: 700, color: s.color, fontFamily: "var(--font-heading)" }}>{s.v}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px", animation: "fadeUp 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, fontFamily: "var(--font-heading)" }}>{t.recent}</h3>
          <button onClick={() => { setPage("contributions"); setFilter("all"); }} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500 }}>{t.viewAll} →</button>
        </div>
        {recent.length === 0
          ? <p style={{ color: "var(--text-dim)", textAlign: "center", padding: 24 }}>{t.noContrib}</p>
          : recent.map(c => <ContribRow key={c.id} c={c} t={t} lang={lang} users={users} isAdmin={true} updateContribution={updateContribution} deleteContribution={deleteContribution} showToast={showToast} />)
        }
      </div>
    </div>
  );
}
