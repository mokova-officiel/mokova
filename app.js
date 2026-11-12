'use strict';
/* ============ 1. CONFIGURATION ============ */
const CONFIG = { appName: 'MOKOVA', currency: 'HTG', commission: 0.10, defaultLang: 'fr', restoDelayMin: 10, driverDelayMin: 3 };

/* ============ 2. DONNÉES INITIALES ============ */
const ZONES = [
  { id: 'z1', name: 'Zone 1 — Cœur', fee: 100, active: true, hoods: ['Pétion-Ville centre', 'Delmas 40', 'Delmas 60', 'Delmas 75'] },
  { id: 'z2', name: 'Zone 2 — Proche', fee: 175, active: true, hoods: ['Delmas 2 à 33', 'Nazon', 'Turgeau', 'Bourdon', 'Pacot', 'Canapé-Vert', 'Frères'] },
  { id: 'z3', name: 'Zone 3 — Étendue', fee: 250, active: true, hoods: ['Clercine', 'Fleuriot', "Zone de l'aéroport", 'Pernier', 'Centre-ville'] },
  { id: 'z4', name: 'Zone 4 — Éloignée', fee: 350, active: true, hoods: ['Thomassin haut', 'Fermathe', 'Kenscoff bas', 'Croix-des-Missions', 'Tabarre est'] }
];
const OUT_OF_AREA = ['Carrefour et Fontamara', 'Martissant', 'Cité Soleil', 'Croix-des-Bouquets', 'Kenscoff haut'];
const CATEGORIES = ['Grillades', 'Fritay', 'Soupes', 'Pizzas et burgers', 'Poulet', 'Fruits de mer', 'Végétarien', 'Desserts et jus'];
const CAT_ICON = ['flame', 'fry', 'bowl', 'pizza', 'leg', 'fish', 'leaf', 'cup'];
const STATUSES = ['received', 'accepted', 'preparing', 'ready', 'pickedup', 'delivering', 'delivered'];
const U = id => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=640&q=70';
const PH = { hero: U('photo-1504674900247-0877df9cc836'), grill: U('photo-1555939594-58d7cb561ad1'), fritay: U('photo-1504674900247-0877df9cc836'), soup: U('photo-1547592166-23ac45744acd'), pizza: U('photo-1565299624946-b28f40a0ae38'), burger: U('photo-1568901346375-23c9450c58cd'), chicken: U('photo-1598103442097-8b74394b95c6'), sea: U('photo-1519708227418-c8fd9a32b7a2'), veg: U('photo-1546069901-ba9599a7e63c'), sweet: U('photo-1567620905732-2d1ec7ab7445'), juice: U('photo-1600271886742-f049cd451bba'), rice: U('photo-1512058564366-18510be2db19'), place: U('photo-1414235077428-338989a2e8c0'), steak: U('photo-1544025162-d76694265947') };
const photo = k => PH[k] || k || PH.place;
/* Restaurant : id, nom, catégories, note, avis, délai, quartier, zones, horaires, photo, vedette, plats [nom, description, prix, catégorie, stock, photo] */
const RAW = [
  ['r1', 'Chez Tante Marie', ['Fritay', 'Grillades'], 4.7, 212, 25, 'Pétion-Ville centre', [1, 2, 3], [7, 22], 'fritay', 1, [['Griot et bannann', 'Porc mariné frit, bananes pesées, pikliz', 650, 'Fritay', 20, 'fritay'], ['Tasso kabrit', 'Chèvre séchée frite, pikliz maison', 750, 'Fritay', 15, 'fritay'], ['Akra (12)', 'Beignets de malanga croustillants', 300, 'Fritay', 40, 'fritay'], ['Bœuf grillé', 'Tranches de bœuf grillées, riz collé', 850, 'Grillades', 12, 'steak'], ['Poisson gros sel', 'Poisson grillé, sauce ti-malice', 900, 'Grillades', 0, 'sea']]],
  ['r2', 'Soup Joumou Express', ['Soupes'], 4.5, 148, 30, 'Delmas 40', [1, 2], [6, 21], 'soup', 1, [['Soup joumou', 'Soupe de giraumon, bœuf et légumes', 500, 'Soupes', 30, 'soup'], ['Bouyon tèt kabrit', 'Bouillon épicé traditionnel', 700, 'Soupes', 12, 'soup'], ['Soup pwa', 'Soupe de haricots et dumplings', 450, 'Soupes', 25, 'soup'], ['Bouyon legim', 'Bouillon de légumes racines', 400, 'Soupes', 20, 'veg'], ['Jus de cerise', 'Jus frais 33 cl', 150, 'Desserts et jus', 30, 'juice']]],
  ['r3', 'Poulet Delmas', ['Poulet'], 4.3, 96, 25, 'Delmas 60', [1, 2, 3, 4], [9, 22], 'chicken', 0, [['Poulet rôti ¼', 'Quart de poulet, riz collé aux pois', 600, 'Poulet', 25, 'chicken'], ['Poulet en sauce', 'Cuisse en sauce créole, riz blanc', 700, 'Poulet', 20, 'chicken'], ['Poulet frit (6)', 'Six morceaux croustillants, bannann', 950, 'Poulet', 15, 'chicken'], ['Riz djon-djon', 'Riz aux champignons noirs', 400, 'Poulet', 20, 'rice'], ['Jus de citron', 'Citronnade fraîche', 120, 'Desserts et jus', 30, 'juice']]],
  ['r4', 'Kay Lanmè', ['Fruits de mer'], 4.8, 175, 40, 'Bourdon', [1, 2, 3], [11, 22], 'sea', 1, [['Lambi en sauce', 'Conque mijotée, riz djon-djon', 1400, 'Fruits de mer', 10, 'sea'], ['Crevettes grillées', "Crevettes à l'ail, bannann peze", 1600, 'Fruits de mer', 8, 'sea'], ['Poisson frit', 'Vivaneau entier, pikliz', 1200, 'Fruits de mer', 14, 'sea'], ['Poisson en sauce', 'Filet en sauce créole', 1100, 'Fruits de mer', 10, 'sea'], ['Jus de maracudja', 'Fruit de la passion pressé', 180, 'Desserts et jus', 20, 'juice']]],
  ['r5', 'Verdure Pacot', ['Végétarien', 'Desserts et jus'], 4.4, 61, 30, 'Pacot', [2, 3], [8, 20], 'veg', 0, [['Legim', 'Ragoût de légumes, riz blanc', 550, 'Végétarien', 18, 'veg'], ['Bol de pois noirs', 'Haricots noirs, avocat, plantain', 500, 'Végétarien', 20, 'rice'], ['Salade tropicale', 'Mangue, avocat, légumes croquants', 450, 'Végétarien', 15, 'veg'], ['Pen patat', 'Gâteau de patate douce', 250, 'Desserts et jus', 20, 'sweet'], ['Jus de canne', 'Pressé frais', 150, 'Desserts et jus', 25, 'juice']]],
  ['r6', 'Pizza Nazon', ['Pizzas et burgers'], 4.2, 88, 35, 'Nazon', [2, 3], [11, 23], 'pizza', 0, [['Pizza margherita', 'Tomate, mozzarella, basilic', 900, 'Pizzas et burgers', 15, 'pizza'], ['Pizza poulet', 'Poulet, poivrons, oignons', 1100, 'Pizzas et burgers', 12, 'pizza'], ['Pizza légumes', 'Légumes du marché grillés', 950, 'Pizzas et burgers', 10, 'pizza'], ['Calzone', 'Pizza pliée fromage et jambon', 1000, 'Pizzas et burgers', 8, 'pizza'], ['Jus de goyave', 'Goyave fraîche', 150, 'Desserts et jus', 20, 'juice']]],
  ['r7', 'Burger Canapé-Vert', ['Pizzas et burgers'], 4.1, 73, 30, 'Canapé-Vert', [2, 3, 4], [11, 23], 'burger', 0, [['Burger classique', 'Bœuf, cheddar, salade, tomate', 750, 'Pizzas et burgers', 25, 'burger'], ['Double burger', 'Deux steaks, sauce maison', 1000, 'Pizzas et burgers', 15, 'burger'], ['Burger poulet', 'Poulet pané, mayonnaise pikliz', 800, 'Pizzas et burgers', 20, 'burger'], ['Frites maison', 'Pommes de terre fraîches', 300, 'Fritay', 40, 'fritay'], ['Milkshake vanille', 'Lait glacé, vanille', 350, 'Desserts et jus', 15, 'sweet']]],
  ['r8', 'Grill Turgeau', ['Grillades'], 4.6, 130, 35, 'Turgeau', [1, 2, 3], [10, 22], 'grill', 1, [['Brochettes mixtes', 'Bœuf et poulet, légumes grillés', 900, 'Grillades', 20, 'grill'], ['Côtes de porc', 'Marinade épicée, bannann peze', 950, 'Grillades', 12, 'grill'], ['Poulet grillé', 'Demi-poulet, sauce ail-citron', 850, 'Poulet', 15, 'chicken'], ['Steak sauce créole', 'Bœuf grillé, riz blanc', 1100, 'Grillades', 10, 'steak'], ['Jus de tamarin', 'Tamarin frais sucré', 150, 'Desserts et jus', 25, 'juice']]],
  ['r9', 'Fritay Tabarre', ['Fritay'], 4.0, 54, 40, 'Tabarre est', [3, 4], [8, 21], 'fritay', 0, [['Fritay complet', 'Griot, bannann, marinad, pikliz', 700, 'Fritay', 30, 'fritay'], ['Marinad (10)', 'Beignets salés épicés', 250, 'Fritay', 50, 'fritay'], ['Bannann peze', 'Plantain frit pesé', 200, 'Fritay', 40, 'fritay'], ['Patat fri', 'Patate douce frite', 250, 'Fritay', 20, 'fritay'], ['Jus de citron', 'Citronnade fraîche', 120, 'Desserts et jus', 30, 'juice']]],
  ['r10', 'Jus Natirèl', ['Desserts et jus'], 4.9, 201, 20, 'Delmas 75', [1, 2], [7, 20], 'juice', 1, [['Jus de mangue', 'Mangue Francisque pressée', 200, 'Desserts et jus', 30, 'juice'], ['Jus de corossol', 'Corossol onctueux', 220, 'Desserts et jus', 20, 'juice'], ['Jus de canne', 'Canne pressée à la commande', 150, 'Desserts et jus', 30, 'juice'], ['Pain patate', 'Gâteau à la patate douce', 300, 'Desserts et jus', 15, 'sweet'], ['Dous makos', 'Confiserie de lait et coco', 200, 'Desserts et jus', 25, 'sweet']]],
  ['r11', 'Lakay Gourmand', ['Grillades', 'Poulet'], 4.4, 112, 30, 'Frères', [1, 2, 3, 4], [10, 22], 'place', 0, [['Assiette lakay', 'Griot, riz collé, légumes, pikliz', 800, 'Grillades', 25, 'rice'], ['Poulet en sauce', 'Poulet mijoté, riz blanc', 700, 'Poulet', 20, 'chicken'], ['Tasso dinde', 'Dinde séchée frite', 700, 'Grillades', 15, 'fritay'], ['Légumes sautés', 'Chou, carottes, poivrons', 400, 'Végétarien', 20, 'veg'], ['Jus de goyave', 'Goyave fraîche', 150, 'Desserts et jus', 20, 'juice']]],
  ['r12', 'Bouyon Fermathe', ['Soupes'], 3.9, 41, 45, 'Fermathe', [3, 4], [16, 21], 'soup', 0, [['Bouyon', 'Bouillon de racines et viande', 600, 'Soupes', 20, 'soup'], ['Soup vèmicèl', 'Vermicelles au poulet', 450, 'Soupes', 20, 'soup'], ['Soup zonbi', 'Soupe de tubercules', 500, 'Soupes', 15, 'soup'], ['Pain beurre', 'Pain frais beurré', 100, 'Desserts et jus', 40, 'sweet'], ['Jus de cerise', 'Cerise pressée', 150, 'Desserts et jus', 20, 'juice']]]
];
const RESTAURANTS = RAW.map(r => ({ id: r[0], name: r[1], cats: r[2], rating: r[3], reviews: r[4], eta: r[5], hood: r[6], zones: r[7].map(n => 'z' + n), hours: r[8], photo: r[9], popular: !!r[10], prep: r[5], menu: r[11].map((m, i) => ({ id: r[0] + 'm' + i, name: m[0], desc: m[1], price: m[2], cat: m[3], stock: m[4], photo: m[5], on: true })) }));
const REVIEW_POOL = [['Jean', 5, 'Plats chauds et livraison rapide.'], ['Nadège', 5, 'Un régal, je recommande.'], ['Wilner', 4, 'Très bon, portions généreuses.'], ['Fabiola', 4, 'Bon rapport qualité prix.'], ['Roosevelt', 5, 'Goût authentique, comme à la maison.'], ['Mimose', 3, 'Bon mais un peu de retard.']];
const reviewsFor = id => { const n = +id.slice(1); return [0, 1, 2].map(i => { const v = REVIEW_POOL[(n + i * 2) % 6]; return { who: v[0], stars: v[1], text: v[2], date: '2026-10-' + String(10 + ((n + i * 5) % 18)) }; }); };
const SEED_PW = 'mokova2026';
const ACCOUNTS = [
  { id: 'u1', role: 'client', name: 'Marie Joseph', phone: '3412 5678', email: 'client@mokova.ht', pw: SEED_PW },
  { id: 'u2', role: 'restaurant', name: 'Tante Marie', phone: '3698 1200', email: 'resto@mokova.ht', rid: 'r1', pw: SEED_PW, active: true },
  { id: 'u3', role: 'driver', name: 'Jean-Robert Pierre', phone: '3755 4410', email: 'livreur@mokova.ht', zones: ['z1', 'z2', 'z3'], pw: SEED_PW, active: true },
  { id: 'u4', role: 'driver', name: 'Samuel Étienne', phone: '3822 7765', email: 'livreur2@mokova.ht', zones: ['z2', 'z3', 'z4'], pw: SEED_PW, active: true },
  { id: 'u5', role: 'admin', name: 'Administration MOKOVA', phone: '3400 2020', email: 'admin@mokova.ht', pw: SEED_PW }
];

