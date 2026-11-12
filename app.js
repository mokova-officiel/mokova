'use strict';
/* ============ 1. CONFIGURATION ============ */
const CONFIG = { appName: 'MOKOVA', currency: 'HTG', commission: 0.10, defaultLang: 'fr', responseDelayMin: 5 };

/* ============ 2. DONNÉES INITIALES ============ */
const ZONES = [
  { id: 'z1', name: 'Zone 1 — Cœur', fee: 100, active: true, hoods: ['Pétion-Ville centre', 'Delmas 40', 'Delmas 60', 'Delmas 75'] },
  { id: 'z2', name: 'Zone 2 — Proche', fee: 175, active: true, hoods: ['Delmas 2 à 33', 'Nazon', 'Turgeau', 'Bourdon', 'Pacot', 'Canapé-Vert', 'Frères'] },
  { id: 'z3', name: 'Zone 3 — Étendue', fee: 250, active: true, hoods: ['Clercine', 'Fleuriot', "Zone de l'aéroport", 'Pernier', 'Centre-ville'] },
  { id: 'z4', name: 'Zone 4 — Éloignée', fee: 350, active: true, hoods: ['Thomassin haut', 'Fermathe', 'Kenscoff bas', 'Croix-des-Missions', 'Tabarre est'] }
];
const OUT_OF_AREA = ['Carrefour et Fontamara', 'Martissant', 'Cité Soleil', 'Croix-des-Bouquets', 'Kenscoff haut'];
const CATEGORIES = ['Grillades', 'Fritay', 'Soupes', 'Pizzas et burgers', 'Poulet', 'Fruits de mer', 'Végétarien', 'Desserts et jus'];
const RESTAURANTS = [
  { id: 'r1', name: 'Chez Tante Marie', cats: ['Fritay', 'Grillades'], rating: 4.7, reviews: 212, eta: 30, zones: ['z1', 'z2', 'z3'], hours: [9, 21], color: '#b45309',
    menu: [['Griot et bannann', 'Porc mariné frit, bananes pesées, pikliz', 650, 'Fritay', 20], ['Tasso kabrit', 'Chèvre séchée frite, pikliz maison', 750, 'Fritay', 15], ['Akra (12)', 'Beignets de malanga croustillants', 300, 'Fritay', 40], ['Poisson gros sel', 'Poisson grillé, sauce ti-malice', 900, 'Grillades', 0]] },
  { id: 'r2', name: 'Soup Joumou Express', cats: ['Soupes'], rating: 4.5, reviews: 148, eta: 35, zones: ['z1', 'z2'], hours: [7, 20], color: '#c2410c',
    menu: [['Soup joumou', 'Soupe de giraumon, bœuf, légumes', 500, 'Soupes', 30], ['Bouyon tèt kabrit', 'Bouillon épicé traditionnel', 700, 'Soupes', 12], ['Pain maison', 'Petit pain frais', 100, 'Desserts et jus', 50]] },
  { id: 'r3', name: 'Poulet Delmas', cats: ['Poulet', 'Grillades'], rating: 4.3, reviews: 96, eta: 25, zones: ['z1', 'z2', 'z3', 'z4'], hours: [10, 22], color: '#a16207',
    menu: [['Poulet rôti ¼', 'Quart de poulet, riz collé aux pois', 600, 'Poulet', 25], ['Poulet en sauce', 'Cuisse en sauce créole, riz blanc', 700, 'Poulet', 20], ['Jus de cerise', 'Jus frais, bouteille 33 cl', 150, 'Desserts et jus', 30]] },
  { id: 'r4', name: 'Kay Lanmè', cats: ['Fruits de mer'], rating: 4.8, reviews: 175, eta: 45, zones: ['z1', 'z2', 'z3'], hours: [11, 22], color: '#0e7490',
    menu: [['Lambi en sauce', 'Conque mijotée, riz djon-djon', 1400, 'Fruits de mer', 10], ['Crevettes grillées', 'Crevettes à l\'ail, bannann peze', 1600, 'Fruits de mer', 8], ['Poisson frit', 'Vivaneau entier, pikliz', 1200, 'Fruits de mer', 14]] },
  { id: 'r5', name: 'Verdure Pacot', cats: ['Végétarien', 'Desserts et jus'], rating: 4.4, reviews: 61, eta: 30, zones: ['z2', 'z3'], hours: [8, 19], color: '#15803d',
    menu: [['Legim', 'Ragoût de légumes, riz blanc', 550, 'Végétarien', 18], ['Pen patat', 'Gâteau de patate douce', 250, 'Desserts et jus', 20], ['Jus de canne', 'Pressé frais', 150, 'Desserts et jus', 25]] }
].map(r => ({ ...r, menu: r.menu.map((m, i) => ({ id: r.id + 'm' + i, name: m[0], desc: m[1], price: m[2], cat: m[3], stock: m[4] })) }));
const REVIEWS = [{ rid: 'r1', who: 'Jean', stars: 5, text: 'Griot parfait.', date: '2026-10-28' }, { rid: 'r4', who: 'Nadège', stars: 5, text: 'Lambi excellent.', date: '2026-11-02' }];
const STATUSES = ['received', 'accepted', 'preparing', 'ready', 'pickedup', 'delivering', 'delivered'];

