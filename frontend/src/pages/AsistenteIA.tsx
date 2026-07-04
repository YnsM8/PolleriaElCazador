import { FormEvent, useState } from "react";
import { sendChatMessage } from "../api/client";
import { PageHeader } from "../components/PageHeader";
import type { ChatResponse } from "../types/api";

const starterQuestions = [
  "Que local vende mas?",
  "Que significa el RMSE?",
  "Como aporta K-Means al negocio?",
  "Como optimizar inventario en temporada alta?",
];

export function AsistenteIA() {
  const [message, setMessage] = useState(starterQuestions[0]);
  const [history, setHistory] = useState<Array<{ question: string; response: ChatResponse }>>([]);
  const [loading, setLoading] = useState(false);

  async function submitQuestion(question: string) {
    setLoading(true);
    try {
      const response = await sendChatMessage(question);
      setHistory((current) => [{ question, response }, ...current]);
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim()) {
      await submitQuestion(message.trim());
    }
  }

  return (
    <div>
      <PageHeader
        description="Prototipo conversacional local, basado en reglas, KPIs y resultados de modelos. No usa APIs externas."
        eyebrow="IA"
        title="Asistente IA gerencial"
      />
      <section className="premium-card p-6">
        <div className="flex flex-wrap gap-2">
          {starterQuestions.map((question) => (
            <button
              className="rounded-full border border-cazador-amber/40 px-4 py-2 text-sm text-cazador-cream/80 hover:bg-cazador-amber hover:text-cazador-dark hover:border-cazador-amber transition-colors shadow-sm"
              key={question}
              onClick={() => void submitQuestion(question)}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
        <form className="mt-6 flex gap-3" onSubmit={handleSubmit}>
          <label className="min-w-0 flex-1 relative group">
            <span className="sr-only">Pregunta gerencial</span>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:text-cazador-amber transition-opacity">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <input
              className="w-full bg-cazador-dark/50 rounded-xl border border-cazador-border/50 pl-10 pr-4 py-3 text-cazador-cream placeholder-cazador-cream/30 focus:outline-none focus:border-cazador-amber focus:ring-1 focus:ring-cazador-amber transition-all"
              name="message"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Escribe una pregunta gerencial…"
              value={message}
            />
          </label>
          <button className="rounded-xl bg-gradient-to-r from-cazador-amber to-cazador-orange px-6 py-3 font-semibold text-cazador-dark hover:shadow-[0_0_15px_rgba(229,160,34,0.4)] transition-all disabled:opacity-50" disabled={loading} type="submit">
            {loading ? "..." : "Consultar"}
          </button>
        </form>
      </section>
      <div className="mt-8 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-cazador-border before:to-transparent">
        {history.map((item, index) => (
          <article className="relative flex items-start gap-4" key={`${item.question}-${index}`}>
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-cazador-dark border border-cazador-amber text-cazador-amber z-10 shrink-0">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <div className="premium-card p-6 flex-1 relative animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-cazador-amber mb-3 border-b border-cazador-border/50 pb-2">{item.question}</p>
              <p className="text-sm leading-relaxed text-cazador-cream/90 font-light">{item.response.answer}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-cazador-border/50 pt-3">
                <p className="text-xs uppercase tracking-widest text-cazador-amber/50 font-sans">Categoría: <span className="text-cazador-cream/70">{item.response.category}</span></p>
                <div className="flex flex-wrap gap-2">
                  {item.response.suggested_questions.map((question) => (
                    <button
                      className="rounded-full bg-cazador-dark/50 border border-cazador-border px-3 py-1 text-xs text-cazador-cream/60 hover:bg-cazador-amber hover:text-cazador-dark hover:border-cazador-amber transition-colors"
                      key={question}
                      onClick={() => void submitQuestion(question)}
                      type="button"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
