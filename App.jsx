import { useState, useEffect } from "react";

const CONFIG = {
  PAYPAL_EMAIL: "VOTRE_EMAIL_PAYPAL@example.com",
  HOST_EMAIL:   "VOTRE_EMAIL@example.com",
  PROPERTY_NAME: "Sunny Terrace",
  CITY: "Nice",
  WHATSAPP: "+33600000000",
};

const COLORS = {
  sand: "#F5EFE0", cream: "#FDFAF4",
  terracotta: "#C4623A", terracottaLight: "#F0D5C8", terracottaDark: "#9A3E1F",
  olive: "#6B7C4A", oliveLight: "#E8EDDE",
  sky: "#4A7FA5", skyLight: "#D6E8F5",
  dark: "#2C2416", muted: "#7A7060", white: "#FFFFFF", border: "#E8E0D0",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    welcome: (name) => `Bienvenue, ${name} !`,
    welcomeSub: `Nous sommes ravis de vous accueillir à ${CONFIG.CITY}.\nVotre check-in prend 3 minutes, promis ✨`,
    yourStay: "Votre séjour",
    stayDates: (ci, co, n) => `Du ${ci} au ${co} — ${n} nuit${n>1?"s":""}`,
    propertyDesc: `Appartement moderne avec terrasse ensoleillée, ${CONFIG.CITY}`,
    startCheckin: "Commencer l'enregistrement →",
    confirmGroup: "Confirmez votre groupe",
    howMany: "Combien de personnes séjournent avec vous ?",
    travelers: (n) => `${n} voyageur${n>1?"s":""}`,
    regulationNote: "Nous avons besoin d'enregistrer chaque voyageur conformément à la réglementation française.",
    continueWith: (n) => `Continuer avec ${n} voyageur${n>1?"s":""} →`,
    back: "← Retour",
    travelerInfo: "Informations voyageurs",
    travelerSub: (n) => n===1 ? "Renseignez vos informations." : `Renseignez les ${n} voyageurs.`,
    confirmEmail: "Email de confirmation",
    yourEmail: "Votre email",
    mainTraveler: "Voyageur principal",
    travelerN: (n) => `Voyageur ${n}`,
    firstName: "Prénom", lastName: "Nom", nationality: "Nationalité",
    selectNat: "Sélectionner...",
    arrivalTime: "Heure d'arrivée estimée",
    arrivalNote: "La remise des clés se fait en main propre — indiquez-nous approximativement à quelle heure vous prévoyez d'arriver.",
    arrivalSlots: ["Avant 12h","12h–14h","14h–16h","16h–18h","18h–20h","Après 20h"],
    departureTime: "Heure de départ prévue",
    departureNote: "Le départ se fait au plus tard à 11h00. La remise des clés se fait en main propre — à quelle heure prévoyez-vous de partir ?",
    departureSlots: ["Avant 8h","8h–9h","9h–10h","10h–11h","11h00 (max)"],
    parking: "Place de parking",
    parkingSub: "Parking privé sécurisé — 20 €/nuit",
    wantParking: "Oui, je veux le parking",
    noParking: "Non merci",
    noParkingDesc: "Je n'en ai pas besoin",
    parkingPayment: "Paiement du parking",
    cashOnsite: "Cash sur place", cashDesc: "À la remise des clés",
    paypalOnline: "PayPal en ligne", paypalDesc: "Paiement sécurisé avant l'arrivée",
    breakfast: "Petit-déjeuner",
    breakfastSub: "Livré directement à votre porte, frais du matin",
    dayN: (n) => `Matin du jour ${n}`,
    chooseItems: "Choisissez vos articles",
    perUnit: "/ unité",
    deliveryTime: "Heure de livraison",
    yes: "Oui", no: "Non",
    seeRecap: "Voir le récapitulatif →",
    recap: "Récapitulatif",
    recapSub: "Vérifiez avant de confirmer.",
    parkingLabel: "🚗 Parking",
    bfLabel: (n, t) => `☕ Petit-déj J${n}${t?" · "+t:""}`,
    paymentRecap: "Récapitulatif des paiements",
    bfItems: "Petit-déjeuners",
    parkingN: (n) => `Parking (${n} nuit${n>1?"s":""})`,
    totalPaypal: "💳 Total PayPal",
    cashOnPlace: "💵 Cash sur place",
    securePay: "Paiement sécurisé",
    payTo: (amt) => `Réglez ${amt} directement à Conciergerie Daddio`,
    payBtn: (amt) => `Payer ${amt} via PayPal`,
    paypalRedirect: "Vous serez redirigé vers PayPal — 100% sécurisé",
    cashNote: (amt) => `💵 Parking (${amt} €) à régler en espèces à la remise des clés.`,
    sending: "Envoi de vos confirmations…",
    confirm: "✓ Confirmer mon enregistrement",
    allReady: (name) => `Tout est prêt, ${name} !`,
    confirmedSub: (email) => `Votre enregistrement est confirmé.\nUn email de confirmation a été envoyé à ${email}.`,
    paypalPending: "Paiement PayPal",
    paypalPendingDesc: (amt) => `Si ce n'est pas encore fait, finalisez votre paiement de ${amt} via PayPal.`,
    nextStep: "Prochaine étape",
    nextStepDesc: "Vous recevrez les instructions d'accès par SMS le jour de votre arrivée.",
    question: "Une question ?",
    questionDesc: `WhatsApp ${CONFIG.WHATSAPP} — disponible 7j/7`,
    arrivalPrev: (t) => `🕐 Arrivée prévue : ${t}`,
    departurePrev: (t) => `🚪 Départ prévu : ${t}`,
    emailLabel: "Email :",
    nights: (n) => `${n} nuit${n>1?"s":""}`,
    langBtn: "🇬🇧 English",
    nationalities: [
      ["FR","🇫🇷 Française"],["BE","🇧🇪 Belge"],["CH","🇨🇭 Suisse"],["DE","🇩🇪 Allemande"],
      ["IT","🇮🇹 Italienne"],["ES","🇪🇸 Espagnole"],["GB","🇬🇧 Britannique"],["US","🇺🇸 Américaine"],["OTHER","🌍 Autre"],
    ],
    bfMenu: [
      { id:"pancakes", emoji:"🥞", name:"Pancakes maison",      desc:"Sirop d'érable, fruits frais" },
      { id:"toast",    emoji:"🍳", name:"Toast & œufs",         desc:"Pain au levain, œufs bio" },
      { id:"avocado",  emoji:"🥑", name:"Toast avocat",         desc:"Avocat, graines, citron" },
      { id:"croissant",emoji:"🥐", name:"Viennoiseries",        desc:"Croissant, pain au choc, confiture" },
      { id:"smoothie", emoji:"🍹", name:"Smoothie bowl",        desc:"Mangue, banane, chia" },
      { id:"full",     emoji:"🍽️", name:"Formule complète",    desc:"Salé + sucré + boisson" },
      { id:"coffee",   emoji:"☕", name:"Café",                  desc:"Expresso ou allongé" },
      { id:"oj",       emoji:"🍊", name:"Jus d'orange frais",   desc:"Pressé à la commande" },
    ],
  },
  en: {
    welcome: (name) => `Welcome, ${name}!`,
    welcomeSub: `We're delighted to welcome you to ${CONFIG.CITY}.\nCheck-in takes just 3 minutes ✨`,
    yourStay: "Your stay",
    stayDates: (ci, co, n) => `From ${ci} to ${co} — ${n} night${n>1?"s":""}`,
    propertyDesc: `Modern apartment with sunny terrace, ${CONFIG.CITY}`,
    startCheckin: "Start check-in →",
    confirmGroup: "Confirm your group",
    howMany: "How many people are staying with you?",
    travelers: (n) => `${n} guest${n>1?"s":""}`,
    regulationNote: "We need to register every guest in accordance with French regulations.",
    continueWith: (n) => `Continue with ${n} guest${n>1?"s":""} →`,
    back: "← Back",
    travelerInfo: "Guest information",
    travelerSub: (n) => n===1 ? "Please fill in your details." : `Please fill in details for all ${n} guests.`,
    confirmEmail: "Confirmation email",
    yourEmail: "Your email",
    mainTraveler: "Main guest",
    travelerN: (n) => `Guest ${n}`,
    firstName: "First name", lastName: "Last name", nationality: "Nationality",
    selectNat: "Select...",
    arrivalTime: "Estimated arrival time",
    arrivalNote: "Keys are handed over in person — please let us know approximately when you plan to arrive.",
    arrivalSlots: ["Before 12pm","12pm–2pm","2pm–4pm","4pm–6pm","6pm–8pm","After 8pm"],
    departureTime: "Planned departure time",
    departureNote: "Check-out is no later than 11:00 AM. Keys are returned in person — when do you plan to leave?",
    departureSlots: ["Before 8am","8–9am","9–10am","10–11am","11:00 AM (max)"],
    parking: "Parking spot",
    parkingSub: "Private secure parking — €20/night",
    wantParking: "Yes, I want the parking spot",
    noParking: "No thanks",
    noParkingDesc: "I don't need it",
    parkingPayment: "Parking payment",
    cashOnsite: "Cash on arrival", cashDesc: "At key handover",
    paypalOnline: "PayPal online", paypalDesc: "Secure payment before arrival",
    breakfast: "Breakfast",
    breakfastSub: "Delivered fresh to your door every morning",
    dayN: (n) => `Morning of day ${n}`,
    chooseItems: "Choose your items",
    perUnit: "/ item",
    deliveryTime: "Delivery time",
    yes: "Yes", no: "No",
    seeRecap: "See summary →",
    recap: "Summary",
    recapSub: "Review before confirming.",
    parkingLabel: "🚗 Parking",
    bfLabel: (n, t) => `☕ Breakfast D${n}${t?" · "+t:""}`,
    paymentRecap: "Payment summary",
    bfItems: "Breakfasts",
    parkingN: (n) => `Parking (${n} night${n>1?"s":""})`,
    totalPaypal: "💳 Total PayPal",
    cashOnPlace: "💵 Cash on arrival",
    securePay: "Secure payment",
    payTo: (amt) => `Pay ${amt} directly to Conciergerie Daddio`,
    payBtn: (amt) => `Pay ${amt} via PayPal`,
    paypalRedirect: "You'll be redirected to PayPal — 100% secure",
    cashNote: (amt) => `💵 Parking (€${amt}) to be paid in cash at key handover.`,
    sending: "Sending your confirmations…",
    confirm: "✓ Confirm check-in",
    allReady: (name) => `All set, ${name}!`,
    confirmedSub: (email) => `Your check-in is confirmed.\nA confirmation email has been sent to ${email}.`,
    paypalPending: "PayPal payment",
    paypalPendingDesc: (amt) => `If you haven't done so yet, please complete your payment of ${amt} via PayPal.`,
    nextStep: "Next step",
    nextStepDesc: "You'll receive access instructions by SMS on the day of your arrival.",
    question: "Any questions?",
    questionDesc: `WhatsApp ${CONFIG.WHATSAPP} — available 7 days a week`,
    arrivalPrev: (t) => `🕐 Estimated arrival: ${t}`,
    departurePrev: (t) => `🚪 Planned departure: ${t}`,
    emailLabel: "Email:",
    nights: (n) => `${n} night${n>1?"s":""}`,
    langBtn: "🇫🇷 Français",
    nationalities: [
      ["FR","🇫🇷 French"],["BE","🇧🇪 Belgian"],["CH","🇨🇭 Swiss"],["DE","🇩🇪 German"],
      ["IT","🇮🇹 Italian"],["ES","🇪🇸 Spanish"],["GB","🇬🇧 British"],["US","🇺🇸 American"],["OTHER","🌍 Other"],
    ],
    bfMenu: [
      { id:"pancakes", emoji:"🥞", name:"Homemade pancakes",    desc:"Maple syrup, fresh fruit" },
      { id:"toast",    emoji:"🍳", name:"Toast & eggs",         desc:"Sourdough, organic eggs" },
      { id:"avocado",  emoji:"🥑", name:"Avocado toast",        desc:"Avocado, seeds, lemon" },
      { id:"croissant",emoji:"🥐", name:"Pastry basket",        desc:"Croissant, pain au choc, jam" },
      { id:"smoothie", emoji:"🍹", name:"Smoothie bowl",        desc:"Mango, banana, chia" },
      { id:"full",     emoji:"🍽️", name:"Full breakfast",      desc:"Savoury + sweet + drink" },
      { id:"coffee",   emoji:"☕", name:"Coffee",               desc:"Espresso or Americano" },
      { id:"oj",       emoji:"🍊", name:"Fresh orange juice",   desc:"Freshly squeezed" },
    ],
  },
};

