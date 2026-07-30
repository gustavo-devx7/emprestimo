import { createServerFn } from "@tanstack/react-start";

const API_BASE = "https://app.flevopay.com.br/api/v1";

type CustomerInput = {
  name: string;
  email: string;
  document: string;
  phone: string;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function validateCustomer(input: CustomerInput): CustomerInput {
  const name = String(input?.name ?? "").trim();
  const email = String(input?.email ?? "").trim();
  const document = onlyDigits(String(input?.document ?? ""));
  const phone = onlyDigits(String(input?.phone ?? ""));

  if (name.length < 3 || name.length > 120) throw new Error("Informe seu nome completo.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 160)
    throw new Error("Informe um e-mail válido.");
  if (document.length !== 11 && document.length !== 14)
    throw new Error("Informe um CPF ou CNPJ válido.");
  if (phone.length < 10 || phone.length > 13) throw new Error("Informe um telefone válido com DDD.");

  return { name, email, document, phone };
}

export type PixCharge = {
  transactionId: string;
  reference: string;
  qrCode: string;
  qrCodeBase64: string | null;
  amount: number;
  expiresAt: string | null;
};

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator(validateCustomer)
  .handler(async ({ data }): Promise<PixCharge> => {
    const apiKey = process.env.FLEVOPAY_SECRET_KEY;
    if (!apiKey) throw new Error("Gateway de pagamento não configurado.");

    const amount = Number(process.env.PIX_AMOUNT_CENTS ?? 3021);
    const description = process.env.PIX_PRODUCT_DESCRIPTION || "Taxa de adesão";
    const productHash = process.env.PIX_PRODUCT_HASH || "";
    const webhookUrl = process.env.PIX_WEBHOOK_URL || "";
    const reference = `ECON-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const body: Record<string, unknown> = {
      amount,
      description,
      reference,
      customer: data,
    };
    if (productHash) body.productHash = productHash;
    else body.source = "api_externa";
    if (webhookUrl) body.postback_url = webhookUrl;

    const response = await fetch(`${API_BASE}/transaction`, {
      method: "POST",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`FlevoPay transaction failed [${response.status}]: ${text}`);
      throw new Error("Não foi possível gerar o PIX agora. Tente novamente.");
    }

    const payload = JSON.parse(text) as {
      transaction_id?: number | string;
      qr_code?: string;
      qr_code_base64?: string;
      amount?: number;
      expires_at?: string;
    };

    if (!payload.qr_code) {
      console.error(`FlevoPay transaction without qr_code: ${text}`);
      throw new Error("Não foi possível gerar o PIX agora. Tente novamente.");
    }

    return {
      transactionId: String(payload.transaction_id ?? reference),
      reference,
      qrCode: payload.qr_code,
      qrCodeBase64: payload.qr_code_base64 ?? null,
      amount: payload.amount ?? amount,
      expiresAt: payload.expires_at ?? null,
    };
  });

export const getPixStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { transactionId: string }) => ({
    transactionId: String(input?.transactionId ?? "").slice(0, 64),
  }))
  .handler(async ({ data }): Promise<{ status: string; upsellUrl: string | null }> => {
    const apiKey = process.env.FLEVOPAY_SECRET_KEY;
    if (!apiKey || !data.transactionId) return { status: "pending", upsellUrl: null };

    const rawUpsell = process.env.UPSELL_URL || "";
    const upsellUrl = rawUpsell
      ? /^https?:\/\//.test(rawUpsell)
        ? rawUpsell
        : `https://${rawUpsell}`
      : null;

    const response = await fetch(
      `${API_BASE}/query?action=get_transaction&id=${encodeURIComponent(data.transactionId)}`,
      { headers: { "X-API-Key": apiKey } },
    );

    if (!response.ok) {
      console.error(`FlevoPay query failed [${response.status}]: ${await response.text()}`);
      return { status: "pending", upsellUrl };
    }

    const payload = (await response.json()) as { status?: string };
    return { status: payload?.status ?? "pending", upsellUrl };
  });
