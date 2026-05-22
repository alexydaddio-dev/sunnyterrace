import { useState, useEffect } from "react";

// ─── CONFIG — À PERSONNALISER ────────────────────────────────────────────────
const CONFIG = {
  PAYPAL_EMAIL: "alexydaddio@gmail.com",   // ← remplacez ici
  HOST_EMAIL:   "alexydaddio@gmail.com",           // ← remplacez ici
  PROPERTY_NAME: "Sunny Terrace",
  CITY: "Nice",
  WHATSAPP: "+33637728856",                          // ← votre numéro WhatsApp
};
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  sand: "#F5EFE0",
  cream: "#FDFAF4",
  terracotta: "#C4623A",
  terracottaLight: "#F0D5C8",
  terracottaDark: "#9A3E1F",
  olive: "#6B7C4A",
  oliveLight: "#E8EDDE",
  sky: "#4A7FA5",
  skyLight: "#D6E8F5",
  dark: "#2C2416",
  muted: "#7A7060",
  white: "#FFFFFF",
  border: "#E8E0D0",
};

const BREAKFAST_MENU = [
  { id: "pancakes", emoji: "🥞", name: "Pancakes maison", price: 9,   desc: "Sirop d'érable, fruits frais" },
  { id: "toast",    emoji: "🍳", name: "Toast & œufs",    price: 8,   desc: "Pain au levain, œufs bio" },
  { id: "avocado",  emoji: "🥑", name: "Toast avocat",    price: 8.5, desc: "Avocat, graines, citron" },
  { id: "croissant",emoji: "🥐", name: "Viennoiseries",   price: 7,   desc: "Croissant, pain au choc, confiture" },
  { id: "smoothie", emoji: "🍹", name: "Smoothie bowl",   price: 9.5, desc: "Mangue, banane, chia" },
  { id: "full",     emoji: "🍽️", name: "Formule complète",price: 14,  desc: "Salé + sucré + boisson" },
  { id: "coffee",   emoji: "☕", name: "Café",             price: 3,   desc: "Expresso ou allongé" },
  { id: "oj",       emoji: "🍊", name: "Jus d'orange frais",price: 4, desc: "Pressé à la commande" },
];

const DELIVERY_TIMES = ["7h00","7h30","8h00","8h30","9h00","9h30","10h00"];

// ─── EMAIL HELPERS ─────────────────────────────────────────────────────────

function buildHostEmail({ guestName, guestEmail, checkIn, checkOut, nights, travelers, count, parking, breakfastDays, arrivalTime, departureTime }) {
  const bfLines = breakfastDays.map((day, i) => {
    if (!day?.active) return null;
    const items = (day.items||[]).map(id => BREAKFAST_MENU.find(m=>m.id===id)?.name).filter(Boolean).join(", ");
    return `  Jour ${i+1} : ${items || "—"} · Livraison ${day.time||"—"}`;
  }).filter(Boolean).join("\n");

  const parkingLine = parking.want
    ? `Parking : OUI · ${nights * 20}€ · Paiement ${parking.payment === "cash" ? "cash sur place" : "PayPal"}`
    : "Parking : NON";

  const bfTotal = breakfastDays.reduce((sum, day) => {
    if (!day?.active) return sum;
    return sum + (day.items||[]).reduce((s, id) => {
      const item = BREAKFAST_MENU.find(m=>m.id===id);
      return s + (item ? item.price : 0);
    }, 0);
  }, 0);

  const parkingTotal = parking.want ? nights * 20 : 0;
  const onlineTotal = bfTotal + (parking.payment === "paypal" ? parkingTotal : 0);

  const travelersStr = travelers.slice(0, count).map((t,i) =>
    `  ${i===0?"Principal":"Voyageur "+(i+1)} : ${t?.firstName||""} ${t?.lastName||""} (${t?.nationality||""})`
  ).join("\n");

  return {
    to: CONFIG.HOST_EMAIL,
    subject: `✅ Nouvel enregistrement — ${guestName} · arrivée ${checkIn}`,
    body: `RÉCAP ENREGISTREMENT
━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT  : ${guestName}
Email   : ${guestEmail}
Séjour  : ${checkIn} → ${checkOut} (${nights} nuit${nights>1?"s":""})
Arrivée : ${arrivalTime || "Non précisée"}
Départ  : ${departureTime || "Non précisé"}
Voyageurs (${count}) :
${travelersStr}

━━ SERVICES ━━━━━━━━━━━━━━

${parkingLine}

Petit-déjeuners :
${bfLines || "  Aucun"}

━━ TOTAUX ━━━━━━━━━━━━━━━━

Petit-déjeuners : ${bfTotal.toFixed(2)}€ (PayPal)
Parking PayPal  : ${parking.payment==="paypal" ? parkingTotal+"€" : "0€ (cash)"}
TOTAL EN LIGNE  : ${onlineTotal.toFixed(2)}€
Cash sur place  : ${parking.payment==="cash" ? parkingTotal+"€" : "0€"}

━━━━━━━━━━━━━━━━━━━━━━━━━`
  };
}

