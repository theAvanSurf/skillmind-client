import { redirect } from "next/navigation";
import { cookies } from "next/headers";

function isProfessorToken(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return false;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payloadJson = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;

    const role = String(payload.role ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? "").toLowerCase();
    return role === "professor";
  } catch {
    return false;
  }
}

export default async function RootPage() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token")?.value;

  if (!userToken) {
    redirect("/login");
  }

  redirect(isProfessorToken(userToken) ? "/professor/dashboard" : "/main");
}

