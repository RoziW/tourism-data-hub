const titles = (t, page) => ({ dashboard: t.dashboard, addData: t.addData, contributions: t.contributions, myContributions: t.myContributions, users: t.users, editContribution: t.editContribution }[page] || "");

export default function TopBar({ t, page, user, isRtl }) {
  return (
    <div style={{
      padding: "14px 28px", borderBottom: "1px solid var(--border)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "#bdb5a8", backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: isRtl ? "var(--font-arabic)" : "var(--font-heading)", letterSpacing: isRtl ? 0 : "-0.01em" }}>
        {titles(t, page)}
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ padding: "5px 14px", borderRadius: 20, background: user.role === "admin" ? "var(--accent-dim)" : "var(--green-dim)", color: user.role === "admin" ? "var(--accent)" : "var(--green)", fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          {user.role === "admin" ? t.admin : t.contributorRole}
        </div>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{user.name}</span>
      </div>
    </div>
  );
}
