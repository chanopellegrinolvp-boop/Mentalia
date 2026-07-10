import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  role: "professional" as string,
  uploads: [] as any[],
  updates: [] as any[],
  uploadError: null as any,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: "pro1" } } }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: h.role } }) }) }) }),
  }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: { from: () => ({ upload: async (path: string, _buf: any, opts: any) => { h.uploads.push({ path, opts }); return { error: h.uploadError }; } }) },
    from: (t: string) => ({ update: (v: any) => ({ eq: async () => { h.updates.push({ table: t, value: v }); return { error: null }; } }) }),
  }),
}));

import { POST as subir } from "@/app/api/profesional/subir-matricula/route";

function fileReq(file: File): any {
  const fd = new FormData();
  fd.append("file", file);
  return new Request("http://localhost/api/profesional/subir-matricula", { method: "POST", body: fd });
}

describe("profesional/subir-matricula", () => {
  beforeEach(() => { h.role = "professional"; h.uploads = []; h.updates = []; h.uploadError = null; });

  it("PDF válido → sube al bucket (carpeta = uid) y guarda url + fecha", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "matricula.pdf", { type: "application/pdf" });
    const res = await subir(fileReq(file));
    expect(res.status).toBe(200);
    expect(h.uploads).toHaveLength(1);
    expect(h.uploads[0].path).toMatch(/^pro1\/matricula-\d+\.pdf$/);
    const upd = h.updates.find(u => u.table === "professionals");
    expect(upd?.value.license_doc_url).toMatch(/^pro1\/matricula-/);
    expect(upd?.value.license_doc_uploaded_at).toBeTruthy();
  });

  it("tipo no permitido → 400 y no sube", async () => {
    const file = new File(["hola"], "nota.txt", { type: "text/plain" });
    const res = await subir(fileReq(file));
    expect(res.status).toBe(400);
    expect(h.uploads).toHaveLength(0);
  });

  it("archivo > 5 MB → 400", async () => {
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "grande.png", { type: "image/png" });
    const res = await subir(fileReq(big));
    expect(res.status).toBe(400);
    expect(h.uploads).toHaveLength(0);
  });

  it("no profesional → 403", async () => {
    h.role = "patient";
    const file = new File([new Uint8Array([1])], "m.pdf", { type: "application/pdf" });
    const res = await subir(fileReq(file));
    expect(res.status).toBe(403);
  });
});