function buildGuestEmail({ guestName, guestEmail, checkIn, checkOut, nights, parking, breakfastDays, bfTotal, parkingTotal, onlineTotal, arrivalTime, departureTime }) {
  const bfLines = breakfastDays.map((day, i) => {
    if (!day?.active) return null;
    const items = (day.items||[]).map(id => BREAKFAST_MENU.find(m=>m.id===id)?.name).filter(Boolean).join(", ");
    return `  • Matin du jour ${i+1} : ${items || "—"} — livraison ${day.time||"—"}`;
  }).filter(Boolean).join("\n");

  return {
    to: guestEmail,
    subject: `Votre séjour au ${CONFIG.PROPERTY_NAME} — Confirmation d'enregistrement ✨`,
    body: `Bonjour ${guestName},

Votre enregistrement est confirmé pour votre séjour au ${CONFIG.PROPERTY_NAME} à ${CONFIG.CITY} !

━━ VOTRE SÉJOUR ━━━━━━━━━━

📅 Arrivée   : ${checkIn}${arrivalTime ? ` · vers ${arrivalTime}` : ""}
📅 Départ    : ${checkOut}${departureTime ? ` · vers ${departureTime}` : " · avant 11h00"}
🌙 Durée     : ${nights} nuit${nights>1?"s":""}

━━ VOS OPTIONS ━━━━━━━━━━━
${parking.want ? `\n🚗 Parking privé : ${nights} nuit${nights>1?"s":""} · ${parkingTotal}€\n   Paiement : ${parking.payment==="cash" ? "cash à la remise des clés" : "via PayPal (lien envoyé séparément)"}` : ""}
${bfLines ? `\n☕ Petits-déjeuners commandés :\n${bfLines}` : ""}
${onlineTotal > 0 ? `\n💳 Total à régler en ligne : ${onlineTotal.toFixed(2)}€` : ""}
${parking.payment==="cash" && parking.want ? `💵 Cash sur place : ${parkingTotal}€` : ""}

━━ REMISE DES CLÉS ━━━━━━━

🤝 La remise des clés se fait en main propre.${arrivalTime ? `\n   Nous serons prêts à vous accueillir vers ${arrivalTime}.` : "\n   Nous vous contacterons pour confirmer le rendez-vous."}

💬 Une question ? Contactez-nous sur WhatsApp : ${CONFIG.WHATSAPP}

━━━━━━━━━━━━━━━━━━━━━━━━━

À très bientôt à ${CONFIG.CITY} !
L'équipe ${CONFIG.PROPERTY_NAME}`
  };
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.sand}; font-family: 'DM Sans', sans-serif; color: ${COLORS.dark}; min-height: 100vh; }

  .app { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 0 16px 60px; }

  .header { width: 100%; max-width: 560px; display: flex; align-items: center; justify-content: center; padding: 28px 0 20px; gap: 12px; }
  .logo-mark { width: 40px; height: 40px; background: ${COLORS.terracotta}; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .logo-inner { width: 22px; height: 22px; border: 2.5px solid white; border-radius: 5px; position: relative; }
  .logo-inner::after { content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; border-right: 2.5px solid white; border-bottom: 2.5px solid white; border-radius: 0 0 2px 0; }
  .logo-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 500; color: ${COLORS.dark}; letter-spacing: -0.3px; }
  .logo-text span { color: ${COLORS.terracotta}; }

  .card { background: ${COLORS.cream}; border-radius: 20px; border: 1px solid ${COLORS.border}; padding: 32px 28px; width: 100%; max-width: 560px; animation: slideUp 0.4s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .step-indicator { display: flex; justify-content: center; gap: 8px; margin-bottom: 28px; }
  .step-dot { height: 4px; border-radius: 2px; background: ${COLORS.border}; transition: all 0.3s ease; }
  .step-dot.active { background: ${COLORS.terracotta}; width: 24px; }
  .step-dot.done { background: ${COLORS.olive}; width: 12px; }
  .step-dot.inactive { width: 12px; }

  .welcome-emoji { font-size: 48px; text-align: center; margin-bottom: 16px; display: block; }
  h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 500; line-height: 1.2; color: ${COLORS.dark}; margin-bottom: 8px; text-align: center; }
  h1 .name { color: ${COLORS.terracotta}; font-style: italic; }
  .subtitle { font-size: 15px; color: ${COLORS.muted}; text-align: center; line-height: 1.6; margin-bottom: 28px; font-weight: 300; }

  .info-box { background: ${COLORS.oliveLight}; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; gap: 14px; align-items: flex-start; }
  .info-box-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
  .info-box-content p { font-size: 14px; color: ${COLORS.olive}; font-weight: 400; line-height: 1.5; }
  .info-box-content strong { font-weight: 500; color: ${COLORS.dark}; }

  .section-label { font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase; color: ${COLORS.muted}; margin-bottom: 12px; }

  .traveler-counter { display: flex; align-items: center; justify-content: space-between; background: white; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; }
  .counter-label { display: flex; align-items: center; gap: 10px; }
  .counter-label-text { font-size: 15px; font-weight: 400; color: ${COLORS.dark}; }
  .counter-controls { display: flex; align-items: center; gap: 16px; }
  .counter-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid ${COLORS.border}; background: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${COLORS.terracotta}; font-weight: 500; transition: all 0.2s; flex-shrink: 0; }
  .counter-btn:hover:not(:disabled) { background: ${COLORS.terracottaLight}; border-color: ${COLORS.terracotta}; transform: scale(1.05); }
  .counter-btn:disabled { color: ${COLORS.border}; cursor: not-allowed; }
  .counter-value { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: ${COLORS.dark}; min-width: 24px; text-align: center; }

  .btn-primary { width: 100%; padding: 16px; background: ${COLORS.terracotta}; color: white; border: none; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-primary:hover { background: ${COLORS.terracottaDark}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-secondary { width: 100%; padding: 14px; background: transparent; color: ${COLORS.muted}; border: 1px solid ${COLORS.border}; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 400; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
  .btn-secondary:hover { background: ${COLORS.sand}; color: ${COLORS.dark}; }

  .traveler-card { background: white; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 20px; margin-bottom: 14px; }
  .traveler-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .traveler-avatar { width: 36px; height: 36px; border-radius: 50%; background: ${COLORS.terracottaLight}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .traveler-card-title { font-weight: 500; font-size: 15px; color: ${COLORS.dark}; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .form-group:last-child { margin-bottom: 0; }
  label { font-size: 12px; font-weight: 500; color: ${COLORS.muted}; letter-spacing: 0.5px; text-transform: uppercase; }
  input, select { padding: 11px 14px; border: 1px solid ${COLORS.border}; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: ${COLORS.dark}; background: ${COLORS.cream}; transition: border-color 0.2s; outline: none; width: 100%; appearance: none; }
  input:focus, select:focus { border-color: ${COLORS.terracotta}; background: white; }
  input::placeholder { color: ${COLORS.border}; }

  .option-card { background: white; border: 1.5px solid ${COLORS.border}; border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 16px; }
  .option-card:hover { border-color: ${COLORS.terracotta}; background: ${COLORS.cream}; }
  .option-card.selected { border-color: ${COLORS.terracotta}; background: ${COLORS.terracottaLight}; }
  .option-card-icon { font-size: 28px; flex-shrink: 0; }
  .option-card-content { flex: 1; }
  .option-card-title { font-weight: 500; font-size: 15px; color: ${COLORS.dark}; margin-bottom: 2px; }
  .option-card-desc { font-size: 13px; color: ${COLORS.muted}; font-weight: 300; }
  .option-card-price { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: ${COLORS.terracotta}; flex-shrink: 0; }
  .radio-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${COLORS.border}; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .option-card.selected .radio-circle { border-color: ${COLORS.terracotta}; }
  .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${COLORS.terracotta}; opacity: 0; transition: opacity 0.2s; }
  .option-card.selected .radio-dot { opacity: 1; }

  .day-row { background: white; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 16px 18px; margin-bottom: 10px; }
  .day-row-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .day-label { font-weight: 500; font-size: 14px; color: ${COLORS.dark}; }
  .day-date { font-size: 12px; color: ${COLORS.muted}; font-weight: 300; }
  .breakfast-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .toggle { width: 40px; height: 22px; border-radius: 11px; background: ${COLORS.border}; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .toggle.on { background: ${COLORS.terracotta}; }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .toggle.on::after { left: 21px; }
  .toggle-label { font-size: 14px; color: ${COLORS.muted}; font-weight: 300; }

  .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
  .menu-item { border: 1.5px solid ${COLORS.border}; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
  .menu-item:hover { border-color: ${COLORS.terracotta}; }
  .menu-item.selected { border-color: ${COLORS.terracotta}; background: ${COLORS.terracottaLight}; }
  .menu-item-emoji { font-size: 18px; flex-shrink: 0; }
  .menu-item-info { flex: 1; min-width: 0; }
  .menu-item-name { font-size: 12px; font-weight: 500; color: ${COLORS.dark}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .menu-item-price { font-size: 11px; color: ${COLORS.terracotta}; font-weight: 500; }

  .time-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .time-chip { padding: 6px 12px; border-radius: 20px; border: 1px solid ${COLORS.border}; font-size: 13px; cursor: pointer; transition: all 0.2s; background: white; color: ${COLORS.dark}; font-weight: 400; }
  .time-chip:hover { border-color: ${COLORS.terracotta}; }
  .time-chip.selected { background: ${COLORS.terracotta}; border-color: ${COLORS.terracotta}; color: white; }

  .paypal-btn { width: 100%; padding: 16px; background: #003087; color: white; border: none; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .paypal-btn:hover { background: #001f5c; transform: translateY(-1px); }
  .paypal-logo { font-size: 15px; letter-spacing: 0.5px; }

  .success-icon { width: 72px; height: 72px; background: ${COLORS.oliveLight}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 24px; }

  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${COLORS.border}; }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 14px; color: ${COLORS.muted}; font-weight: 300; }
  .summary-value { font-size: 14px; font-weight: 500; color: ${COLORS.dark}; text-align: right; max-width: 220px; }

  .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .tag-olive { background: ${COLORS.oliveLight}; color: ${COLORS.olive}; }
  .tag-terracotta { background: ${COLORS.terracottaLight}; color: ${COLORS.terracottaDark}; }

  .divider { height: 1px; background: ${COLORS.border}; margin: 20px 0; }

  .highlight-box { background: ${COLORS.skyLight}; border-radius: 12px; padding: 16px 18px; margin: 16px 0; }
  .highlight-box p { font-size: 14px; color: ${COLORS.sky}; line-height: 1.6; }

  .page-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: ${COLORS.dark}; margin-bottom: 6px; }

  .sending-overlay { text-align: center; padding: 20px 0; }
  .spinner { width: 40px; height: 40px; border: 3px solid ${COLORS.border}; border-top-color: ${COLORS.terracotta}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="header">
      <div className="logo-mark"><div className="logo-inner" /></div>
      <div className="logo-text">Sunny<span>Terrace</span></div>
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`step-dot ${i < current ? "done" : i === current ? "active" : "inactive"}`} />
      ))}
    </div>
  );
}

