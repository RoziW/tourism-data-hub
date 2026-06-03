export default function Sidebar({ t, lang, setLang, user, page, setPage, setEditingId, sidebarOpen, setSidebarOpen, handleLogout, isRtl }) {
  const links = user.role === "admin"
    ? [{ id: "dashboard", icon: "📊", l: t.dashboard }, { id: "addData", icon: "➕", l: t.addData }, { id: "contributions", icon: "📋", l: t.contributions }, { id: "users", icon: "👥", l: t.users }]
    : [{ id: "addData", icon: "➕", l: t.addData }, { id: "myContributions", icon: "📋", l: t.myContributions }];

  const navBtn = (id, icon, label) => (
    <button key={id} onClick={() => { setPage(id); setEditingId(null); }} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: sidebarOpen ? "11px 14px" : "11px 15px", marginBottom: 2,
      borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
      background: page === id ? "var(--accent-dim)" : "transparent",
      color: "var(--accent)z",
      fontFamily: "inherit", fontSize: 13.5, fontWeight: page === id ? 600 : 400,
      textAlign: isRtl ? "right" : "left", direction: isRtl ? "rtl" : "ltr",
      transition: "all 0.15s",
    }}>
      <span style={{ fontSize: 15, flexShrink: 0, width: 22, textAlign: "center" }}>{icon}</span>
      {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
    </button>
  );

  return (
    <div style={{
      width: sidebarOpen ? 230 : 56, minHeight: "100vh",
      background: "linear-gradient(180deg, #bdb5a8 0%, var(--bg-deep) 100%)",
      borderRight: isRtl ? "none" : "1px solid var(--border)",
      borderLeft: isRtl ? "1px solid var(--border)" : "none",
      transition: "width 0.25s ease", display: "flex", flexDirection: "column",
      overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{ padding: sidebarOpen ? "20px 16px" : "20px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), #8b6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🏔</div>
        {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)", whiteSpace: "nowrap", fontFamily: isRtl ? "var(--font-arabic)" : "var(--font-heading)", letterSpacing: isRtl ? 0 : "0.01em" }}>{t.appName}</span>}
      </div>
      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {links.map(l => navBtn(l.id, l.icon, l.l))}
      </nav>
      <div style={{ padding: "10px 8px", borderTop: "1px solid var(--border)" }}>
        <button onClick={() => setLang(lang === "en" ? "ku" : "en")} style={{ width: "100%", padding: "8px 12px", marginBottom: 2, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "var(--accent-dim)", color: "var(--text-dim)", fontFamily: "inherit", fontSize: 12, textAlign: isRtl ? "right" : "left", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🌐</span>{sidebarOpen && <span>{lang === "en" ? "کوردی" : "English"}</span>}
        </button>
        <button onClick={handleLogout} style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "var(--red-dim)", color: "var(--red)", fontFamily: "inherit", fontSize: 12, textAlign: isRtl ? "right" : "left", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🚪</span>{sidebarOpen && <span>{t.logout}</span>}
        </button>
      </div>
    </div>
  );
}
