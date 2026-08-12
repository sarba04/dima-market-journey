import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { BUSINESS } from "@/lib/business";
import dimaMLogo from "@/assets/dima-m-logo-transparent.png";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const T = {
  fr: {
    open: "Discuter avec DIMA",
    close: "Fermer la discussion",
    title: "Dima · Assistant",
    status: "En ligne · réponse immédiate",
    intro: `Bonjour et bienvenue chez DIMA M Market. Je suis Dima, votre assistant. Horaires, rayons, livraison, paiement — posez-moi votre question.`,
    placeholder: "Écrivez votre message…",
    send: "Envoyer",
    thinking: "Dima écrit…",
    error: "Désolé, une erreur est survenue. Réessayez ou appelez-nous au " + BUSINESS.phoneDisplay + ".",
    suggestions: [
      "Vos horaires ?",
      "Vous livrez ?",
      "Où êtes-vous exactement ?",
      "Le pain est frais ?",
    ],
  },
  ar: {
    open: "تحدث مع ديما",
    close: "إغلاق المحادثة",
    title: "ديما · المساعد",
    status: "متصل · رد فوري",
    intro: "مرحباً بكم في DIMA M Market. أنا ديما، مساعدكم. الأوقات، الأقسام، التوصيل، الأداء — اسألوني.",
    placeholder: "اكتب رسالتك…",
    send: "إرسال",
    thinking: "ديما يكتب…",
    error: "عذراً، حدث خطأ. أعد المحاولة أو اتصل بنا على " + BUSINESS.phoneDisplay + ".",
    suggestions: ["ما هي أوقات العمل؟", "هل تقومون بالتوصيل؟", "أين يوجد المتجر؟", "هل الخبز طازج؟"],
  },
} as const;

export function ChatWidget() {
  const { lang, dir } = useLanguage();
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setPulse(true), 9000);
    return () => clearTimeout(t0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: value };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    const replyId = crypto.randomUUID();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));

      setMessages((prev) => [...prev, { id: replyId, role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: acc } : m)));
      }
      if (!acc.trim()) {
        setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: t.error } : m)));
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== replyId),
        { id: replyId, role: "assistant", content: t.error },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.close : t.open}
        className="fixed bottom-5 right-5 z-[95] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[color:var(--dima)] text-black shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8"
      >
        {pulse && !open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--dima)] opacity-40" />
        )}
        <span className="relative">
          {open ? <X className="h-6 w-6" strokeWidth={1.75} /> : <MessageCircle className="h-6 w-6" strokeWidth={1.75} />}
        </span>
      </button>

      {/* Panel */}
      <div
        dir={dir}
        className={`fixed bottom-24 right-3 z-[96] flex w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-400 sm:bottom-28 sm:right-8 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(560px, calc(100dvh - 8rem))" }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
            <img src={dimaMLogo} alt="DIMA M Market" className="h-6 w-6 object-contain" />
          </span>
          <div className="min-w-0">
            <div className="font-display text-sm text-white">{t.title}</div>
            <div className="flex items-center gap-1.5 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dima)]" />
              {t.status}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <div className="max-w-[92%] text-[13px] leading-relaxed text-white/75">{t.intro}</div>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-[color:var(--dima)] hover:text-[color:var(--dima)]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-[color:var(--dima)] px-3.5 py-2 text-[13px] leading-relaxed text-black">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={m.id} className="max-w-[92%] whitespace-pre-wrap text-[13px] leading-relaxed text-white/85">
                {m.content}
              </div>
            ),
          )}

          {loading && (
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/35">
              {t.thinking}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-white/10 p-3"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder={t.placeholder}
            className="max-h-28 min-h-[42px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:border-[color:var(--dima)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label={t.send}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[color:var(--dima)] text-black transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </form>
      </div>
    </>
  );
}
