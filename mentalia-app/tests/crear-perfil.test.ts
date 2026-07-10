import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/auth/crear-perfil/route";

function req(body: any) {
  return new Request("http://localhost/api/auth/crear-perfil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("crear-perfil — consentimiento informado", () => {
  it("sin consent → 400 (el registro no se completa)", async () => {
    const res = await POST(req({ userId: "u1", email: "a@b.com", role: "patient" }));
    expect(res.status).toBe(400);
    const j = await res.json();
    expect(j.error).toMatch(/consentimiento/i);
  });

  it("consent=false → 400", async () => {
    const res = await POST(req({ userId: "u1", email: "a@b.com", role: "patient", consent: false }));
    expect(res.status).toBe(400);
  });

  it("datos incompletos → 400 antes del consent", async () => {
    const res = await POST(req({ email: "a@b.com" }));
    expect(res.status).toBe(400);
  });
});