function Counter({ value, onChange, min = 1, max = 8 }) {
  return (
    <div className="traveler-counter">
      <div className="counter-label">
        <span>👥</span>
        <div className="counter-label-text">Nombre de voyageurs</div>
      </div>
      <div className="counter-controls">
        <button className="counter-btn" onClick={() => onChange(value - 1)} disabled={value <= min}>−</button>
        <span className="counter-value">{value}</span>
        <button className="counter-btn" onClick={() => onChange(value + 1)} disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

// ─── STEP 0 — WELCOME ─────────────────────────────────────────────────────

function WelcomePage({ guestName, checkIn, checkOut, nights, onNext }) {
  return (
    <div className="card">
      <StepIndicator current={0} total={5} />
      <span className="welcome-emoji">☀️</span>
      <h1>Bienvenue, <span className="name">{guestName}</span> !</h1>
      <p className="subtitle">
        Nous sommes ravis de vous accueillir à {CONFIG.CITY}.<br />
        Votre check-in prend 3 minutes, promis ✨
      </p>
      <div className="info-box">
        <span className="info-box-icon">📅</span>
        <div className="info-box-content">
          <p><strong>Votre séjour</strong></p>
          <p>Du <strong>{checkIn}</strong> au <strong>{checkOut}</strong> — {nights} nuit{nights > 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="info-box" style={{ background: COLORS.skyLight }}>
        <span className="info-box-icon">🏡</span>
        <div className="info-box-content">
          <p style={{ color: COLORS.sky }}><strong style={{ color: COLORS.dark }}>{CONFIG.PROPERTY_NAME}</strong></p>
          <p style={{ color: COLORS.sky }}>Appartement moderne avec terrasse ensoleillée, {CONFIG.CITY}</p>
        </div>
      </div>
      <button className="btn-primary" onClick={onNext}>Commencer l'enregistrement →</button>
    </div>
  );
}

// ─── STEP 1 — TRAVELERS COUNT ─────────────────────────────────────────────

function TravelersPage({ count, onChange, onNext, onBack }) {
  return (
    <div className="card">
      <StepIndicator current={1} total={5} />
      <div className="page-title">Confirmez votre groupe</div>
      <p className="subtitle" style={{ textAlign: "left" }}>Combien de personnes séjournent avec vous ?</p>
      <Counter value={count} onChange={onChange} />
      <div className="info-box">
        <span className="info-box-icon">ℹ️</span>
        <div className="info-box-content">
          <p>Nous avons besoin d'enregistrer <strong>chaque voyageur</strong> conformément à la réglementation française.</p>
        </div>
      </div>
      <button className="btn-primary" onClick={onNext}>Continuer avec {count} voyageur{count > 1 ? "s" : ""} →</button>
      <button className="btn-secondary" onClick={onBack}>← Retour</button>
    </div>
  );
}

// ─── STEP 2 — GUEST INFO ─────────────────────────────────────────────────

function GuestInfoPage({ count, travelers, onChange, guestEmail, setGuestEmail, arrivalTime, setArrivalTime, departureTime, setDepartureTime, onNext, onBack }) {
  const handleChange = (idx, field, val) => {
    const updated = [...travelers];
    if (!updated[idx]) updated[idx] = {};
    updated[idx][field] = val;
    onChange(updated);
  };

  const isComplete = () => {
    if (!guestEmail || !guestEmail.includes("@")) return false;
    for (let i = 0; i < count; i++) {
      const t = travelers[i] || {};
      if (!t.firstName || !t.lastName || !t.nationality) return false;
    }
    return true;
  };

  return (
    <div className="card">
      <StepIndicator current={2} total={5} />
      <div className="page-title">Informations voyageurs</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 20 }}>
        {count === 1 ? "Renseignez vos informations." : `Renseignez les ${count} voyageurs.`}
      </p>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">📧</div>
          <div className="traveler-card-title">Email de confirmation</div>
        </div>
        <div className="form-group">
          <label>Votre email</label>
          <input type="email" placeholder="sophie@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
        </div>
      </div>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">🕐</div>
          <div className="traveler-card-title">Heure d'arrivée estimée</div>
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14, fontWeight: 300, lineHeight: 1.5 }}>
          La remise des clés se fait en main propre — indiquez-nous approximativement à quelle heure vous prévoyez d'arriver.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Avant 12h","12h–14h","14h–16h","16h–18h","18h–20h","Après 20h"].map(slot => (
            <div
              key={slot}
              onClick={() => setArrivalTime(slot)}
              style={{
                padding: "9px 16px",
                borderRadius: 20,
                border: `1.5px solid ${arrivalTime === slot ? COLORS.terracotta : COLORS.border}`,
                background: arrivalTime === slot ? COLORS.terracottaLight : "white",
                fontSize: 14,
                cursor: "pointer",
                color: arrivalTime === slot ? COLORS.terracottaDark : COLORS.dark,
                fontWeight: arrivalTime === slot ? 500 : 400,
                transition: "all 0.15s",
              }}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">🚪</div>
          <div className="traveler-card-title">Heure de départ prévue</div>
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14, fontWeight: 300, lineHeight: 1.5 }}>
          Le départ se fait au plus tard à <strong>11h00</strong>. La remise des clés se fait en main propre — à quelle heure prévoyez-vous de partir ?
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Avant 8h","8h–9h","9h–10h","10h–11h","11h00 (max)"].map(slot => (
            <div
              key={slot}
              onClick={() => setDepartureTime(slot)}
              style={{
                padding: "9px 16px",
                borderRadius: 20,
                border: `1.5px solid ${departureTime === slot ? (slot === "11h00 (max)" ? COLORS.olive : COLORS.terracotta) : COLORS.border}`,
                background: departureTime === slot ? (slot === "11h00 (max)" ? COLORS.oliveLight : COLORS.terracottaLight) : "white",
                fontSize: 14,
                cursor: "pointer",
                color: departureTime === slot ? (slot === "11h00 (max)" ? COLORS.olive : COLORS.terracottaDark) : COLORS.dark,
                fontWeight: departureTime === slot ? 500 : 400,
                transition: "all 0.15s",
              }}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>

      {Array.from({ length: count }).map((_, i) => {
        const t = travelers[i] || {};
        return (
          <div key={i} className="traveler-card">
            <div className="traveler-card-header">
              <div className="traveler-avatar">{i === 0 ? "🧑" : "👤"}</div>
              <div className="traveler-card-title">{i === 0 ? "Voyageur principal" : `Voyageur ${i + 1}`}</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" placeholder="Marie" value={t.firstName || ""} onChange={e => handleChange(i, "firstName", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" placeholder="Dupont" value={t.lastName || ""} onChange={e => handleChange(i, "lastName", e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Nationalité</label>
              <select value={t.nationality || ""} onChange={e => handleChange(i, "nationality", e.target.value)}>
                <option value="">Sélectionner...</option>
                <option value="FR">🇫🇷 Française</option>
                <option value="BE">🇧🇪 Belge</option>
                <option value="CH">🇨🇭 Suisse</option>
                <option value="DE">🇩🇪 Allemande</option>
                <option value="IT">🇮🇹 Italienne</option>
                <option value="ES">🇪🇸 Espagnole</option>
                <option value="GB">🇬🇧 Britannique</option>
                <option value="US">🇺🇸 Américaine</option>
                <option value="OTHER">🌍 Autre</option>
              </select>
            </div>
          </div>
        );
      })}

      <button className="btn-primary" onClick={onNext} disabled={!isComplete()}>Continuer →</button>
      <button className="btn-secondary" onClick={onBack}>← Retour</button>
    </div>
  );
}

// ─── STEP 3 — EXTRAS ────────────────────────────────────────────────────

