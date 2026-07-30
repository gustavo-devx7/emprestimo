import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { LegalFooter } from "@/components/LegalFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CredOn — Descubra o empréstimo ideal para você" },
      {
        name: "description",
        content:
          "Responda 2 perguntas rápidas e veja as opções de empréstimo mais adequadas ao seu perfil. Serviço 100% gratuito, online e sem consulta ao SPC.",
      },
      { property: "og:title", content: "CredOn — Descubra o empréstimo ideal para você" },
      {
        property: "og:description",
        content: "Leva menos de 30 segundos. Sem compromisso, 100% online, sem consulta ao SPC.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="bg-brand-green-dark px-4 py-8 text-center">
        <span className="text-3xl font-extrabold tracking-tight text-brand-navy-foreground">
          cred<span className="text-brand-green">On</span>
        </span>
        <p className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-brand-navy-foreground/70">
          Uma marca Neocred
        </p>
      </header>

      <main className="flex flex-1 flex-col items-center px-5 py-12 text-center">
        <span className="rounded-full bg-muted px-5 py-2 text-sm font-semibold text-foreground">
          ⚡ Leva menos de 30 segundos
        </span>

        <h1 className="mt-8 max-w-2xl text-4xl font-extrabold leading-tight text-brand-green-dark sm:text-5xl">
          Descubra o empréstimo <span className="text-brand-teal">ideal para você</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Responda <strong className="text-foreground">2 perguntas rápidas</strong> e veja as opções
          mais adequadas ao seu perfil. Serviço{" "}
          <strong className="text-foreground">100% gratuito</strong>.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <li>✓ Sem compromisso</li>
          <li>✓ 100% online</li>
          <li>✓ Sem consulta ao SPC</li>
        </ul>

        <button
          type="button"
          onClick={() => navigate({ to: "/quiz" })}
          className="mt-10 w-full max-w-md rounded-2xl bg-brand-green px-8 py-6 text-xl font-extrabold tracking-wide text-brand-green-foreground shadow-[0_0_40px_-6px_var(--brand-green)] transition-transform hover:scale-[1.02]"
        >
          CONTINUAR →
        </button>

        <p className="mt-6 max-w-md text-sm text-muted-foreground">
          Ao continuar você concorda com nossos Termos e Política de Privacidade.
        </p>
      </main>

      <LegalFooter />
    </div>
  );
}
