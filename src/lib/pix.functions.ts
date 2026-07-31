import { createServerFn } from "@tanstack/react-start";

import { isUtmifyTest, type Tracking } from "./tracking";

const API_BASE = "https://app.flevopay.com.br/api/v1";
const UTMIFY_API = "https://api.utmify.com.br/api-credentials/orders";

function env(name: string) {
  return String(process.env[name] ?? "").trim();
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
) {
  const { timeoutMs = 15000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function getWebhookUrl() {
  const url = env("PIX_WEBHOOK_URL");
  // Never send status callbacks to FlevoPay's transaction creation endpoint.
  return url && !url.startsWith("https://app.flevopay.com.br/") ? url : "";
}

function utmifyDate() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

async function notifyUtmify(input: {
  orderId: string;
  status: "waiting_payment" | "paid";
  customer: CustomerInput;
  amount: number;
  tracking?: TrackingInput;
}) {
  const token = env("UTMIFY_API_TOKEN");
  if (!token) return;

  const body = {
    orderId: input.orderId,
    platform: env("UTMIFY_PLATFORM") || "FlevoPay",
    paymentMethod: "pix",
    status: input.status,
    createdAt: utmifyDate(),
    approvedDate: input.status === "paid" ? utmifyDate() : null,
    refundedAt: null,
    customer: { ...input.customer, country: "BR" },
    products: [{
      id: env("UTMIFY_PRODUCT_ID") || env("PIX_PRODUCT_HASH") || "emprestimo",
      name: env("UTMIFY_PRODUCT_NAME") || env("PIX_PRODUCT_DESCRIPTION") || "Taxa de adesão",
      planId: null,
      planName: null,
      quantity: 1,
      priceInCents: input.amount,
    }],
    trackingParameters: { src: input.tracking?.src ?? null, sck: input.tracking?.sck ?? null, utm_source: input.tracking?.utm_source ?? null, utm_medium: input.tracking?.utm_medium ?? null, utm_campaign: input.tracking?.utm_campaign ?? null, utm_content: input.tracking?.utm_content ?? null, utm_term: input.tracking?.utm_term ?? null },
    commission: { totalPriceInCents: input.amount, gatewayFeeInCents: 0, userCommissionInCents: input.amount },
    isTest: isUtmifyTest(input.tracking ?? {}),
  };

  try {
    const response = await fetchWithTimeout(UTMIFY_API, {
      method: "POST",
      headers: { "x-api-token": token, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeoutMs: 15000,
    });
    if (!response.ok) console.error(`Utmify notification failed [${response.status}]: ${await response.text()}`);
  } catch (error) {
    console.error("Utmify notification error", error);
  }
}

type TrackingInput = Partial<Record<"src" | "sck" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;

type CustomerInput = {
  name: string;
  email: string;
  document: string;
  phone: string;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function validateCustomer(input: CustomerInput & { tracking?: TrackingInput }): CustomerInput & { tracking?: TrackingInput } {
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

  const tracking = Object.fromEntries(Object.entries(input?.tracking ?? {}).filter(([, value]) => typeof value === "string" && value.length <= 200));
  return { name, email, document, phone, ...(Object.keys(tracking).length ? { tracking } : {}) };
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
    const { tracking, ...customer } = data;
    const apiKey = process.env.FLEVOPAY_SECRET_KEY;
    if (!apiKey) throw new Error("Gateway de pagamento não configurado.");

    const amount = Number(env("PIX_AMOUNT_CENTS") || 3021);
    const description = env("PIX_PRODUCT_DESCRIPTION") || "Taxa de adesão";
    const productHash = env("PIX_PRODUCT_HASH");
    const callbackUrl = getWebhookUrl();
    const reference = `ECON-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const body: Record<string, unknown> = {
      amount,
      description,
      reference,
      customer,
    };
    if (productHash) body.productHash = productHash;
    if (tracking && Object.keys(tracking).length) body.tracking = tracking;
    else body.source = "api_externa";
    if (callbackUrl) body.postback_url = callbackUrl;

    let response: Response;
    try {
      response = await fetchWithTimeout(`${API_BASE}/transaction`, {
        method: "POST",
        headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        timeoutMs: 15000,
      });
    } catch (error) {
      console.error("FlevoPay transaction request failed/timed out", error);
      throw new Error("Não foi possível gerar o PIX agora. Tente novamente.");
    }

    const text = await response.text();
    if (!response.ok) {
      console.error(`FlevoPay transaction failed [${response.status}]: ${text}`);
      throw new Error("Não foi possível gerar o PIX agora. Tente novamente.");
    }

    const payload = JSON.parse(text) as {
      transaction_id?: number | string;
      transactionId?: number | string;
      id?: number | string;
      qr_code?: string;
      qr_code_base64?: string;
      pix?: { code?: string; qr_code?: string; qrCode?: string };
      data?: { transaction_id?: number | string; id?: number | string; qr_code?: string; pix?: { code?: string } };
      amount?: number;
      expires_at?: string;
    };

    const transactionId = payload.transaction_id ?? payload.transactionId ?? payload.id ?? payload.data?.transaction_id ?? payload.data?.id;
    const qrCode = payload.qr_code ?? payload.pix?.code ?? payload.pix?.qr_code ?? payload.pix?.qrCode ?? payload.data?.qr_code;
    if (!transactionId || !qrCode) {
      console.error(`FlevoPay transaction without qr_code: ${text}`);
      throw new Error("Não foi possível gerar o PIX agora. Tente novamente.");
    }

    // Fire-and-forget: a notificação de rastreamento (Utmify) NÃO deve bloquear
    // a resposta do QR Code ao usuário. Ela roda em segundo plano.
    void notifyUtmify({ orderId: String(transactionId), status: "waiting_payment", customer, amount: payload.amount ?? amount, tracking }).catch((error) => {
      console.error("Utmify notification (background) failed", error);
    });

    return {
      transactionId: String(transactionId),
      reference,
      qrCode,
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

    let response: Response;
    try {
      response = await fetchWithTimeout(
        `${API_BASE}/query?action=get_transaction&id=${encodeURIComponent(data.transactionId)}`,
        { headers: { "X-API-Key": apiKey }, timeoutMs: 10000 },
      );
    } catch (error) {
      console.error("FlevoPay query request failed/timed out", error);
      return { status: "pending", upsellUrl };
    }

    if (!response.ok) {
      console.error(`FlevoPay query failed [${response.status}]: ${await response.text()}`);
      return { status: "pending", upsellUrl };
    }

    const payload = (await response.json()) as { status?: string };
    return { status: payload?.status ?? "pending", upsellUrl };
  });
