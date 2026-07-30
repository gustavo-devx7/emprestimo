import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import { LegalFooter } from "@/components/LegalFooter";
import { createPixCharge, getPixStatus, type PixCharge } from "@/lib/pix.functions";

export const Route = createFileRoute("/pagamento")({
  head: () => ({
    meta: [
      { title: "Pagamento via PIX — Economigo" },
      {
        name: "description",
        content:
          "Finalize sua solicitação pagando a taxa de adesão via PIX: escaneie o QR Code ou use o código copia e cola.",
      },
      { property: "og:title", content: "Pagamento via PIX — Economigo" },
      {
        property: "og:description",
        content: "Escaneie o QR Code ou copie o código PIX para concluir sua solicitação.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Pagamento,
});

const formatCents = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function maskCPF(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function Pagamento() {
  const generate = useServerFn(createPixCharge);
  const checkStatus = useServerFn(getPixStatus);

  const [form, setForm] = useState({ name: "", email: "", document: "", phone: "" });
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!charge || approved) return;
    const interval = setInterval(async () => {
      try {
        const result = await checkStatus({ data: { transactionId: charge.transactionId } });
        if (result.status === "approved") {
          setApproved(true);
          if (result.upsellUrl) window.location.href = result.upsellUrl;
        }
      } catch {
        /* keep polling */
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [charge, approved, checkStatus]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const tracking = Object.fromEntries(["src", "sck", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].flatMap((key) => {
        const value = params.get(key);
        return value ? [[key, value]] : [];
      }));
      setCharge(await generate({ data: { ...form, tracking } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar o PIX.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!charge) return;
    await navigator.clipboard.writeText(charge.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="bg-brand-navy px-4 py-6 text-center">
        <span className="text-2xl font-extrabold tracking-tight text-brand-navy-foreground">
          Econo<span className="text-brand-green">migo</span>
        </span>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-10">
        {!charge ? (
          <>
            <h1 className="text-center text-2xl font-extrabold text-brand-navy">
              Falta pouco para liberar sua solicitação
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Preencha seus dados para gerar o PIX da taxa de adesão.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              {[
                { key: "name", label: "Nome completo", type: "text", placeholder: "João da Silva", maxLength: 80, inputMode: undefined, mask: undefined },
                { key: "email", label: "E-mail", type: "email", placeholder: "voce@email.com", maxLength: 120, inputMode: undefined, mask: undefined },
                { key: "document", label: "CPF", type: "text", placeholder: "000.000.000-00", maxLength: 14, inputMode: "numeric" as const, mask: maskCPF },
                { key: "phone", label: "Telefone com DDD", type: "tel", placeholder: "(11) 99999-9999", maxLength: 15, inputMode: "tel" as const, mask: maskPhone },
              ].map((field) => (
                <label key={field.key} className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                  {field.label}
                  <input
                    required
                    type={field.type}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    inputMode={field.inputMode}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const value = field.mask ? field.mask(raw) : raw.slice(0, field.maxLength);
                      setForm((prev) => ({ ...prev, [field.key]: value }));
                    }}
                    className="rounded-lg border border-border bg-card px-4 py-3 text-base font-normal text-foreground outline-none focus:border-brand-teal"
                  />
                </label>
              ))}


              {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-brand-green px-6 py-5 text-lg font-bold text-brand-green-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-step-idle disabled:text-muted-foreground"
              >
                {loading ? "Gerando PIX..." : "Gerar PIX"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl font-extrabold text-brand-navy">
              {approved ? "Pagamento confirmado!" : "Pague com PIX para concluir"}
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {approved
                ? "Recebemos seu pagamento. Estamos te redirecionando..."
                : `Escaneie o QR Code ou use o código copia e cola. Valor: ${formatCents(charge.amount)}`}
            </p>

            {!approved && (
              <>
                {charge.qrCode && (
                  <div className="mt-8 flex justify-center">
                    <div className="rounded-xl border border-border bg-white p-3">
                      <QRCodeSVG
                        value={charge.qrCode}
                        size={232}
                        level="M"
                        title="QR Code PIX para pagamento da taxa de adesão"
                      />
                    </div>
                  </div>
                )}


                <p className="mt-8 text-sm font-semibold text-foreground">PIX copia e cola</p>
                <p className="mt-2 break-all rounded-lg border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
                  {charge.qrCode}
                </p>

                <button
                  type="button"
                  onClick={copyCode}
                  className="mt-4 w-full rounded-xl bg-brand-teal px-6 py-4 text-base font-bold text-brand-navy-foreground transition-opacity hover:opacity-90"
                >
                  {copied ? "Código copiado ✓" : "Copiar código PIX"}
                </button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Aguardando confirmação do pagamento
                  {charge.expiresAt ? ` — expira em ${charge.expiresAt}` : ""}.
                </p>
              </>
            )}
          </>
        )}
      </main>

      <LegalFooter />
    </div>
  );
}
