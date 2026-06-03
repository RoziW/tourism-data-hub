import ContribRow from "./ContribRow";

export default function ContributionsList({ t, lang, contributions,  updateContribution, deleteContribution, users, filter, setFilter, search, setSearch, setPage, setEditingId, showToast, isAdmin, isRtl }) {
  const filtered = contributions
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => { if (!search) return true; const q = search.toLowerCase(); return c.data.name?.toLowerCase().includes(q) || c.data.region?.toLowerCase().includes(q); })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <div style={{ display: "flex", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", border: "none", cursor: "pointer", background: filter === f ? "var(--accent-dim)" : "transparent", color: filter === f ? "var(--accent)" : "var(--text-dim)", fontFamily: "inherit", fontSize: 12, fontWeight: filter === f ? 600 : 400, transition: "all 0.15s" }}>
              {f === "all" ? t.filterAll : t[f]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 24px", animation: "fadeUp 0.3s ease" }}>
        {filtered.length === 0
          ? <div style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}><p style={{ fontSize: 36, margin: "0 0 8px" }}>📭</p><p>{t.noContrib}</p></div>
          : filtered.map(c => <ContribRow key={c.id} c={c} t={t} lang={lang} users={users} isAdmin={isAdmin} updateContribution={updateContribution} deleteContribution={deleteContribution} showToast={showToast} setPage={setPage} setEditingId={setEditingId} />)
        }
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>{filtered.length} {t.total}</p>
      </div>
    </div>
  );
}
