// Single source of truth for DIMA M Market's real-world contact info.
export const BUSINESS = {
  phoneDisplay: "+212 751 700 790",
  phoneHref: "tel:+212751700790",
  whatsappNumber: "212751700790", // digits only, no +, no leading 0
  email: "hello@dima.market",
  addressLabel: "Tabriquet, Salé — à 1 min de la poste de Tabriquet",
  // Coordonnées exactes du lieu Dima M (Google Maps)
  mapLat: 34.0464556,
  mapLng: -6.8055976,
  mapsEmbedSrc:
    "https://maps.google.com/maps?q=34.0464556,-6.8055976&z=17&output=embed",
  mapsLink: "https://www.google.com/maps/place/Dima+M/@34.0464553,-6.805598,17z",
  ratingValue: 4.9,
  reviewCountValue: 340,
  hours: [
    ["Lundi — Vendredi", "09:00 — 22:00"],
    ["Samedi", "09:00 — 22:00"],
    ["Dimanche", "09:00 — 22:00"],
  ] as const,
};

export const whatsappHref = (message: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
