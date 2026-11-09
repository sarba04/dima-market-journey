import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Menu, X, Phone, MessageCircle } from "lucide-react";
import { BUSINESS, whatsappHref } from "@/lib/business";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dima-m-logo-transparent.png";

const NAV = [
  { href: "#manifeste", fr: "L’esprit DIMA", ar: "روح ديما" },
  { href: "#rayons", fr: "Nos rayons", ar: "أقسامنا" },
  { href: "#engagements", fr: "Nos engagements", ar: "التزاماتنا" },
  { href: "#visiter", fr: "Nous trouver", ar: "موقعنا" },
];
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useLanguage();
  return <Button variant="outline" onClick={toggleLang} aria-label={lang === "fr" ? "Passer au site en arabe" : "Passer au site en français"} className={`language-toggle ${className}`}><span aria-hidden="true">{lang === "fr" ? "🇲🇦" : "🇫🇷"}</span><span>{lang === "fr" ? "العربية" : "Français"}</span></Button>;
}
export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const { lang } = useLanguage();
  useEffect(() => {
    const done = () => setVisible(true);
    const enter = () => { setVisible(false); setOpen(false); };
    const onScroll = () => {
      const tour = document.querySelector(".tour");
      if (tour) setVisible(tour.getBoundingClientRect().bottom <= 100);
    };
    const io = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) setCurrent(`#${e.target.id}`); }); }, { rootMargin: "-15% 0px -65% 0px" });
    NAV.forEach(n => { const el = document.querySelector(n.href); if (el) io.observe(el); });
    window.addEventListener("dima:heroDone", done);
    window.addEventListener("dima:heroEnter", enter);
    window.addEventListener("scroll", onScroll, { passive: true });
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", escape);
    onScroll();
    return () => { io.disconnect(); window.removeEventListener("dima:heroDone", done); window.removeEventListener("dima:heroEnter", enter); window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", escape); };
  }, []);
  return <>
    <nav className={`market-nav ${visible ? "nav-visible" : ""}`} aria-label={lang === "fr" ? "Navigation principale" : "القائمة الرئيسية"} inert={!visible}>
      <div className="market-nav-inner">
        <a href="#top" className="nav-brand" aria-label={lang === "fr" ? "Retour au début" : "العودة إلى البداية"}><img src={logo} alt="DIMA M Market" /><span dir="ltr">DIMA M<span>MARKET</span></span></a>
        <div className="nav-desktop">{NAV.map(n => <Button asChild variant="ghost" key={n.href} className={`nav-link ${current === n.href ? "nav-link-active" : ""}`}><a href={n.href}>{n[lang]}</a></Button>)}</div>
        <div className="flex items-center gap-2"><LanguageToggle /><Button asChild className="nav-directions"><a href={BUSINESS.mapsLink} target="_blank" rel="noopener noreferrer">{lang === "fr" ? "Itinéraire" : "الاتجاهات"}<ArrowUpRight /></a></Button><Button variant="ghost" size="icon" className="nav-menu" aria-label={lang === "fr" ? "Ouvrir le menu" : "فتح القائمة"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
      </div>
      {open && <div className="nav-mobile" id="mobile-navigation">{NAV.map((n,i) => <a href={n.href} key={n.href} onClick={() => setOpen(false)}><span className="nav-mobile-index">0{i+1}</span>{n[lang]}<ArrowUpRight /></a>)}</div>}
    </nav>
    {visible && <Button variant="outline" size="icon" className="back-top" aria-label={lang === "fr" ? "Revenir au début" : "العودة إلى الأعلى"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp /></Button>}
  </>;
}
function SceneTick() {
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => {
    const warm = () => { try { audio.current ??= new AudioContext(); void audio.current.resume().catch(() => {}); } catch {} };
    const tick = () => {
      const ctx = audio.current;
      if (!ctx || ctx.state !== "running" || document.hidden) return;
      const o = ctx.createOscillator(), g = ctx.createGain(), now = ctx.currentTime;
      o.frequency.setValueAtTime(1200, now); o.frequency.exponentialRampToValueAtTime(700, now + 0.06);
      g.gain.setValueAtTime(0.012, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      o.connect(g).connect(ctx.destination); o.start(now); o.stop(now + 0.08);
    };
    window.addEventListener("pointerdown", warm, { once: true }); window.addEventListener("keydown", warm, { once: true }); window.addEventListener("wheel", warm, { once: true, passive: true });
    window.addEventListener("dima:scene", tick);
    return () => { window.removeEventListener("pointerdown", warm); window.removeEventListener("keydown", warm); window.removeEventListener("wheel", warm); window.removeEventListener("dima:scene", tick); void audio.current?.close().catch(() => {}); audio.current = null; };
  }, []);
  return null;
}
function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }); }, { threshold: 0.08 });
    const scan = () => document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => io.observe(el));
    scan(); const mo = new MutationObserver(scan); mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
export function ExperienceLayer() {
  const { lang } = useLanguage();
  return <><FloatingNav /><SceneTick /><ScrollReveal /><div className="quick-contact"><Button asChild variant="outline" size="icon"><a href={BUSINESS.phoneHref} aria-label={lang === "fr" ? "Appeler le magasin" : "اتصل بالمتجر"}><Phone /></a></Button><Button asChild variant="outline" size="icon"><a href={whatsappHref(lang === "fr" ? "Bonjour, je vous contacte depuis le site DIMA M Market." : "مرحباً، أتواصل معكم من موقع DIMA M Market.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle /></a></Button></div></>;
}
