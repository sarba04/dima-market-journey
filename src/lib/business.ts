// Single source of truth for DIMA M Market's real-world contact info.
export const BUSINESS = {
  phoneDisplay: "+212 751 700 790",
  phoneHref: "tel:+212751700790",
  whatsappNumber: "212751700790", // digits only, no +, no leading 0
  email: "hello@dima.market",
  addressLabel: "Tabriquet, Salé — à 1 min de la poste de Tabriquet",
  mapsEmbedSrc:
    "https://www.openstreetmap.org/export/embed.html?bbox=-6.87%2C34.01%2C-6.77%2C34.08&layer=mapnik&marker=34.048%2C-6.816",
  ratingValue: 4.9,
  reviewCountValue: 340,
  hours: [
    ["Lundi — Vendredi", "07:30 — 23:00"],
    ["Samedi", "07:30 — 23:30"],
    ["Dimanche", "08:00 — 22:00"],
    ["Boulangerie", "Dès 06:30"],
  ] as const,
};

export const whatsappHref = (message: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