/* ============ 3. TRADUCTIONS ============ */
const I18N = {
  fr: { home: 'Accueil', orders: 'Commandes', pro: 'Espaces pro', profile: 'Profil', login: 'Connexion', signup: 'Inscription', order: 'Commander', slogan2: 'Kòmande fasil. Resevwa kote ou vle.', yourHood: 'Votre quartier', how: 'Comment ça marche', s1: 'Choisissez un restaurant et vos plats', s2: 'Payez en ligne', s3: 'Suivez la livraison jusqu\'à votre porte', featured: 'Restaurants vedettes', perks: 'Pourquoi MOKOVA', p1: 'Paiement en ligne', p2: 'Tarifs fixes par zone, affichés avant de commander', p3: 'Suivi de commande en direct', p4: 'Restaurants de Port-au-Prince', beResto: 'Devenir restaurant', beDriver: 'Devenir livreur', rd: 'République dominicaine : bientôt disponible', open: 'Ouvert', closed: 'Fermé', reopens: 'Réouverture à', min: 'min', delivery: 'Livraison', unavailable: 'Indisponible pour cette adresse', soldout: 'Épuisé', add: 'Ajouter', cart: 'Voir mon panier', emptyCart: 'Votre panier est vide', discover: 'Découvrir les restaurants', subtotal: 'Sous-total des plats', total: 'Total', hood: 'Quartier', pickHood: 'Choisir un quartier', outArea: 'La livraison n\'est pas encore disponible dans ce quartier.', address: 'Adresse précise et repère', phone: 'Téléphone de contact', note: 'Commentaire pour le restaurant', pay: 'Paiement', card: 'Carte bancaire', cardNo: 'Numéro de carte (16 chiffres)', momo: 'Numéro du compte', confirmPay: 'Payer et commander', req: 'Champ obligatoire', badPhone: 'Numéro haïtien invalide', thanks: 'Commande confirmée', code: 'Code de confirmation', track: 'Suivre ma commande', estimate: 'Délai estimé', empty: 'Aucune commande pour le moment', otherResto: 'Panier d\'un autre restaurant', clearAsk: 'Vider le panier et commencer une nouvelle commande ?', cancel: 'Annuler', yes: 'Oui, vider', search: 'Rechercher un restaurant ou un plat', all: 'Toutes', logout: 'Se déconnecter', guest: 'Continuer en invité', email: 'E-mail ou téléphone', pwd: 'Mot de passe', pwd2: 'Confirmer le mot de passe', name: 'Nom complet', mail: 'E-mail', badMail: 'E-mail invalide', short: '8 caractères minimum', mismatch: 'Les mots de passe diffèrent', forgot: 'Mot de passe oublié', role: 'Rôle', client: 'Client', restaurant: 'Restaurant', driver: 'Livreur', lang: 'Langue', sent: 'Si ce compte existe, un message a été envoyé.', reorder: 'Recommander', advance: 'Faire avancer (démo)', cancelOrder: 'Annuler la commande', zones: 'Zones desservies', fallback: 'Un problème est survenu.', back: 'Retour à l\'accueil', save: 'Enregistrer', fee: 'Tarif', adminZones: 'Tarifs par zone', split: 'Répartition', rest: 'Restaurant', mokova: 'MOKOVA', courier: 'Livreur', st_received: 'Reçue', st_accepted: 'Acceptée', st_preparing: 'En préparation', st_ready: 'Prête', st_pickedup: 'Prise en charge', st_delivering: 'En livraison', st_delivered: 'Livrée', st_cancelled: 'Annulée', proNote: 'Démo : les commandes du navigateur et les tarifs des zones sont modifiables ici.', about: 'À propos', terms: 'Conditions', privacy: 'Confidentialité', help: 'Aide et contact', pageBody: 'MOKOVA met en relation clients, restaurants et livreurs à Port-au-Prince. Contact : contact@mokova.ht — +509 0000 0000.' },
  ht: { home: 'Akèy', orders: 'Kòmand', pro: 'Espas pwofesyonèl', profile: 'Pwofil', login: 'Konekte', signup: 'Enskri', order: 'Kòmande', slogan2: 'Kòmande fasil. Resevwa kote ou vle.', yourHood: 'Katye ou', how: 'Kijan sa mache', s1: 'Chwazi yon restoran ak manje ou', s2: 'Peye sou entènèt', s3: 'Swiv livrezon an jiska pòt ou', featured: 'Restoran an vedèt', perks: 'Poukisa MOKOVA', p1: 'Peman sou entènèt', p2: 'Tarif fiks pa zòn, ou wè l anvan ou kòmande', p3: 'Swivi kòmand an dirèk', p4: 'Restoran Pòtoprens', beResto: 'Vin restoran', beDriver: 'Vin livrè', rd: 'Repiblik Dominikèn : talè konsa', open: 'Ouvè', closed: 'Fèmen', reopens: 'Li rouvri a', min: 'min', delivery: 'Livrezon', unavailable: 'Pa disponib pou adrès sa a', soldout: 'Fini', add: 'Ajoute', cart: 'Gade panye mwen', emptyCart: 'Panye ou vid', discover: 'Dekouvri restoran yo', subtotal: 'Sou-total manje', total: 'Total', hood: 'Katye', pickHood: 'Chwazi yon katye', outArea: 'Nou poko livre nan katye sa a.', address: 'Adrès egzak ak repè', phone: 'Telefòn pou kontakte w', note: 'Kòmantè pou restoran an', pay: 'Peman', card: 'Kat labank', cardNo: 'Nimewo kat (16 chif)', momo: 'Nimewo kont lan', confirmPay: 'Peye epi kòmande', req: 'Chan obligatwa', badPhone: 'Nimewo ayisyen pa valab', thanks: 'Kòmand konfime', code: 'Kòd konfimasyon', track: 'Swiv kòmand mwen', estimate: 'Dire estime', empty: 'Pa gen kòmand pou kounye a', otherResto: 'Panye yon lòt restoran', clearAsk: 'Vide panye a epi kòmanse yon nouvo kòmand ?', cancel: 'Anile', yes: 'Wi, vide', search: 'Chèche restoran oswa manje', all: 'Tout', logout: 'Dekonekte', guest: 'Kontinye kòm envite', email: 'Imèl oswa telefòn', pwd: 'Modpas', pwd2: 'Konfime modpas', name: 'Non konplè', mail: 'Imèl', badMail: 'Imèl pa valab', short: '8 karaktè minimòm', mismatch: 'Modpas yo pa menm', forgot: 'Bliye modpas', role: 'Wòl', client: 'Kliyan', restaurant: 'Restoran', driver: 'Livrè', lang: 'Lang', sent: 'Si kont lan egziste, nou voye yon mesaj.', reorder: 'Kòmande ankò', advance: 'Avanse (demo)', cancelOrder: 'Anile kòmand lan', zones: 'Zòn nou sèvi', fallback: 'Te gen yon pwoblèm.', back: 'Tounen nan akèy', save: 'Sove', fee: 'Tarif', adminZones: 'Tarif pa zòn', split: 'Repatisyon', rest: 'Restoran', mokova: 'MOKOVA', courier: 'Livrè', st_received: 'Resevwa', st_accepted: 'Aksepte', st_preparing: 'Ap prepare', st_ready: 'Pare', st_pickedup: 'Livrè pran l', st_delivering: 'Ap livre', st_delivered: 'Livre', st_cancelled: 'Anile', proNote: 'Demo : ou ka modifye kòmand yo ak tarif zòn yo la a.', about: 'Konsènan nou', terms: 'Kondisyon', privacy: 'Konfidansyalite', help: 'Èd ak kontak', pageBody: 'MOKOVA konekte kliyan, restoran ak livrè nan Pòtoprens. Kontak : contact@mokova.ht — +509 0000 0000.' },
  es: { home: 'Inicio', orders: 'Pedidos', pro: 'Espacios pro', profile: 'Perfil', login: 'Iniciar sesión', signup: 'Registrarse', order: 'Pedir', slogan2: 'Kòmande fasil. Resevwa kote ou vle.', yourHood: 'Tu barrio', how: 'Cómo funciona', s1: 'Elige un restaurante y tus platos', s2: 'Paga en línea', s3: 'Sigue la entrega hasta tu puerta', featured: 'Restaurantes destacados', perks: 'Por qué MOKOVA', p1: 'Pago en línea', p2: 'Tarifas fijas por zona, visibles antes de pedir', p3: 'Seguimiento en vivo', p4: 'Restaurantes de Puerto Príncipe', beResto: 'Ser restaurante', beDriver: 'Ser repartidor', rd: 'República Dominicana: próximamente', open: 'Abierto', closed: 'Cerrado', reopens: 'Reabre a las', min: 'min', delivery: 'Entrega', unavailable: 'No disponible para esta dirección', soldout: 'Agotado', add: 'Añadir', cart: 'Ver mi carrito', emptyCart: 'Tu carrito está vacío', discover: 'Descubrir restaurantes', subtotal: 'Subtotal de platos', total: 'Total', hood: 'Barrio', pickHood: 'Elegir un barrio', outArea: 'Aún no entregamos en este barrio.', address: 'Dirección exacta y referencia', phone: 'Teléfono de contacto', note: 'Comentario para el restaurante', pay: 'Pago', card: 'Tarjeta bancaria', cardNo: 'Número de tarjeta (16 dígitos)', momo: 'Número de cuenta', confirmPay: 'Pagar y pedir', req: 'Campo obligatorio', badPhone: 'Número haitiano inválido', thanks: 'Pedido confirmado', code: 'Código de confirmación', track: 'Seguir mi pedido', estimate: 'Tiempo estimado', empty: 'Aún no hay pedidos', otherResto: 'Carrito de otro restaurante', clearAsk: '¿Vaciar el carrito y empezar un nuevo pedido?', cancel: 'Cancelar', yes: 'Sí, vaciar', search: 'Buscar restaurante o plato', all: 'Todas', logout: 'Cerrar sesión', guest: 'Continuar como invitado', email: 'Correo o teléfono', pwd: 'Contraseña', pwd2: 'Confirmar contraseña', name: 'Nombre completo', mail: 'Correo', badMail: 'Correo inválido', short: 'Mínimo 8 caracteres', mismatch: 'Las contraseñas no coinciden', forgot: 'Olvidé mi contraseña', role: 'Rol', client: 'Cliente', restaurant: 'Restaurante', driver: 'Repartidor', lang: 'Idioma', sent: 'Si la cuenta existe, se envió un mensaje.', reorder: 'Pedir de nuevo', advance: 'Avanzar (demo)', cancelOrder: 'Cancelar pedido', zones: 'Zonas atendidas', fallback: 'Ocurrió un problema.', back: 'Volver al inicio', save: 'Guardar', fee: 'Tarifa', adminZones: 'Tarifas por zona', split: 'Reparto', rest: 'Restaurante', mokova: 'MOKOVA', courier: 'Repartidor', st_received: 'Recibido', st_accepted: 'Aceptado', st_preparing: 'En preparación', st_ready: 'Listo', st_pickedup: 'Recogido', st_delivering: 'En camino', st_delivered: 'Entregado', st_cancelled: 'Cancelado', proNote: 'Demo: aquí puedes editar pedidos y tarifas de zona.', about: 'Acerca de', terms: 'Condiciones', privacy: 'Privacidad', help: 'Ayuda y contacto', pageBody: 'MOKOVA conecta clientes, restaurantes y repartidores en Puerto Príncipe. Contacto: contact@mokova.ht — +509 0000 0000.' }
};

