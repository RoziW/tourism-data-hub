import { useState } from "react";
import { TEAM_CODE } from "../utils/constants";
import { genId } from "../utils/helpers";

export default function AuthScreen({ t, lang, setLang, authMode, setAuthMode, users, addUser, setUser, setPage, isRtl, toast }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", teamCode: "" });
  const [error, setError] = useState("");

  const handleLogin = () => {
    const found = users.find(u => u.email === form.email && u.password === form.password);
    if (found) { setUser(found); setPage(found.role === "admin" ? "dashboard" : "myContributions"); }
    else setError(t.invalidLogin);
  };

  const handleRegister = async () => {
  if (!form.name || !form.email || !form.password) { setError(t.requiredField); return; }
  if (users.find(u => u.email === form.email)) { setError(t.emailExists); return; }
  const role = form.teamCode === TEAM_CODE ? "admin" : "contributor";
  const u = { id: genId(), ...form, role, joinDate: new Date().toISOString().split("T")[0] };
  await addUser(u);
  setUser(u);
  setPage(role === "admin" ? "dashboard" : "addData");
};

  const inp = {
    width: "100%", padding: "13px 16px", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text)",
    fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border 0.2s",
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 30% 20%, #1a1510 0%, var(--bg-deep) 60%)",
      fontFamily: isRtl ? "var(--font-arabic)" : "var(--font-body)", padding: 20,
    }}>
      {/* Subtle grain */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 0 }} />

      <div style={{
        width: "100%", maxWidth: 440, background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 20, padding: "44px 36px", position: "relative", zIndex: 1,
        boxShadow: "0 0 80px rgba(212,164,74,0.04), 0 32px 64px rgba(0,0,0,0.3)",
        animation: "fadeUp 0.5s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, var(--accent), #8b6914)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, marginBottom: 16, boxShadow: "0 8px 32px rgba(212,164,74,0.2)",
          }}>🏔</div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 700, color: "var(--text)",
            fontFamily: isRtl ? "var(--font-arabic)" : "var(--font-heading)",
            letterSpacing: isRtl ? 0 : "-0.02em",
          }}>{t.appName}</h1>
          <p style={{ margin: "6px 0 0", color: "var(--text-dim)", fontSize: 14, fontStyle: "italic" }}>{t.appTagline}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
            {["en", "ku"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "7px 20px", border: "none", cursor: "pointer",
                background: lang === l ? "var(--accent)" : "transparent",
                color: lang === l ? "var(--bg-deep)" : "var(--text-dim)",
                fontFamily: "inherit", fontSize: 13, fontWeight: lang === l ? 700 : 400,
                transition: "all 0.2s",
              }}>{l === "en" ? "English" : "کوردی"}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", marginBottom: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setError(""); }} style={{
              flex: 1, padding: "11px", border: "none", cursor: "pointer",
              background: authMode === m ? "var(--accent-dim)" : "transparent",
              color: authMode === m ? "var(--accent)" : "var(--text-dim)",
              fontFamily: "inherit", fontSize: 14, fontWeight: authMode === m ? 600 : 400,
            }}>{m === "login" ? t.login : t.register}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {authMode === "register" && <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.fullName} style={inp} />}
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t.email} type="email" style={inp} />
          {authMode === "register" && <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder={t.phone} style={inp} />}
          <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder={t.password} type="password" style={inp} />
          {authMode === "register" && (
            <div>
              <input value={form.teamCode} onChange={e => setForm({...form, teamCode: e.target.value})} placeholder={t.adminCode} style={inp} />
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-muted)" }}>{t.teamCodeHint}</p>
            </div>
          )}
          {error && <p style={{ margin: 0, color: "var(--red)", fontSize: 13 }}>{error}</p>}
          <button onClick={authMode === "login" ? handleLogin : handleRegister} style={{
            width: "100%", padding: "14px", borderRadius: "var(--radius-sm)", border: "none",
            background: "linear-gradient(135deg, var(--accent), #a07820)", color: "var(--bg-deep)",
            fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4,
            boxShadow: "0 4px 20px rgba(212,164,74,0.2)", transition: "transform 0.15s",
          }}>{authMode === "login" ? t.signIn : t.signUp}</button>
        </div>
      </div>
      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--bg-card)", color: "var(--accent)", padding: "12px 24px", borderRadius: "var(--radius)", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", border: "1px solid var(--border)", zIndex: 1000, animation: "slideUp 0.3s ease" }}>{toast}</div>}
    </div>
  );
}
