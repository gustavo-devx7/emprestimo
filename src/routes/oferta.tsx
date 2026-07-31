import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { LegalFooter } from "@/components/LegalFooter";
import { captureTracking, trackingSearch } from "@/lib/tracking";

export const Route = createFileRoute("/oferta")({
  head: () => ({
    meta: [
      { title: "Empréstimo SuperSim pode liberar até R$ 2.500,00 — Economigo" },
      {
        name: "description",
        content:
          "Veja como funciona o empréstimo SuperSim: até R$ 2.500, solicitação 100% online, parcelas que cabem no orçamento e uma das melhores taxas de aprovação do mercado.",
      },
      {
        property: "og:title",
        content: "Empréstimo SuperSim pode liberar até R$ 2.500,00",
      },
      {
        property: "og:description",
        content:
          "Dinheiro liberado em minutos após aprovação, sem exigir garantias de bens. Entenda como funciona e como solicitar.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/oferta" },
    ],
    links: [{ rel: "canonical", href: "/oferta" }],
  }),
  component: Oferta,
});

const vantagens = [
  "Pode aprovar qualquer perfil",
  "Dinheiro liberado em minutos após aprovação, segundo a SuperSim",
  "Parcelas que cabem no seu orçamento",
  "Solicitação 100% online",
];

const faq = [
  {
    q: "Qual o valor máximo que posso pedir?",
    a: "Na modalidade de crédito pessoal da SuperSim, você pode solicitar até R$ 2.500,00, segundo a plataforma.",
  },
  {
    q: "Quantas parcelas posso fazer?",
    a: "Você pode parcelar o valor solicitado em até 12 vezes, de acordo com dados da SuperSim.",
  },
  {
    q: "Quando recebo o dinheiro após aprovação?",
    a: "O dinheiro pode ser liberado em minutos depois de aprovado, segundo a SuperSim.",
  },
  {
    q: "Qualquer perfil pode solicitar?",
    a: "Sim, a SuperSim permite que pessoas com qualquer perfil financeiro faça a solicitação, de acordo com o site oficial.",
  },
];

function Oferta() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);
  const goToPayment = () => {
    const search = trackingSearch(captureTracking(window.location.search));
    navigate({ to: "/pagamento", search: search ? `?${search}` : undefined });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="bg-brand-navy px-4 py-6 text-center">
        <span className="text-2xl font-extrabold tracking-tight text-brand-navy-foreground">
          Econo<span className="text-brand-green">migo</span>
        </span>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <h1 className="text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
          Empréstimo SuperSim pode liberar até R$ 2.500,00 para você
        </h1>

        <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="bg-muted/50 px-4 py-3">
            <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold text-brand-green-dark">
              Canal de recomendações
            </span>
          </div>
          <div className="px-4 pb-5 pt-4">
            <h2 className="text-center text-xl font-extrabold text-foreground">
              Veja recomendações de empréstimo que combinam com seu perfil
            </h2>

            <ul className="mt-4 flex flex-col gap-3">
              {[
                "Opções de até R$ 2.500 mesmo para score baixo",
                "Conteúdo gratuito, direto no seu WhatsApp",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-brand-green-foreground">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={goToPayment}
              className="mt-5 w-full rounded-lg bg-brand-green px-6 py-4 text-base font-bold text-brand-green-foreground transition-opacity hover:opacity-90"
            >
              Quero minhas opções no WhatsApp
            </button>
            <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
              Toque em Seguir e ative o 🔔
            </p>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-muted-foreground">
              Canal informativo no WhatsApp. Conteúdo educativo, sem garantias de liberação e sem
              contratação automática.
            </p>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-foreground">
          <p>
            Este é o{" "}
            <strong>empréstimo perfeito para quem precisa de dinheiro rápido após aprovação</strong>{" "}
            para <strong>resolver um imprevisto financeiro</strong> ou até mesmo um problema que já
            está te incomodando há algum tempo. Entenda como funciona o empréstimo com uma das{" "}
            <strong>melhores taxas de aprovação do mercado</strong>!
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={goToPayment}
            className="rounded-lg bg-brand-teal px-8 py-4 text-sm font-bold uppercase tracking-wide text-brand-navy-foreground transition-opacity hover:opacity-90"
          >
            Ver como funciona
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-foreground">
          <p>
            O empréstimo pessoal é uma solução financeira bastante popular e{" "}
            <strong>pode realmente fazer a diferença em tempos de dificuldades</strong>, dívidas,
            emergências ou até para realizar um sonho.
          </p>
          <p>
            Por isso, o Economigo preparou dicas para te ajudar nesse processo de análise de perfil
            com o SuperSim.
          </p>
          <p>
            Com o SuperSim, o processo de solicitação é descomplicado, tornando a{" "}
            <strong>aprovação muito mais fácil</strong>. Ele oferece uma das melhores taxas de
            aprovação, sem exigir garantias de bens e disponibiliza <strong>até R$ 2.500</strong>.
          </p>
          <p>
            É normal ter dúvidas antes de solicitar um empréstimo, por isso, reunimos algumas
            informações adicionais para que você se sinta mais confiante ao lidar com qualquer
            imprevisto financeiro que possa estar te afetando.
          </p>
        </div>

        <h2 className="mt-8 text-2xl font-extrabold text-brand-navy">Vantagens</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {vantagens.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base text-foreground">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-teal text-xs font-bold text-brand-navy-foreground">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={goToPayment}
            className="rounded-lg bg-brand-teal px-8 py-4 text-sm font-bold uppercase tracking-wide text-brand-navy-foreground transition-opacity hover:opacity-90"
          >
            Ver como funciona
          </button>
          <button
            type="button"
            onClick={goToPayment}
            className="text-sm font-bold uppercase tracking-wide text-brand-navy"
          >
            Ver como solicitar →
          </button>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-brand-navy">Perguntas frequentes</h2>
          <div className="mt-4 border-t border-border">
            {faq.map((item, index) => (
              <div key={item.q} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(open === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={open === index}
                >
                  <span className="text-sm font-bold text-foreground">{item.q}</span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-muted-foreground text-muted-foreground">
                    {open === index ? "−" : "+"}
                  </span>
                </button>
                {open === index && (
                  <p className="pb-6 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <LegalFooter />
    </div>
  );
}