function ExtrasPage({ parking, setParking, breakfastDays, setBreakfastDays, nights, checkIn, onNext, onBack }) {
  const getDayLabel = (offset) => {
    const parts = checkIn.split("/");
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };

  const toggleDay = (i) => setBreakfastDays(prev => {
    const u = [...prev];
    u[i] = { ...(u[i] || { items: [], time: "" }), active: !u[i]?.active };
    return u;
  });

  const toggleItem = (dayIdx, id) => setBreakfastDays(prev => {
    const u = [...prev];
    const d = { ...(u[dayIdx] || { active: true, items: [], time: "" }) };
    d.items = d.items.includes(id) ? d.items.filter(x => x !== id) : [...d.items, id];
    u[dayIdx] = d;
    return u;
  });

  const setTime = (dayIdx, time) => setBreakfastDays(prev => {
    const u = [...prev];
    u[dayIdx] = { ...(u[dayIdx] || {}), time };
    return u;
  });

  return (
    <div className="card">
      <StepIndicator current={3} total={5} />

      <div className="page-title" style={{ marginBottom: 6 }}>🚗 Place de parking</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 16 }}>Parking privé sécurisé — 20 €/nuit</p>

      {[true, false].map(val => (
        <div key={String(val)} className={`option-card ${parking.want === val ? "selected" : ""}`} onClick={() => setParking({ ...parking, want: val })}>
          <div className="radio-circle"><div className="radio-dot" /></div>
          <span className="option-card-icon">{val ? "✅" : "🚶"}</span>
          <div className="option-card-content">
            <div className="option-card-title">{val ? "Oui, je veux le parking" : "Non merci"}</div>
            <div className="option-card-desc">{val ? `${nights} nuit${nights > 1 ? "s" : ""} × 20 €` : "Je n'en ai pas besoin"}</div>
          </div>
          <div className="option-card-price" style={val ? {} : { color: COLORS.muted, fontSize: 14 }}>{val ? `${nights * 20} €` : "—"}</div>
        </div>
      ))}

      {parking.want === true && (
        <div style={{ marginBottom: 8 }}>
          <p className="section-label" style={{ marginTop: 4 }}>Paiement du parking</p>
          {[
            { id: "cash",   icon: "💵", title: "Cash sur place",    desc: "À la remise des clés" },
            { id: "paypal", icon: "💳", title: "PayPal en ligne",   desc: "Paiement sécurisé avant l'arrivée" },
          ].map(opt => (
            <div key={opt.id} className={`option-card ${parking.payment === opt.id ? "selected" : ""}`} style={{ padding: "14px 16px" }} onClick={() => setParking({ ...parking, payment: opt.id })}>
              <div className="radio-circle"><div className="radio-dot" /></div>
              <span className="option-card-icon">{opt.icon}</span>
              <div className="option-card-content">
                <div className="option-card-title">{opt.title}</div>
                <div className="option-card-desc">{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      <div className="page-title" style={{ marginBottom: 6 }}>☕ Petit-déjeuner</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 16 }}>Livré directement à votre porte, frais du matin</p>

      {Array.from({ length: nights }).map((_, i) => {
        const day = breakfastDays[i] || { active: false, items: [], time: "" };
        return (
          <div key={i} className="day-row">
            <div className="day-row-header">
              <div>
                <div className="day-label" style={{ textTransform: "capitalize" }}>{getDayLabel(i)}</div>
                <div className="day-date">Matin du jour {i + 1}</div>
              </div>
              <div className="breakfast-toggle" onClick={() => toggleDay(i)}>
                <div className={`toggle ${day.active ? "on" : ""}`} />
                <span className="toggle-label">{day.active ? "Oui" : "Non"}</span>
              </div>
            </div>
            {day.active && (
              <>
                <p className="section-label">Choisissez vos articles</p>
                <div className="menu-grid">
                  {BREAKFAST_MENU.map(item => (
                    <div key={item.id} className={`menu-item ${day.items.includes(item.id) ? "selected" : ""}`} onClick={() => toggleItem(i, item.id)}>
                      <span className="menu-item-emoji">{item.emoji}</span>
                      <div className="menu-item-info">
                        <div className="menu-item-name">{item.name}</div>
                        <div className="menu-item-price">{item.price} €</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <p className="section-label">Heure de livraison</p>
                  <div className="time-chips">
                    {DELIVERY_TIMES.map(t => (
                      <div key={t} className={`time-chip ${day.time === t ? "selected" : ""}`} onClick={() => setTime(i, t)}>{t}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button className="btn-primary" onClick={onNext} style={{ marginTop: 16 }}>Voir le récapitulatif →</button>
      <button className="btn-secondary" onClick={onBack}>← Retour</button>
    </div>
  );
}

// ─── STEP 4 — SUMMARY + PAYPAL ───────────────────────────────────────────

function SummaryPage({ guestName, guestEmail, travelers, count, nights, parking, breakfastDays, checkIn, checkOut, arrivalTime, departureTime, onConfirm, sending }) {
  const bfTotal = breakfastDays.reduce((sum, day) => {
    if (!day?.active) return sum;
    return sum + (day.items || []).reduce((s, id) => {
      const item = BREAKFAST_MENU.find(m => m.id === id);
      return s + (item ? item.price : 0);
    }, 0);
  }, 0);
  const parkingTotal = parking.want ? nights * 20 : 0;
  const onlineTotal = bfTotal + (parking.payment === "paypal" ? parkingTotal : 0);
  const cashTotal = parking.payment === "cash" && parking.want ? parkingTotal : 0;

  const paypalUrl = `https://www.paypal.com/paypalme/${CONFIG.PAYPAL_EMAIL.split("@")[0]}/${onlineTotal.toFixed(2)}EUR`;

  return (
    <div className="card">
      <StepIndicator current={4} total={5} />
      <div className="page-title" style={{ marginBottom: 4 }}>Récapitulatif</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 20 }}>Vérifiez avant de confirmer.</p>

      <div className="info-box">
        <span className="info-box-icon">📅</span>
        <div className="info-box-content">
          <p><strong>{checkIn} → {checkOut}</strong> · {nights} nuit{nights > 1 ? "s" : ""}</p>
          <p>{count} voyageur{count > 1 ? "s" : ""} : {travelers.slice(0, count).map(t => `${t?.firstName || ""} ${t?.lastName || ""}`).join(", ")}</p>
          {arrivalTime && <p>🕐 Arrivée prévue : <strong>{arrivalTime}</strong></p>}
          {departureTime && <p>🚪 Départ prévu : <strong>{departureTime}</strong></p>}
          <p>Email : {guestEmail}</p>
        </div>
      </div>

      <div className="summary-row">
        <span className="summary-label">🚗 Parking</span>
        <span className="summary-value">
          {parking.want
            ? <><span className="tag tag-terracotta">{nights} nuit{nights>1?"s":""} · {parkingTotal} €</span>{" "}<span style={{ fontSize: 12, color: COLORS.muted }}>({parking.payment === "cash" ? "cash" : "PayPal"})</span></>
            : <span style={{ color: COLORS.muted }}>Non</span>}
        </span>
      </div>

      {breakfastDays.map((day, i) => {
        if (!day?.active) return null;
        const items = (day.items || []).map(id => BREAKFAST_MENU.find(m => m.id === id)?.name).filter(Boolean);
        const dayTotal = (day.items || []).reduce((s, id) => {
          const item = BREAKFAST_MENU.find(m => m.id === id);
          return s + (item ? item.price : 0);
        }, 0);
        return (
          <div key={i} className="summary-row">
            <span className="summary-label">☕ Petit-déj J{i + 1}{day.time ? ` · ${day.time}` : ""}</span>
            <span className="summary-value" style={{ fontSize: 12 }}>
              {items.length ? items.join(", ") : "Sélectionné"}{dayTotal > 0 ? ` · ${dayTotal.toFixed(2)} €` : ""}
            </span>
          </div>
        );
      })}

      {/* ── TOTAL BLOCK ── */}
      <div style={{ background: COLORS.sand, borderRadius: 16, padding: "18px 20px", margin: "16px 0" }}>
        <p className="section-label" style={{ marginBottom: 12 }}>Récapitulatif des paiements</p>

        {bfTotal > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: COLORS.muted }}>☕ Petit-déjeuners</span>
            <span style={{ fontWeight: 500 }}>{bfTotal.toFixed(2)} €</span>
          </div>
        )}
        {parking.want && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: COLORS.muted }}>🚗 Parking ({nights} nuit{nights>1?"s":""})</span>
            <span style={{ fontWeight: 500 }}>{parkingTotal} €</span>
          </div>
        )}
        <div style={{ height: 1, background: COLORS.border, margin: "10px 0" }} />
        {onlineTotal > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>💳 Total PayPal</span>
            <span style={{ fontWeight: 500, color: COLORS.terracotta, fontFamily: "'Playfair Display', serif", fontSize: 20 }}>{onlineTotal.toFixed(2)} €</span>
          </div>
        )}
        {cashTotal > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: COLORS.muted }}>💵 Cash sur place</span>
            <span style={{ fontWeight: 500 }}>{cashTotal} €</span>
          </div>
        )}
      </div>

      {/* ── PAYPAL BUTTON ── */}
      {onlineTotal > 0 && (
        <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.muted, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 8 }}>Paiement sécurisé</p>
          <p style={{ fontSize: 14, color: COLORS.dark, marginBottom: 16, lineHeight: 1.5 }}>
            Réglez <strong style={{ color: COLORS.terracotta, fontSize: 18 }}>{onlineTotal.toFixed(2)} €</strong> directement à <strong>Conciergerie Daddio</strong>
          </p>
          <button
            onClick={() => window.open(`https://www.paypal.com/paypalme/conciergeriedaddio/${onlineTotal.toFixed(2)}`, "_blank")}
            style={{
              width: "100%",
              padding: "16px",
              background: "#003087",
              color: "white",
              border: "none",
              borderRadius: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7.5 4h7C17.09 4 19 5.91 19 8.5c0 3.31-2.69 6-6 6H10l-1 5H6L8.5 4H7.5z" fill="#009CDE"/>
              <path d="M9 4h6.5C18.09 4 20 5.91 20 8.5c0 3.31-2.69 6-6 6H11l-1 5H7L9.5 4H9z" fill="#012169" opacity="0.6"/>
            </svg>
            Payer {onlineTotal.toFixed(2)} € via PayPal
          </button>
          <p style={{ fontSize: 12, color: COLORS.muted, fontWeight: 300 }}>Vous serez redirigé vers PayPal — 100% sécurisé</p>
        </div>
      )}

      {cashTotal > 0 && (
        <div className="highlight-box">
          <p>💵 Parking ({cashTotal} €) à régler en espèces à la remise des clés.</p>
        </div>
      )}

      {sending ? (
        <div className="sending-overlay">
          <div className="spinner" />
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Envoi de vos confirmations…</p>
        </div>
      ) : (
        <button
          className={onlineTotal > 0 ? "btn-primary" : "btn-primary"}
          onClick={() => onConfirm(bfTotal, parkingTotal, onlineTotal)}
          style={{ marginTop: 4 }}
        >
          ✓ Confirmer mon enregistrement
        </button>
      )}
    </div>
  );
}

// ─── STEP 5 — CONFIRMED ───────────────────────────────────────────────────

function ConfirmedPage({ guestName, guestEmail, onlineTotal }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="success-icon">🎉</div>
      <h1 style={{ marginBottom: 12 }}>Tout est prêt, {guestName} !</h1>
      <p className="subtitle">
        Votre enregistrement est confirmé.<br />
        Un email de confirmation a été envoyé à <strong>{guestEmail}</strong>.
      </p>
      {onlineTotal > 0 && (
        <div className="info-box" style={{ background: "#E8F0FC", textAlign: "left" }}>
          <span className="info-box-icon">💳</span>
          <div className="info-box-content">
            <p style={{ color: "#003087" }}>
              <strong style={{ color: COLORS.dark }}>Paiement PayPal</strong>
            </p>
            <p style={{ color: "#003087" }}>Si ce n'est pas encore fait, finalisez votre paiement de <strong>{onlineTotal.toFixed(2)} €</strong> via le lien PayPal.</p>
          </div>
        </div>
      )}
      <div className="info-box" style={{ textAlign: "left", marginBottom: 12 }}>
        <span className="info-box-icon">📱</span>
        <div className="info-box-content">
          <p><strong>Prochaine étape</strong></p>
          <p>Vous recevrez les <strong>instructions d'accès</strong> et le code de la boîte à clés par SMS le jour de votre arrivée.</p>
        </div>
      </div>
      <div className="info-box" style={{ background: COLORS.oliveLight, textAlign: "left" }}>
        <span className="info-box-icon">💬</span>
        <div className="info-box-content">
          <p style={{ color: COLORS.olive }}><strong style={{ color: COLORS.dark }}>Une question ?</strong></p>
          <p style={{ color: COLORS.olive }}>WhatsApp {CONFIG.WHATSAPP} — disponible 7j/7</p>
        </div>
      </div>
      <p style={{ fontSize: 28, margin: "20px 0 8px" }}>🌊 ☀️ 🏖️</p>
      <p style={{ fontSize: 14, color: COLORS.muted, fontWeight: 300 }}>{CONFIG.PROPERTY_NAME} · {CONFIG.CITY}</p>
    </div>
  );
}

// ─── EMAIL SENDER (mailto fallback) ───────────────────────────────────────

function sendEmailsViaMailto(hostEmail, guestEmail) {
  const encode = s => encodeURIComponent(s);
  const hostLink = `mailto:${hostEmail.to}?subject=${encode(hostEmail.subject)}&body=${encode(hostEmail.body)}`;
  window.open(hostLink, "_blank");
  setTimeout(() => {
    const guestLink = `mailto:${guestEmail.to}?subject=${encode(guestEmail.subject)}&body=${encode(guestEmail.body)}`;
    window.open(guestLink, "_blank");
  }, 800);
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep]               = useState(0);
  const [guestName]                   = useState("Sophie");
  const [checkIn]                     = useState("14/06/2025");
  const [checkOut]                    = useState("17/06/2025");
  const [nights]                      = useState(3);
  const [travelerCount, setTravelerCount] = useState(2);
  const [travelers, setTravelers]     = useState([]);
  const [guestEmail, setGuestEmail]   = useState("");
  const [arrivalTime, setArrivalTime]     = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [parking, setParking]         = useState({ want: null, payment: "" });
  const [breakfastDays, setBreakfastDays] = useState([]);
  const [sending, setSending]         = useState(false);
  const [finalTotals, setFinalTotals] = useState({ bf: 0, parking: 0, online: 0 });

  useEffect(() => {
    setBreakfastDays(Array.from({ length: nights }, (_, i) =>
      breakfastDays[i] || { active: false, items: [], time: "" }
    ));
  }, [nights]);

  const handleConfirm = (bfTotal, parkingTotal, onlineTotal) => {
    setSending(true);
    setFinalTotals({ bf: bfTotal, parking: parkingTotal, online: onlineTotal });

    const hostMail = buildHostEmail({ guestName, guestEmail, checkIn, checkOut, nights, travelers, count: travelerCount, parking, breakfastDays, arrivalTime, departureTime });
    const clientMail = buildGuestEmail({ guestName, guestEmail, checkIn, checkOut, nights, parking, breakfastDays, bfTotal, parkingTotal, onlineTotal, arrivalTime, departureTime });

    setTimeout(() => {
      sendEmailsViaMailto(hostMail, clientMail);
      setSending(false);
      setStep(5);
    }, 1200);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <Logo />
        {step === 0 && <WelcomePage guestName={guestName} checkIn={checkIn} checkOut={checkOut} nights={nights} onNext={() => setStep(1)} />}
        {step === 1 && <TravelersPage count={travelerCount} onChange={setTravelerCount} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <GuestInfoPage count={travelerCount} travelers={travelers} onChange={setTravelers} guestEmail={guestEmail} setGuestEmail={setGuestEmail} arrivalTime={arrivalTime} setArrivalTime={setArrivalTime} departureTime={departureTime} setDepartureTime={setDepartureTime} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <ExtrasPage parking={parking} setParking={setParking} breakfastDays={breakfastDays} setBreakfastDays={setBreakfastDays} nights={nights} checkIn={checkIn} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <SummaryPage guestName={guestName} guestEmail={guestEmail} travelers={travelers} count={travelerCount} nights={nights} parking={parking} breakfastDays={breakfastDays} checkIn={checkIn} checkOut={checkOut} arrivalTime={arrivalTime} departureTime={departureTime} onConfirm={handleConfirm} sending={sending} />}
        {step === 5 && <ConfirmedPage guestName={guestName} guestEmail={guestEmail} onlineTotal={finalTotals.online} />}
      </div>
    </>
  );
}
  { id: "oj",       emoji: "🍊", name: "Jus d'orange frais",price: 4, desc: "Pressé à la commande" },
];