// prices stay the same regardless of language
const PRICES = { pancakes:9, toast:8, avocado:8.5, croissant:7, smoothie:9.5, full:14, coffee:3, oj:4 };

const DELIVERY_TIMES = ["7h00","7h30","8h00","8h30","9h00","9h30","10h00"];

// ─── EMAIL HELPERS ────────────────────────────────────────────────────────────
function buildHostEmail({ guestName, guestEmail, checkIn, checkOut, nights, travelers, count, parking, breakfastDays, arrivalTime, departureTime }) {
  const bfLines = breakfastDays.map((day, i) => {
    if (!day?.active) return null;
    const entries = Object.entries(day.qty || {}).filter(([,q]) => q > 0);
    if (!entries.length) return null;
    const items = entries.map(([id, q]) => `${id} ×${q}`).join(", ");
    return `  Jour ${i+1} : ${items} · Livraison ${day.time||"—"}`;
  }).filter(Boolean).join("\n");

  const bfTotal = breakfastDays.reduce((sum, day) => {
    if (!day?.active) return sum;
    return sum + Object.entries(day.qty || {}).reduce((s, [id, q]) => s + (PRICES[id]||0)*q, 0);
  }, 0);

  const parkingTotal = parking.want ? nights * 20 : 0;
  const onlineTotal  = bfTotal + (parking.payment === "paypal" ? parkingTotal : 0);
  const travelersStr = travelers.slice(0, count).map((t,i) =>
    `  ${i===0?"Principal":"Voyageur "+(i+1)} : ${t?.firstName||""} ${t?.lastName||""} (${t?.nationality||""})`
  ).join("\n");

  return {
    to: CONFIG.HOST_EMAIL,
    subject: `✅ Enregistrement — ${guestName} · arrivée ${checkIn}`,
    body: `RÉCAP ENREGISTREMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCLIENT  : ${guestName}\nEmail   : ${guestEmail}\nSéjour  : ${checkIn} → ${checkOut} (${nights} nuit${nights>1?"s":""})\nArrivée : ${arrivalTime||"Non précisée"}\nDépart  : ${departureTime||"Non précisé"}\nVoyageurs (${count}) :\n${travelersStr}\n\n━━ SERVICES ━━━━━━━━━━━━━━\n\nParking : ${parking.want ? `OUI · ${parkingTotal}€ · ${parking.payment==="cash"?"cash":"PayPal"}` : "NON"}\n\nPetit-déjeuners :\n${bfLines||"  Aucun"}\n\n━━ TOTAUX ━━━━━━━━━━━━━━━━\n\nPetit-déjeuners : ${bfTotal.toFixed(2)}€\nParking PayPal  : ${parking.payment==="paypal"?parkingTotal+"€":"0€ (cash)"}\nTOTAL EN LIGNE  : ${onlineTotal.toFixed(2)}€\nCash sur place  : ${parking.payment==="cash"?parkingTotal+"€":"0€"}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━`,
  };
}

