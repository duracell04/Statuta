import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const get = (obj, path) => path.split(".").reduce((a, s) => (a == null ? a : a[s]), obj);

const evalRule = (rule, doc) => {
  const lhs = get(doc, rule.select);
  const rhs = rule.value;
  const ref = rule.ref ? get(doc, rule.ref) : undefined;
  switch (rule.op) {
    case "exists": return lhs !== undefined && lhs !== null && !(typeof lhs === "string" && lhs.trim() === "");
    case "eq": return lhs === rhs;
    case "neq": return lhs !== rhs;
    case "gte": return typeof lhs === "number" && lhs >= Number(rhs);
    case "lte": return typeof lhs === "number" && lhs <= Number(rhs);
    case "in": return Array.isArray(rhs) && rhs.includes(lhs);
    case "ltePercentOf": return typeof lhs === "number" && typeof ref === "number" && lhs <= ref * (rule.percent / 100);
    case "gtePercentOf": return typeof lhs === "number" && typeof ref === "number" && lhs >= ref * (rule.percent / 100);
    default: return false;
  }
};

(async () => {
  const doc = JSON.parse(await readFile(resolve(root, "public/data/statute-ag-v1.json"), "utf8"));
  const pack = JSON.parse(await readFile(resolve(root, "public/packs/ch-or-ag-2025.11.json"), "utf8"));

  const findings = [];
  for (const r of pack.rules) {
    const ok = evalRule(r, doc);
    if (!ok) {
      findings.push({
        id: r.id,
        severity: r.severity || "error",
        message: r.message || r.title || r.id,
        evidence: (r.evidence || []).map(p => JSON.stringify({ path: p, value: get(doc, p) }))
      });
    }
  }

  const evidence = {
    meta: { docId: doc.meta.docId, orgType: doc.meta.orgType, rulePackId: pack.id, exportedAt: new Date().toISOString() },
    inputs: { statuteDoc: doc, rulePack: pack },
    findings,
    decisions: []
  };

  const outDir = resolve(root, "out");
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "findings.json"), JSON.stringify(findings, null, 2));
  await writeFile(resolve(outDir, "evidence-pack.json"), JSON.stringify(evidence, null, 2));
  console.log(`Wrote ${findings.length} findings and evidence-pack.json to /out`);
})();
