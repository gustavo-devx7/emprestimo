import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { LegalFooter } from "@/components/LegalFooter";
import { Stepper } from "@/components/Stepper";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Simulação de empréstimo — CredOn" },
      {
        name: "description",
        content:
          "Responda algumas perguntas rápidas sobre valor, prazo e perfil e receba a recomendação de empréstimo mais adequada para você.",
      },
      { property: "og:title", content: "Simulação de empréstimo — CredOn" },
      {
        property: "og:description",
        content: "Perguntas rápidas para encontrar a melhor opção de crédito para o seu perfil.",
      },
    ],
  }),
  component: Quiz,
});

type Question = { key: string; title: string; options: string[] };

const questions: Question[] = [
  {
    key: "valor",
    title: "De quanto você precisa?",
    options: ["Até 1.000,00", "Até 1.500,00", "Até 2.000,00", "Mais de 2.500"],
  },
  {
    key: "prazo",
    title: "Qual prazo você prefere?",
    options: ["Em até 3 meses", "Em até 6 meses", "Em até 1 ano"],
  },
  {
    key: "negativado",
    title: "Você está negativado?",
    options: ["Sim", "Não"],
  },
  {
    key: "notificacoes",
    title: "Quer se manter informado sobre sua solicitação por meio de notificações?",
    options: ["Sim", "Não"],
  },
  {
    key: "renda",
    title: "Qual a sua renda mensal?",
    options: ["Até 1.500,00", "De 1.500,00 a 3.000,00", "Acima de 3.000,00"],
  },
];

function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [, setAnswers] = useState<Record<string, string>>({});

  const isLast = step > questions.length;
  const question = questions[step - 1];

  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    if (!isLast) return;
    setCtaReady(false);
    const timer = setTimeout(() => setCtaReady(true), 2000);
    return () => clearTimeout(timer);
  }, [isLast]);

  function answer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
    setStep((s) => s + 1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="bg-brand-navy px-4 py-6 text-center">
        <span className="text-2xl font-extrabold tracking-tight text-brand-navy-foreground">
          Econo<span className="text-brand-green">migo</span>
        </span>
      </header>

      <main className="flex-1 px-5 py-12">
        {isLast ? (
          <div className="mx-auto flex max-w-lg flex-col items-center">
            <p className="mt-10 text-center text-2xl font-bold text-brand-navy">
              aqui vai a vsl
            </p>

            <button
              type="button"
              disabled={!ctaReady}
              onClick={() => navigate({ to: "/oferta" })}
              className={`mt-10 w-full rounded-xl px-6 py-5 text-lg font-bold transition-colors ${
                ctaReady
                  ? "bg-brand-green text-brand-navy hover:opacity-90"
                  : "cursor-not-allowed bg-step-idle text-muted-foreground"
              }`}
            >
              Pegar empréstimo sem juros
            </button>
          </div>
        ) : (
          <>
            <Stepper current={Math.min(step, 6)} />
            <h1 className="mx-auto mt-14 max-w-2xl text-center text-2xl font-bold text-brand-navy">
              {question.title}
            </h1>

            <div className="mx-auto mt-8 flex max-w-lg flex-col gap-4">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => answer(option)}
                  className="rounded-xl bg-brand-navy px-6 py-5 text-lg font-bold text-brand-navy-foreground transition-colors hover:bg-brand-navy-soft"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <LegalFooter />
    </div>
  );
}
