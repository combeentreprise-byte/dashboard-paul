export const SESSION_COOKIE = "dashboard_session";

/** SHA-256 hex digest, computed via Web Crypto so it works in both the Edge middleware and Node routes. */
export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function expectedSessionValue(): Promise<string | null> {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;
  return sha256Hex(password);
}
