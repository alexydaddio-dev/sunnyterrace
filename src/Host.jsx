import { useState, useEffect } from "react";

const PIN = "1234";

const C = {
  terra: "#C4623A", terraD: "#9A3E1F", terraL: "#F0D5C8",
  sand: "#F5EFE0", cream: "#FDFAF4", dark: "#2C2416",
  muted: "#7A7060", border: "#E8E0D0", wa: "#25D366",
};

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { height: 100%; background: #F5EFE0; font-family: 'DM Sans', -apple-system, sans-serif; color: #2C2416; }
.wrap { max-width: 430px; margin: 0 auto; padding: 0 16px 120px; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 0 14px; }
.logo { display: flex; align-items: center; gap: 9px; }
.lm { width: 34px; height: 34px; background: #C4623A; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.li { width: 18px; height: 18px; border: 2.5px solid white; border-radius: 4px; }
.ln { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; color: #2C2416; }
.ln span { color: #C4623A; }
.badge { font-size: 11px; font-weight: 500; background: #F0D5C8; color: #9A3E1F; padding: 4px 11px; border-radius: 20px; }
.title { font-size: 22px; font-weight: 500; margin-bottom: 4px; }
.sub { font-size: 14px; color: #7A7060; margin-bottom: 20px; font-weight: 300; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 11px; font-weight: 500; letter-spacing: 0.6px; text-transform: uppercase; color: #7A7060; margin-bottom: 6px; }
.field input { width: 100%; padding: 14px 15px; border: 1.5px solid #E8E0D0; border-radius: 14px; font-family: 'DM Sans', -apple-system, sans-serif; font-size: 17px; color: #2C2416; background: #FDFAF4; outline: none; appearance: none; -webkit-appearance: none; transition: border-color 0.15s; }
.field input:focus { border-color: #C4623A; background: white; }
.field input::placeholder { color: #C8C0B0; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.nights { background: #F0D5C8; color: #9A3E1F; border-radius: 14px; font-size: 16px; font-weight: 500; padding: 14px 0; text-align: center; }
.pax-row { display: flex; align-items: center; background: #FDFAF4; border: 1.5px solid #E8E0D0; border-radius: 14px; padding: 12px 15px; margin-bottom: 14px; }
.pax-label { flex: 1; }
.pax-name { font-size: 16px; color: #2C2416; }
.pax-hint { font-size: 12px; color: #7A7060; font-weight: 300; }
.pax-ctrls { display: flex; align-items: center; gap: 14px; }
.pax-btn { width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid #E8E0D0; background: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #C4623A; transition: all 0.15s; }
.pax-btn:active { background: #F0D5C8; border-color: #C4623A; transform: scale(0.94); }
.pax-val { font-size: 22px; font-weight: 500; min-width: 22px; text-align: center; }
.btn-wa { width: 100%; padding: 18px; background: #25D366; color: white; border: none; border-radius: 16px; font-family: 'DM Sans', -apple-system, sans-serif; font-size: 17px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.15s; margin-top: 8px; }
.btn-wa:active { background: #1da851; transform: scale(0.98); }
.pin-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; gap: 20px; }
.pin-icon { font-size: 52px; }
.pin-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 500; text-align: center; }
.pin-input { width: 100%; max-width: 280px; padding: 16px; border: 1.5px solid #E8E0D0; border-radius: 14px; font-size: 24px; text-align: center; letter-spacing: 8px; outline: none; background: #FDFAF4; font-family: 'DM Sans', sans-serif; }
.pin-input:focus { border-color: #C4623A; background: white; }
.pin-error { color: #C4623A; font-size: 14px; min-height: 20px; }
.btn-pin { width: 100%; max-width: 280px; padding: 16px; background: #C4623A; color: white; border: none; border-radius: 14px; font-size: 17px; font-weight: 500; cursor: pointer; }
.btn-pin:active { background: #9A3E1F; }
.bnav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(253,250,244,0.95); border-top: 1px solid #E8E0D0; display: flex; padding: 10px 0 calc(env(safe-area-inset-bottom, 0px) + 10px); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.ni { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 0; }
.ni-icon { font-size: 22px; }
.ni-label { font-size: 10px; font-weight: 500; color: #7A7060; letter-spacing: 0.3px; }
.ni.on .ni-label { color: #C4623A; }
.ni:not(.on) .ni-icon { opacity: 0.45; }
.hist-item { background: #FDFAF4; border: 1px solid #E8E0D0; border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; cursor: pointer; }
.hi-name { font-weight: 500; font-size: 15px; margin-bottom: 3px; }
.hi-dates { font-size: 13px; color: #7A7060; font-weight: 300; }
.empty { text-align: center; color: #7A7060; font-size: 14px; padding: 40px 0; font-weight: 300; }
.sett-h { font-size: 12px; color: #7A7060; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; margin-top: 20px; }
`;

function pad(n) { return String(n).padStart(2, "0"); }
function fmtDate(s) {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return pad(d) + "/" + pad(m) + "/" + y;
}

export default function Host() {
  const [auth, setAuth]         = useState(false);
  const [pinVal, setPinVal]     = useState("");
  const [pinErr, setPinErr]     = useState("");
  const [tab, setTab]           = useState(0);
  const [guest, setGuest]       = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [checkin, setCheckin]   = useState("");
  const [checkout, setCheckout] = useState("");
  const [pax, setPax]           = useState(2);
  const [hist, setHist]         = useState([]);
  const [baseUrl, setBaseUrl]   = useState("");
  const [propName, setPropName] = useState("");
  const [city, setCity]         = useState("");

  useEffect(() => {
    setBaseUrl(localStorage.getItem("st_url") || "");
    setPropName(localStorage.getItem("st_prop") || "");
    setCity(localStorage.getItem("st_city") || "");
    setHist(JSON.parse(localStorage.getItem("st_hist") || "[]"));
    if (localStorage.getItem("st_auth") === "1") setAuth(true);
  }, []);

  const nights = (() => {
    if (!checkin || !checkout) return 0;
    const n = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
    return n > 0 ? n : 0;
  })();

  const base = (baseUrl || "https://sunnyterrace.vercel.app").replace(/\/$/, "");
  const prop = propName || "Sunny Terrace";
  const cty  = city || "Nice";

  const buildMsg = () => {
    const link = base + "/checkin?guest=" + encodeURIComponent(guest) + "&pax=" + pax + "&checkin=" + checkin + "&checkout=" + checkout + "&nights=" + nights + (guestEmail ? "&email=" + encodeURIComponent(guestEmail) : "");
    const ps   = pax === 1 ? "1 voyageur" : pax + " voyageurs";
    const ns   = nights === 1 ? "1 nuit" : nights + " nuits";
    return "Bonjour " + guest + " ! \u2600\ufe0f\n\nNous sommes ravis de vous accueillir demain au *" + prop + "* \u00e0 " + cty + " !\n\nVotre r\u00e9servation : " + fmtDate(checkin) + " \u2192 " + fmtDate(checkout) + " \u00b7 " + ns + " \u00b7 " + ps + "\n\nPour une arriv\u00e9e en toute fluidit\u00e9, enregistrez-vous en 3 minutes :\n\ud83d\udc49 " + link + "\n\nVous pourrez y confirmer votre groupe, r\u00e9server un parking (20\u20ac/nuit) et commander votre petit-d\u00e9jeuner livr\u00e9 \u00e0 la porte \u2615\n\n\u00c0 demain et bon voyage ! \ud83c\udf0a\n\n\u2014 *" + prop + " " + cty + "*";
  };

  const send = () => {
    if (!guest || !checkin || !checkout) {
      alert("Remplis le pr\u00e9nom et les dates \ud83d\ude0a");
      return;
    }
    const msg     = buildMsg();
    const entry   = { guest, guestEmail, checkin, checkout, pax, ts: Date.now() };
    const newHist = [entry, ...hist].slice(0, 20);
    setHist(newHist);
    localStorage.setItem("st_hist", JSON.stringify(newHist));
    window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
  };

  const saveSettings = (k, v) => { localStorage.setItem(k, v); };

  const checkPin = () => {
    if (pinVal === PIN) {
      setAuth(true);
      localStorage.setItem("st_auth", "1");
    } else {
      setPinErr("Code incorrect, r\u00e9essaie");
      setPinVal("");
    }
  };

  const reuse = (r) => {
    setGuest(r.guest);
    setGuestEmail(r.guestEmail || "");
    setCheckin(r.checkin);
    setCheckout(r.checkout);
    setPax(r.pax || 2);
    setTab(0);
  };

  if (!auth) return (
    <>
      <style>{S}</style>
      <div className="pin-wrap">
        <span className="pin-icon">🔐</span>
        <div className="pin-title">Accès hôte</div>
        <input
          className="pin-input"
          type="password"
          inputMode="numeric"
          maxLength={6}
          placeholder="••••"
          value={pinVal}
          onChange={e => { setPinVal(e.target.value); setPinErr(""); }}
          onKeyDown={e => e.key === "Enter" && checkPin()}
          autoFocus
        />
        <div className="pin-error">{pinErr}</div>
        <button className="btn-pin" onClick={checkPin}>Entrer</button>
      </div>
    </>
  );

  return (
    <>
      <style>{S}</style>
      <div className="wrap">
        <div className="topbar">
          <div className="logo">
            <div className="lm"><div className="li" /></div>
            <div className="ln">Sunny<span>Terrace</span></div>
          </div>
          <span className="badge">Hôte</span>
        </div>

        {tab === 0 && (
          <>
            <div className="title">Nouvelle résa</div>
            <p className="sub">Infos depuis Booking.com</p>

            <div className="field">
              <label>Prénom du client</label>
              <input type="text" placeholder="Sophie" value={guest}
                onChange={e => setGuest(e.target.value)} autoCorrect="off" spellCheck={false} />
            </div>

            <div className="field">
              <label>Email du client</label>
              <input type="email" placeholder="sophie@email.com" value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)} autoCorrect="off" autoCapitalize="off" spellCheck={false} />
            </div>

            <div className="row2">
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Arrivée</label>
                <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Départ</label>
                <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
              </div>
            </div>

            {nights > 0 && (
              <div className="nights" style={{ marginBottom: 14 }}>
                {nights} nuit{nights > 1 ? "s" : ""}
              </div>
            )}

            <div className="pax-row">
              <div className="pax-label">
                <div className="pax-name">Voyageurs</div>
                <div className="pax-hint">sur la réservation</div>
              </div>
              <div className="pax-ctrls">
                <button className="pax-btn" onClick={() => setPax(p => Math.max(1, p - 1))} disabled={pax <= 1}>−</button>
                <span className="pax-val">{pax}</span>
                <button className="pax-btn" onClick={() => setPax(p => Math.min(8, p + 1))} disabled={pax >= 8}>+</button>
              </div>
            </div>

            <button className="btn-wa" onClick={send}>
              <span style={{ fontSize: 22 }}>💬</span>
              Envoyer sur WhatsApp
            </button>
          </>
        )}

        {tab === 1 && (
          <>
            <div className="title">Historique</div>
            <p className="sub">Vos derniers envois</p>
            {hist.length === 0
              ? <div className="empty">Aucun envoi pour l'instant</div>
              : hist.map((r, i) => (
                <div key={i} className="hist-item" onClick={() => reuse(r)}>
                  <div className="hi-name">{r.guest} · {r.pax || 1} pers.</div>
                  <div className="hi-dates">
                    {fmtDate(r.checkin)} → {fmtDate(r.checkout)} · {new Date(r.ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            }
          </>
        )}

        {tab === 2 && (
          <>
            <div className="title">Réglages</div>
            <p className="sub">Configuration une seule fois</p>

            <div className="sett-h">URL de l'app client</div>
            <div className="field">
              <label>Lien Vercel</label>
              <input type="url" placeholder="https://sunnyterrace.vercel.app"
                value={baseUrl} onChange={e => { setBaseUrl(e.target.value); saveSettings("st_url", e.target.value); }} />
            </div>

            <div className="sett-h">Propriété</div>
            <div className="field">
              <label>Nom affiché</label>
              <input type="text" placeholder="Sunny Terrace"
                value={propName} onChange={e => { setPropName(e.target.value); saveSettings("st_prop", e.target.value); }} />
            </div>

            <div className="sett-h">Ville</div>
            <div className="field">
              <label>Affichée dans le message</label>
              <input type="text" placeholder="Nice"
                value={city} onChange={e => { setCity(e.target.value); saveSettings("st_city", e.target.value); }} />
            </div>
          </>
        )}
      </div>

      <div className="bnav">
        {[["✉️", "Envoyer"], ["🕓", "Historique"], ["⚙️", "Réglages"]].map(([icon, label], i) => (
          <div key={i} className={"ni" + (tab === i ? " on" : "")} onClick={() => setTab(i)}>
            <span className="ni-icon">{icon}</span>
            <span className="ni-label">{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