const DELIVERY_TIMES = ["7h00","7h30","8h00","8h30","9h00","9h30","10h00"];

// ─── EMAIL HELPERS ─────────────────────────────────────────────────────────

function buildHostEmail({ guestName, guestEmail, checkIn, checkOut, nights, travelers, count, parking, breakfastDays }) {
  const bfLines = breakfastDays.map((day, i) => {
    if (!day?.active) return null;
    const items = (day.items||[]).map(id => BREAKFAST_MENU.find(m=>m.id===id)?.name).filter(Boolean).join(", ");
    return `  Jour ${i+1} : ${items || "—"} · Livraison ${day.time||"—"}`;
  }).filter(Boolean).join("\n");

  const parkingLine = parking.want
    ? `Parking : OUI · ${nights * 20}€ · Paiement ${parking.payment === "cash" ? "cash sur place" : "PayPal"}`
    : "Parking : NON";

  const bfTotal = breakfastDays.reduce((sum, day) => {
    if (!day?.active) return sum;
    return sum + (day.items||[]).reduce((s, id) => {
      const item = BREAKFAST_MENU.find(m=>m.id===id);
      return s + (item ? item.price : 0);
    }, 0);
  }, 0);

  const parkingTotal = parking.want ? nights * 20 : 0;
  const onlineTotal = bfTotal + (parking.payment === "paypal" ? parkingTotal : 0);

  const travelersStr = travelers.slice(0, count).map((t,i) =>
    `  ${i===0?"Principal":"Voyageur "+(i+1)} : ${t?.firstName||""} ${t?.lastName||""} (${t?.nationality||""})`
  ).join("\n");

  return {
    to: CONFIG.HOST_EMAIL,
    subject: `✅ Nouvel enregistrement — ${guestName} · arrivée ${checkIn}`,
    body: `RÉCAP ENREGISTREMENT
━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT : ${guestName}
Email  : ${guestEmail}
Séjour : ${checkIn} → ${checkOut} (${nights} nuit${nights>1?"s":""})
Voyageurs (${count}) :
${travelersStr}

━━ SERVICES ━━━━━━━━━━━━━━

${parkingLine}

Petit-déjeuners :
${bfLines || "  Aucun"}

━━ TOTAUX ━━━━━━━━━━━━━━━━

Petit-déjeuners : ${bfTotal.toFixed(2)}€ (PayPal)
Parking PayPal  : ${parking.payment==="paypal" ? parkingTotal+"€" : "0€ (cash)"}
TOTAL EN LIGNE  : ${onlineTotal.toFixed(2)}€
Cash sur place  : ${parking.payment==="cash" ? parkingTotal+"€" : "0€"}

━━━━━━━━━━━━━━━━━━━━━━━━━`
  };
}

