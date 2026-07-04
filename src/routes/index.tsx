import { createFileRoute } from "@tanstack/react-router";
import { DimaHero } from "@/components/DimaHero";
import { PostHero } from "@/components/PostHero";
import { ExperienceLayer } from "@/components/ExperienceLayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIMA M Market — Une supérette. Une expérience." },
      {
        name: "description",
        content:
          "DIMA M Market — visite immersive d'une supérette moderne à Tabriquet, Salé. Alimentation, boulangerie, produits importés, boissons et snacks, servis avec exigence.",
      },
      { property: "og:title", content: "DIMA M Market — Une supérette. Une expérience." },
      {
        property: "og:description",
        content:
          "Entrez virtuellement dans DIMA M Market : visite cinématique pilotée au scroll, rayons soignés, boulangerie fraîche chaque jour.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main id="top" className="bg-background text-foreground">
      <ExperienceLayer />
      <DimaHero />
      <PostHero />
    </main>
  );
}
