import { Finding, Rule, RulePack, StatuteDoc } from "./types";

function get(obj: any, path?: string): any {
  if (!path) return undefined;
  return path.split(".").reduce((acc, seg) => (acc == null ? acc : acc[seg]), obj);
}

function opEval(rule: Rule, doc: any): boolean {
  const lhs = get(doc, rule.select);
  const rhs = rule.value;
  const ref = get(doc, rule.ref || "");
  switch (rule.op) {
    case "exists": return lhs !== undefined && lhs !== null && !(typeof lhs === "string" && lhs.trim() === "");
    case "eq": return lhs === rhs;
    case "neq": return lhs !== rhs;
    case "gte": return typeof lhs === "number" && lhs >= Number(rhs);
    case "lte": return typeof lhs === "number" && lhs <= Number(rhs);
    case "in":  return Array.isArray(rhs) && rhs.includes(lhs);
    case "ltePercentOf":
      return typeof lhs === "number" && typeof ref === "number" && typeof rule.percent === "number" && lhs <= ref * (rule.percent / 100);
    case "gtePercentOf":
      return typeof lhs === "number" && typeof ref === "number" && typeof rule.percent === "number" && lhs >= ref * (rule.percent / 100);
    default: return false;
  }
}

export function evaluateRules(doc: StatuteDoc, pack: RulePack): Finding[] {
  const findings: Finding[] = [];
  for (const r of pack.rules) {
    const ok = opEval(r, doc);
    if (!ok) {
      findings.push({
        id: r.id,
        severity: r.severity || "error",
        message: r.message || r.title || r.id,
        evidence: (r.evidence || []).map(p => JSON.stringify({ path: p, value: get(doc, p) }))
      });
    }
  }
  return findings;
}
