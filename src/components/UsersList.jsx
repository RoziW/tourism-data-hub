import { useState } from "react";
import { genId } from "../utils/helpers";

export default function UsersList({ t, users, addUser, deleteUser, contributions }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "contributor" });

  const inp = { width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  const add = async () => {
    if (!form.name || !form.email || !form.password) return;
    const newUser = { id: genId(), ...form, joinDate: new Date().toISOString().split("T")[0] };
    await addUser(newUser);
    setForm({ name: "", email: "", phone: "", password: "", role: "contributor" });
    setShow(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setShow(!show)} style={{
          padding: "9px 22px", borderRadius: "var(--radius-sm)", border: "none",
          background: show ? "var(--border)" : "linear-gradient(135deg, var(--accent), #a07820)",
          color: show ? "var(--text-dim)" : "var(--bg-deep)", fontWeight: 600, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
        }}>{show ? t.cancel : "+ Add User"}</button>
      </div>

      {show && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.2s ease" }}>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.fullName} style={inp} />
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t.email} type="email" style={inp} />
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder={t.phone} style={inp} />
          <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder={t.password} type="password" style={inp} />
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={inp}>
            <option value="contributor">{t.contributorRole}</option>
            <option value="admin">{t.admin}</option>
          </select>
          <button onClick={add} style={{ padding: "11px", borderRadius: "var(--radius-sm)", border: "none", background: "linear-gradient(135deg, var(--accent), #a07820)", color: "var(--bg-deep)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.submit}</button>
        </div>
      )}

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 24px", animation: "fadeUp 0.3s ease" }}>
        {users.map(u => {
          const count = contributions.filter(c => c.userId === u.id).length;
          return (
            <div key={u.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.role === "admin" ? "var(--accent-dim)" : "var(--green-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: u.role === "admin" ? "var(--accent)" : "var(--green)" }}>{u.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{u.name}</span>
                    <span style={{ marginLeft: 8, padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", background: u.role === "admin" ? "var(--accent-dim)" : "var(--green-dim)", color: u.role === "admin" ? "var(--accent)" : "var(--green)" }}>{u.role === "admin" ? t.admin : t.contributorRole}</span>
                  </div>
                </div>
                <p style={{ margin: "3px 0 0 40px", fontSize: 12, color: "var(--text-dim)" }}>{u.email}{u.phone && ` · ${u.phone}`}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
  <div style={{ textAlign: "center", minWidth: 50 }}>
    <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>{count}</p>
    <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)" }}>{t.contribCount}</p>
  </div>
  {u.id !== "admin1" && (
    <button onClick={async () => {
  if (confirm(t.confirmDelete || "Delete this user?")) {
    await deleteUser(u.id);
  }
}} style={{
      background: "none", border: "1px solid var(--red-dim)",
      borderRadius: "var(--radius-sm)", padding: "5px 10px",
      color: "var(--red)", cursor: "pointer", fontFamily: "inherit",
      fontSize: 11, fontWeight: 500,
    }}>✕</button>
  )}
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
