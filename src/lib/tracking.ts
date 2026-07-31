export const TRACKING_KEYS = [
  "src",
  "sck",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type Tracking = Partial<Record<(typeof TRACKING_KEYS)[number], string>>;

const STORAGE_KEY = "emprestimo:tracking";

export function trackingFromSearch(search: string): Tracking {
  const params = new URLSearchParams(search);
  return Object.fromEntries(
    TRACKING_KEYS.flatMap((key) => {
      const value = params.get(key);
      return value ? [[key, value]] : [];
    }),
  );
}

export function readStoredTracking(): Tracking {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function captureTracking(search: string): Tracking {
  if (typeof window === "undefined") return {};
  const current = trackingFromSearch(search);
  const tracking = { ...readStoredTracking(), ...current };
  if (Object.keys(current).length) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
  }
  return tracking;
}

export function trackingSearch(tracking: Tracking): string {
  const params = new URLSearchParams();
  TRACKING_KEYS.forEach((key) => {
    const value = tracking[key];
    if (value) params.set(key, value);
  });
  return params.toString();
}

export function isUtmifyTest(tracking: Tracking) {
  return Object.values(tracking).some((value) => value.includes("TesteUtms"));
}
