import { useState, useEffect } from "react";
import T from "./translations";
import { DEFAULT_ADMIN } from "./utils/constants";
import { storage } from "./utils/storage";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import SiteForm from "./components/SiteForm";
import ContributionsList from "./components/ContributionsList";
import UsersList from "./components/UsersList";
import "./styles/global.css";

export default function App() {
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [authMode, setAuthMode] = useState("login");
  const [users, setUsers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1000);

// Auto-close sidebar on small screens
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth <= 1000) setSidebarOpen(false);
  };
  window.addEventListener("resize", handleResize);
  handleResize(); // Run once on mount
  return () => window.removeEventListener("resize", handleResize);
}, []);
  const [loaded, setLoaded] = useState(false);

  const t = T[lang];
  const isRtl = lang === "ku";

  // ── Load from Firestore with real-time listeners ──
  useEffect(() => {
    // Seed default admin if needed
   console.log("✅ Connecting to Supabase...");
    // Listen for real-time updates
    const unsubUsers = storage.listen("users", (data) => {
      setUsers(data);
    });

    const unsubContribs = storage.listen("contributions", (data) => {
      setContributions(data);
    });

    // Restore session from localStorage (session is per-browser)
    try {
      const session = JSON.parse(localStorage.getItem("tdh-session"));
      if (session) {
        setUser(session.user);
        setPage(session.user.role === "admin" ? "dashboard" : "myContributions");
        setLang(session.lang || "en");
      }
    } catch {}

    setLoaded(true);

    // Cleanup listeners on unmount
    return () => { unsubUsers(); unsubContribs(); };
  }, []);

  // ── Save session to localStorage (per-browser only) ──
  useEffect(() => {
    if (!loaded) return;
    if (user) localStorage.setItem("tdh-session", JSON.stringify({ user, lang }));
    else localStorage.removeItem("tdh-session");
  }, [user, lang, loaded]);

  // ── Firestore CRUD helpers ──
  const addContribution = async (contrib) => {
    await storage.set("contributions", contrib.id, contrib);
    // Listener will auto-update state
  };

  const updateContribution = async (id, changes) => {
    await storage.update("contributions", id, changes);
  };

  const deleteContribution = async (id) => {
    await storage.remove("contributions", id);
  };

  const addUser = async (newUser) => {
    await storage.set("users", newUser.id, newUser);
  };

  const deleteUser = async (id) => {
    await storage.remove("users", id);
  };

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };
  const handleLogout = () => { setUser(null); setPage("login"); setAuthMode("login"); };

  if (!loaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-deep)", color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: 16 }}>
      <div style={{ animation: "pulse 1.2s infinite" }}>Loading...</div>
    </div>
  );

  if (!user) return <AuthScreen t={t} lang={lang} setLang={setLang} authMode={authMode} setAuthMode={setAuthMode} users={users} addUser={addUser} setUser={setUser} setPage={setPage} isRtl={isRtl} toast={toast} />;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "var(--bg-deep)", color: "var(--text)", fontFamily: isRtl ? "var(--font-arabic)" : "var(--font-body)", display: "flex", fontSize: 14 }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.015, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar t={t} lang={lang} setLang={setLang} user={user} page={page} setPage={setPage} setEditingId={setEditingId} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} isRtl={isRtl} />

      <div style={{ flex: 1, overflow: "auto", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        <TopBar t={t} page={page} user={user} isRtl={isRtl} />
        <div style={{ padding: "24px 28px" }}>
          {page === "dashboard" && <Dashboard t={t} lang={lang} contributions={contributions} users={users} setPage={setPage} setFilter={setFilter} updateContribution={updateContribution} deleteContribution={deleteContribution} showToast={showToast} isRtl={isRtl} />}
          {page === "addData" && <SiteForm t={t} lang={lang} user={user} contributions={contributions} addContribution={addContribution} updateContribution={updateContribution} showToast={showToast} isRtl={isRtl} />}
          {page === "contributions" && <ContributionsList t={t} lang={lang} contributions={contributions} updateContribution={updateContribution} deleteContribution={deleteContribution} users={users} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} setPage={setPage} setEditingId={setEditingId} showToast={showToast} isAdmin={true} isRtl={isRtl} />}
          {page === "myContributions" && <ContributionsList t={t} lang={lang} contributions={contributions.filter(c => c.userId === user.id)} updateContribution={updateContribution} deleteContribution={deleteContribution} users={users} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} setPage={setPage} setEditingId={setEditingId} showToast={showToast} isAdmin={false} isRtl={isRtl} />}
          {page === "users" && <UsersList t={t} users={users} addUser={addUser} deleteUser={deleteUser} contributions={contributions} />}
          {page === "editContribution" && editingId && <SiteForm t={t} lang={lang} user={user} contributions={contributions} addContribution={addContribution} updateContribution={updateContribution} showToast={showToast} editingId={editingId} setPage={setPage} setEditingId={setEditingId} isRtl={isRtl} />}
        </div>
      </div>

      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--bg-card)", color: "var(--accent)", padding: "12px 28px", borderRadius: "var(--radius)", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", border: "1px solid var(--border)", zIndex: 1000, animation: "slideUp 0.3s ease" }}>{toast}</div>}
    </div>
  );
}