/* ============ 4. SERVICES DE DONNÉES ============
   Point de branchement prévu pour un backend plus tard :
   les vues n'appellent que ces fonctions asynchrones. */
const store = {
  get: (k, d) => { try { const v = localStorage.getItem('mokova_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem('mokova_' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
};
const getZones = async () => store.get('zones', ZONES);
const saveZones = async z => store.set('zones', z);
const getRestaurants = async () => RESTAURANTS;
const getRestaurantMenu = async id => (RESTAURANTS.find(r => r.id === id) || { menu: [] }).menu;
const getOrders = async () => store.get('orders', []);
const createOrder = async o => { const l = await getOrders(); l.unshift(o); store.set('orders', l); return o; };
const updateOrderStatus = async (id, status) => {
  const l = await getOrders(); const o = l.find(x => x.id === id);
  if (o) { o.status = status; o.history.push({ s: status, t: new Date().toISOString() }); store.set('orders', l); }
  return o;
};
const getCurrentUser = async () => store.get('user', null);
const saveProfile = async p => { store.set('user', p); return p; };

/* ============ 5. ÉTAT GLOBAL ============ */
const S = { lang: store.get('lang', CONFIG.defaultLang), cart: store.get('cart', { rid: null, items: {} }), hood: store.get('hood', ''), user: null, zones: ZONES, orders: [] };
const t = k => (I18N[S.lang] && I18N[S.lang][k]) || I18N.fr[k] || k;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + CONFIG.currency;
const ICONS = { home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', orders: 'M6 2h12v20l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6', pro: 'M3 7h18v13H3zM8 7V4h8v3', profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', food: 'M7 3v8a3 3 0 0 0 3 3v7M7 3v5M10 3v5M17 3c-2 2-2 6 0 8v10' };
const icon = n => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;
const findZone = hood => S.zones.find(z => z.hoods.includes(hood));
const isOpen = r => { const h = new Date().getHours(); return h >= r.hours[0] && h < r.hours[1]; };
const serves = (r, hood) => { const z = findZone(hood); return !hood || (z && z.active && r.zones.includes(z.id)); };
const cartCount = () => Object.values(S.cart.items).reduce((a, b) => a + b, 0);
const saveCart = () => store.set('cart', S.cart);

/* ============ 6. PANIER ============ */
function findItem(id) { for (const r of RESTAURANTS) { const m = r.menu.find(x => x.id === id); if (m) return { r, m }; } return null; }
function setQty(rid, id, qty) {
  const { m } = findItem(id);
  if (S.cart.rid && S.cart.rid !== rid && qty > 0) {
    return confirmBox(t('otherResto'), t('clearAsk'), () => { S.cart = { rid, items: { [id]: 1 } }; saveCart(); render(); });
  }
  qty = Math.max(0, Math.min(qty, m.stock));
  S.cart.rid = rid; if (qty) S.cart.items[id] = qty; else delete S.cart.items[id];
  if (!cartCount()) S.cart = { rid: null, items: {} };
  saveCart(); render();
}
function cartTotals(hood) {
  const sub = Object.entries(S.cart.items).reduce((a, [id, q]) => a + findItem(id).m.price * q, 0);
  const z = findZone(hood); const fee = z ? z.fee : 0;
  return { sub, fee, zone: z, total: sub + fee, commission: Math.round(sub * CONFIG.commission), restaurant: sub - Math.round(sub * CONFIG.commission), courier: fee };
}
function confirmBox(title, text, onYes) {
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = `<div class="box" role="dialog" aria-modal="true"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="row"><button class="btn" id="mn">${t('cancel')}</button><button class="btn primary" id="my">${t('yes')}</button></div></div>`;
  $('#mn').onclick = () => { m.hidden = true; }; $('#my').onclick = () => { m.hidden = true; onYes(); };
}

/* ============ 7. NAVIGATION ============ */
const go = h => { location.hash = h; };
function renderChrome() {
  $('#top').innerHTML = `<button class="logo" onclick="go('#/')">${CONFIG.appName}</button>
    <select aria-label="${t('lang')}" onchange="setLang(this.value)">${['fr', 'ht', 'es'].map(l => `<option value="${l}" ${S.lang === l ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}</select>
    ${S.user ? '' : `<button class="btn" onclick="go('#/login')">${t('login')}</button>`}`;
  const cur = location.hash.split('/')[1] || '';
  const tab = (h, ic, lab, on) => `<button class="${on ? 'on' : ''}" onclick="go('#/${h}')">${icon(ic)}${t(lab)}</button>`;
  $('#tabs').innerHTML = tab('', 'home', 'home', cur === '' || cur === 'restaurants' || cur === 'menu') + tab('orders', 'orders', 'orders', cur === 'orders' || cur === 'track') + tab('pro', 'pro', 'pro', cur === 'pro') + tab('profile', 'profile', 'profile', cur === 'profile');
  const n = cartCount();
  $('#cartbar').innerHTML = n && !['cart', 'checkout'].includes(cur) ? `<button class="cb" onclick="go('#/cart')"><span>${n} · ${money(cartTotals(S.hood).sub)}</span><span>${t('cart')}</span></button>` : '';
}
function setLang(l) { S.lang = l; store.set('lang', l); document.documentElement.lang = l; render(); }
async function render() {
  try {
    S.user = await getCurrentUser(); S.zones = await getZones(); S.orders = await getOrders();
    const [, view, a] = location.hash.split('/');
    const V = { '': vHome, restaurants: vList, menu: vMenu, cart: vCart, checkout: vCheckout, confirm: vTrack, track: vTrack, orders: vOrders, pro: vPro, profile: vProfile, login: vLogin, signup: vSignup, info: vInfo }[view || ''] || vHome;
    $('#app').innerHTML = await V(a); renderChrome(); bind();
  } catch (e) { console.error(e); $('#app').innerHTML = `<div class="card pad"><h2>${t('fallback')}</h2><button class="btn primary" onclick="go('#/')">${t('back')}</button></div>`; }
}
window.addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

/* ============ 8. VUES ============ */
const hoodOptions = sel => `<option value="">${t('pickHood')}</option>` + S.zones.map(z => `<optgroup label="${esc(z.name)} — ${money(z.fee)}">${z.hoods.map(h => `<option ${h === sel ? 'selected' : ''}>${esc(h)}</option>`).join('')}</optgroup>`).join('') + `<optgroup label="—">${OUT_OF_AREA.map(h => `<option ${h === sel ? 'selected' : ''}>${esc(h)}</option>`).join('')}</optgroup>`;
const restoCard = r => {
  const z = findZone(S.hood), ok = serves(r, S.hood);
  return `<button class="card link ${ok ? '' : 'off'}" onclick="go('#/menu/${r.id}')"><div class="photo" style="background:${r.color}">${icon('food')}</div><div class="pad"><div class="row"><h3>${esc(r.name)}</h3><span class="badge ${isOpen(r) ? 'open' : 'closed'}">${isOpen(r) ? t('open') : t('closed')}</span></div><p class="muted">${r.cats.map(esc).join(', ')}</p><p class="muted">★ ${r.rating} (${r.reviews}) · ${r.eta} ${t('min')}${z ? ' · ' + t('delivery') + ' ' + money(z.fee) : ''}</p>${ok ? '' : `<p class="err">${t('unavailable')}</p>`}</div></button>`;
};
async function vHome() {
  const soon = `<div class="soon"><b>${t('rd')}</b></div>`;
  return `<section class="hero"><h1>Manje Ou, Kote Ou Vle A</h1><p>${t('slogan2')}</p><div class="row"><select id="hoodSel" aria-label="${t('yourHood')}">${hoodOptions(S.hood)}</select><button class="btn primary" onclick="go('#/restaurants')">${t('order')}</button></div></section>
  <h2>${t('how')}</h2><div class="grid steps"><div class="card">${[1, 2, 3].map(i => '').join('')}<p style="padding:16px 40px 16px 16px">${t('s1')}</p></div><div class="card"><p style="padding:16px 40px 16px 16px">${t('s2')}</p></div><div class="card"><p style="padding:16px 40px 16px 16px">${t('s3')}</p></div></div>
  <h2>${t('featured')}</h2><div class="grid">${RESTAURANTS.slice(0, 3).map(restoCard).join('')}</div>
  <h2>${t('perks')}</h2><div class="card pad"><p>${t('p1')}</p><p>${t('p2')}</p><p>${t('p3')}</p><p>${t('p4')}</p></div>
  <div class="grid" style="margin-top:16px"><div class="card pad"><h3>${t('beResto')}</h3><br><button class="btn dark" onclick="go('#/signup/restaurant')">${t('signup')}</button></div><div class="card pad"><h3>${t('beDriver')}</h3><br><button class="btn dark" onclick="go('#/signup/driver')">${t('signup')}</button></div></div>${soon}
  <footer class="foot"><h3>${CONFIG.appName}</h3><p>Manje Ou, Kote Ou Vle A</p><p class="muted" style="color:#ccc">${t('zones')} : ${S.zones.filter(z => z.active).flatMap(z => z.hoods).join(', ')}</p>${['about', 'terms', 'privacy', 'help'].map(k => `<button class="btn" style="border:0;background:none;color:var(--orange);text-decoration:underline" onclick="go('#/info/${k}')">${t(k)}</button>`).join('')}</footer>`;
}
async function vInfo(k) { return `<div class="card pad"><h2>${t(k) || ''}</h2><p>${t('pageBody')}</p></div>`; }
let filter = { q: '', cat: '', sort: 'rating' };
async function vList() {
  let l = RESTAURANTS.filter(r => (!filter.cat || r.cats.includes(filter.cat)) && (!filter.q || (r.name + r.menu.map(m => m.name).join()).toLowerCase().includes(filter.q.toLowerCase())));
  l.sort((a, b) => filter.sort === 'rating' ? b.rating - a.rating : a.eta - b.eta);
  return `<label for="hoodSel">${t('yourHood')}</label><select id="hoodSel">${hoodOptions(S.hood)}</select>
  <label for="q">${t('search')}</label><input id="q" type="search" value="${esc(filter.q)}">
  <div class="chips"><button class="chip ${filter.cat ? '' : 'on'}" data-cat="">${t('all')}</button>${CATEGORIES.map(c => `<button class="chip ${filter.cat === c ? 'on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  <div class="grid">${l.map(restoCard).join('') || `<p>${t('empty')}</p>`}</div>`;
}
async function vMenu(id) {
  const r = RESTAURANTS.find(x => x.id === id); if (!r) return vList();
  const open = isOpen(r), ok = serves(r, S.hood), can = open && ok;
  const cats = [...new Set(r.menu.map(m => m.cat))];
  return `<div class="card"><div class="photo" style="background:${r.color}">${icon('food')}</div><div class="pad"><h1>${esc(r.name)}</h1><p class="muted">★ ${r.rating} (${r.reviews}) · ${r.eta} ${t('min')} · ${r.hours[0]}h–${r.hours[1]}h</p><p><span class="badge ${open ? 'open' : 'closed'}">${open ? t('open') : t('closed') + ' · ' + t('reopens') + ' ' + r.hours[0] + 'h'}</span></p><p class="muted">${t('zones')} : ${r.zones.map(z => S.zones.find(s => s.id === z).name).join(', ')}</p>${ok ? '' : `<p class="err">${t('unavailable')}</p>`}</div></div>
  ${cats.map(c => `<h2>${esc(c)}</h2><div class="grid">${r.menu.filter(m => m.cat === c).map(m => {
    const q = (S.cart.items[m.id] || 0), out = m.stock <= 0;
    return `<div class="card pad ${out ? 'off' : ''}"><div class="row"><h3>${esc(m.name)}</h3><span class="price">${money(m.price)}</span></div><p class="muted">${esc(m.desc)}</p><div class="row" style="margin-top:10px">${out ? `<span class="badge closed">${t('soldout')}</span>` : q ? `<div class="qty"><button aria-label="−" data-q="${r.id}|${m.id}|${q - 1}">−</button><b>${q}</b><button aria-label="+" data-q="${r.id}|${m.id}|${q + 1}">+</button></div>` : `<button class="btn primary" ${can ? '' : 'disabled'} data-q="${r.id}|${m.id}|1">${t('add')}</button>`}</div></div>`;
  }).join('')}</div>`).join('')}
  <h2>★</h2>${REVIEWS.filter(v => v.rid === id).map(v => `<div class="card pad"><b>${esc(v.who)}</b> ${'★'.repeat(v.stars)} <span class="muted">${v.date}</span><p>${esc(v.text)}</p></div>`).join('')}`;
}
async function vCart() {
  if (!cartCount()) return `<div class="card pad"><h2>${t('emptyCart')}</h2><button class="btn primary" onclick="go('#/restaurants')">${t('discover')}</button></div>`;
  const r = RESTAURANTS.find(x => x.id === S.cart.rid), T = cartTotals(S.hood);
  return `<h2>${esc(r.name)}</h2>${Object.entries(S.cart.items).map(([id, q]) => { const m = findItem(id).m; return `<div class="card pad row" style="margin-bottom:10px"><div><b>${esc(m.name)}</b><br><span class="price">${money(m.price * q)}</span></div><div class="qty"><button aria-label="−" data-q="${r.id}|${id}|${q - 1}">−</button><b>${q}</b><button aria-label="+" data-q="${r.id}|${id}|${q + 1}">+</button></div></div>`; }).join('')}
  <div class="card pad sum"><div><span>${t('subtotal')}</span><b>${money(T.sub)}</b></div><button class="btn primary block" onclick="go('#/checkout')">${t('order')}</button></div>`;
}
async function vCheckout() {
  if (!cartCount()) return vCart();
  const u = S.user || {};
  return `<h2>${t('order')}</h2><form id="co" class="card pad" novalidate>
  <div class="field"><label for="hood">${t('hood')}</label><select id="hood" name="hood">${hoodOptions(S.hood)}</select><div class="err" data-e="hood"></div></div>
  <div class="field"><label for="addr">${t('address')}</label><input id="addr" name="addr"><div class="err" data-e="addr"></div></div>
  <div class="field"><label for="ph">${t('phone')}</label><input id="ph" name="phone" type="tel" value="${esc(u.phone || '')}"><div class="err" data-e="phone"></div></div>
  <label for="nt">${t('note')}</label><textarea id="nt" name="note"></textarea>
  <label>${t('pay')}</label><div class="pay" id="pay">${['card', 'MonCash', 'NatCash'].map((m, i) => `<button type="button" class="${i ? '' : 'on'}" data-m="${m}">${m === 'card' ? t('card') : m}</button>`).join('')}</div>
  <div class="field"><label for="acc" id="accl">${t('cardNo')}</label><input id="acc" name="acc" inputmode="numeric"><div class="err" data-e="acc"></div></div>
  <div class="sum" id="sum"></div><button class="btn primary block" id="go">${t('confirmPay')}</button></form>`;
}
function updateSum() {
  const h = $('#hood').value, T = cartTotals(h), out = OUT_OF_AREA.includes(h), z = T.zone;
  $('#sum').innerHTML = `<div><span>${t('subtotal')}</span><b>${money(T.sub)}</b></div><div><span>${t('delivery')}${z ? ' · ' + esc(z.name) : ''}</span><b>${h && !out ? money(T.fee) : '—'}</b></div><div class="tot"><span>${t('total')}</span><span>${money(T.total)}</span></div>${out || (z && !z.active) ? `<p class="err">${t('outArea')}</p>` : ''}`;
  $('#go').disabled = !h || out || !z || !z.active;
}
async function submitOrder(f) {
  const E = {}, v = n => f.elements[n].value.trim(), m = $('#pay .on').dataset.m;
  if (!v('hood')) E.hood = t('req'); if (!v('addr')) E.addr = t('req');
  if (!PHONE_RE.test(v('phone'))) E.phone = t('badPhone');
  if (m === 'card' ? !/^\d{16}$/.test(v('acc').replace(/\s/g, '')) : !PHONE_RE.test(v('acc'))) E.acc = t('req');
  document.querySelectorAll('[data-e]').forEach(e => { e.textContent = E[e.dataset.e] || ''; e.parentElement.classList.toggle('bad', !!E[e.dataset.e]); });
  if (Object.keys(E).length) return;
  const T = cartTotals(v('hood')), r = RESTAURANTS.find(x => x.id === S.cart.rid), now = new Date().toISOString();
  const o = await createOrder({ id: 'MK' + Date.now().toString().slice(-6), rid: r.id, rname: r.name, items: Object.entries(S.cart.items).map(([id, q]) => ({ name: findItem(id).m.name, q, price: findItem(id).m.price })), subtotal: T.sub, fee: T.fee, zone: T.zone.name, total: T.total, commission: T.commission, restaurant: T.restaurant, courier: T.courier, hood: v('hood'), addr: v('addr'), phone: v('phone'), status: 'received', history: [{ s: 'received', t: now }], code: String(1000 + Math.floor(Math.random() * 9000)), eta: r.eta, date: now });
  S.hood = v('hood'); store.set('hood', S.hood); S.cart = { rid: null, items: {} }; saveCart(); go('#/confirm/' + o.id);
}
const PHONE_RE = /^(\+?509)?[\s-]?[2-5]\d{3}[\s-]?\d{4}$/;
const stLabel = s => t('st_' + s);
async function vTrack(id) {
  const o = S.orders.find(x => x.id === id); if (!o) return vOrders();
  const idx = STATUSES.indexOf(o.status), cancelled = o.status === 'cancelled';
  return `<h2>${t('thanks')} · ${o.id}</h2><div class="card pad"><div class="prog" role="progressbar">${STATUSES.map((s, i) => `<i class="${i <= idx && !cancelled ? 'on' : ''}"></i>`).join('')}</div><h3>${stLabel(o.status)}</h3><p class="muted">${esc(o.rname)} · ${t('estimate')} : ${o.eta + 15} ${t('min')}</p><p class="muted">${t('code')}</p><div class="code">${o.code}</div></div>
  <div class="card pad sum" style="margin-top:12px">${o.items.map(i => `<div><span>${i.q} × ${esc(i.name)}</span><b>${money(i.q * i.price)}</b></div>`).join('')}<div><span>${t('subtotal')}</span><b>${money(o.subtotal)}</b></div><div><span>${t('delivery')} · ${esc(o.zone)}</span><b>${money(o.fee)}</b></div><div class="tot"><span>${t('total')}</span><span>${money(o.total)}</span></div></div>
  <div class="card pad" style="margin-top:12px"><ul class="hist">${o.history.map(h => `<li>${stLabel(h.s)} <span class="muted">${new Date(h.t).toLocaleString()}</span></li>`).join('')}</ul>
  ${idx < 2 && !cancelled ? `<button class="btn block" data-st="${o.id}|cancelled">${t('cancelOrder')}</button>` : ''}</div>`;
}
async function vOrders() {
  if (!S.orders.length) return `<div class="card pad"><h2>${t('empty')}</h2><button class="btn primary" onclick="go('#/restaurants')">${t('discover')}</button></div>`;
  return `<h2>${t('orders')}</h2>${S.orders.map(o => `<div class="card pad" style="margin-bottom:10px"><div class="row"><h3>${esc(o.rname)}</h3><span class="price">${money(o.total)}</span></div><p class="muted">${new Date(o.date).toLocaleDateString()} · ${stLabel(o.status)}</p><div class="row"><button class="btn" onclick="go('#/track/${o.id}')">${t('track')}</button><button class="btn primary" data-re="${o.id}">${t('reorder')}</button></div></div>`).join('')}`;
}
async function vPro() {
  const live = S.orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  return `<h2>${t('pro')}</h2><p class="muted">${t('proNote')}</p>
  ${live.map(o => `<div class="card pad" style="margin:10px 0"><b>${o.id}</b> · ${esc(o.rname)} · ${stLabel(o.status)}<p class="muted">${t('split')} — ${t('rest')} ${money(o.restaurant)} · ${t('mokova')} ${money(o.commission)} · ${t('courier')} ${money(o.courier)}</p><button class="btn primary" data-st="${o.id}|${STATUSES[STATUSES.indexOf(o.status) + 1]}">${t('advance')}</button></div>`).join('')}
  <h2>${t('adminZones')}</h2><div class="card pad">${S.zones.map(z => `<div class="row" style="margin-bottom:8px"><label style="margin:0;flex:1" for="f${z.id}">${esc(z.name)}</label><input id="f${z.id}" data-zf="${z.id}" type="number" min="0" value="${z.fee}" style="width:100px"><input type="checkbox" data-za="${z.id}" ${z.active ? 'checked' : ''} aria-label="actif" style="width:28px;min-height:28px"></div>`).join('')}</div>`;
}
async function vProfile() {
  const u = S.user;
  return `<h2>${t('profile')}</h2><div class="card pad">${u ? `<p><b>${esc(u.name)}</b></p><p class="muted">${esc(u.phone || '')} · ${esc(u.email || '')}</p><p class="muted">${t('role')} : ${t(u.role)}</p>` : `<button class="btn primary" onclick="go('#/login')">${t('login')}</button>`}
  <label for="lg">${t('lang')}</label><select id="lg" onchange="setLang(this.value)">${[['fr', 'Français'], ['ht', 'Kreyòl ayisyen'], ['es', 'Español']].map(([c, n]) => `<option value="${c}" ${S.lang === c ? 'selected' : ''}>${n}</option>`).join('')}</select>
  ${S.hood ? `<p class="muted">${esc(S.hood)} — ${findZone(S.hood) ? esc(findZone(S.hood).name) : ''}</p>` : ''}${u ? `<br><button class="btn block" id="out">${t('logout')}</button>` : ''}</div>`;
}
const field = (id, label, type = 'text') => `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}"><div class="err" data-e="${id}"></div></div>`;
async function vLogin() {
  return `<h2>${t('login')}</h2><form id="lf" class="card pad" novalidate>${field('id', t('email'))}${field('pw', t('pwd'), 'password')}<br><button class="btn primary block">${t('login')}</button><br><br><button type="button" class="btn block" id="guest">${t('guest')}</button><p><button type="button" class="btn" style="border:0" id="fg">${t('forgot')}</button> <button type="button" class="btn" style="border:0" onclick="go('#/signup')">${t('signup')}</button></p><p class="muted" id="fgm"></p></form>`;
}
let signRole = 'client';
async function vSignup(role) {
  if (role) signRole = role;
  return `<h2>${t('signup')}</h2><form id="sf" class="card pad" novalidate><div class="pay" id="roles">${['client', 'restaurant', 'driver'].map(r => `<button type="button" class="${signRole === r ? 'on' : ''}" data-r="${r}">${t(r)}</button>`).join('')}</div>
  ${field('name', t('name'))}${field('phone', t('phone'), 'tel')}${field('email', t('mail'), 'email')}${field('pw', t('pwd'), 'password')}${field('pw2', t('pwd2'), 'password')}<br><button class="btn primary block">${t('signup')}</button></form>`;
}
function showErrors(E) { document.querySelectorAll('[data-e]').forEach(e => { e.textContent = E[e.dataset.e] || ''; e.parentElement.classList.toggle('bad', !!E[e.dataset.e]); }); return !Object.keys(E).length; }

/* ============ 9. ÉVÉNEMENTS ============ */
function bind() {
  document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { const [r, i, q] = b.dataset.q.split('|'); setQty(r, i, +q); });
  document.querySelectorAll('[data-st]').forEach(b => b.onclick = async () => { const [i, s] = b.dataset.st.split('|'); await updateOrderStatus(i, s); render(); });
  document.querySelectorAll('[data-re]').forEach(b => b.onclick = () => { const o = S.orders.find(x => x.id === b.dataset.re), r = RESTAURANTS.find(x => x.id === o.rid); S.cart = { rid: r.id, items: {} }; o.items.forEach(i => { const m = r.menu.find(x => x.name === i.name); if (m && m.stock > 0) S.cart.items[m.id] = Math.min(i.q, m.stock); }); saveCart(); go('#/cart'); });
  const hs = $('#hoodSel'); if (hs) hs.onchange = () => { S.hood = hs.value; store.set('hood', S.hood); render(); };
  const q = $('#q'); if (q) q.oninput = () => { filter.q = q.value; const p = q.selectionStart; render().then(() => { const n = $('#q'); n.focus(); n.setSelectionRange(p, p); }); };
  document.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { filter.cat = b.dataset.cat; render(); });
  document.querySelectorAll('[data-zf]').forEach(i => i.onchange = async () => { const z = S.zones.find(x => x.id === i.dataset.zf); z.fee = Math.max(0, +i.value || 0); await saveZones(S.zones); });
  document.querySelectorAll('[data-za]').forEach(i => i.onchange = async () => { S.zones.find(x => x.id === i.dataset.za).active = i.checked; await saveZones(S.zones); });
  const co = $('#co'); if (co) {
    $('#hood').onchange = updateSum; updateSum();
    document.querySelectorAll('#pay button').forEach(b => b.onclick = () => { document.querySelectorAll('#pay button').forEach(x => x.classList.remove('on')); b.classList.add('on'); $('#accl').textContent = b.dataset.m === 'card' ? t('cardNo') : t('momo'); });
    co.onsubmit = e => { e.preventDefault(); submitOrder(co); };
  }
  document.querySelectorAll('#roles button').forEach(b => b.onclick = () => { signRole = b.dataset.r; document.querySelectorAll('#roles button').forEach(x => x.classList.toggle('on', x === b)); });
  const sf = $('#sf'); if (sf) sf.onsubmit = async e => {
    e.preventDefault(); const v = n => sf.elements[n].value.trim(), E = {};
    if (!v('name')) E.name = t('req'); if (!PHONE_RE.test(v('phone'))) E.phone = t('badPhone');
    if (!/^\S+@\S+\.\S+$/.test(v('email'))) E.email = t('badMail'); if (v('pw').length < 8) E.pw = t('short');
    if (v('pw') !== v('pw2')) E.pw2 = t('mismatch');
    if (showErrors(E)) { await saveProfile({ name: v('name'), phone: v('phone'), email: v('email'), role: signRole }); go('#/' + (signRole === 'client' ? '' : 'pro')); }
  };
  const lf = $('#lf'); if (lf) {
    lf.onsubmit = async e => { e.preventDefault(); const E = {}; if (!lf.elements.id.value.trim()) E.id = t('req'); if (lf.elements.pw.value.length < 8) E.pw = t('short');
      if (showErrors(E)) { const id = lf.elements.id.value.trim(); await saveProfile({ name: id, phone: '', email: id, role: 'client' }); go('#/'); } };
    $('#guest').onclick = () => go('#/restaurants');
    $('#fg').onclick = () => { $('#fgm').textContent = t('sent'); };
  }
  const out = $('#out'); if (out) out.onclick = async () => { store.set('user', null); go('#/'); render(); };
}
document.documentElement.lang = S.lang;
render();
