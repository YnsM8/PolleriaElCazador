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
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {starterQuestions.map((question) => (
            <button
              className="rounded-full border border-amber-300 px-3 py-2 text-sm text-cazador-brown hover:bg-amber-50"
              key={question}
              onClick={() => void submitQuestion(question)}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
        <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Pregunta gerencial</span>
            <input
              className="w-full rounded-md border border-stone-300 px-3 py-2"
              name="message"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Escribe una pregunta gerencial…"
              value={message}
            />
          </label>
          <button className="rounded-md bg-cazador-brown px-4 py-2 font-semibold text-white" disabled={loading} type="submit">
            {loading ? "..." : "Enviar"}
          </button>
        </form>
      </section>
      <div className="mt-6 space-y-4">
        {history.map((item, index) => (
          <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm" key={`${item.question}-${index}`}>
            <p className="text-sm font-semibold text-cazador-orange">{item.question}</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{item.response.answer}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Categoría: {item.response.category}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.response.suggested_questions.map((question) => (
                <button
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700 hover:bg-amber-100"
                  key={question}
                  onClick={() => void submitQuestion(question)}
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
