// Single source of truth for DIMA Market's real-world contact info.
// TODO: replace placeholders with the real phone/WhatsApp/address before launch.
export const BUSINESS = {
  phoneDisplay: "+212 — DIMA",
  phoneHref: "tel:+212000000000",
  whatsappNumber: "212600000000", // digits only, no +, no leading 0
  email: "hello@dima.market",
  addressLabel: "Casablanca, Maroc",
  mapsEmbedSrc:
    "https://www.openstreetmap.org/export/embed.html?bbox=-7.65%2C33.55%2C-7.55%2C33.62&layer=mapnik",
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
