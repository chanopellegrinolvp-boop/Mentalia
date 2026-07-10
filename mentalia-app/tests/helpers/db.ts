import { vi } from "vitest";

// Fake del cliente Supabase con query builder encadenable.
// `results` mapea nombre de tabla → resultado terminal ({ data, error, count }).
// Registra insert/update/delete/upsert en `ops` para poder inspeccionarlos.
export type DbResults = Record<string, any> & { __user?: any };

export function makeDb(results: DbResults = {}) {
  const ops: Array<{ table: string; op: string; value?: any }> = [];

  function from(table: string) {
    const res = results[table] ?? { data: null, error: null, count: 0 };
    const b: any = {};
    const chain = ["select", "eq", "neq", "gte", "gt", "lte", "lt", "not", "in", "is", "order", "limit", "range", "filter", "contains", "match"];
    for (const m of chain) b[m] = () => b;
    b.insert = (v: any) => { ops.push({ table, op: "insert", value: v }); return b; };
    b.update = (v: any) => { ops.push({ table, op: "update", value: v }); return b; };
    b.upsert = (v: any) => { ops.push({ table, op: "upsert", value: v }); return b; };
    b.delete = () => { ops.push({ table, op: "delete" }); return b; };
    b.single = () => Promise.resolve(res);
    b.maybeSingle = () => Promise.resolve(res);
    b.then = (resolve: any, reject: any) => Promise.resolve(res).then(resolve, reject);
    return b;
  }

  return {
    ops,
    from: vi.fn(from),
    auth: { getUser: vi.fn(async () => ({ data: { user: results.__user ?? null } })) },
  };
}

// Proxy que delega en `ref.current` — permite fijar el fake por test aunque el
// módulo capture el cliente al importarse (createClient a nivel de módulo).
export function dbProxy(ref: { current: any }) {
  return new Proxy({}, { get: (_t, p) => (ref.current as any)[p] });
}
