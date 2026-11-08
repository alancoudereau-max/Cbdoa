/**
 * Authentification de l'espace /admin : mot de passe unique (ADMIN_PASSWORD) → cookie de session
 * signé HMAC-SHA256 (ADMIN_SESSION_SECRET). Compatible Edge (middleware) et Node (actions).
 */

export const ADMIN_COOKIE = "cbdoux_admin";
export const SESSION_HOURS = 12;

const enc = new TextEncoder();

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_PASSWORD.length >= 8);
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const sig = await hmac(process.env.ADMIN_SESSION_SECRET!, `admin.${exp}`);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const expected = await hmac(process.env.ADMIN_SESSION_SECRET, `admin.${exp}`);
  return timingSafeEqual(expected, sig);
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  // Comparaison à temps constant via HMAC des deux valeurs
  const k = process.env.ADMIN_SESSION_SECRET ?? "x";
  const [a, b] = await Promise.all([hmac(k, input), hmac(k, expected)]);
  return timingSafeEqual(a, b);
}