/* ============ 3. TRADUCTIONS : clé: [fr, ht, es] — repli sur le français ============ */
const TR = {
  home: ['Accueil', 'Akèy', 'Inicio'], orders: ['Commandes', 'Kòmand', 'Pedidos'], pro: ['Espaces pro', 'Espas pwofesyonèl', 'Espacios pro'], profile: ['Profil', 'Pwofil', 'Perfil'],
  login: ['Connexion', 'Konekte', 'Entrar'], signup: ['Inscription', 'Enskri', 'Registro'], deliverTo: ['Livrer à', 'Livre nan', 'Entregar en'], choose: ['Choisir un quartier', 'Chwazi yon katye', 'Elegir un barrio'],
  hi: ['Salut, <span>affamé</span> ?', 'Bonjou, <span>grangou</span> ?', 'Hola, ¿<span>hambre</span>?'], hiSub: ['Choisis ton plat, on le livre là où tu es.', 'Chwazi manje ou, nou livre l kote ou ye.', 'Elige tu plato, lo llevamos donde estés.'],
  searchPh: ['Restaurant ou plat', 'Restoran oswa manje', 'Restaurante o plato'], go: ['Chercher', 'Chèche', 'Buscar'], slogan2: ['Kòmande fasil. Resevwa kote ou vle.', 'Kòmande fasil. Resevwa kote ou vle.', 'Kòmande fasil. Resevwa kote ou vle.'],
  promoK: ['Offre de lancement', 'Òf lansman', 'Oferta de lanzamiento'], promoT: ['Livraison à tarif fixe', 'Livrezon a tarif fiks', 'Entrega a tarifa fija'], promoS: ['Tu connais les frais avant de payer.', 'Ou konnen frè yo anvan ou peye.', 'Conoces el costo antes de pagar.'],
  top: ['Les mieux notés', 'Pi bon nòt yo', 'Los mejor valorados'], restos: ['Restaurants', 'Restoran', 'Restaurantes'], sort: ['Trier :', 'Triye :', 'Ordenar:'], s_rel: ['Pertinence', 'Pètinans', 'Relevancia'], s_rate: ['Meilleures notes', 'Pi bon nòt', 'Mejores notas'], s_fast: ['Livraison rapide', 'Livrezon rapid', 'Entrega rápida'], s_fee: ['Frais de livraison', 'Frè livrezon', 'Costo de entrega'],
  open: ['Ouvert', 'Ouvè', 'Abierto'], closed: ['Fermé', 'Fèmen', 'Cerrado'], reopens: ['réouvre à', 'rouvri a', 'reabre a las'], popular: ['Populaire', 'Popilè', 'Popular'], notServed: ['Indisponible pour cette adresse', 'Pa disponib pou adrès sa a', 'No disponible para esta dirección'],
  delivery: ['Livraison', 'Livrezon', 'Entrega'], soldout: ['Épuisé', 'Fini', 'Agotado'], zonesServed: ['Zones desservies', 'Zòn nou sèvi', 'Zonas atendidas'], reviewsT: ['Avis clients', 'Avi kliyan', 'Opiniones'],
  seeCart: ['Voir mon panier', 'Gade panye mwen', 'Ver mi carrito'], cart: ['Mon panier', 'Panye mwen', 'Mi carrito'], emptyCart: ['Votre panier est vide', 'Panye ou vid', 'Tu carrito está vacío'], discover: ['Découvrir les restaurants', 'Dekouvri restoran yo', 'Descubrir restaurantes'],
  subtotal: ['Sous-total des plats', 'Sou-total manje', 'Subtotal de platos'], total: ['Total', 'Total', 'Total'], checkout: ['Valider la commande', 'Konfime kòmand lan', 'Confirmar pedido'], hood: ['Quartier', 'Katye', 'Barrio'], address: ['Adresse précise et repère', 'Adrès egzak ak repè', 'Dirección exacta y referencia'],
  phone: ['Téléphone', 'Telefòn', 'Teléfono'], note: ['Commentaire pour le restaurant', 'Kòmantè pou restoran an', 'Comentario para el restaurante'], pay: ['Paiement', 'Peman', 'Pago'], card: ['Carte bancaire', 'Kat labank', 'Tarjeta'], cardNo: ['Numéro de carte (16 chiffres)', 'Nimewo kat (16 chif)', 'Número de tarjeta (16 dígitos)'], acct: ['Numéro du compte', 'Nimewo kont lan', 'Número de cuenta'],
  payNow: ['Payer et commander', 'Peye epi kòmande', 'Pagar y pedir'], req: ['Champ obligatoire', 'Chan obligatwa', 'Campo obligatorio'], badPhone: ['Numéro haïtien invalide', 'Nimewo ayisyen pa valab', 'Número haitiano inválido'], outArea: ["La livraison n'est pas encore disponible dans ce quartier.", 'Nou poko livre nan katye sa a.', 'Aún no entregamos en este barrio.'],
  thanks: ['Commande confirmée', 'Kòmand konfime', 'Pedido confirmado'], code: ['Code de confirmation', 'Kòd konfimasyon', 'Código de confirmación'], codeHint: ['À donner au livreur à la porte.', 'Bay livrè a l nan pòt la.', 'Dáselo al repartidor.'], track: ['Suivre ma commande', 'Swiv kòmand mwen', 'Seguir mi pedido'], eta: ['Arrivée estimée', 'Rive estime', 'Llegada estimada'], min: ['min', 'min', 'min'],
  noOrders: ['Aucune commande pour le moment', 'Pa gen kòmand pou kounye a', 'Aún no hay pedidos'], noResult: ['Aucun résultat', 'Pa gen rezilta', 'Sin resultados'], otherResto: ["Panier d'un autre restaurant", 'Panye yon lòt restoran', 'Carrito de otro restaurante'], clearAsk: ['Vider le panier et commencer une nouvelle commande ?', 'Vide panye a epi kòmanse yon nouvo kòmand ?', '¿Vaciar el carrito y empezar un nuevo pedido?'],
  cancel: ['Annuler', 'Anile', 'Cancelar'], yesClear: ['Vider le panier', 'Vide panye a', 'Vaciar'], all: ['Toutes', 'Tout', 'Todas'], logout: ['Se déconnecter', 'Dekonekte', 'Cerrar sesión'], guest: ['Continuer en invité', 'Kontinye kòm envite', 'Continuar como invitado'], idf: ['E-mail ou téléphone', 'Imèl oswa telefòn', 'Correo o teléfono'], pwd: ['Mot de passe', 'Modpas', 'Contraseña'], pwd2: ['Confirmer le mot de passe', 'Konfime modpas', 'Confirmar contraseña'],
  fullName: ['Nom complet', 'Non konplè', 'Nombre completo'], mail: ['Adresse e-mail', 'Adrès imèl', 'Correo electrónico'], badMail: ['E-mail invalide', 'Imèl pa valab', 'Correo inválido'], short: ['8 caractères minimum', '8 karaktè minimòm', 'Mínimo 8 caracteres'], mismatch: ['Les mots de passe diffèrent', 'Modpas yo pa menm', 'Las contraseñas no coinciden'], forgot: ['Mot de passe oublié', 'Bliye modpas', 'Olvidé mi contraseña'],
  badLogin: ['Identifiants incorrects', 'Idantifyan pa bon', 'Credenciales incorrectas'], sent: ['Si ce compte existe, un message vient d’être envoyé.', 'Si kont lan egziste, nou fèk voye yon mesaj.', 'Si la cuenta existe, se envió un mensaje.'], quick: ['Accès rapide aux comptes', 'Aksè rapid ak kont yo', 'Acceso rápido a cuentas'],
  welcome: ['Bon retour', 'Byenvenu ankò', 'Bienvenido de nuevo'], create: ['Créer un compte', 'Kreye yon kont', 'Crear una cuenta'], loginSub: ['Connecte-toi pour commander et suivre tes livraisons.', 'Konekte pou kòmande epi swiv livrezon ou.', 'Entra para pedir y seguir tus entregas.'], backHome: ["Retour à l'accueil", 'Tounen nan akèy', 'Volver al inicio'], or: ['ou', 'oswa', 'o'],
  client: ['Client', 'Kliyan', 'Cliente'], restaurant: ['Restaurant', 'Restoran', 'Restaurante'], driver: ['Livreur', 'Livrè', 'Repartidor'], admin: ['Administrateur', 'Administratè', 'Administrador'], rc: ['Je commande des plats', 'Mwen kòmande manje', 'Pido platos'], rr: ['Je vends mes plats', 'Mwen vann manje m', 'Vendo mis platos'], rd: ['Je livre des courses', 'Mwen livre kòmand', 'Reparto pedidos'],
  estab: ["Nom de l'établissement", 'Non etablisman an', 'Nombre del local'], cuisines: ['Cuisines proposées', 'Kwizin nou ofri', 'Cocinas'], baseHood: ['Quartier de base', 'Katye baz', 'Barrio base'], vehicle: ['Moyen de déplacement', 'Mwayen deplasman', 'Medio de transporte'], moto: ['Moto', 'Moto', 'Moto'], bike: ['Vélo', 'Bisiklèt', 'Bicicleta'], car: ['Voiture', 'Machin', 'Coche'],
  lang: ['Langue', 'Lang', 'Idioma'], addresses: ['Adresses de livraison', 'Adrès livrezon', 'Direcciones'], reorder: ['Recommander', 'Kòmande ankò', 'Pedir de nuevo'], cancelOrder: ['Annuler la commande', 'Anile kòmand lan', 'Cancelar pedido'], contactResto: ['Contacter le restaurant', 'Kontakte restoran an', 'Contactar al restaurante'], report: ['Signaler un problème', 'Siyale yon pwoblèm', 'Informar un problema'],
  reason: ['Motif', 'Rezon', 'Motivo'], r_late: ['Retard', 'Reta', 'Retraso'], r_missing: ['Plat manquant', 'Manje manke', 'Plato faltante'], r_wrong: ['Plat incorrect', 'Move manje', 'Plato incorrecto'], r_none: ['Commande non reçue', 'Kòmand pa resevwa', 'Pedido no recibido'], details: ['Détails', 'Detay', 'Detalles'], send: ['Envoyer', 'Voye', 'Enviar'], reported: ['Signalement envoyé', 'Siyalman voye', 'Informe enviado'],
  rateT: ['Notez votre commande', 'Bay kòmand lan yon nòt', 'Califica tu pedido'], rateR: ['Restaurant', 'Restoran', 'Restaurante'], rateD: ['Livreur', 'Livrè', 'Repartidor'], comment: ['Commentaire (facultatif)', 'Kòmantè (si ou vle)', 'Comentario (opcional)'], thanksRate: ['Merci pour votre avis', 'Mèsi pou avi w', 'Gracias por tu opinión'],
  driverName: ['Livreur', 'Livrè', 'Repartidor'], pending: ['En attente', 'Ap tann', 'Pendiente'], contactMsg: ['Le restaurant a été prévenu.', 'Restoran an resevwa mesaj la.', 'Se avisó al restaurante.'],
  st_received: ['Reçue', 'Resevwa', 'Recibido'], st_accepted: ['Acceptée', 'Aksepte', 'Aceptado'], st_preparing: ['En préparation', 'Ap prepare', 'Preparando'], st_ready: ['Prête', 'Pare', 'Listo'], st_pickedup: ['Prise en charge', 'Livrè pran l', 'Recogido'], st_delivering: ['En livraison', 'Ap livre', 'En camino'], st_delivered: ['Livrée', 'Livre', 'Entregado'], st_refused: ['Refusée', 'Refize', 'Rechazado'], st_cancelled: ['Annulée', 'Anile', 'Cancelado'], st_noresponse: ['Sans réponse', 'Pa gen repons', 'Sin respuesta'],
  how: ['Comment ça marche', 'Kijan sa mache', 'Cómo funciona'], h1: ['Choisis', 'Chwazi', 'Elige'], h1d: ['Un restaurant et tes plats.', 'Yon restoran ak manje ou.', 'Un restaurante y tus platos.'], h2: ['Paie en ligne', 'Peye sou entènèt', 'Paga en línea'], h2d: ['Carte, MonCash ou NatCash.', 'Kat, MonCash oswa NatCash.', 'Tarjeta, MonCash o NatCash.'], h3: ['Reçois', 'Resevwa', 'Recibe'], h3d: ['Suis ta livraison jusqu’à ta porte.', 'Swiv livrezon ou jiska pòt ou.', 'Sigue tu entrega hasta tu puerta.'],
  featured: ['Restaurants vedettes', 'Restoran an vedèt', 'Restaurantes destacados'], why: ['Pourquoi Mokova', 'Poukisa Mokova', 'Por qué Mokova'], w1: ['Paiement en ligne uniquement', 'Peman sou entènèt sèlman', 'Solo pago en línea'], w1d: ['Pas d’argent à préparer à la porte.', 'Pa bezwen lajan nan pòt la.', 'Sin efectivo en la puerta.'], w2: ['Frais fixes par zone', 'Frè fiks pa zòn', 'Tarifa fija por zona'], w2d: ['Le tarif est connu avant de payer.', 'Ou konnen tarif la anvan ou peye.', 'La tarifa se conoce antes de pagar.'], w3: ['Suivi en temps réel', 'Swivi an tan reyèl', 'Seguimiento en tiempo real'], w3d: ['Avec un code de confirmation.', 'Ak yon kòd konfimasyon.', 'Con código de confirmación.'], w4: ['Commission claire de 10 %', 'Komisyon klè 10 %', 'Comisión clara del 10 %'], w4d: ['Sur les plats uniquement, jamais sur la livraison.', 'Sou manje sèlman, pa janm sou livrezon.', 'Solo sobre los platos.'],
  zoneFees: ['Frais de livraison par zone', 'Frè livrezon pa zòn', 'Costo de entrega por zona'], calcNote: ['Calcul type : plats 2 000 HTG + livraison Zone 3 250 HTG = 2 250 HTG. Restaurant 1 800, MOKOVA 200, livreur 250.', 'Kalkil: manje 2 000 HTG + livrezon Zòn 3 250 HTG = 2 250 HTG.', 'Cálculo: platos 2 000 HTG + entrega Zona 3 250 HTG = 2 250 HTG.'],
  sell: ['Tu vends ou tu livres ?', 'Ou vann oswa ou livre ?', '¿Vendes o repartes?'], beResto: ['Devenir restaurant', 'Vin restoran', 'Ser restaurante'], beDriver: ['Devenir livreur', 'Vin livrè', 'Ser repartidor'], earn: ['100 % des frais de livraison', '100 % frè livrezon yo', '100 % del costo de entrega'], earnD: ['de 100 à 350 HTG par course', 'de 100 a 350 HTG pa kous', 'de 100 a 350 HTG por viaje'],
  rdSoon: ['République dominicaine : bientôt disponible', 'Repiblik Dominikèn : talè konsa', 'República Dominicana: próximamente'], orderNow: ['Commander maintenant', 'Kòmande kounye a', 'Pedir ahora'], heroK: ['Port-au-Prince • Haïti — Phase 1', 'Pòtoprens • Ayiti — Faz 1', 'Puerto Príncipe • Haití — Fase 1'], partners: ['restaurants partenaires', 'restoran patnè', 'restaurantes'], avg: ['livraison moyenne', 'livrezon mwayèn', 'entrega media'], zonesN: ['zones', 'zòn', 'zonas'],
  about: ['À propos', 'Konsènan nou', 'Acerca de'], terms: ["Conditions d'utilisation", 'Kondisyon itilizasyon', 'Condiciones de uso'], privacy: ['Politique de confidentialité', 'Konfidansyalite', 'Privacidad'], help: ['Aide et contact', 'Èd ak kontak', 'Ayuda y contacto'], servedZones: ['Zones desservies', 'Zòn nou sèvi', 'Zonas atendidas'], fallback: ['Un problème est survenu.', 'Te gen yon pwoblèm.', 'Ocurrió un problema.'],
  forProOnly: ['Cet espace est réservé aux comptes concernés. Connectez-vous avec le rôle correspondant.', 'Espas sa a se pou kont ki konsène yo. Konekte ak wòl ki kòrèk la.', 'Este espacio es solo para las cuentas correspondientes.'], save: ['Enregistrer', 'Sove', 'Guardar'], saved: ['Enregistré', 'Sove', 'Guardado'],
  /* Espaces pro (français) */
  overview: ['Vue d’ensemble'], received: ['Commandes reçues'], menu: ['Menu'], place: ['Établissement'], revenue: ['Revenus'], todayOrders: ['Commandes du jour'], todayRev: ['Chiffre d’affaires du jour'], avgRate: ['Note moyenne'], bestSellers: ['Plats les plus vendus'], accept: ['Accepter'], refuse: ['Refuser'], refuseWhy: ['Motif de refus'], toPrep: ['En préparation'], toReady: ['Commande prête'],
  answerIn: ['Répondre avant'], add: ['Ajouter'], remove: ['Retirer'], dishName: ['Nom'], dishDesc: ['Description'], dishPrice: ['Prix (HTG)'], dishCat: ['Catégorie'], dishPhoto: ['Adresse de la photo'], stock: ['Stock'], available: ['Disponible'], coverPhoto: ['Photo de couverture'], hours: ['Horaires (ouverture, fermeture)'], prep: ['Délai de préparation (min)'], net: ['Net restaurant'], commission: ['Commission'], day: ['Aujourd’hui'], week: ['7 derniers jours'],
  online: ['En ligne'], offline: ['Hors ligne'], offers: ['Livraisons proposées'], pickup: ['Retrait'], dropoff: ['Livraison'], distance: ['Distance'], gain: ['Gain'], take: ['Accepter'], pass: ['Passer'], current: ['Livraison en cours'], d0: ['Arrivé au restaurant'], d1: ['Commande récupérée'], d2: ['En route'], d3: ['Arrivé chez le client'], enterCode: ['Code du client (4 chiffres)'], confirmDeliv: ['Terminer la livraison'], badCode: ['Code incorrect. Demandez-le de nouveau au client.'], earnings: ['Gains'], deliveries: ['Livraisons effectuées'], none: ['Aucun élément'], goOnline: ['Passez en ligne pour recevoir des livraisons.'],
  sales: ['Ventes totales'], commissions: ['Commissions'], inProgress: ['Commandes en cours'], openResto: ['Restaurants ouverts'], onlineDrv: ['Livreurs en ligne'], last7: ['Ventes des 7 derniers jours'], reports: ['Signalements'], accounts: ['Comptes'], zonesT: ['Zones'], settings: ['Paramètres'], ledger: ['Journal'], markDone: ['Marquer comme traité'], internalNote: ['Note interne'], reassign: ['Réattribuer'], refund: ['Rembourser'], amount: ['Montant (HTG)'], refundWhy: ['Motif du remboursement'], split: ['Répartition'], fee: ['Tarif'], activeT: ['Actif'], rate: ['Commission (%)'], rDelay: ['Délai de réponse restaurant (min)'], dDelay: ['Délai de réponse livreur (min)'], filterAll: ['Tous'], period: ['Période'], all2: ['Tout']
};
const t = k => { const v = TR[k]; if (!v) return k; const i = { fr: 0, ht: 1, es: 2 }[S.lang]; return v[i] || v[0]; };