function buildGuestEmail({ guestName, guestEmail, checkIn, checkOut, nights, parking, breakfastDays, bfTotal, parkingTotal, onlineTotal, arrivalTime, departureTime, lang }) {
  const t = T[lang||"fr"];
  const bfLines = breakfastDays.map((day, i) => {
    if (!day?.active) return null;
    const entries = Object.entries(day.qty || {}).filter(([,q]) => q > 0);
    if (!entries.length) return null;
    const menu = t.bfMenu;
    const items = entries.map(([id, q]) => { const m=menu.find(x=>x.id===id); return `${m?.name||id} ×${q}`; }).join(", ");
    return `  • ${t.dayN(i+1)} : ${items} — ${day.time||"—"}`;
  }).filter(Boolean).join("\n");

  return {
    to: guestEmail,
    subject: lang==="en"
      ? `Your stay at ${CONFIG.PROPERTY_NAME} — Check-in confirmed ✨`
      : `Votre séjour au ${CONFIG.PROPERTY_NAME} — Confirmation ✨`,
    body: (lang==="en"
      ? `Hello ${guestName},\n\nYour check-in is confirmed for your stay at ${CONFIG.PROPERTY_NAME} in ${CONFIG.CITY}!\n\n━━ YOUR STAY ━━━━━━━━━━━━━━\n\n📅 Arrival  : ${checkIn}${arrivalTime?` · around ${arrivalTime}`:""}\n📅 Departure: ${checkOut}${departureTime?` · around ${departureTime}`:" · before 11:00 AM"}\n🌙 Duration : ${nights} night${nights>1?"s":""}\n\n━━ YOUR OPTIONS ━━━━━━━━━━━${parking.want?`\n\n🚗 Parking: ${nights} night${nights>1?"s":""} · €${parkingTotal}\n   Payment: ${parking.payment==="cash"?"cash at key handover":"via PayPal"}`:""}\n${bfLines?`\n☕ Breakfasts:\n${bfLines}`:""}\n${onlineTotal>0?`\n💳 Total to pay online: €${onlineTotal.toFixed(2)}`:""}${parking.payment==="cash"&&parking.want?`\n💵 Cash on arrival: €${parkingTotal}`:""}\n\n━━ NEXT STEPS ━━━━━━━━━━━━━\n\n🤝 Key handover is in person.${arrivalTime?`\n   We'll be ready to welcome you around ${arrivalTime}.`:"\n   We'll contact you to confirm the meeting time."}\n\n💬 Questions? WhatsApp: ${CONFIG.WHATSAPP}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSee you soon in ${CONFIG.CITY}!\nThe ${CONFIG.PROPERTY_NAME} team`
      : `Bonjour ${guestName},\n\nVotre enregistrement est confirmé pour votre séjour au ${CONFIG.PROPERTY_NAME} à ${CONFIG.CITY} !\n\n━━ VOTRE SÉJOUR ━━━━━━━━━━\n\n📅 Arrivée  : ${checkIn}${arrivalTime?` · vers ${arrivalTime}`:""}\n📅 Départ   : ${checkOut}${departureTime?` · vers ${departureTime}`:" · avant 11h00"}\n🌙 Durée    : ${nights} nuit${nights>1?"s":""}\n\n━━ VOS OPTIONS ━━━━━━━━━━━${parking.want?`\n\n🚗 Parking : ${nights} nuit${nights>1?"s":""} · ${parkingTotal}€\n   Paiement : ${parking.payment==="cash"?"cash à la remise des clés":"via PayPal"}`:""}\n${bfLines?`\n☕ Petits-déjeuners :\n${bfLines}`:""}\n${onlineTotal>0?`\n💳 Total en ligne : ${onlineTotal.toFixed(2)}€`:""}\n${parking.payment==="cash"&&parking.want?`💵 Cash sur place : ${parkingTotal}€`:""}\n\n━━ REMISE DES CLÉS ━━━━━━━\n\n🤝 La remise des clés se fait en main propre.${arrivalTime?`\n   Nous serons prêts vers ${arrivalTime}.`:"\n   Nous vous contacterons pour confirmer."}\n\n💬 WhatsApp : ${CONFIG.WHATSAPP}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nÀ très bientôt à ${CONFIG.CITY} !\nL'équipe ${CONFIG.PROPERTY_NAME}`)
  };
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.sand}; font-family: 'DM Sans', sans-serif; color: ${COLORS.dark}; min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 0 16px 60px; }
  .header { width: 100%; max-width: 560px; display: flex; align-items: center; justify-content: space-between; padding: 28px 0 20px; }
  .header-logo { display: flex; align-items: center; gap: 12px; }
  .logo-mark { width: 40px; height: 40px; background: ${COLORS.terracotta}; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .logo-inner { width: 22px; height: 22px; border: 2.5px solid white; border-radius: 5px; position: relative; }
  .logo-inner::after { content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; border-right: 2.5px solid white; border-bottom: 2.5px solid white; border-radius: 0 0 2px 0; }
  .logo-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 500; color: ${COLORS.dark}; letter-spacing: -0.3px; }
  .logo-text span { color: ${COLORS.terracotta}; }
  .lang-btn { padding: 7px 14px; border-radius: 20px; border: 1.5px solid ${COLORS.border}; background: white; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; color: ${COLORS.dark}; transition: all 0.2s; white-space: nowrap; }
  .lang-btn:hover { border-color: ${COLORS.terracotta}; background: ${COLORS.terracottaLight}; }
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
  .time-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .time-chip { padding: 6px 12px; border-radius: 20px; border: 1px solid ${COLORS.border}; font-size: 13px; cursor: pointer; transition: all 0.2s; background: white; color: ${COLORS.dark}; font-weight: 400; }
  .time-chip:hover { border-color: ${COLORS.terracotta}; }
  .time-chip.selected { background: ${COLORS.terracotta}; border-color: ${COLORS.terracotta}; color: white; }
  .success-icon { width: 72px; height: 72px; background: ${COLORS.oliveLight}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 24px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${COLORS.border}; }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 14px; color: ${COLORS.muted}; font-weight: 300; }
  .summary-value { font-size: 14px; font-weight: 500; color: ${COLORS.dark}; text-align: right; max-width: 220px; }
  .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .tag-terracotta { background: ${COLORS.terracottaLight}; color: ${COLORS.terracottaDark}; }
  .divider { height: 1px; background: ${COLORS.border}; margin: 20px 0; }
  .highlight-box { background: ${COLORS.skyLight}; border-radius: 12px; padding: 16px 18px; margin: 16px 0; }
  .highlight-box p { font-size: 14px; color: ${COLORS.sky}; line-height: 1.6; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: ${COLORS.dark}; margin-bottom: 6px; }
  .sending-overlay { text-align: center; padding: 20px 0; }
  .spinner { width: 40px; height: 40px; border: 3px solid ${COLORS.border}; border-top-color: ${COLORS.terracotta}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── SHARED ───────────────────────────────────────────────────────────────────
function Logo({ lang, setLang, t }) {
  return (
    <div className="header">
      <div className="header-logo">
        <div className="logo-mark"><div className="logo-inner" /></div>
        <div className="logo-text">Sunny<span>Terrace</span></div>
      </div>
      <button className="lang-btn" onClick={() => setLang(lang === "fr" ? "en" : "fr")}>{t.langBtn}</button>
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

function SlotPicker({ slots, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {slots.map(slot => (
        <div key={slot} onClick={() => onChange(slot)} style={{
          padding: "9px 16px", borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
          border: `1.5px solid ${value === slot ? COLORS.terracotta : COLORS.border}`,
          background: value === slot ? COLORS.terracottaLight : "white",
          fontSize: 14,
          color: value === slot ? COLORS.terracottaDark : COLORS.dark,
          fontWeight: value === slot ? 500 : 400,
        }}>{slot}</div>
      ))}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function WelcomePage({ guestName, checkIn, checkOut, nights, onNext, t }) {
  return (
    <div className="card">
      <StepIndicator current={0} total={5} />
      <span className="welcome-emoji">☀️</span>
      <h1><span className="name">{t.welcome(guestName)}</span></h1>
      <p className="subtitle">{t.welcomeSub.split("\n").map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</p>
      <div className="info-box">
        <span className="info-box-icon">📅</span>
        <div className="info-box-content">
          <p><strong>{t.yourStay}</strong></p>
          <p>{t.stayDates(checkIn, checkOut, nights)}</p>
        </div>
      </div>
      <div className="info-box" style={{ background: COLORS.skyLight }}>
        <span className="info-box-icon">🏡</span>
        <div className="info-box-content">
          <p style={{ color: COLORS.sky }}><strong style={{ color: COLORS.dark }}>{CONFIG.PROPERTY_NAME}</strong></p>
          <p style={{ color: COLORS.sky }}>{t.propertyDesc}</p>
        </div>
      </div>
      <button className="btn-primary" onClick={onNext}>{t.startCheckin}</button>
    </div>
  );
}

function TravelersPage({ count, onChange, onNext, onBack, t }) {
  return (
    <div className="card">
      <StepIndicator current={1} total={5} />
      <div className="page-title">{t.confirmGroup}</div>
      <p className="subtitle" style={{ textAlign: "left" }}>{t.howMany}</p>
      <div className="traveler-counter">
        <div className="counter-label">
          <span>👥</span>
          <div className="counter-label-text">{t.travelers(count)}</div>
        </div>
        <div className="counter-controls">
          <button className="counter-btn" onClick={() => onChange(count-1)} disabled={count<=1}>−</button>
          <span className="counter-value">{count}</span>
          <button className="counter-btn" onClick={() => onChange(count+1)} disabled={count>=8}>+</button>
        </div>
      </div>
      <div className="info-box">
        <span className="info-box-icon">ℹ️</span>
        <div className="info-box-content"><p>{t.regulationNote}</p></div>
      </div>
      <button className="btn-primary" onClick={onNext}>{t.continueWith(count)}</button>
      <button className="btn-secondary" onClick={onBack}>{t.back}</button>
    </div>
  );
}

function GuestInfoPage({ count, travelers, onChange, guestEmail, setGuestEmail, arrivalTime, setArrivalTime, departureTime, setDepartureTime, onNext, onBack, t }) {
  const handleChange = (idx, field, val) => {
    const updated = [...travelers];
    if (!updated[idx]) updated[idx] = {};
    updated[idx][field] = val;
    onChange(updated);
  };
  const isComplete = () => {
    if (!guestEmail?.includes("@")) return false;
    for (let i=0; i<count; i++) {
      const tr = travelers[i]||{};
      if (!tr.firstName||!tr.lastName||!tr.nationality) return false;
    }
    return true;
  };
  return (
    <div className="card">
      <StepIndicator current={2} total={5} />
      <div className="page-title">{t.travelerInfo}</div>
      <p className="subtitle" style={{ textAlign:"left", marginBottom:20 }}>{t.travelerSub(count)}</p>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">📧</div>
          <div className="traveler-card-title">{t.confirmEmail}</div>
        </div>
        <div className="form-group">
          <label>{t.yourEmail}</label>
          <input type="email" placeholder="sophie@email.com" value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} />
        </div>
      </div>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">🕐</div>
          <div className="traveler-card-title">{t.arrivalTime}</div>
        </div>
        <p style={{ fontSize:13, color:COLORS.muted, marginBottom:14, fontWeight:300, lineHeight:1.5 }}>{t.arrivalNote}</p>
        <SlotPicker slots={t.arrivalSlots} value={arrivalTime} onChange={setArrivalTime} />
      </div>

      <div className="traveler-card">
        <div className="traveler-card-header">
          <div className="traveler-avatar">🚪</div>
          <div className="traveler-card-title">{t.departureTime}</div>
        </div>
        <p style={{ fontSize:13, color:COLORS.muted, marginBottom:14, fontWeight:300, lineHeight:1.5 }}>{t.departureNote}</p>
        <SlotPicker slots={t.departureSlots} value={departureTime} onChange={v => {
          const isLast = v === t.departureSlots[t.departureSlots.length-1];
          setDepartureTime(v);
        }} />
      </div>

      {Array.from({ length: count }).map((_, i) => {
        const tr = travelers[i]||{};
        return (
          <div key={i} className="traveler-card">
            <div className="traveler-card-header">
              <div className="traveler-avatar">{i===0?"🧑":"👤"}</div>
              <div className="traveler-card-title">{i===0?t.mainTraveler:t.travelerN(i+1)}</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t.firstName}</label>
                <input type="text" placeholder="Marie" value={tr.firstName||""} onChange={e=>handleChange(i,"firstName",e.target.value)} />
              </div>
              <div className="form-group">
                <label>{t.lastName}</label>
                <input type="text" placeholder="Dupont" value={tr.lastName||""} onChange={e=>handleChange(i,"lastName",e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>{t.nationality}</label>
              <select value={tr.nationality||""} onChange={e=>handleChange(i,"nationality",e.target.value)}>
                <option value="">{t.selectNat}</option>
                {t.nationalities.map(([code,label])=><option key={code} value={code}>{label}</option>)}
              </select>
            </div>
          </div>
        );
      })}

      <button className="btn-primary" onClick={onNext} disabled={!isComplete()}>{t.continueWith(count)}</button>
      <button className="btn-secondary" onClick={onBack}>{t.back}</button>
    </div>
  );
}

function ExtrasPage({ parking, setParking, breakfastDays, setBreakfastDays, nights, checkIn, onNext, onBack, t }) {
  const getDayLabel = (offset) => {
    const parts = checkIn.split("/");
    const date = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
    date.setDate(date.getDate()+offset);
    return date.toLocaleDateString(t === T.en ? "en-GB" : "fr-FR", { weekday:"long", day:"numeric", month:"long" });
  };

  const toggleDay = (i) => setBreakfastDays(prev => {
    const u=[...prev]; u[i]={...(u[i]||{qty:{},time:""}),active:!u[i]?.active}; return u;
  });

  const changeQty = (dayIdx, id, delta) => setBreakfastDays(prev => {
    const u=[...prev];
    const d={...(u[dayIdx]||{active:true,qty:{},time:""})};
    const cur=d.qty?.[id]||0;
    d.qty={...d.qty,[id]:Math.max(0,cur+delta)};
    u[dayIdx]=d; return u;
  });

  const setTime = (dayIdx, time) => setBreakfastDays(prev => {
    const u=[...prev]; u[dayIdx]={...(u[dayIdx]||{}),time}; return u;
  });

  return (
    <div className="card">
      <StepIndicator current={3} total={5} />
      <div className="page-title" style={{ marginBottom:6 }}>🚗 {t.parking}</div>
      <p className="subtitle" style={{ textAlign:"left", marginBottom:16 }}>{t.parkingSub}</p>

      {[true,false].map(val=>(
        <div key={String(val)} className={`option-card ${parking.want===val?"selected":""}`} onClick={()=>setParking({...parking,want:val})}>
          <div className="radio-circle"><div className="radio-dot"/></div>
          <span className="option-card-icon">{val?"✅":"🚶"}</span>
          <div className="option-card-content">
            <div className="option-card-title">{val?t.wantParking:t.noParking}</div>
            <div className="option-card-desc">{val?`${nights} × 20 €`:t.noParkingDesc}</div>
          </div>
          <div className="option-card-price" style={val?{}:{color:COLORS.muted,fontSize:14}}>{val?`${nights*20} €`:"—"}</div>
        </div>
      ))}

      {parking.want===true && (
        <div style={{ marginBottom:8 }}>
          <p className="section-label" style={{ marginTop:4 }}>{t.parkingPayment}</p>
          {[{id:"cash",icon:"💵",title:t.cashOnsite,desc:t.cashDesc},{id:"paypal",icon:"💳",title:t.paypalOnline,desc:t.paypalDesc}].map(opt=>(
            <div key={opt.id} className={`option-card ${parking.payment===opt.id?"selected":""}`} style={{padding:"14px 16px"}} onClick={()=>setParking({...parking,payment:opt.id})}>
              <div className="radio-circle"><div className="radio-dot"/></div>
              <span className="option-card-icon">{opt.icon}</span>
              <div className="option-card-content">
                <div className="option-card-title">{opt.title}</div>
                <div className="option-card-desc">{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="divider"/>
      <div className="page-title" style={{ marginBottom:6 }}>☕ {t.breakfast}</div>
      <p className="subtitle" style={{ textAlign:"left", marginBottom:16 }}>{t.breakfastSub}</p>

      {Array.from({ length: nights }).map((_,i) => {
        const day = breakfastDays[i]||{active:false,qty:{},time:""};
        return (
          <div key={i} className="day-row">
            <div className="day-row-header">
              <div>
                <div className="day-label" style={{ textTransform:"capitalize" }}>{getDayLabel(i)}</div>
                <div className="day-date">{t.dayN(i+1)}</div>
              </div>
              <div className="breakfast-toggle" onClick={()=>toggleDay(i)}>
                <div className={`toggle ${day.active?"on":""}`}/>
                <span className="toggle-label">{day.active?t.yes:t.no}</span>
              </div>
            </div>
            {day.active && (
              <>
                <p className="section-label">{t.chooseItems}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {t.bfMenu.map(item => {
                    const qty=day.qty?.[item.id]||0;
                    const price=PRICES[item.id]||0;
                    return (
                      <div key={item.id} style={{
                        display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
                        borderRadius:12, transition:"all 0.15s",
                        border:`1.5px solid ${qty>0?COLORS.terracotta:COLORS.border}`,
                        background:qty>0?COLORS.terracottaLight:"white",
                      }}>
                        <span style={{ fontSize:20, flexShrink:0 }}>{item.emoji}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:500, color:COLORS.dark }}>{item.name}</div>
                          <div style={{ fontSize:11, color:COLORS.terracotta, fontWeight:500 }}>{price} € {t.perUnit}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                          <button onClick={()=>changeQty(i,item.id,-1)} disabled={qty===0} style={{
                            width:28,height:28,borderRadius:"50%",border:`1.5px solid ${qty>0?COLORS.terracotta:COLORS.border}`,
                            background:"white",fontSize:16,cursor:qty>0?"pointer":"not-allowed",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            color:qty>0?COLORS.terracotta:COLORS.border,padding:0,lineHeight:1,
                          }}>−</button>
                          <span style={{ fontSize:16, fontWeight:500, minWidth:18, textAlign:"center", color:qty>0?COLORS.terracottaDark:COLORS.muted }}>{qty}</span>
                          <button onClick={()=>changeQty(i,item.id,1)} style={{
                            width:28,height:28,borderRadius:"50%",border:`1.5px solid ${COLORS.terracotta}`,
                            background:COLORS.terracotta,fontSize:16,cursor:"pointer",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            color:"white",padding:0,lineHeight:1,
                          }}>+</button>
                        </div>
                        {qty>0&&<div style={{ fontSize:13, fontWeight:500, color:COLORS.terracottaDark, minWidth:40, textAlign:"right" }}>{(price*qty).toFixed(2)} €</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop:14 }}>
                  <p className="section-label">{t.deliveryTime}</p>
                  <div className="time-chips">
                    {DELIVERY_TIMES.map(tm=>(
                      <div key={tm} className={`time-chip ${day.time===tm?"selected":""}`} onClick={()=>setTime(i,tm)}>{tm}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button className="btn-primary" onClick={onNext} style={{ marginTop:16 }}>{t.seeRecap}</button>
      <button className="btn-secondary" onClick={onBack}>{t.back}</button>
    </div>
  );
}

function SummaryPage({ guestName, guestEmail, travelers, count, nights, parking, breakfastDays, checkIn, checkOut, arrivalTime, departureTime, onConfirm, sending, t }) {
  const bfTotal = breakfastDays.reduce((sum,day) => {
    if (!day?.active) return sum;
    return sum + Object.entries(day.qty||{}).reduce((s,[id,q]) => s+(PRICES[id]||0)*q, 0);
  }, 0);
  const parkingTotal = parking.want ? nights*20 : 0;
  const onlineTotal  = bfTotal + (parking.payment==="paypal"?parkingTotal:0);
  const cashTotal    = parking.payment==="cash"&&parking.want ? parkingTotal : 0;

  return (
    <div className="card">
      <StepIndicator current={4} total={5} />
      <div className="page-title" style={{ marginBottom:4 }}>{t.recap}</div>
      <p className="subtitle" style={{ textAlign:"left", marginBottom:20 }}>{t.recapSub}</p>

      <div className="info-box">
        <span className="info-box-icon">📅</span>
        <div className="info-box-content">
          <p><strong>{checkIn} → {checkOut}</strong> · {t.nights(nights)}</p>
          <p>{t.travelers(count)} : {travelers.slice(0,count).map(tr=>`${tr?.firstName||""} ${tr?.lastName||""}`).join(", ")}</p>
          {arrivalTime&&<p>{t.arrivalPrev(arrivalTime)}</p>}
          {departureTime&&<p>{t.departurePrev(departureTime)}</p>}
          <p>{t.emailLabel} {guestEmail}</p>
        </div>
      </div>

      <div className="summary-row">
        <span className="summary-label">{t.parkingLabel}</span>
        <span className="summary-value">
          {parking.want
            ? <><span className="tag tag-terracotta">{nights} × 20 € = {parkingTotal} €</span>{" "}<span style={{fontSize:12,color:COLORS.muted}}>({parking.payment==="cash"?"cash":"PayPal"})</span></>
            : <span style={{color:COLORS.muted}}>{t.no}</span>}
        </span>
      </div>

      {breakfastDays.map((day,i) => {
        if (!day?.active) return null;
        const entries=Object.entries(day.qty||{}).filter(([,q])=>q>0);
        if (!entries.length) return null;
        const dayTotal=entries.reduce((s,[id,q])=>s+(PRICES[id]||0)*q,0);
        const lines=entries.map(([id,q])=>{const m=t.bfMenu.find(x=>x.id===id);return `${m?.name||id} ×${q}`;}).join(", ");
        return (
          <div key={i} className="summary-row">
            <span className="summary-label">{t.bfLabel(i+1,day.time)}</span>
            <span className="summary-value" style={{fontSize:12}}>{lines} · <strong>{dayTotal.toFixed(2)} €</strong></span>
          </div>
        );
      })}

      <div style={{ background:COLORS.sand, borderRadius:16, padding:"18px 20px", margin:"16px 0" }}>
        <p className="section-label" style={{ marginBottom:12 }}>{t.paymentRecap}</p>
        {bfTotal>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:8}}><span style={{color:COLORS.muted}}>☕ {t.bfItems}</span><span style={{fontWeight:500}}>{bfTotal.toFixed(2)} €</span></div>}
        {parking.want&&<div style={{display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:8}}><span style={{color:COLORS.muted}}>🚗 {t.parkingN(nights)}</span><span style={{fontWeight:500}}>{parkingTotal} €</span></div>}
        <div style={{height:1,background:COLORS.border,margin:"10px 0"}}/>
        {onlineTotal>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:16,marginBottom:6}}><span style={{fontWeight:500}}>{t.totalPaypal}</span><span style={{fontWeight:500,color:COLORS.terracotta,fontFamily:"'Playfair Display',serif",fontSize:20}}>{onlineTotal.toFixed(2)} €</span></div>}
        {cashTotal>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:14}}><span style={{color:COLORS.muted}}>{t.cashOnPlace}</span><span style={{fontWeight:500}}>{cashTotal} €</span></div>}
      </div>

      {onlineTotal>0&&(
        <div style={{ background:"white", border:`1px solid ${COLORS.border}`, borderRadius:16, padding:"20px", textAlign:"center", marginBottom:16 }}>
          <p style={{ fontSize:13, fontWeight:500, color:COLORS.muted, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:8 }}>{t.securePay}</p>
          <p style={{ fontSize:14, color:COLORS.dark, marginBottom:16, lineHeight:1.5 }}>{t.payTo(`${onlineTotal.toFixed(2)} €`)}</p>
          <button onClick={()=>window.open(`https://www.paypal.com/paypalme/conciergeriedaddio/${onlineTotal.toFixed(2)}`,"_blank")} style={{
            width:"100%", padding:"16px", background:"#003087", color:"white", border:"none", borderRadius:14,
            fontFamily:"'DM Sans',sans-serif", fontSize:17, fontWeight:500, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:10,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7.5 4h7C17.09 4 19 5.91 19 8.5c0 3.31-2.69 6-6 6H10l-1 5H6L8.5 4H7.5z" fill="#009CDE"/><path d="M9 4h6.5C18.09 4 20 5.91 20 8.5c0 3.31-2.69 6-6 6H11l-1 5H7L9.5 4H9z" fill="#012169" opacity="0.6"/></svg>
            {t.payBtn(`${onlineTotal.toFixed(2)} €`)}
          </button>
          <p style={{ fontSize:12, color:COLORS.muted, fontWeight:300 }}>{t.paypalRedirect}</p>
        </div>
      )}

      {cashTotal>0&&<div className="highlight-box"><p>{t.cashNote(cashTotal)}</p></div>}

      {sending
        ? <div className="sending-overlay"><div className="spinner"/><p style={{color:COLORS.muted,fontSize:14}}>{t.sending}</p></div>
        : <button className="btn-primary" onClick={()=>onConfirm(bfTotal,parkingTotal,onlineTotal)} style={{marginTop:4}}>{t.confirm}</button>
      }
    </div>
  );
}

function ConfirmedPage({ guestName, guestEmail, onlineTotal, t }) {
  return (
    <div className="card" style={{ textAlign:"center" }}>
      <div className="success-icon">🎉</div>
      <h1 style={{ marginBottom:12 }}>{t.allReady(guestName)}</h1>
      <p className="subtitle">{t.confirmedSub(guestEmail).split("\n").map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</p>
      {onlineTotal>0&&(
        <div className="info-box" style={{ background:"#E8F0FC", textAlign:"left" }}>
          <span className="info-box-icon">💳</span>
          <div className="info-box-content">
            <p style={{color:"#003087"}}><strong style={{color:COLORS.dark}}>{t.paypalPending}</strong></p>
            <p style={{color:"#003087"}}>{t.paypalPendingDesc(`${onlineTotal.toFixed(2)} €`)}</p>
          </div>
        </div>
      )}
      <div className="info-box" style={{ textAlign:"left", marginBottom:12 }}>
        <span className="info-box-icon">🤝</span>
        <div className="info-box-content">
          <p><strong>{t.nextStep}</strong></p>
          <p>{t.nextStepDesc}</p>
        </div>
      </div>
      <div className="info-box" style={{ background:COLORS.oliveLight, textAlign:"left" }}>
        <span className="info-box-icon">💬</span>
        <div className="info-box-content">
          <p style={{color:COLORS.olive}}><strong style={{color:COLORS.dark}}>{t.question}</strong></p>
          <p style={{color:COLORS.olive}}>{t.questionDesc}</p>
        </div>
      </div>
      <p style={{ fontSize:28, margin:"20px 0 8px" }}>🌊 ☀️ 🏖️</p>
      <p style={{ fontSize:14, color:COLORS.muted, fontWeight:300 }}>{CONFIG.PROPERTY_NAME} · {CONFIG.CITY}</p>
    </div>
  );
}

function sendEmailsViaMailto(hostEmail, guestEmail) {
  const enc = s => encodeURIComponent(s);
  window.open(`mailto:${hostEmail.to}?subject=${enc(hostEmail.subject)}&body=${enc(hostEmail.body)}`,"_blank");
  setTimeout(() => {
    window.open(`mailto:${guestEmail.to}?subject=${enc(guestEmail.subject)}&body=${enc(guestEmail.body)}`,"_blank");
  }, 800);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const params     = new URLSearchParams(window.location.search);
  const paramName  = params.get("guest") || "Sophie";
  const paramPax   = parseInt(params.get("pax")||"2",10);
  const paramCI    = (() => { const v=params.get("checkin"); if(!v) return "14/06/2025"; const [y,m,d]=v.split("-"); return `${d}/${m}/${y}`; })();
  const paramCO    = (() => { const v=params.get("checkout"); if(!v) return "17/06/2025"; const [y,m,d]=v.split("-"); return `${d}/${m}/${y}`; })();
  const paramN     = parseInt(params.get("nights")||"3",10);
  const paramEmail = params.get("email")||"";

  const [lang, setLang]                   = useState("fr");
  const [step, setStep]                   = useState(0);
  const [guestName]                       = useState(paramName);
  const [checkIn]                         = useState(paramCI);
  const [checkOut]                        = useState(paramCO);
  const [nights]                          = useState(paramN);
  const [travelerCount, setTravelerCount] = useState(paramPax);
  const [travelers, setTravelers]         = useState([]);
  const [guestEmail, setGuestEmail]       = useState(paramEmail);
  const [arrivalTime, setArrivalTime]     = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [parking, setParking]             = useState({ want:null, payment:"" });
  const [breakfastDays, setBreakfastDays] = useState([]);
  const [sending, setSending]             = useState(false);
  const [finalOnline, setFinalOnline]     = useState(0);

  const t = T[lang];

  useEffect(() => {
    setBreakfastDays(prev =>
      Array.from({ length: nights }, (_,i) =>
        prev[i] || { active:false, qty:{}, time:"" }
      )
    );
  }, [nights]);

  // reset arrival/departure slots when language changes (slots are different)
  useEffect(() => { setArrivalTime(""); setDepartureTime(""); }, [lang]);

  const handleConfirm = (bfTotal, parkingTotal, onlineTotal) => {
    setSending(true);
    setFinalOnline(onlineTotal);
    const hostMail   = buildHostEmail({ guestName, guestEmail, checkIn, checkOut, nights, travelers, count:travelerCount, parking, breakfastDays, arrivalTime, departureTime });
    const clientMail = buildGuestEmail({ guestName, guestEmail, checkIn, checkOut, nights, parking, breakfastDays, bfTotal, parkingTotal, onlineTotal, arrivalTime, departureTime, lang });
    setTimeout(() => { sendEmailsViaMailto(hostMail, clientMail); setSending(false); setStep(5); }, 1200);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <Logo lang={lang} setLang={setLang} t={t} />
        {step===0 && <WelcomePage guestName={guestName} checkIn={checkIn} checkOut={checkOut} nights={nights} onNext={()=>setStep(1)} t={t} />}
        {step===1 && <TravelersPage count={travelerCount} onChange={setTravelerCount} onNext={()=>setStep(2)} onBack={()=>setStep(0)} t={t} />}
        {step===2 && <GuestInfoPage count={travelerCount} travelers={travelers} onChange={setTravelers} guestEmail={guestEmail} setGuestEmail={setGuestEmail} arrivalTime={arrivalTime} setArrivalTime={setArrivalTime} departureTime={departureTime} setDepartureTime={setDepartureTime} onNext={()=>setStep(3)} onBack={()=>setStep(1)} t={t} />}
        {step===3 && <ExtrasPage parking={parking} setParking={setParking} breakfastDays={breakfastDays} setBreakfastDays={setBreakfastDays} nights={nights} checkIn={checkIn} onNext={()=>setStep(4)} onBack={()=>setStep(2)} t={t} />}
        {step===4 && <SummaryPage guestName={guestName} guestEmail={guestEmail} travelers={travelers} count={travelerCount} nights={nights} parking={parking} breakfastDays={breakfastDays} checkIn={checkIn} checkOut={checkOut} arrivalTime={arrivalTime} departureTime={departureTime} onConfirm={handleConfirm} sending={sending} t={t} />}
        {step===5 && <ConfirmedPage guestName={guestName} guestEmail={guestEmail} onlineTotal={finalOnline} t={t} />}
      </div>
    </>
  );
}