function buildGuestEmail({ guestName, guestEmail, checkIn, checkOut, nights, parking, breakfastDays, bfTotal, parkingTotal, onlineTotal }) {
  const bfLines = breakfastDays.map((day, i) => {
    if (!day?.active) return null;
    const items = (day.items||[]).map(id => BREAKFAST_MENU.find(m=>m.id===id)?.name).filter(Boolean).join(", ");
    return `  • Matin du jour ${i+1} : ${items || "—"} — livraison ${day.time||"—"}`;
  }).filter(Boolean).join("\n");

  return {
    to: guestEmail,
    subject: `Votre séjour au ${CONFIG.PROPERTY_NAME} — Confirmation d'enregistrement ✨`,
    body: `Bonjour ${guestName},

Votre enregistrement est confirmé pour votre séjour au ${CONFIG.PROPERTY_NAME} à ${CONFIG.CITY} !

━━ VOTRE SÉJOUR ━━━━━━━━━━

📅 Arrivée   : ${checkIn}
📅 Départ    : ${checkOut}
🌙 Durée     : ${nights} nuit${nights>1?"s":""}

━━ VOS OPTIONS ━━━━━━━━━━━
${parking.want ? `\n🚗 Parking privé : ${nights} nuit${nights>1?"s":""} · ${parkingTotal}€\n   Paiement : ${parking.payment==="cash" ? "cash à la remise des clés" : "via PayPal (lien envoyé séparément)"}` : ""}
${bfLines ? `\n☕ Petits-déjeuners commandés :\n${bfLines}` : ""}
${onlineTotal > 0 ? `\n💳 Total à régler en ligne : ${onlineTotal.toFixed(2)}€` : ""}
${parking.payment==="cash" && parking.want ? `💵 Cash sur place : ${parkingTotal}€` : ""}

━━ PROCHAINES ÉTAPES ━━━━━

🔑 Vous recevrez les instructions d'accès et le code de la boîte à clés par SMS le jour de votre arrivée.

💬 Une question ? Contactez-nous sur WhatsApp : ${CONFIG.WHATSAPP}

━━━━━━━━━━━━━━━━━━━━━━━━━

À très bientôt à ${CONFIG.CITY} !
L'équipe ${CONFIG.PROPERTY_NAME}`
  };
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.sand}; font-family: 'DM Sans', sans-serif; color: ${COLORS.dark}; min-height: 100vh; }

  .app { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 0 16px 60px; }

  .header { width: 100%; max-width: 560px; display: flex; align-items: center; justify-content: center; padding: 28px 0 20px; gap: 12px; }
  .logo-mark { width: 40px; height: 40px; background: ${COLORS.terracotta}; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .logo-inner { width: 22px; height: 22px; border: 2.5px solid white; border-radius: 5px; position: relative; }
  .logo-inner::after { content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; border-right: 2.5px solid white; border-bottom: 2.5px solid white; border-radius: 0 0 2px 0; }
  .logo-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 500; color: ${COLORS.dark}; letter-spacing: -0.3px; }
  .logo-text span { color: ${COLORS.terracotta}; }

  .card { background: ${COLORS.cream}; border-radius: 20px; border: 1px solid ${COLORS.border}; padding: 32px 28px; width: 100%; max-width: 560px; animation: slideUp 0.4s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .step-indicator { display: flex; justify-content: center; gap: 8px; margin-bottom: 28px; }
  .step-dot { height: 4px; border-radius: 2px; background: ${COLORS.border}; transition: all 0.3s ease; }
  .step-dot.active { background: ${COLORS.terracotta}; width: 24px; }
  .step-dot.done { background: ${COLORS.olive}; width: 12px; }
  .step-dot.inactive { width: 12px; }

  .welcome-emoji { font-size: 48px; text-align: center; margin-bottom: 16px; display: block; }
  h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 500; line-height: 1.2; color: ${COLORS.dark}; margin-bottom: 8px; text-align: center; }
  h1 .name { color: ${COLORS.terracotta}; font-style: italic; }
  .subtitle { font-size: 15px; color: ${COLORS.muted}; text-align: center; line-height: 1.6; margin-bottom: 28px; font-weight: 300; }

  .info-box { background: ${COLORS.oliveLight}; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; gap: 14px; align-items: flex-start; }
  .info-box-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
  .info-box-content p { font-size: 14px; color: ${COLORS.olive}; font-weight: 400; line-height: 1.5; }
  .info-box-content strong { font-weight: 500; color: ${COLORS.dark}; }

  .section-label { font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase; color: ${COLORS.muted}; margin-bottom: 12px; }

  .traveler-counter { display: flex; align-items: center; justify-content: space-between; background: white; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; }
  .counter-label { display: flex; align-items: center; gap: 10px; }
  .counter-label-text { font-size: 15px; font-weight: 400; color: ${COLORS.dark}; }
  .counter-controls { display: flex; align-items: center; gap: 16px; }
  .counter-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid ${COLORS.border}; background: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${COLORS.terracotta}; font-weight: 500; transition: all 0.2s; flex-shrink: 0; }
  .counter-btn:hover:not(:disabled) { background: ${COLORS.terracottaLight}; border-color: ${COLORS.terracotta}; transform: scale(1.05); }
  .counter-btn:disabled { color: ${COLORS.border}; cursor: not-allowed; }
  .counter-value { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: ${COLORS.dark}; min-width: 24px; text-align: center; }

  .btn-primary { width: 100%; padding: 16px; background: ${COLORS.terracotta}; color: white; border: none; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-primary:hover { background: ${COLORS.terracottaDark}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-secondary { width: 100%; padding: 14px; background: transparent; color: ${COLORS.muted}; border: 1px solid ${COLORS.border}; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 400; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
  .btn-secondary:hover { background: ${COLORS.sand}; color: ${COLORS.dark}; }

  .traveler-card { background: white; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 20px; margin-bottom: 14px; }
  .traveler-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .traveler-avatar { width: 36px; height: 36px; border-radius: 50%; background: ${COLORS.terracottaLight}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .traveler-card-title { font-weight: 500; font-size: 15px; color: ${COLORS.dark}; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .form-group:last-child { margin-bottom: 0; }
  label { font-size: 12px; font-weight: 500; color: ${COLORS.muted}; letter-spacing: 0.5px; text-transform: uppercase; }
  input, select { padding: 11px 14px; border: 1px solid ${COLORS.border}; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: ${COLORS.dark}; background: ${COLORS.cream}; transition: border-color 0.2s; outline: none; width: 100%; appearance: none; }
  input:focus, select:focus { border-color: ${COLORS.terracotta}; background: white; }
  input::placeholder { color: ${COLORS.border}; }

  .option-card { background: white; border: 1.5px solid ${COLORS.border}; border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 16px; }
  .option-card:hover { border-color: ${COLORS.terracotta}; background: ${COLORS.cream}; }
  .option-card.selected { border-color: ${COLORS.terracotta}; background: ${COLORS.terracottaLight}; }
  .option-card-icon { font-size: 28px; flex-shrink: 0; }
  .option-card-content { flex: 1; }
  .option-card-title { font-weight: 500; font-size: 15px; color: ${COLORS.dark}; margin-bottom: 2px; }
  .option-card-desc { font-size: 13px; color: ${COLORS.muted}; font-weight: 300; }
  .option-card-price { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: ${COLORS.terracotta}; flex-shrink: 0; }
  .radio-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${COLORS.border}; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .option-card.selected .radio-circle { border-color: ${COLORS.terracotta}; }
  .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${COLORS.terracotta}; opacity: 0; transition: opacity 0.2s; }
  .option-card.selected .radio-dot { opacity: 1; }

  .day-row { background: white; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 16px 18px; margin-bottom: 10px; }
  .day-row-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .day-label { font-weight: 500; font-size: 14px; color: ${COLORS.dark}; }
  .day-date { font-size: 12px; color: ${COLORS.muted}; font-weight: 300; }
  .breakfast-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .toggle { width: 40px; height: 22px; border-radius: 11px; background: ${COLORS.border}; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .toggle.on { background: ${COLORS.terracotta}; }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .toggle.on::after { left: 21px; }
  .toggle-label { font-size: 14px; color: ${COLORS.muted}; font-weight: 300; }

  .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
  .menu-item { border: 1.5px solid ${COLORS.border}; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
  .menu-item:hover { border-color: ${COLORS.terracotta}; }
  .menu-item.selected { border-color: ${COLORS.terracotta}; background: ${COLORS.terracottaLight}; }
  .menu-item-emoji { font-size: 18px; flex-shrink: 0; }
  .menu-item-info { flex: 1; min-width: 0; }
  .menu-item-name { font-size: 12px; font-weight: 500; color: ${COLORS.dark}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .menu-item-price { font-size: 11px; color: ${COLORS.terracotta}; font-weight: 500; }

  .time-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .time-chip { padding: 6px 12px; border-radius: 20px; border: 1px solid ${COLORS.border}; font-size: 13px; cursor: pointer; transition: all 0.2s; background: white; color: ${COLORS.dark}; font-weight: 400; }
  .time-chip:hover { border-color: ${COLORS.terracotta}; }
  .time-chip.selected { background: ${COLORS.terracotta}; border-color: ${COLORS.terracotta}; color: white; }

  .paypal-btn { width: 100%; padding: 16px; background: #003087; color: white; border: none; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .paypal-btn:hover { background: #001f5c; transform: translateY(-1px); }
  .paypal-logo { font-size: 15px; letter-spacing: 0.5px; }

  .success-icon { width: 72px; height: 72px; background: ${COLORS.oliveLight}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 24px; }

  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${COLORS.border}; }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 14px; color: ${COLORS.muted}; font-weight: 300; }
  .summary-value { font-size: 14px; font-weight: 500; color: ${COLORS.dark}; text-align: right; max-width: 220px; }

  .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .tag-olive { background: ${COLORS.oliveLight}; color: ${COLORS.olive}; }
  .tag-terracotta { background: ${COLORS.terracottaLight}; color: ${COLORS.terracottaDark}; }

  .divider { height: 1px; background: ${COLORS.border}; margin: 20px 0; }

  .highlight-box { background: ${COLORS.skyLight}; border-radius: 12px; padding: 16px 18px; margin: 16px 0; }
  .highlight-box p { font-size: 14px; color: ${COLORS.sky}; line-height: 1.6; }

  .page-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: ${COLORS.dark}; margin-bottom: 6px; }

  .sending-overlay { text-align: center; padding: 20px 0; }
  .spinner { width: 40px; height: 40px; border: 3px solid ${COLORS.border}; border-top-color: ${COLORS.terracotta}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="header">
      <div className="logo-mark"><div className="logo-inner" /></div>
      <div className="logo-text">Sunny<span>Terrace</span></div>
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`step-dot ${i < current ? "done" : i === current ? "active" : "inactive"}`} />
      ))}
    </div>
  );
}

