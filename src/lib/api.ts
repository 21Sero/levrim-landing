// Talks to the Levrim Commerce platform over its public API.
// The base URL is configured via NEXT_PUBLIC_PLATFORM_API_URL.

export const API_BASE = (process.env.NEXT_PUBLIC_PLATFORM_API_URL || "").replace(/\/$/, "");

export type LandingStats = { partners: number; orders: number; salesCents: number; stores: number };

const EMPTY: LandingStats = { partners: 0, orders: 0, salesCents: 0, stores: 0 };

/** Server-side: fetch live platform stats for social proof. Falls back to zeros. */
export async function fetchStats(): Promise<LandingStats> {
  if (!API_BASE) return EMPTY;
  try {
    const res = await fetch(`${API_BASE}/api/public/stats`, { next: { revalidate: 60 } });
    if (!res.ok) return EMPTY;
    const data = (await res.json()) as Partial<LandingStats>;
    return {
      partners: Number(data.partners) || 0,
      orders: Number(data.orders) || 0,
      salesCents: Number(data.salesCents) || 0,
      stores: Number(data.stores) || 0,
    };
  } catch {
    return EMPTY;
  }
}

export type DemoPayload = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  intent: "demo" | "trial";
};

/** Client-side: submit a demo/trial lead to the platform. */
export async function submitDemo(payload: DemoPayload): Promise<{ ok: boolean; error?: string }> {
  if (!API_BASE) return { ok: false, error: "API не настроен (NEXT_PUBLIC_PLATFORM_API_URL)." };
  try {
    const res = await fetch(`${API_BASE}/api/public/demo-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) return { ok: false, error: data.error || "Не удалось отправить заявку." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Сеть недоступна. Попробуйте позже." };
  }
}