/* ============ 4. SERVICES DE DONNÉES ============
   Point de branchement prévu pour un backend plus tard :
   les vues n'appellent que ces fonctions asynchrones. */
const store = {
  get: (k, d) => { try { const v = localStorage.getItem('mokova_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem('mokova_' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
};
const getZones = async () => store.get('zones', ZONES);
const saveZones = async z => store.set('zones', z);
const getSettings = async () => store.get('settings', { commission: CONFIG.commission, restoDelay: CONFIG.restoDelayMin, driverDelay: CONFIG.driverDelayMin });
const saveSettings = async s => store.set('settings', s);
const getRestaurants = async () => { const p = store.get('rprof', {}); return RESTAURANTS.map(r => ({ ...r, ...(p[r.id] || {}) })); };
const saveRestaurantProfile = async (id, patch) => { const p = store.get('rprof', {}); p[id] = { ...(p[id] || {}), ...patch }; store.set('rprof', p); };
const getRestaurantMenu = async id => store.get('menus', {})[id] || (RESTAURANTS.find(r => r.id === id) || { menu: [] }).menu;
const saveRestaurantMenu = async (id, menu) => { const m = store.get('menus', {}); m[id] = menu; store.set('menus', m); };
const getOrders = async () => { let l = store.get('orders', null); if (!l) { l = seedOrders(); store.set('orders', l); } return l; };
const createOrder = async o => { const l = await getOrders(); l.unshift(o); store.set('orders', l); return o; };
const patchOrder = async (id, fn) => { const l = await getOrders(); const o = l.find(x => x.id === id); if (o) { fn(o); store.set('orders', l); } return o; };
const updateOrderStatus = async (id, status) => patchOrder(id, o => { o.status = status; o.history.push({ s: status, t: new Date().toISOString() }); });
const getAccounts = async () => store.get('accounts', ACCOUNTS);
const saveAccounts = async a => store.set('accounts', a);
const getCurrentUser = async () => store.get('user', null);
const saveProfile = async p => { store.set('user', p); const a = await getAccounts(); const i = a.findIndex(x => x.id === p.id); if (i < 0) a.push(p); else a[i] = { ...a[i], ...p }; await saveAccounts(a); return p; };
const getReports = async () => store.get('reports', []);
const saveReports = async r => store.set('reports', r);

/* ============ 5. ÉTAT ET OUTILS ============ */
const S = { lang: store.get('lang', CONFIG.defaultLang), cart: store.get('cart', { rid: null, items: {} }), hood: store.get('hood', ''), guest: store.get('guest', false), user: null, zones: ZONES, res: RESTAURANTS, menus: {}, orders: [], settings: {}, accounts: [], reports: [] };
const UI = { q: '', cat: '', sort: 'rel', proTab: {}, adm: { status: '', zone: '', rid: '', date: '', open: '' }, pay: 'card', role: 'client', authTab: 'login', period: 'all' };
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' HTG';
const PHONE_RE = /^(\+?509)?[\s-]?[2-5]\d{3}[\s-]?\d{4}$/;
const okPhone = v => PHONE_RE.exec(v.trim()) !== null;
const IC = { home: 'M3 11l9-8 9 8v10H4zM9 21v-7h6v7', orders: 'M6 2h12v20l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6', pro: 'M3 7h18v13H3zM8 7V4h8v3M3 13h18', profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5', bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4', heart: 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z', x: 'M6 6l12 12M18 6L6 18', pin: 'M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 2 1 2 0-3 0-5 2-8z', fry: 'M5 9h14l-2 12H7zM8 9l1-5M12 9V3M16 9l-1-5', bowl: 'M3 11h18a9 9 0 0 1-18 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4', pizza: 'M3 6c6-4 12-4 18 0l-9 15zM9 9h.01M14 10h.01M12 14h.01', leg: 'M14 4a5 5 0 0 1 3 8l-4 4-5-5 4-4zM9 15l-5 5', fish: 'M3 12c4-6 11-6 15 0-4 6-11 6-15 0zM18 12l3-3v6zM8 11h.01', leaf: 'M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8', cup: 'M6 8h12l-1 13H7zM8 8l1-5h6l1 5', shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z', clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v10M9 10h5a2 2 0 0 1 0 4H9', store: 'M4 9l1-5h14l1 5M4 9v11h16V9M9 20v-6h6v6', bike: 'M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15l4-8h5l3 8M10 7H8', arrow: 'M9 6l6 6-6 6' };
const ic = n => `<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="${IC[n] || ''}"/></svg>`;
const ph = (src, name, cls = '') => `<span class="ph ${cls}" data-n="${esc(name)}"><img loading="lazy" src="${esc(photo(src))}" alt="${esc(name)}" onerror="this.parentNode.classList.add('fail');this.remove()"></span>`;
const findZone = h => S.zones.find(z => z.hoods.includes(h));
const resOf = id => S.res.find(r => r.id === id);
const isOpen = r => { const h = new Date().getHours(); return h >= r.hours[0] && h < r.hours[1]; };
const serves = (r, h) => { const z = findZone(h); return !h || (!!z && z.active && r.zones.includes(z.id)); };
const cartCount = () => Object.values(S.cart.items).reduce((a, b) => a + b, 0);
const saveCart = () => store.set('cart', S.cart);
const stLabel = s => t('st_' + s);
const hhmm = d => new Date(d).toLocaleString(S.lang === 'es' ? 'es' : 'fr', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const dayKey = d => { const x = new Date(d); return x.getFullYear() * 400 + x.getMonth() * 32 + x.getDate(); };
const sameDay = (a, b) => dayKey(a) === dayKey(b);
const toast = m => { const e = $('#toast'); e.textContent = m; e.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => e.classList.remove('on'), 2200); };
const dist = id => (1.2 + (id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 48) / 10).toFixed(1) + ' km';
const findDish = id => { for (const rid in S.menus) { const m = S.menus[rid].find(x => x.id === id); if (m) return { r: resOf(rid), m }; } return null; };
const split = (sub, fee, rate) => { const c = Math.round(sub * rate); return { commission: c, restaurant: sub - c, courier: fee }; };
const makeOrder = (r, items, hood, extra) => { const z = findZone(hood), sub = items.reduce((a, i) => a + i.q * i.price, 0), fee = z ? z.fee : 0, s = split(sub, fee, S.settings.commission || CONFIG.commission); return { id: 'MK' + String(Date.now()).slice(-6) + Math.floor(Math.random() * 90 + 10), rid: r.id, rname: r.name, items, subtotal: sub, fee, zoneId: z ? z.id : '', zone: z ? z.name : '', total: sub + fee, ...s, hood, addr: '', phone: '', client: '', status: 'received', history: [], code: String(1000 + Math.floor(Math.random() * 9000)), eta: r.eta, date: new Date().toISOString(), driver: '', dstep: 0, refunds: [], skipped: [], ...extra }; };
function seedOrders() {
  const R = id => RESTAURANTS.find(r => r.id === id), mk = (rid, idx, hood, status, ageMin, drv) => {
    const r = R(rid), items = idx.map(([i, q]) => ({ name: r.menu[i].name, q, price: r.menu[i].price })), d = new Date(Date.now() - ageMin * 6e4).toISOString(), o = makeOrder(r, items, hood, { client: 'Marie Joseph', clientId: 'u1', phone: '3412 5678', addr: 'Rue Lamarre, près de la pharmacie', status, date: d, driver: drv || '', code: String(2000 + ageMin % 7000) });
    o.id = 'MK' + String(1e5 + ageMin); const upto = status === 'delivered' ? 6 : STATUSES.indexOf(status);
    o.history = STATUSES.slice(0, upto + 1).map((s, i) => ({ s, t: new Date(Date.now() - (ageMin - i * 4) * 6e4).toISOString() })); return o;
  };
  const l = [mk('r1', [[0, 2], [2, 1]], 'Delmas 60', 'received', 2), mk('r1', [[1, 1], [3, 1]], 'Nazon', 'preparing', 25), mk('r1', [[0, 1], [2, 2]], 'Turgeau', 'ready', 40), mk('r1', [[0, 2], [3, 1]], 'Pétion-Ville centre', 'delivered', 200, 'u3'), mk('r4', [[0, 1], [1, 1]], 'Pacot', 'delivered', 1500, 'u4'), mk('r8', [[0, 2]], 'Fleuriot', 'delivered', 2900, 'u3'), mk('r2', [[0, 3]], 'Delmas 40', 'delivered', 4300, 'u4'), mk('r1', [[2, 3]], 'Canapé-Vert', 'delivered', 5800, 'u3'), mk('r3', [[0, 2]], 'Pernier', 'delivered', 7200, 'u3'), mk('r10', [[0, 4]], 'Bourdon', 'delivered', 8600, 'u4')];
  return l;
}

/* ============ 6. PANIER ============ */
function setQty(rid, id, qty) {
  const d = findDish(id); if (!d) return;
  if (S.cart.rid && S.cart.rid !== rid && qty > 0) return confirmBox(t('otherResto'), t('clearAsk'), t('yesClear'), () => { S.cart = { rid, items: { [id]: 1 } }; saveCart(); render(); });
  qty = Math.max(0, Math.min(qty, d.m.stock)); S.cart.rid = rid;
  if (qty) S.cart.items[id] = qty; else delete S.cart.items[id];
  if (!cartCount()) S.cart = { rid: null, items: {} };
  saveCart(); render();
}
function cartTotals(hood) {
  const sub = Object.entries(S.cart.items).reduce((a, [id, q]) => { const d = findDish(id); return a + (d ? d.m.price * q : 0); }, 0), z = findZone(hood), fee = z && z.active ? z.fee : 0;
  return { sub, fee, zone: z, total: sub + fee };
}
function confirmBox(title, text, yes, onYes) {
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><h3>${esc(title)}</h3><p class="mut" style="margin-top:8px">${esc(text)}</p><div class="two"><button class="btn out" id="mn">${t('cancel')}</button><button class="btn o" id="my">${esc(yes)}</button></div></div>`;
  $('#mn').onclick = () => { m.hidden = true; }; $('#my').onclick = () => { m.hidden = true; onYes(); };
}

/* ============ 7. NAVIGATION ET ROUTAGE ============ */
const go = h => { location.hash = h; };
const route = () => { const [, v, a] = location.hash.split('/'); return { v: v || '', a }; };
const isPub = () => { const { v } = route(); return !S.user && !S.guest && ['', 'login', 'signup', 'info'].includes(v); };
const langPill = () => `<div class="lang" role="group" aria-label="${t('lang')}">${['fr', 'ht', 'es'].map(l => `<button data-act="lang" data-a="${l}" class="${S.lang === l ? 'on' : ''}">${l.toUpperCase()}</button>`).join('')}</div>`;
const brand = '<button class="brand" data-act="go" data-a="#/">MOKO<em>VA</em></button>';
function renderChrome() {
  const pub = isPub(), { v } = route(); $('#shell').classList.toggle('pub', pub);
  const addr = S.hood ? esc(S.hood) : t('choose');
  $('#hdr').className = 'hdr';
  $('#hdr').innerHTML = pub
    ? `<div class="hrow"><div>${brand}<span class="tag">Manje Ou • Kote Ou • Vle A</span></div><div class="pubbtns"><button class="btn o s" data-act="go" data-a="#/login">${t('login')}</button><button class="btn s" data-act="go" data-a="#/signup">${t('signup')}</button></div></div>`
    : `<div class="hrow"><button class="addr" data-act="go" data-a="#/restaurants" aria-label="${t('deliverTo')}"><small>${t('deliverTo')} • Port-au-Prince</small><b>${addr} ▾</b></button><button class="bell" aria-label="Notifications">${ic('bell')}<i></i></button></div><div class="hrow" style="margin-top:6px"><div>${brand}<span class="tag">Manje Ou • Kote Ou • Vle A</span></div>${langPill()}</div>`;
  const tab = (h, i, k) => `<button class="${(v || 'home') === h || (h === 'home' && ['', 'restaurants', 'menu', 'cart', 'checkout'].includes(v)) || (h === 'orders' && ['track', 'confirm'].includes(v)) ? 'on' : ''}" data-act="go" data-a="#/${h === 'home' ? '' : h}">${ic(i)}${t(k)}${h === 'orders' && S.orders.filter(o => !['delivered', 'cancelled', 'refused', 'noresponse'].includes(o.status) && (!S.user || o.clientId === S.user.id || !o.clientId)).length ? `<span class="bd">${S.orders.filter(o => !['delivered', 'cancelled', 'refused', 'noresponse'].includes(o.status)).length}</span>` : ''}</button>`;
  $('#nav').style.display = pub || ['login', 'signup'].includes(v) ? 'none' : '';
  $('#nav').innerHTML = tab('home', 'home', 'home') + tab('orders', 'orders', 'orders') + tab('pro', 'pro', 'pro') + tab('profile', 'profile', 'profile');
  const n = cartCount(), show = n && !pub && !['cart', 'checkout', 'login', 'signup'].includes(v);
  $('#cartbar').className = 'cartbar'; const r = resOf(S.cart.rid);
  $('#cartbar').innerHTML = show && r ? `<button data-act="go" data-a="#/cart"><span class="n">${n}</span><span class="l">${t('seeCart')}<small>${esc(r.name)}</small></span><span class="tt">${money(cartTotals(S.hood).sub)}</span></button>` : '';
}
async function load() {
  S.user = await getCurrentUser(); S.zones = await getZones(); S.settings = await getSettings(); S.res = await getRestaurants(); S.accounts = await getAccounts(); S.reports = await getReports();
  for (const r of S.res) S.menus[r.id] = await getRestaurantMenu(r.id);
  S.orders = await getOrders();
  for (const o of S.orders) if (o.status === 'received' && (Date.now() - new Date(o.date)) / 6e4 > S.settings.restoDelay) await updateOrderStatus(o.id, 'noresponse');
  S.orders = await getOrders();
}
async function render() {
  try {
    await load();
    const { v, a } = route();
    const V = { '': vHome, restaurants: vHome, menu: vMenu, cart: vCart, checkout: vCheckout, confirm: vTrack, track: vTrack, orders: vOrders, pro: vPro, profile: vProfile, login: vAuth, signup: vAuth, info: vInfo }[v] || vHome;
    $('#app').innerHTML = await V(a); renderChrome();
  } catch (e) { console.error(e); $('#app').innerHTML = `<div class="empty"><h3>${t('fallback')}</h3><button class="btn o" data-act="go" data-a="#/">${t('backHome')}</button></div>`; }
}
window.addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

/* ============ 8. VUES CLIENT ============ */
const hoodOptions = sel => `<option value="">${t('choose')}</option>` + S.zones.map(z => `<optgroup label="${esc(z.name)} — ${money(z.fee)}${z.active ? '' : ' (—)'}">${z.hoods.map(h => `<option ${h === sel ? 'selected' : ''}>${esc(h)}</option>`).join('')}</optgroup>`).join('') + `<optgroup label="—">${OUT_OF_AREA.map(h => `<option ${h === sel ? 'selected' : ''}>${esc(h)}</option>`).join('')}</optgroup>`;
const zoneLine = z => `${esc(z.name)} : ${z.hoods.map(esc).join(', ')}`;
function restoCard(r) {
  const z = findZone(S.hood), ok = serves(r, S.hood), o = isOpen(r);
  return `<button class="rcard ${ok ? '' : 'off'}" data-act="go" data-a="#/menu/${r.id}"><span class="ph" style="height:182px;border-radius:18px;box-shadow:0 12px 26px rgba(60,40,5,.12);position:relative" data-n="${esc(r.name)}"><img loading="lazy" style="width:100%;height:100%;object-fit:cover" src="${esc(photo(r.photo))}" alt="${esc(r.name)}" onerror="this.parentNode.classList.add('fail');this.remove()">${r.popular ? `<span class="ov tl">${t('popular')}</span>` : ''}<span class="ov tr">${ic('heart')}</span><span class="ov bl">${r.eta}–${r.eta + 15} ${t('min')}</span></span>
  <h3>${esc(r.name)}</h3><div class="meta">${r.cats.map(esc).join(', ')} · ${esc(r.hood)} · ${r.hours[0]}h–${r.hours[1]}h</div>
  <div class="pills"><span class="chip k">★ ${r.rating} (${r.reviews})</span><span class="chip">${r.eta}–${r.eta + 15} ${t('min')}</span>${z ? `<span class="chip">${t('delivery')} ${money(z.fee)}</span>` : ''}<span class="chip ${o ? 'g' : 'r'}">${o ? t('open') : t('closed') + ' · ' + t('reopens') + ' ' + r.hours[0] + 'h'}</span></div>${ok ? '' : `<div class="warn">${t('notServed')}</div>`}</button>`;
}
function listHTML() {
  let l = S.res.filter(r => !r.off && (!UI.cat || r.cats.includes(UI.cat) || S.menus[r.id].some(m => m.cat === UI.cat)) && (!UI.q || (r.name + S.menus[r.id].map(m => m.name).join(' ')).toLowerCase().includes(UI.q.toLowerCase())));
  const z = findZone(S.hood), f = r => (z && r.zones.includes(z.id) ? z.fee : 999);
  if (UI.sort === 'rate') l.sort((a, b) => b.rating - a.rating); else if (UI.sort === 'fast') l.sort((a, b) => a.eta - b.eta); else if (UI.sort === 'fee') l.sort((a, b) => f(a) - f(b));
  return l.map(restoCard).join('') || `<div class="empty"><h3>${t('noResult')}</h3></div>`;
}
async function vHome() {
  if (isPub()) return vShowcase();
  const feat = [...S.res].sort((a, b) => b.rating - a.rating)[0];
  return `<div class="hello"><h1>${t('hi')}</h1><p>${t('hiSub')}</p></div>
  <div class="search">${ic('search')}<input id="q" type="search" value="${esc(UI.q)}" placeholder="${t('searchPh')}" aria-label="${t('searchPh')}"><button class="btn o" data-act="search">${t('go')}</button></div>
  <div class="zrow">${ic('pin')}<select class="pill" id="hoodSel" aria-label="${t('hood')}">${hoodOptions(S.hood)}</select></div>
  <div class="cats">${CATEGORIES.map((c, i) => `<button class="cat ${UI.cat === c ? 'on' : ''}" data-act="cat" data-a="${esc(c)}"><span>${ic(CAT_ICON[i])}</span>${esc(c)}</button>`).join('')}</div>
  <div class="promo">${ph(feat.photo, feat.name)}<small>${t('promoK')}</small><h3>${t('promoT')}</h3><span>${t('promoS')}</span></div>
  <div class="sec"><h2>${t('restos')}</h2><span>${t('top')}</span></div>
  <div class="sortrow">${t('sort')}<select class="pill" id="sortSel">${[['rel', 's_rel'], ['rate', 's_rate'], ['fast', 's_fast'], ['fee', 's_fee']].map(([v, k]) => `<option value="${v}" ${UI.sort === v ? 'selected' : ''}>${t(k)}</option>`).join('')}</select></div>
  <div id="list">${listHTML()}</div>`;
}
function vShowcase() {
  const feats = S.res.filter(r => r.popular).slice(0, 4);
  return `<section class="hero">${ph('hero', 'MOKOVA')}<small>${t('heroK')}</small><h1>Manje ou, <span>kote ou</span> vle a.</h1><p>${t('slogan2')}</p>
  <div class="btns"><button class="btn o s" data-act="go" data-a="#/restaurants">${t('orderNow')}</button><button class="btn out s" data-act="go" data-a="#/signup">${t('create')}</button></div>
  <div class="mini"><div><b>${S.res.length}</b>${t('partners')}</div><div><b>25–45 min</b>${t('avg')}</div><div><b>4 ${t('zonesN')}</b>100 → 350 HTG</div></div></section>
  <div class="sec"><h2>${t('how')}</h2></div><div class="how"><div><span>1</span><b>${t('h1')}</b><p>${t('h1d')}</p></div><div><span>2</span><b>${t('h2')}</b><p>${t('h2d')}</p></div><div><span>3</span><b>${t('h3')}</b><p>${t('h3d')}</p></div></div>
  <div class="sec"><h2>${t('featured')}</h2></div>${feats.map(r => `<button class="feat" data-act="go" data-a="#/menu/${r.id}">${ph(r.photo, r.name)}<div><b>${esc(r.name)}</b><span>★ ${r.rating} · ${esc(r.hood)} · ${r.eta}–${r.eta + 15} ${t('min')}</span></div><i>›</i></button>`).join('')}
  <div class="sec"><h2>${t('why')}</h2></div>${[['coin', 'w1'], ['pin', 'w2'], ['clock', 'w3'], ['shield', 'w4']].map(([i, k]) => `<div class="why"><span class="ic">${ic(i)}</span><div><b>${t(k)}</b><p>${t(k + 'd')}</p></div></div>`).join('')}
  <div class="zonecard"><h3>${t('zoneFees')}</h3>${S.zones.map(z => `<div class="zr"><div><b>${esc(z.name)}</b><small>${z.hoods.map(esc).join(', ')}</small></div><b style="color:var(--orange);white-space:nowrap">${money(z.fee)}</b></div>`).join('')}<p style="font-size:12.5px;color:#bbb;margin-top:10px">${t('calcNote')}</p></div>
  <div class="sec" style="padding-top:6px"><h2>${t('sell')}</h2></div><div class="sell"><div class="a"><h3>${t('beResto')}</h3><p>90 % · ${t('w4d')}</p><br><button class="btn o s" data-act="signup" data-a="restaurant">${t('signup')}</button></div><div class="b"><h3>${t('beDriver')}</h3><div class="big">${t('earn')}</div><p>${t('earnD')}</p><br><button class="btn s" data-act="signup" data-a="driver">${t('signup')}</button></div></div>
  <div class="soon">${t('rdSoon')}</div>
  <footer class="foot">${brand}<p style="margin-top:6px">Manje Ou, Kote Ou Vle A</p><p style="margin:10px 0;font-size:12.5px;color:#ccc">${t('servedZones')} : ${S.zones.filter(z => z.active).map(z => z.name).join(' · ')} — Haïti, phase 1</p><div style="margin-bottom:10px">${langPill()}</div>${['about', 'terms', 'privacy', 'help'].map(k => `<a role="button" tabindex="0" data-act="go" data-a="#/info/${k}">${t(k)}</a>`).join('')}<a role="button" tabindex="0" data-act="go" data-a="#/restaurants">${t('orderNow')}</a><a role="button" tabindex="0" data-act="signup" data-a="restaurant">${t('beResto')}</a><a role="button" tabindex="0" data-act="signup" data-a="driver">${t('beDriver')}</a><a role="button" tabindex="0" data-act="go" data-a="#/login">${t('login')}</a></footer>`;
}
const INFO = {
  about: ["MOKOVA relie les habitants de Port-au-Prince aux restaurants et aux vendeurs de nourriture de leur quartier. Les clients commandent et paient en ligne, les restaurants préparent, et des livreurs indépendants apportent la commande à la porte.", "Le service démarre à Port-au-Prince, en Haïti. La République dominicaine viendra dans une phase ultérieure."],
  terms: ["En utilisant MOKOVA, vous acceptez de fournir des informations exactes, de payer vos commandes en ligne et de communiquer le code de confirmation au livreur uniquement à la remise de la commande.", "La livraison est facturée au tarif fixe de la zone, affiché avant la validation. MOKOVA perçoit 10 % du prix des plats, jamais sur la livraison. Une commande peut être annulée tant qu'elle n'est pas en préparation."],
  privacy: ["Nous recueillons votre nom, votre téléphone, votre adresse de livraison et l'historique de vos commandes pour assurer le service.", "Ces informations ne sont communiquées qu'au restaurant et au livreur concernés par votre commande. Vous pouvez modifier votre profil ou vous déconnecter à tout moment."],
  help: ["Un problème avec une commande ? Ouvrez le suivi de la commande et choisissez « Signaler un problème » : retard, plat manquant, plat incorrect ou commande non reçue. L'équipe MOKOVA traite chaque signalement.", "Pour joindre un restaurant, utilisez le bouton « Contacter le restaurant » du suivi."]
};
async function vInfo(k) { const p = INFO[k] || INFO.about; return `<button class="back" data-act="go" data-a="#/">← ${t('backHome')}</button><div class="box"><h3>${t(k)}</h3>${p.map(x => `<p style="margin-bottom:10px">${x}</p>`).join('')}</div>`; }
async function vMenu(id) {
  const r = resOf(id); if (!r) return vHome();
  const menu = S.menus[id], open = isOpen(r), ok = serves(r, S.hood), can = open && ok, cats = [...new Set(menu.map(m => m.cat))];
  return `<button class="back" data-act="go" data-a="#/">← ${t('home')}</button><div class="panel"><div class="cover">${ph(r.photo, r.name)}<h1>${esc(r.name)}</h1><button class="close" data-act="go" data-a="#/" aria-label="${t('cancel')}">${ic('x')}</button></div><div class="body">
  <div class="pills" style="margin:0 0 8px"><span class="chip k">★ ${r.rating} (${r.reviews})</span><span class="chip">${r.eta}–${r.eta + 15} ${t('min')}</span><span class="chip">${r.hours[0]}h–${r.hours[1]}h</span><span class="chip ${open ? 'g' : 'r'}">${open ? t('open') : t('closed') + ' · ' + t('reopens') + ' ' + r.hours[0] + 'h'}</span></div>
  ${ok ? '' : `<div class="warn">${t('notServed')}</div>`}<p class="mut" style="font-size:12.5px;margin:6px 0"><b>${t('zonesServed')}</b><br>${S.zones.filter(z => r.zones.includes(z.id)).map(zoneLine).join('<br>')}</p>
  ${cats.map(c => `<h3 style="margin:14px 0 2px">${esc(c)}</h3>${menu.filter(m => m.cat === c).map(m => { const q = S.cart.items[m.id] || 0, out = m.stock <= 0 || m.on === false; return `<div class="dish ${out ? 'off' : ''}">${ph(m.photo, m.name)}<div class="t"><b>${esc(m.name)}</b><p>${esc(m.desc)}</p><div class="pr">${money(m.price)}</div></div>${out ? `<span class="chip r">${t('soldout')}</span>` : q ? `<div class="stp"><button data-act="qty" data-a="${r.id}|${m.id}|${q - 1}" aria-label="−">−</button><b>${q}</b><button data-act="qty" data-a="${r.id}|${m.id}|${q + 1}" aria-label="+">+</button></div>` : `<button class="add" ${can ? '' : 'disabled'} data-act="qty" data-a="${r.id}|${m.id}|1" aria-label="${t('add')}">+</button>`}</div>`; }).join('')}`).join('')}
  <h3 style="margin:18px 0 6px">${t('reviewsT')}</h3>${reviewsFor(id).map(v => `<div class="row" style="display:block"><b>${esc(v.who)}</b> <span class="pr2">${'★'.repeat(v.stars)}</span> <span class="mut">${v.date}</span><p>${esc(v.text)}</p></div>`).join('')}</div></div>`;
}
async function vCart() {
  if (!cartCount()) return `<div class="empty"><h3>${t('emptyCart')}</h3><button class="btn o" data-act="go" data-a="#/">${t('discover')}</button></div>`;
  const r = resOf(S.cart.rid), T = cartTotals(S.hood);
  return `<button class="back" data-act="go" data-a="#/menu/${r.id}">← ${esc(r.name)}</button><div class="box"><h3>${t('cart')}</h3>${Object.entries(S.cart.items).map(([id, q]) => { const m = findDish(id).m; return `<div class="row"><div><b>${esc(m.name)}</b><br><span class="pr2">${money(m.price * q)}</span></div><div class="stp"><button data-act="qty" data-a="${r.id}|${id}|${q - 1}" aria-label="−">−</button><b>${q}</b><button data-act="qty" data-a="${r.id}|${id}|${q + 1}" aria-label="+">+</button></div></div>`; }).join('')}
  <div class="sumbox"><div><span>${t('subtotal')}</span><b>${money(T.sub)}</b></div></div></div><div class="pad"><button class="btn o blk" data-act="go" data-a="#/checkout">${t('checkout')}</button></div>`;
}
async function vCheckout() {
  if (!cartCount()) return vCart();
  const u = S.user || {};
  return `<button class="back" data-act="go" data-a="#/cart">← ${t('cart')}</button><form class="box" data-form="checkout" novalidate><h3>${t('checkout')}</h3>
  <div class="fld"><label for="hood">${t('hood')}</label><select id="hood" name="hood" data-act="hoodchg">${hoodOptions(S.hood)}</select><div class="err" data-e="hood"></div></div>
  <div class="fld"><label for="addr">${t('address')}</label><input id="addr" name="addr"><div class="err" data-e="addr"></div></div>
  <div class="fld"><label for="ph">${t('phone')}</label><input id="ph" name="phone" type="tel" value="${esc(u.phone || '')}"><div class="err" data-e="phone"></div></div>
  <label for="nt">${t('note')}</label><textarea id="nt" name="note"></textarea>
  <label>${t('pay')}</label><div class="paycards">${[['card', t('card')], ['MonCash', 'MonCash'], ['NatCash', 'NatCash']].map(([m, n]) => `<button type="button" class="${UI.pay === m ? 'on' : ''}" data-act="pay" data-a="${m}">${n}</button>`).join('')}</div>
  <div class="fld"><label for="acc">${UI.pay === 'card' ? t('cardNo') : t('acct')}</label><input id="acc" name="acc" inputmode="numeric"><div class="err" data-e="acc"></div></div>
  <div class="sumbox" id="sum"></div><br><button class="btn o blk" id="goPay">${t('payNow')}</button></form>`;
}
function updateSum() {
  const h = $('#hood').value, T = cartTotals(h), out = OUT_OF_AREA.includes(h), z = T.zone, bad = out || (z && !z.active);
  $('#sum').innerHTML = `<div><span>${t('subtotal')}</span><b>${money(T.sub)}</b></div><div><span>${t('delivery')}${z ? ' · ' + esc(z.name) : ''}</span><b>${h && !bad ? money(T.fee) : '—'}</b></div><div class="tot"><span>${t('total')}</span><span>${money(T.sub + (h && !bad ? T.fee : 0))}</span></div>${bad ? `<p class="err">${t('outArea')}</p>` : ''}`;
  $('#goPay').disabled = !h || !!bad || !z;
}
const showErr = E => { document.querySelectorAll('[data-e]').forEach(e => { e.textContent = E[e.dataset.e] || ''; e.parentElement.classList.toggle('bad', !!E[e.dataset.e]); }); return !Object.keys(E).length; };
async function submitCheckout(f) {
  const v = n => f.elements[n].value.trim(), E = {};
  if (!v('hood')) E.hood = t('req'); if (!v('addr')) E.addr = t('req'); if (!okPhone(v('phone'))) E.phone = t('badPhone');
  if (UI.pay === 'card' ? /^\d{16}$/.exec(v('acc').replace(/\s/g, '')) === null : !okPhone(v('acc'))) E.acc = UI.pay === 'card' ? t('cardNo') : t('badPhone');
  if (!showErr(E)) return;
  const r = resOf(S.cart.rid), items = Object.entries(S.cart.items).map(([id, q]) => { const m = findDish(id).m; return { id, name: m.name, q, price: m.price }; });
  const o = makeOrder(r, items, v('hood'), { addr: v('addr'), phone: v('phone'), note: v('note'), client: S.user ? S.user.name : 'Invité', clientId: S.user ? S.user.id : '' });
  o.history = [{ s: 'received', t: o.date }]; await createOrder(o);
  for (const it of items) { const menu = await getRestaurantMenu(r.id); const m = menu.find(x => x.id === it.id); if (m) m.stock = Math.max(0, m.stock - it.q); await saveRestaurantMenu(r.id, menu); }
  S.hood = v('hood'); store.set('hood', S.hood); S.cart = { rid: null, items: {} }; saveCart(); go('#/confirm/' + o.id);
}
async function vTrack(id) {
  const o = S.orders.find(x => x.id === id); if (!o) return vOrders();
  const idx = STATUSES.indexOf(o.status), exit = ['cancelled', 'refused', 'noresponse'].includes(o.status), drv = S.accounts.find(a => a.id === o.driver), rep = S.reports.some(x => x.oid === o.id);
  const short = ['received', 'accepted', 'preparing', 'ready', 'pickedup', 'delivering', 'delivered'];
  return `<button class="back" data-act="go" data-a="#/orders">← ${t('orders')}</button><div class="box"><h3>${route().v === 'confirm' ? t('thanks') + ' · ' : ''}${o.id}</h3><div class="bar"><i style="width:${exit ? 0 : Math.round((idx + 1) / 7 * 100)}%"></i></div>
  <div class="steps">${short.map((s, i) => `<div class="${i <= idx && !exit ? 'on' : ''}"><span>${i + 1}</span>${stLabel(s)}</div>`).join('')}</div>
  <p style="margin-top:12px"><span class="st ${exit ? 'x' : ''}">${stLabel(o.status)}</span> <span class="mut">${esc(o.rname)} · ${t('eta')} : ${o.eta + 15} ${t('min')}</span></p>
  <p class="mut">${t('driverName')} : ${drv ? esc(drv.name) : t('pending')}</p><p class="mut" style="margin:12px 0 6px">${t('code')} — ${t('codeHint')}</p><div class="code">${o.code}</div></div>
  <div class="box"><h3>${t('details')}</h3>${o.items.map(i => `<div class="row"><span>${i.q} × ${esc(i.name)}</span><b>${money(i.q * i.price)}</b></div>`).join('')}<div class="sumbox"><div><span>${t('subtotal')}</span><b>${money(o.subtotal)}</b></div><div><span>${t('delivery')} · ${esc(o.zone)}</span><b>${money(o.fee)}</b></div><div class="tot"><span>${t('total')}</span><span>${money(o.total)}</span></div></div>
  ${o.history.map(h => `<div class="row"><span>${stLabel(h.s)}</span><span class="mut">${hhmm(h.t)}</span></div>`).join('')}</div>
  <div class="pad" style="display:grid;gap:8px">${idx < 2 && !exit ? `<button class="btn out" data-act="cancelOrder" data-a="${o.id}">${t('cancelOrder')}</button>` : ''}<button class="btn out" data-act="contact">${t('contactResto')}</button></div>
  ${rep ? `<p class="pad mut" style="margin-top:10px">${t('reported')}</p>` : `<form class="box" style="margin-top:14px" data-form="report" data-a="${o.id}"><h3>${t('report')}</h3><label for="rs">${t('reason')}</label><select id="rs" name="rs">${[['late', 'r_late'], ['missing', 'r_missing'], ['wrong', 'r_wrong'], ['none', 'r_none']].map(([v, k]) => `<option value="${t(k)}">${t(k)}</option>`).join('')}</select><label for="rt">${t('details')}</label><textarea id="rt" name="rt"></textarea><br><button class="btn blk">${t('send')}</button></form>`}
  ${o.status === 'delivered' ? (o.rating ? `<p class="pad mut">${t('thanksRate')}</p>` : `<form class="box" data-form="rate" data-a="${o.id}"><h3>${t('rateT')}</h3>${[['rr', 'rateR'], ['rd', 'rateD']].map(([n, k]) => `<label>${t(k)}</label><div class="stars" data-star="${n}">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-act="star" data-a="${n}|${i}" aria-label="${i}">☆</button>`).join('')}<input type="hidden" name="${n}" value="0"></div>`).join('')}<label for="rc">${t('comment')}</label><textarea id="rc" name="rc"></textarea><br><button class="btn o blk">${t('send')}</button></form>`) : ''}`;
}
async function vOrders() {
  const l = S.orders.filter(o => !S.user || !o.clientId || o.clientId === S.user.id);
  if (!l.length) return `<div class="empty"><h3>${t('noOrders')}</h3><button class="btn o" data-act="go" data-a="#/">${t('discover')}</button></div>`;
  return `<div class="sec"><h2>${t('orders')}</h2></div>${l.map(o => `<div class="box"><div class="row"><b>${esc(o.rname)}</b><span class="pr2">${money(o.total)}</span></div><p class="mut">${hhmm(o.date)} · <span class="st ${['delivered'].includes(o.status) ? '' : ['cancelled', 'refused', 'noresponse'].includes(o.status) ? 'x' : ''}">${stLabel(o.status)}</span></p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><button class="btn out sm" data-act="go" data-a="#/track/${o.id}">${t('track')}</button><button class="btn o sm" data-act="reorder" data-a="${o.id}">${t('reorder')}</button></div></div>`).join('')}`;
}
async function vProfile() {
  const u = S.user;
  return `<div class="sec"><h2>${t('profile')}</h2></div>${u ? `<div class="box" style="display:flex;gap:14px;align-items:center"><span class="avatar">${esc(u.name.charAt(0))}</span><div><b style="font-size:17px">${esc(u.name)}</b><br><span class="mut">${esc(u.phone || '')}</span><br><span class="mut">${esc(u.email || '')}</span><br><span class="st">${t(u.role)}</span></div></div>` : `<div class="box"><button class="btn o blk" data-act="go" data-a="#/login">${t('login')}</button></div>`}
  <div class="box"><div class="prow"><span>${t('addresses')}<br><span class="mut">${S.hood ? esc(S.hood) + ' — ' + (findZone(S.hood) ? esc(findZone(S.hood).name) : '') : '—'}</span></span></div><div class="prow" style="display:block"><span>${t('lang')}</span><div style="margin-top:8px">${langPill()}</div></div>${u ? `<button class="prow" data-act="logout" style="color:var(--red)">${t('logout')}<span>›</span></button>` : ''}</div>`;
}
const fld = (id, label, type = 'text') => `<div class="fld"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}"><div class="err" data-e="${id}"></div></div>`;
async function vAuth() {
  const signup = route().v === 'signup', cuis = CATEGORIES;
  return `<div class="auth"><button class="back" data-act="go" data-a="#/">← ${t('backHome')}</button><h1>${signup ? t('create') : t('welcome')}</h1><p class="sub">${t('loginSub')}</p>
  <div class="tabs2"><button class="${signup ? '' : 'on'}" data-act="go" data-a="#/login">${t('login')}</button><button class="${signup ? 'on' : ''}" data-act="go" data-a="#/signup">${t('signup')}</button></div>
  ${signup ? `<form class="box" data-form="signup" novalidate><div class="roles">${[['client', 'profile', 'rc'], ['restaurant', 'store', 'rr'], ['driver', 'bike', 'rd']].map(([r, i, d]) => `<button type="button" class="${UI.role === r ? 'on' : ''}" data-act="role" data-a="${r}">${ic(i)}<br>${t(r)}<small>${t(d)}</small></button>`).join('')}</div>
  ${fld('name', t('fullName'))}${fld('phone', t('phone'), 'tel')}${fld('email', t('mail'), 'email')}
  ${UI.role === 'restaurant' ? `${fld('estab', t('estab'))}<div class="fld"><label for="rh">${t('hood')}</label><select id="rh" name="rh">${hoodOptions('')}</select><div class="err" data-e="rh"></div></div><label for="cu">${t('cuisines')}</label><select id="cu" name="cu" multiple size="4">${cuis.map(c => `<option>${esc(c)}</option>`).join('')}</select>` : ''}
  ${UI.role === 'driver' ? `<div class="fld"><label for="rh">${t('baseHood')}</label><select id="rh" name="rh">${hoodOptions('')}</select><div class="err" data-e="rh"></div></div><label for="vh">${t('vehicle')}</label><select id="vh" name="vh"><option>${t('moto')}</option><option>${t('bike')}</option><option>${t('car')}</option></select>` : ''}
  ${fld('pw', t('pwd'), 'password')}${fld('pw2', t('pwd2'), 'password')}<br><button class="btn o blk">${t('signup')}</button></form>`
  : `<form class="box" data-form="login" novalidate>${fld('idf', t('idf'))}${fld('pw', t('pwd'), 'password')}<div class="err" data-e="form"></div><br><button class="btn o blk">${t('login')}</button><div style="text-align:center"><button type="button" class="lnk" data-act="forgot">${t('forgot')}</button></div><p class="mut" id="fgm" style="text-align:center"></p>
  <div class="or">${t('or')}</div><button type="button" class="btn out blk" data-act="guest">${t('guest')}</button><div class="or">${t('quick')}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${['u1', 'u2', 'u3', 'u5'].map(i => { const a = ACCOUNTS.find(x => x.id === i); return `<button type="button" class="btn out s" data-act="quick" data-a="${i}">${t(a.role)}</button>`; }).join('')}</div></form>`}</div>`;
}

/* ============ 9. ESPACES PRO ============ */
const PRO_TABS = { restaurant: [['overview', 'overview'], ['orders', 'received'], ['menu', 'menu'], ['place', 'place'], ['revenue', 'revenue']], driver: [['jobs', 'offers'], ['gains', 'earnings']], admin: [['overview', 'overview'], ['orders', 'orders'], ['reports', 'reports'], ['accounts', 'accounts'], ['zones', 'zonesT'], ['settings', 'settings'], ['ledger', 'ledger']] };
const stat = (l, v) => `<div><small>${l}</small><b>${v}</b></div>`;
async function vPro() {
  const u = S.user;
  if (!u || !PRO_TABS[u.role]) return `<div class="empty"><h3>${t('pro')}</h3><p>${t('forProOnly')}</p><br><button class="btn o" data-act="go" data-a="#/login">${t('login')}</button></div>`;
  const tabs = PRO_TABS[u.role], cur = UI.proTab[u.role] || tabs[0][0];
  const body = await ({ restaurant: proResto, driver: proDriver, admin: proAdmin }[u.role])(cur);
  return `<div class="sec"><h2>${t(u.role)}</h2><span>${esc(u.name)}</span></div><div class="tabs2">${tabs.map(([k, l]) => `<button class="${cur === k ? 'on' : ''}" data-act="ptab" data-a="${k}">${t(l)}</button>`).join('')}</div>${body}`;
}
const ordCard = (o, actions = '') => `<div class="box"><div class="row"><b>${o.id} · ${esc(o.client || '')}</b><span class="st ${['cancelled', 'refused', 'noresponse'].includes(o.status) ? 'x' : ''}">${stLabel(o.status)}</span></div><p class="mut">${esc(o.rname)} · ${o.items.map(i => i.q + '× ' + esc(i.name)).join(', ')}</p><p class="mut">${esc(o.hood)} · ${esc(o.zone)} · ${hhmm(o.date)}</p><div class="sumbox"><div><span>${t('split')}</span><b>${money(o.total)}</b></div><div><span>${t('restaurant')}</span><span>${money(o.restaurant)}</span></div><div><span>MOKOVA</span><span>${money(o.commission)}</span></div><div><span>${t('driver')}</span><span>${money(o.courier)}</span></div></div>${actions}</div>`;
async function proResto(tab) {
  const rid = S.user.rid, r = resOf(rid), mine = S.orders.filter(o => o.rid === rid), today = mine.filter(o => sameDay(o.date, new Date()) && o.status !== 'cancelled'), menu = S.menus[rid];
  if (tab === 'overview') {
    const cnt = {}; mine.forEach(o => o.items.forEach(i => { cnt[i.name] = (cnt[i.name] || 0) + i.q; }));
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return `<div class="stats">${stat(t('todayOrders'), today.length)}${stat(t('todayRev'), money(today.reduce((a, o) => a + o.restaurant, 0)))}${stat(t('avgRate'), '★ ' + r.rating)}</div><div class="box"><h3>${t('bestSellers')}</h3>${top.map(([n, q]) => `<div class="row"><span>${esc(n)}</span><b>${q}</b></div>`).join('') || t('none')}</div>`;
  }
  if (tab === 'orders') {
    const l = mine.filter(o => !['delivered', 'cancelled', 'refused', 'noresponse'].includes(o.status));
    return l.map(o => ordCard(o, o.status === 'received' ? `<p class="mut">${t('answerIn')} ${Math.max(0, Math.ceil(S.settings.restoDelay - (Date.now() - new Date(o.date)) / 6e4))} ${t('min')}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn o sm" data-act="ost" data-a="${o.id}|accepted">${t('accept')}</button><button class="btn out sm" data-act="ost" data-a="${o.id}|refused">${t('refuse')}</button></div>` : o.status === 'accepted' ? `<button class="btn o blk" data-act="ost" data-a="${o.id}|preparing">${t('toPrep')}</button>` : o.status === 'preparing' ? `<button class="btn o blk" data-act="ost" data-a="${o.id}|ready">${t('toReady')}</button>` : '')).join('') || `<div class="empty">${t('none')}</div>`;
  }
  if (tab === 'menu') return `<div class="box"><h3>${t('menu')}</h3>${menu.map(m => `<div class="row" style="display:block"><b>${esc(m.name)}</b><div style="display:grid;grid-template-columns:1fr 1fr auto;gap:6px;margin-top:6px"><input type="number" min="0" value="${m.price}" aria-label="${t('dishPrice')}" data-act="mprice" data-a="${m.id}"><input type="number" min="0" value="${m.stock}" aria-label="${t('stock')}" data-act="mstock" data-a="${m.id}"><button class="btn out sm" data-act="mrm" data-a="${m.id}">${t('remove')}</button></div><label style="display:flex;gap:8px;align-items:center;margin:6px 0 0"><input type="checkbox" style="width:24px;min-height:24px" ${m.on !== false ? 'checked' : ''} data-act="mon" data-a="${m.id}">${t('available')}</label></div>`).join('')}</div>
  <form class="box" data-form="dish" novalidate><h3>${t('add')}</h3>${fld('dn', t('dishName'))}${fld('dd', t('dishDesc'))}${fld('dp', t('dishPrice'), 'number')}<label for="dc">${t('dishCat')}</label><select id="dc" name="dc">${CATEGORIES.map(c => `<option>${esc(c)}</option>`).join('')}</select>${fld('dph', t('dishPhoto'))}<br><button class="btn o blk">${t('add')}</button></form>`;
  if (tab === 'place') return `<form class="box" data-form="place"><h3>${t('place')}</h3>${fld('cov', t('coverPhoto'))}<label>${t('hours')}</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input name="h0" type="number" min="0" max="23" value="${r.hours[0]}"><input name="h1" type="number" min="1" max="24" value="${r.hours[1]}"></div><label for="pp">${t('prep')}</label><input id="pp" name="pp" type="number" min="5" value="${r.eta}"><label>${t('zonesServed')}</label>${S.zones.map(z => `<label style="display:flex;gap:8px;align-items:center;font-weight:600"><input type="checkbox" style="width:24px;min-height:24px" name="z" value="${z.id}" ${r.zones.includes(z.id) ? 'checked' : ''}>${esc(z.name)}</label>`).join('')}<br><button class="btn o blk">${t('save')}</button></form>`;
  const dl = mine.filter(o => o.status === 'delivered'), week = dl.filter(o => Date.now() - new Date(o.date) < 7 * 864e5);
  return `<div class="stats">${stat(t('day'), money(dl.filter(o => sameDay(o.date, new Date())).reduce((a, o) => a + o.restaurant, 0)))}${stat(t('week'), money(week.reduce((a, o) => a + o.restaurant, 0)))}</div><div class="box">${dl.map(o => `<div class="row" style="display:block"><b>${o.id}</b> <span class="mut">${hhmm(o.date)}</span><br>${t('subtotal')} ${money(o.subtotal)} · ${t('commission')} ${money(o.commission)} · <b>${t('net')} ${money(o.restaurant)}</b></div>`).join('') || t('none')}</div>`;
}
const drvOnline = id => store.get('drv_' + id, false);
async function proDriver(tab) {
  const u = S.user, on = drvOnline(u.id), mine = S.orders.filter(o => o.driver === u.id);
  const head = `<div class="box"><div class="row"><b>${on ? t('online') : t('offline')}</b><button class="btn ${on ? 'o' : 'out'} s" data-act="drvtoggle">${on ? t('online') : t('offline')}</button></div></div>`;
  if (tab === 'gains') { const dl = mine.filter(o => o.status === 'delivered'); return head + `<div class="stats">${stat(t('day'), money(dl.filter(o => sameDay(o.date, new Date())).reduce((a, o) => a + o.courier, 0)))}${stat(t('week'), money(dl.filter(o => Date.now() - new Date(o.date) < 7 * 864e5).reduce((a, o) => a + o.courier, 0)))}${stat(t('deliveries'), dl.length)}${stat(t('avgRate'), '★ 4.8')}</div><div class="box">${dl.map(o => `<div class="row"><span>${o.id} · ${esc(o.zone)}</span><b>${money(o.courier)}</b></div>`).join('') || t('none')}</div>`; }
  const act = mine.filter(o => ['ready', 'pickedup', 'delivering'].includes(o.status)), r = o => resOf(o.rid);
  const cur = act.map(o => `<div class="box"><h3>${t('current')} · ${o.id}</h3><p><b>${t('pickup')}</b> : ${esc(o.rname)}, ${esc(r(o).hood)}</p><p><b>${t('dropoff')}</b> : ${esc(o.hood)} — ${esc(o.addr)}</p><p><b>${t('phone')}</b> : ${esc(o.phone)}</p>${o.dstep < 4 ? `<br><button class="btn o blk" data-act="dstep" data-a="${o.id}">${t('d' + o.dstep)}</button>` : `<form data-form="code" data-a="${o.id}"><label for="cd">${t('enterCode')}</label><input id="cd" name="cd" inputmode="numeric" maxlength="4"><div class="err" data-e="cd"></div><br><button class="btn o blk">${t('confirmDeliv')}</button></form>`}</div>`).join('');
  const offers = on ? S.orders.filter(o => o.status === 'ready' && !o.driver && !(o.skipped || []).includes(u.id) && (u.zones || []).includes(o.zoneId)) : [];
  return head + cur + `<div class="sec" style="padding-top:6px"><h2>${t('offers')}</h2></div>` + (on ? offers.map(o => `<div class="box"><p><b>${t('pickup')}</b> : ${esc(o.rname)}, ${esc(r(o).hood)}</p><p><b>${t('dropoff')}</b> : ${esc(o.hood)} — ${esc(o.addr)}</p><p class="mut">${t('distance')} ${dist(o.id)} · ${t('gain')} <b class="pr2">${money(o.courier)}</b></p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><button class="btn o sm" data-act="take" data-a="${o.id}">${t('take')}</button><button class="btn out sm" data-act="passjob" data-a="${o.id}">${t('pass')}</button></div></div>`).join('') || `<div class="empty">${t('none')}</div>` : `<div class="empty">${t('goOnline')}</div>`);
}
async function proAdmin(tab) {
  const ok = o => !['cancelled', 'refused', 'noresponse'].includes(o.status), td = S.orders.filter(o => sameDay(o.date, new Date()) && ok(o));
  const refunded = o => o.refunds.reduce((a, x) => a + x.amt, 0);
  if (tab === 'overview') {
    const days = [...Array(7)].map((_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5); return { d, v: S.orders.filter(o => sameDay(o.date, d) && ok(o)).reduce((a, o) => a + o.total, 0) }; }), mx = Math.max(1, ...days.map(x => x.v));
    return `<div class="stats">${stat(t('todayOrders'), td.length)}${stat(t('sales'), money(S.orders.filter(ok).reduce((a, o) => a + o.total, 0)))}${stat(t('commissions'), money(S.orders.filter(ok).reduce((a, o) => a + o.commission, 0)))}${stat(t('inProgress'), S.orders.filter(o => !['delivered', 'cancelled', 'refused', 'noresponse'].includes(o.status)).length)}${stat(t('openResto'), S.res.filter(isOpen).length)}${stat(t('onlineDrv'), S.accounts.filter(a => a.role === 'driver' && drvOnline(a.id)).length)}</div><div class="box"><h3>${t('last7')}</h3><div class="chart">${days.map((x, i) => `<div class="${i === 6 ? 'cur' : ''}"><span>${x.v ? Math.round(x.v / 100) / 10 + 'k' : ''}</span><i style="height:${Math.round(x.v / mx * 100)}px"></i><span>${['di', 'lu', 'ma', 'me', 'je', 've', 'sa'][x.d.getDay()]}</span></div>`).join('')}</div></div>`;
  }
  if (tab === 'orders') {
    const F = UI.adm, l = S.orders.filter(o => (!F.status || o.status === F.status) && (!F.zone || o.zoneId === F.zone) && (!F.rid || o.rid === F.rid) && (!F.date || sameDay(o.date, F.date)));
    const sel = (n, opts) => `<select class="pill" data-act="afilter" data-a="${n}"><option value="">${t('filterAll')}</option>${opts.map(([v, lb]) => `<option value="${v}" ${F[n] === v ? 'selected' : ''}>${esc(lb)}</option>`).join('')}</select>`;
    return `<div class="box" style="display:grid;gap:8px">${sel('status', [...STATUSES, 'refused', 'cancelled', 'noresponse'].map(s => [s, stLabel(s)]))}${sel('zone', S.zones.map(z => [z.id, z.name]))}${sel('rid', S.res.map(r => [r.id, r.name]))}<input type="date" value="${esc(F.date)}" data-act="afilter" data-a="date" aria-label="date"></div>` + l.map(o => {
      const opn = F.open === o.id, drivers = S.accounts.filter(a => a.role === 'driver');
      return `<div class="box"><div class="row"><b>${o.id} · ${esc(o.rname)}</b><span class="st">${stLabel(o.status)}</span></div><p class="mut">${esc(o.client)} · ${money(o.total)}${refunded(o) ? ' · −' + money(refunded(o)) : ''}</p><button class="lnk" data-act="aopen" data-a="${o.id}">${opn ? '▴' : '▾'} ${t('details')}</button>${opn ? `<p>${o.items.map(i => i.q + '× ' + esc(i.name)).join(', ')}</p><p class="mut">${t('split')} : ${t('restaurant')} ${money(o.restaurant)} · MOKOVA ${money(o.commission)} · ${t('driver')} ${money(o.courier)}</p><p class="mut">${t('driver')} : ${esc((drivers.find(d => d.id === o.driver) || {}).name || t('pending'))}${(o.skipped || []).length ? ' · ' + t('pass') + ' ×' + o.skipped.length : ''}</p>${o.history.map(h => `<div class="row"><span>${stLabel(h.s)}</span><span class="mut">${hhmm(h.t)}</span></div>`).join('')}${o.refunds.map(x => `<div class="row"><span>${t('refund')} : ${esc(x.motif)}</span><b>−${money(x.amt)}</b></div>`).join('')}
      <label>${t('reassign')}</label><select class="pill" data-act="reassign" data-a="${o.id}"><option value="">—</option>${drivers.map(d => `<option value="${d.id}" ${o.driver === d.id ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}</select>
      <form data-form="refund" data-a="${o.id}"><label for="ra${o.id}">${t('amount')}</label><input id="ra${o.id}" name="ra" type="number" min="1" max="${o.total}"><label for="rm${o.id}">${t('refundWhy')}</label><input id="rm${o.id}" name="rm"><div class="err" data-e="ra"></div><br><button class="btn out blk">${t('refund')}</button></form>${['delivered', 'cancelled', 'refused'].includes(o.status) ? '' : `<br><button class="btn out blk" data-act="ost" data-a="${o.id}|cancelled">${t('cancelOrder')}</button>`}` : ''}</div>`;
    }).join('') || `<div class="empty">${t('none')}</div>`;
  }
  if (tab === 'reports') return S.reports.map(x => `<div class="box"><div class="row"><b>${x.oid}</b><span class="st ${x.done ? 'x' : ''}">${x.done ? '✓' : t('pending')}</span></div><p><b>${esc(x.reason)}</b></p><p class="mut">${esc(x.text)}</p>${x.done ? `<p class="mut">${esc(x.note)}</p>` : `<input data-act="rnote" data-a="${x.id}" placeholder="${t('internalNote')}" aria-label="${t('internalNote')}"><br><br><button class="btn o blk" data-act="rdone" data-a="${x.id}">${t('markDone')}</button>`}</div>`).join('') || `<div class="empty">${t('none')}</div>`;
  if (tab === 'accounts') return `<div class="box"><h3>${t('restos')}</h3>${S.res.map(r => `<div class="row"><span>${esc(r.name)}<br><span class="mut">★ ${r.rating}</span></span><label style="margin:0"><input type="checkbox" style="width:24px;min-height:24px" ${r.off ? '' : 'checked'} data-act="rtoggle" data-a="${r.id}"> ${t('activeT')}</label></div>`).join('')}</div><div class="box"><h3>${t('driver')}</h3>${S.accounts.filter(a => a.role === 'driver').map(a => `<div class="row"><span>${esc(a.name)}<br><span class="mut">${drvOnline(a.id) ? t('online') : t('offline')}</span></span><label style="margin:0"><input type="checkbox" style="width:24px;min-height:24px" ${a.active === false ? '' : 'checked'} data-act="dtoggle" data-a="${a.id}"> ${t('activeT')}</label></div>`).join('')}</div>`;
  if (tab === 'zones') return `<div class="box"><h3>${t('zonesT')}</h3>${S.zones.map(z => `<div class="row" style="display:block"><b>${esc(z.name)}</b><br><span class="mut">${z.hoods.map(esc).join(', ')}</span><div style="display:flex;gap:10px;align-items:center;margin-top:6px"><input type="number" min="0" value="${z.fee}" data-act="zfee" data-a="${z.id}" aria-label="${t('fee')}"><label style="margin:0;white-space:nowrap"><input type="checkbox" style="width:24px;min-height:24px" ${z.active ? 'checked' : ''} data-act="zon" data-a="${z.id}"> ${t('activeT')}</label></div></div>`).join('')}</div>`;
  if (tab === 'settings') return `<form class="box" data-form="settings"><h3>${t('settings')}</h3><label for="sc">${t('rate')}</label><input id="sc" name="sc" type="number" min="0" max="100" step="0.5" value="${S.settings.commission * 100}"><label for="sr">${t('rDelay')}</label><input id="sr" name="sr" type="number" min="1" value="${S.settings.restoDelay}"><label for="sd">${t('dDelay')}</label><input id="sd" name="sd" type="number" min="1" value="${S.settings.driverDelay}"><br><button class="btn o blk">${t('save')}</button></form>`;
  const P = { all: 1e15, d: 864e5, w: 7 * 864e5 }, per = P[UI.period] || P.all;
  const ent = []; S.orders.filter(ok).forEach(o => { ent.push({ t: o.date, id: o.id, l: t('total'), tot: o.total, r: o.restaurant, c: o.commission, d: o.courier }); o.refunds.forEach(x => ent.push({ t: x.t, id: o.id, l: t('refund') + ' · ' + x.motif, tot: -x.amt, r: 0, c: 0, d: 0 })); });
  const l = ent.filter(e => Date.now() - new Date(e.t) < per).sort((a, b) => new Date(b.t) - new Date(a.t));
  return `<div class="tabs2">${[['d', 'day'], ['w', 'week'], ['all', 'all2']].map(([k, n]) => `<button class="${UI.period === k ? 'on' : ''}" data-act="period" data-a="${k}">${t(n)}</button>`).join('')}</div><div class="stats">${stat(t('total'), money(l.reduce((a, e) => a + e.tot, 0)))}${stat(t('commissions'), money(l.reduce((a, e) => a + e.c, 0)))}</div><div class="box tbl"><table><tr><th>${t('day')}</th><th>#</th><th></th><th>${t('total')}</th><th>${t('restaurant')}</th><th>MOKOVA</th><th>${t('driver')}</th></tr>${l.map(e => `<tr><td>${hhmm(e.t)}</td><td>${e.id}</td><td>${esc(e.l)}</td><td>${money(e.tot)}</td><td>${money(e.r)}</td><td>${money(e.c)}</td><td>${money(e.d)}</td></tr>`).join('')}</table></div>`;
}

/* ============ 10. ÉVÉNEMENTS ============ */
const A = {
  go: a => go(a), lang: a => { S.lang = a; store.set('lang', a); document.documentElement.lang = a; render(); },
  qty: a => { const [r, i, q] = a.split('|'); setQty(r, i, +q); },
  cat: a => { UI.cat = UI.cat === a ? '' : a; render(); }, search: () => { UI.q = $('#q').value; $('#list').innerHTML = listHTML(); },
  pay: a => { UI.pay = a; render(); }, role: a => { UI.role = a; render(); }, signup: a => { UI.role = a; go('#/signup'); },
  guest: () => { S.guest = true; store.set('guest', true); go('#/restaurants'); }, forgot: () => { $('#fgm').textContent = t('sent'); },
  logout: async () => { store.set('user', null); S.guest = false; store.set('guest', false); go('#/'); render(); },
  quick: async a => { const acc = ACCOUNTS.find(x => x.id === a); await saveProfile(acc); go(acc.role === 'client' ? '#/' : '#/pro'); render(); },
  hoodchg: () => updateSum(), cancelOrder: async a => { await updateOrderStatus(a, 'cancelled'); render(); }, contact: () => toast(t('contactMsg')),
  reorder: a => { const o = S.orders.find(x => x.id === a), r = resOf(o.rid); S.cart = { rid: r.id, items: {} }; o.items.forEach(i => { const m = (S.menus[r.id] || []).find(x => x.name === i.name); if (m && m.stock > 0 && m.on !== false) S.cart.items[m.id] = Math.min(i.q, m.stock); }); saveCart(); go('#/cart'); },
  star: a => { const [n, v] = a.split('|'), box = document.querySelector(`[data-star="${n}"]`); box.querySelector('input').value = v; box.querySelectorAll('button').forEach((b, i) => { b.textContent = i < +v ? '★' : '☆'; }); },
  ptab: a => { UI.proTab[S.user.role] = a; render(); }, ost: async a => { const [i, s] = a.split('|'); await updateOrderStatus(i, s); render(); },
  mprice: async (a, el) => { const m = await getRestaurantMenu(S.user.rid); m.find(x => x.id === a).price = +el.value; await saveRestaurantMenu(S.user.rid, m); toast(t('saved')); },
  mstock: async (a, el) => { const m = await getRestaurantMenu(S.user.rid); m.find(x => x.id === a).stock = Math.max(0, +el.value); await saveRestaurantMenu(S.user.rid, m); toast(t('saved')); },
  mon: async (a, el) => { const m = await getRestaurantMenu(S.user.rid); m.find(x => x.id === a).on = el.checked; await saveRestaurantMenu(S.user.rid, m); toast(t('saved')); },
  mrm: async a => { const m = (await getRestaurantMenu(S.user.rid)).filter(x => x.id !== a); await saveRestaurantMenu(S.user.rid, m); render(); },
  drvtoggle: () => { store.set('drv_' + S.user.id, !drvOnline(S.user.id)); render(); },
  take: async a => { await patchOrder(a, o => { o.driver = S.user.id; o.dstep = 0; }); render(); },
  passjob: async a => { await patchOrder(a, o => { o.skipped = [...(o.skipped || []), S.user.id]; }); render(); },
  dstep: async a => { await patchOrder(a, o => { o.dstep++; if (o.dstep === 2) { o.status = 'pickedup'; o.history.push({ s: 'pickedup', t: new Date().toISOString() }); } if (o.dstep === 3) { o.status = 'delivering'; o.history.push({ s: 'delivering', t: new Date().toISOString() }); } }); render(); },
  afilter: (a, el) => { UI.adm[a] = el.value; render(); }, aopen: a => { UI.adm.open = UI.adm.open === a ? '' : a; render(); },
  reassign: async (a, el) => { await patchOrder(a, o => { o.driver = el.value; o.dstep = 0; }); toast(t('saved')); render(); },
  rnote: (a, el) => { UI.note = el.value; }, rdone: async a => { const r = S.reports.find(x => x.id === a); r.done = true; r.note = UI.note || ''; UI.note = ''; await saveReports(S.reports); render(); },
  rtoggle: async (a, el) => { await saveRestaurantProfile(a, { off: !el.checked }); },
  dtoggle: async (a, el) => { const l = await getAccounts(); l.find(x => x.id === a).active = el.checked; await saveAccounts(l); },
  zfee: async (a, el) => { S.zones.find(z => z.id === a).fee = Math.max(0, +el.value || 0); await saveZones(S.zones); toast(t('saved')); },
  zon: async (a, el) => { S.zones.find(z => z.id === a).active = el.checked; await saveZones(S.zones); toast(t('saved')); },
  period: a => { UI.period = a; render(); }
};
document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (!el || ['INPUT', 'SELECT'].includes(el.tagName)) return; const f = A[el.dataset.act]; if (f) f(el.dataset.a, el); });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('a[data-act]')) e.target.click(); });
document.addEventListener('change', e => { const el = e.target; if (el.dataset && el.dataset.act && ['INPUT', 'SELECT'].includes(el.tagName)) { const f = A[el.dataset.act]; if (f) f(el.dataset.a, el); } if (el.id === 'hoodSel') { S.hood = el.value; store.set('hood', S.hood); render(); } if (el.id === 'sortSel') { UI.sort = el.value; render(); } });
document.addEventListener('input', e => { if (e.target.id === 'q') { UI.q = e.target.value; const l = $('#list'); if (l) l.innerHTML = listHTML(); } });
document.addEventListener('submit', async e => {
  const f = e.target, k = f.dataset.form; if (!k) return; e.preventDefault(); const v = n => (f.elements[n] ? f.elements[n].value.trim() : ''), a = f.dataset.a, E = {};
  if (k === 'checkout') return submitCheckout(f);
  if (k === 'login') {
    if (!v('idf')) E.idf = t('req'); if (!v('pw')) E.pw = t('req'); if (!showErr(E)) return;
    const acc = S.accounts.find(x => (x.email === v('idf') || x.phone.replace(/\s/g, '') === v('idf').replace(/\s/g, '')) && x.pw === v('pw'));
    if (!acc) { E.form = t('badLogin'); showErr(E); return; } await saveProfile(acc); go(acc.role === 'client' ? '#/' : '#/pro'); return render();
  }
  if (k === 'signup') {
    if (!v('name')) E.name = t('req'); if (!okPhone(v('phone'))) E.phone = t('badPhone'); if (/^\S+@\S+\.\S+$/.exec(v('email')) === null) E.email = t('badMail');
    if (UI.role === 'restaurant' && !v('estab')) E.estab = t('req'); if (UI.role !== 'client' && !v('rh')) E.rh = t('req');
    if (v('pw').length < 8) E.pw = t('short'); if (v('pw') !== v('pw2')) E.pw2 = t('mismatch'); if (!showErr(E)) return;
    const id = 'u' + Date.now(), acc = { id, role: UI.role, name: v('name'), phone: v('phone'), email: v('email'), pw: v('pw'), active: true };
    if (UI.role === 'restaurant') acc.rid = 'r1'; if (UI.role === 'driver') { const z = findZone(v('rh')); acc.zones = z ? [z.id] : ['z1', 'z2']; acc.vehicle = v('vh'); }
    await saveProfile(acc); go(UI.role === 'client' ? '#/' : '#/pro'); return render();
  }
  if (k === 'report') { const l = await getReports(); l.unshift({ id: 'p' + Date.now(), oid: a, reason: v('rs'), text: v('rt'), done: false, note: '' }); await saveReports(l); toast(t('reported')); return render(); }
  if (k === 'rate') { await patchOrder(a, o => { o.rating = { r: +v('rr'), d: +v('rd'), c: v('rc') }; }); return render(); }
  if (k === 'code') { const o = S.orders.find(x => x.id === a); if (v('cd') !== o.code) { E.cd = t('badCode'); showErr(E); return; } await updateOrderStatus(a, 'delivered'); toast(t('st_delivered')); return render(); }
  if (k === 'refund') { const amt = +v('ra'); if (!(amt > 0)) { E.ra = t('req'); showErr(E); return; } await patchOrder(a, o => { o.refunds.push({ amt: Math.min(amt, o.total), motif: v('rm') || '—', t: new Date().toISOString() }); }); return render(); }
  if (k === 'dish') { if (!v('dn')) E.dn = t('req'); if (!(+v('dp') > 0)) E.dp = t('req'); if (!showErr(E)) return; const m = await getRestaurantMenu(S.user.rid); m.push({ id: 'x' + Date.now(), name: v('dn'), desc: v('dd'), price: +v('dp'), cat: v('dc'), stock: 20, photo: v('dph') || 'place', on: true }); await saveRestaurantMenu(S.user.rid, m); return render(); }
  if (k === 'place') { const zs = [...f.querySelectorAll('input[name=z]:checked')].map(x => x.value), patch = { hours: [+v('h0'), +v('h1')], eta: +v('pp'), zones: zs }; if (v('cov')) patch.photo = v('cov'); await saveRestaurantProfile(S.user.rid, patch); toast(t('saved')); return render(); }
  if (k === 'settings') { await saveSettings({ commission: (+v('sc') || 10) / 100, restoDelay: +v('sr') || 10, driverDelay: +v('sd') || 3 }); toast(t('saved')); return render(); }
});
document.documentElement.lang = S.lang;
if (!location.hash) location.hash = '#/';
render();