function Counter({ value, onChange, min = 1, max = 8 }) {
  return (
    <div className="traveler-counter">
      <div className="counter-label">
        <span>👥</span>
        <div className="counter-label-text">Nombre de voyageurs</div>
      </div>
      <div className="counter-controls">
        <button className="counter-btn" onClick={() => onChange(value - 1)} disabled={value <= min}>−</button>
        <span className="counter-value">{value}</span>
        <button className="counter-btn" onClick={() => onChange(value + 1)} disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

// ─── STEP 0 — WELCOME ─────────────────────────────────────────────────────

function WelcomePage({ guestName, checkIn, checkOut, nights, onNext }) {
  return (
    <div className="card">
      <StepIndicator current={0} total={5} />
      <span className="welcome-emoji">☀️</span>
      <h1>Bienvenue, <span className="name">{guestName}</span> !</h1>
      <p className="subtitle">
        Nous sommes ravis de vous accueillir à {CONFIG.CITY}.<br />
        Votre check-in prend 3 minutes, promis ✨
      </p>
      <div className="info-box">
        <span className="info-box-icon">📅</span>
        <div className="info-box-content">
          <p><strong>Votre séjour</strong></p>
          <p>Du <strong>{checkIn}</strong> au <strong>{checkOut}</strong> — {nights} nuit{nights > 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="info-box" style={{ background: COLORS.skyLight }}>
        <span className="info-box-icon">🏡</span>
        <div className="info-box-content">
          <p style={{ color: COLORS.sky }}><strong style={{ color: COLORS.dark }}>{CONFIG.PROPERTY_NAME}</strong></p>
          <p style={{ color: COLORS.sky }}>Appartement moderne avec terrasse ensoleillée, {CONFIG.CITY}</p>
        </div>
      </div>
      <button className="btn-primary" onClick={onNext}>Commencer l'enregistrement →</button>
    </div>
  );
}

// ─── STEP 1 — TRAVELERS COUNT ─────────────────────────────────────────────

function TravelersPage({ count, onChange, onNext, onBack }) {
  return (
    <div className="card">
      <StepIndicator current={1} total={5} />
      <div className="page-title">Confirmez votre groupe</div>
      <p className="subtitle" style={{ textAlign: "left" }}>Combien de personnes séjournent avec vous ?</p>
      <Counter value={count} onChange={onChange} />
      <div className="info-box">
        <span className="info-box-icon">ℹ️</span>
        <div className="info-box-content">
          <p>Nous avons besoin d'enregistrer <strong>chaque voyageur</strong> conformément à la réglementation française.</p>
        </div>
      </div>
      <button className="btn-primary" onClick={onNext}>Continuer avec {count} voyageur{count > 1 ? "s" : ""} →</button>
      <button className="btn-secondary" onClick={onBack}>← Retour</button>
    </div>
  );
}

// ─── STEP 2 — GUEST INFO ─────────────────────────────────────────────────

function GuestInfoPage({ count, travelers, onChange, guestEmail, setGuestEmail, onNext, onBack }) {
  const handleChange = (idx, field, val) => {
    const updated = [...travelers];
    if (!updated[idx]) updated[idx] = {};
    updated[idx][field] = val;
    onChange(updated);
  };

  const isComplete = () => {
    if (!guestEmail || !guestEmail.includes("@")) return false;
    for (let i = 0; i < count; i++) {
      const t = travelers[i] || {};
      if (!t.firstName || !t.lastName || !t.nationality) return false;
    }
    return true;
  };

  return (
    <div className="card">
      <StepIndicator current={2} total={5} />
      <div className="page-title">Informations voyageurs</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 20 }}>
        {count === 1 ? "Renseignez vos informations." : `Renseignez les ${count} voyageurs.`}
      </p>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">📧</div>
          <div className="traveler-card-title">Email de confirmation</div>
        </div>
        <div className="form-group">
          <label>Votre email</label>
          <input type="email" placeholder="sophie@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
        </div>
      </div>

      {Array.from({ length: count }).map((_, i) => {
        const t = travelers[i] || {};
        return (
          <div key={i} className="traveler-card">
            <div className="traveler-card-header">
              <div className="traveler-avatar">{i === 0 ? "🧑" : "👤"}</div>
              <div className="traveler-card-title">{i === 0 ? "Voyageur principal" : `Voyageur ${i + 1}`}</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" placeholder="Marie" value={t.firstName || ""} onChange={e => handleChange(i, "firstName", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" placeholder="Dupont" value={t.lastName || ""} onChange={e => handleChange(i, "lastName", e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Nationalité</label>
              <select value={t.nationality || ""} onChange={e => handleChange(i, "nationality", e.target.value)}>
                <option value="">Sélectionner...</option>
                <option value="FR">🇫🇷 Française</option>
                <option value="BE">🇧🇪 Belge</option>
                <option value="CH">🇨🇭 Suisse</option>
                <option value="DE">🇩🇪 Allemande</option>
                <option value="IT">🇮🇹 Italienne</option>
                <option value="ES">🇪🇸 Espagnole</option>
                <option value="GB">🇬🇧 Britannique</option>
                <option value="US">🇺🇸 Américaine</option>
                <option value="OTHER">🌍 Autre</option>
              </select>
            </div>
          </div>
        );
      })}

      <button className="btn-primary" onClick={onNext} disabled={!isComplete()}>Continuer →</button>
      <button className="btn-secondary" onClick={onBack}>← Retour</button>
    </div>
  );
}

// ─── STEP 3 — EXTRAS ────────────────────────────────────────────────────

function ExtrasPage({ parking, setParking, breakfastDays, setBreakfastDays, nights, checkIn, onNext, onBack }) {
  const getDayLabel = (offset) => {
    const parts = checkIn.split("/");
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };

  const toggleDay = (i) => setBreakfastDays(prev => {
    const u = [...prev];
    u[i] = { ...(u[i] || { items: [], time: "" }), active: !u[i]?.active };
    return u;
  });

  const toggleItem = (dayIdx, id) => setBreakfastDays(prev => {
    const u = [...prev];
    const d = { ...(u[dayIdx] || { active: true, items: [], time: "" }) };
    d.items = d.items.includes(id) ? d.items.filter(x => x !== id) : [...d.items, id];
    u[dayIdx] = d;
    return u;
  });

  const setTime = (dayIdx, time) => setBreakfastDays(prev => {
    const u = [...prev];
    u[dayIdx] = { ...(u[dayIdx] || {}), time };
    return u;
  });

  return (
    <div className="card">
      <StepIndicator current={3} total={5} />

      <div className="page-title" style={{ marginBottom: 6 }}>🚗 Place de parking</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 16 }}>Parking privé sécurisé — 20 €/nuit</p>

      {[true, false].map(val => (
        <div key={String(val)} className={`option-card ${parking.want === val ? "selected" : ""}`} onClick={() => setParking({ ...parking, want: val })}>
          <div className="radio-circle"><div className="radio-dot" /></div>
          <span className="option-card-icon">{val ? "✅" : "🚶"}</span>
          <div className="option-card-content">
            <div className="option-card-title">{val ? "Oui, je veux le parking" : "Non merci"}</div>
            <div className="option-card-desc">{val ? `${nights} nuit${nights > 1 ? "s" : ""} × 20 €` : "Je n'en ai pas besoin"}</div>
          </div>
          <div className="option-card-price" style={val ? {} : { color: COLORS.muted, fontSize: 14 }}>{val ? `${nights * 20} €` : "—"}</div>
        </div>
      ))}

      {parking.want === true && (
        <div style={{ marginBottom: 8 }}>
          <p className="section-label" style={{ marginTop: 4 }}>Paiement du parking</p>
          {[
            { id: "cash",   icon: "💵", title: "Cash sur place",    desc: "À la remise des clés" },
            { id: "paypal", icon: "💳", title: "PayPal en ligne",   desc: "Paiement sécurisé avant l'arrivée" },
          ].map(opt => (
            <div key={opt.id} className={`option-card ${parking.payment === opt.id ? "selected" : ""}`} style={{ padding: "14px 16px" }} onClick={() => setParking({ ...parking, payment: opt.id })}>
              <div className="radio-circle"><div className="radio-dot" /></div>
              <span className="option-card-icon">{opt.icon}</span>
              <div className="option-card-content">
                <div className="option-card-title">{opt.title}</div>
                <div className="option-card-desc">{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      <div className="page-title" style={{ marginBottom: 6 }}>☕ Petit-déjeuner</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 16 }}>Livré directement à votre porte, frais du matin</p>

      {Array.from({ length: nights }).map((_, i) => {
        const day = breakfastDays[i] || { active: false, items: [], time: "" };
        return (
          <div key={i} className="day-row">
            <div className="day-row-header">
              <div>
                <div className="day-label" style={{ textTransform: "capitalize" }}>{getDayLabel(i)}</div>
                <div className="day-date">Matin du jour {i + 1}</div>
              </div>
              <div className="breakfast-toggle" onClick={() => toggleDay(i)}>
                <div className={`toggle ${day.active ? "on" : ""}`} />
                <span className="toggle-label">{day.active ? "Oui" : "Non"}</span>
              </div>
            </div>
            {day.active && (
              <>
                <p className="section-label">Choisissez vos articles</p>
                <div className="menu-grid">
                  {BREAKFAST_MENU.map(item => (
                    <div key={item.id} className={`menu-item ${day.items.includes(item.id) ? "selected" : ""}`} onClick={() => toggleItem(i, item.id)}>
                      <span className="menu-item-emoji">{item.emoji}</span>
                      <div className="menu-item-info">
                        <div className="menu-item-name">{item.name}</div>
                        <div className="menu-item-price">{item.price} €</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <p className="section-label">Heure de livraison</p>
                  <div className="time-chips">
                    {DELIVERY_TIMES.map(t => (
                      <div key={t} className={`time-chip ${day.time === t ? "selected" : ""}`} onClick={() => setTime(i, t)}>{t}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button className="btn-primary" onClick={onNext} style={{ marginTop: 16 }}>Voir le récapitulatif →</button>
      <button className="btn-secondary" onClick={onBack}>← Retour</button>
    </div>
  );
}

// ─── STEP 4 — SUMMARY + PAYPAL ───────────────────────────────────────────

function SummaryPage({ guestName, guestEmail, travelers, count, nights, parking, breakfastDays, checkIn, checkOut, onConfirm, sending }) {
  const bfTotal = breakfastDays.reduce((sum, day) => {
    if (!day?.active) return sum;
    return sum + (day.items || []).reduce((s, id) => {
      const item = BREAKFAST_MENU.find(m => m.id === id);
      return s + (item ? item.price : 0);
    }, 0);
  }, 0);
  const parkingTotal = parking.want ? nights * 20 : 0;
  const onlineTotal = bfTotal + (parking.payment === "paypal" ? parkingTotal : 0);
  const cashTotal = parking.payment === "cash" && parking.want ? parkingTotal : 0;

  const paypalUrl = `https://www.paypal.com/paypalme/${CONFIG.PAYPAL_EMAIL.split("@")[0]}/${onlineTotal.toFixed(2)}EUR`;

  return (
    <div className="card">
      <StepIndicator current={4} total={5} />
      <div className="page-title" style={{ marginBottom: 4 }}>Récapitulatif</div>
      <p className="subtitle" style={{ textAlign: "left", marginBottom: 20 }}>Vérifiez avant de confirmer.</p>

      <div className="info-box">
        <span className="info-box-icon">📅</span>
        <div className="info-box-content">
          <p><strong>{checkIn} → {checkOut}</strong> · {nights} nuit{nights > 1 ? "s" : ""}</p>
          <p>{count} voyageur{count > 1 ? "s" : ""} : {travelers.slice(0, count).map(t => `${t?.firstName || ""} ${t?.lastName || ""}`).join(", ")}</p>
          <p>Email : {guestEmail}</p>
        </div>
      </div>

      <div className="summary-row">
        <span className="summary-label">🚗 Parking</span>
        <span className="summary-value">
          {parking.want
            ? <><span className="tag tag-terracotta">{nights} nuit{nights>1?"s":""} · {parkingTotal} €</span>{" "}<span style={{ fontSize: 12, color: COLORS.muted }}>({parking.payment === "cash" ? "cash" : "PayPal"})</span></>
            : <span style={{ color: COLORS.muted }}>Non</span>}
        </span>
      </div>

      {breakfastDays.map((day, i) => {
        if (!day?.active) return null;
        const items = (day.items || []).map(id => BREAKFAST_MENU.find(m => m.id === id)?.name).filter(Boolean);
        const dayTotal = (day.items || []).reduce((s, id) => {
          const item = BREAKFAST_MENU.find(m => m.id === id);
          return s + (item ? item.price : 0);
        }, 0);
        return (
          <div key={i} className="summary-row">
            <span className="summary-label">☕ Petit-déj J{i + 1}{day.time ? ` · ${day.time}` : ""}</span>
            <span className="summary-value" style={{ fontSize: 12 }}>
              {items.length ? items.join(", ") : "Sélectionné"}{dayTotal > 0 ? ` · ${dayTotal.toFixed(2)} €` : ""}
            </span>
          </div>
        );
      })}

      {onlineTotal > 0 && (
        <div className="summary-row" style={{ borderBottom: "none", paddingTop: 14 }}>
          <span className="summary-label" style={{ fontWeight: 500, color: COLORS.dark }}>Total en ligne (PayPal)</span>
          <span className="summary-value" style={{ color: COLORS.terracotta, fontFamily: "'Playfair Display', serif", fontSize: 20 }}>{onlineTotal.toFixed(2)} €</span>
        </div>
      )}
      {cashTotal > 0 && (
        <div className="highlight-box">
          <p>💵 Parking ({cashTotal} €) à régler en cash à la remise des clés.</p>
        </div>
      )}

      {sending ? (
        <div className="sending-overlay">
          <div className="spinner" />
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Envoi de vos confirmations…</p>
        </div>
      ) : (
        <>
          {onlineTotal > 0 ? (
            <>
              <div className="highlight-box" style={{ background: "#E8F0FC", marginTop: 8 }}>
                <p style={{ color: "#003087" }}>
                  💳 En cliquant sur "Payer & Confirmer", vous serez redirigé vers PayPal pour régler <strong>{onlineTotal.toFixed(2)} €</strong> en toute sécurité. Votre enregistrement sera confirmé simultanément.
                </p>
              </div>
              <button className="paypal-btn" onClick={() => { window.open(paypalUrl, "_blank"); onConfirm(bfTotal, parkingTotal, onlineTotal); }}>
                <span className="paypal-logo">PayPal</span>
                <span>Payer {onlineTotal.toFixed(2)} € & Confirmer</span>
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => onConfirm(bfTotal, parkingTotal, onlineTotal)} style={{ marginTop: 8 }}>
              ✓ Confirmer mon enregistrement
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── STEP 5 — CONFIRMED ───────────────────────────────────────────────────

function ConfirmedPage({ guestName, guestEmail, onlineTotal }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="success-icon">🎉</div>
      <h1 style={{ marginBottom: 12 }}>Tout est prêt, {guestName} !</h1>
      <p className="subtitle">
        Votre enregistrement est confirmé.<br />
        Un email de confirmation a été envoyé à <strong>{guestEmail}</strong>.
      </p>
      {onlineTotal > 0 && (
        <div className="info-box" style={{ background: "#E8F0FC", textAlign: "left" }}>
          <span className="info-box-icon">💳</span>
          <div className="info-box-content">
            <p style={{ color: "#003087" }}>
              <strong style={{ color: COLORS.dark }}>Paiement PayPal</strong>
            </p>
            <p style={{ color: "#003087" }}>Si ce n'est pas encore fait, finalisez votre paiement de <strong>{onlineTotal.toFixed(2)} €</strong> via le lien PayPal.</p>
          </div>
        </div>
      )}
      <div className="info-box" style={{ textAlign: "left", marginBottom: 12 }}>
        <span className="info-box-icon">📱</span>
        <div className="info-box-content">
          <p><strong>Prochaine étape</strong></p>
          <p>Vous recevrez les <strong>instructions d'accès</strong> et le code de la boîte à clés par SMS le jour de votre arrivée.</p>
        </div>
      </div>
      <div className="info-box" style={{ background: COLORS.oliveLight, textAlign: "left" }}>
        <span className="info-box-icon">💬</span>
        <div className="info-box-content">
          <p style={{ color: COLORS.olive }}><strong style={{ color: COLORS.dark }}>Une question ?</strong></p>
          <p style={{ color: COLORS.olive }}>WhatsApp {CONFIG.WHATSAPP} — disponible 7j/7</p>
        </div>
      </div>
      <p style={{ fontSize: 28, margin: "20px 0 8px" }}>🌊 ☀️ 🏖️</p>
      <p style={{ fontSize: 14, color: COLORS.muted, fontWeight: 300 }}>{CONFIG.PROPERTY_NAME} · {CONFIG.CITY}</p>
    </div>
  );
}

// ─── EMAIL SENDER (mailto fallback) ───────────────────────────────────────

function sendEmailsViaMailto(hostEmail, guestEmail) {
  const encode = s => encodeURIComponent(s);
  const hostLink = `mailto:${hostEmail.to}?subject=${encode(hostEmail.subject)}&body=${encode(hostEmail.body)}`;
  window.open(hostLink, "_blank");
  setTimeout(() => {
    const guestLink = `mailto:${guestEmail.to}?subject=${encode(guestEmail.subject)}&body=${encode(guestEmail.body)}`;
    window.open(guestLink, "_blank");
  }, 800);
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep]               = useState(0);
  const [guestName]                   = useState("Sophie");
  const [checkIn]                     = useState("14/06/2025");
  const [checkOut]                    = useState("17/06/2025");
  const [nights]                      = useState(3);
  const [travelerCount, setTravelerCount] = useState(2);
  const [travelers, setTravelers]     = useState([]);
  const [guestEmail, setGuestEmail]   = useState("");
  const [parking, setParking]         = useState({ want: null, payment: "" });
  const [breakfastDays, setBreakfastDays] = useState([]);
  const [sending, setSending]         = useState(false);
  const [finalTotals, setFinalTotals] = useState({ bf: 0, parking: 0, online: 0 });

  useEffect(() => {
    setBreakfastDays(Array.from({ length: nights }, (_, i) =>
      breakfastDays[i] || { active: false, items: [], time: "" }
    ));
  }, [nights]);

  const handleConfirm = (bfTotal, parkingTotal, onlineTotal) => {
    setSending(true);
    setFinalTotals({ bf: bfTotal, parking: parkingTotal, online: onlineTotal });

    const hostMail = buildHostEmail({ guestName, guestEmail, checkIn, checkOut, nights, travelers, count: travelerCount, parking, breakfastDays });
    const clientMail = buildGuestEmail({ guestName, guestEmail, checkIn, checkOut, nights, parking, breakfastDays, bfTotal, parkingTotal, onlineTotal });

    setTimeout(() => {
      sendEmailsViaMailto(hostMail, clientMail);
      setSending(false);
      setStep(5);
    }, 1200);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <Logo />
        {step === 0 && <WelcomePage guestName={guestName} checkIn={checkIn} checkOut={checkOut} nights={nights} onNext={() => setStep(1)} />}
        {step === 1 && <TravelersPage count={travelerCount} onChange={setTravelerCount} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <GuestInfoPage count={travelerCount} travelers={travelers} onChange={setTravelers} guestEmail={guestEmail} setGuestEmail={setGuestEmail} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <ExtrasPage parking={parking} setParking={setParking} breakfastDays={breakfastDays} setBreakfastDays={setBreakfastDays} nights={nights} checkIn={checkIn} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <SummaryPage guestName={guestName} guestEmail={guestEmail} travelers={travelers} count={travelerCount} nights={nights} parking={parking} breakfastDays={breakfastDays} checkIn={checkIn} checkOut={checkOut} onConfirm={handleConfirm} sending={sending} />}
        {step === 5 && <ConfirmedPage guestName={guestName} guestEmail={guestEmail} onlineTotal={finalTotals.online} />}
      </div>
    </>
  );
}
