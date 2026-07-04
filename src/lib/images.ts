// Central asset URL map for the DIMA Market experience.
import facadeWide from "@/assets/facade-wide.jpg.asset.json";
import facadeEntrance from "@/assets/facade-entrance.jpg.asset.json";
import interiorCounter from "@/assets/interior-counter.jpg.asset.json";
import interiorAisle from "@/assets/interior-aisle.jpg.asset.json";
import aisleBiscuits from "@/assets/aisle-biscuits.jpg.asset.json";
import aisleEpicerie from "@/assets/aisle-epicerie.jpg.asset.json";
import aisleDrinks from "@/assets/aisle-drinks.jpg.asset.json";
import aisleSnacks from "@/assets/aisle-snacks.jpg.asset.json";
import bakery from "@/assets/bakery.jpg.asset.json";
import customers from "@/assets/customers.jpg.asset.json";
import staffEpicerie from "@/assets/staff-epicerie.jpg.asset.json";
import staffHygiene from "@/assets/staff-hygiene.jpg.asset.json";

export const IMG = {
  facadeWide: facadeWide.url,
  facadeEntrance: facadeEntrance.url,
  interiorCounter: interiorCounter.url,
  interiorAisle: interiorAisle.url,
  aisleBiscuits: aisleBiscuits.url,
  aisleEpicerie: aisleEpicerie.url,
  aisleDrinks: aisleDrinks.url,
  aisleSnacks: aisleSnacks.url,
  bakery: bakery.url,
  customers: customers.url,
  staffEpicerie: staffEpicerie.url,
  staffHygiene: staffHygiene.url,
};

export const ALL_IMAGES = Object.values(IMG);
