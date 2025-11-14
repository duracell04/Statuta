import type { Facts, Finding, Rule, RulePack, StatuteDoc } from "./schema";

function get(obj: unknown, path?: string): unknown {
  if (!obj || !path) {
    return undefined;
  }

  return path.split(".").reduce<unknown>((acc, segment) => {
    if (acc === null || acc === undefined) {
      return acc;
    }
    if (typeof acc !== "object") {
      return undefined;
    }
    const next = (acc as Record<string, unknown>)[segment];
    return next;
  }, obj);
}

function opEval(rule: Rule, doc: StatuteDoc, facts?: Facts): boolean {
  const ctx = { ...doc, facts } as const;
  const lhs = get(ctx, rule.select);
  const rhs = rule.value;
  const ref = get(ctx, rule.ref);

  switch (rule.op) {
    case "exists":
      return lhs !== undefined && lhs !== null && !(typeof lhs === "string" && lhs.trim() === "");
    case "eq":
      return lhs === rhs;
    case "neq":
      return lhs !== rhs;
    case "gte":
      return typeof lhs === "number" && lhs >= Number(rhs);
    case "lte":
      return typeof lhs === "number" && lhs <= Number(rhs);
    case "in":
      return Array.isArray(rhs) && rhs.includes(lhs);
    case "ltePercentOf":
      return (
        typeof lhs === "number" &&
        typeof ref === "number" &&
        typeof rule.percent === "number" &&
        lhs <= ref * (rule.percent / 100)
      );
    case "gtePercentOf":
      return (
        typeof lhs === "number" &&
        typeof ref === "number" &&
        typeof rule.percent === "number" &&
        lhs >= ref * (rule.percent / 100)
      );
    case "inRef":
      return Array.isArray(ref) && ref.includes(lhs);
    case "gteRef":
      return typeof lhs === "number" && typeof ref === "number" && lhs >= ref;
    case "lteRef":
      return typeof lhs === "number" && typeof ref === "number" && lhs <= ref;
    default:
      return false;
  }
}

export function evaluateRules(doc: StatuteDoc, pack: RulePack, facts?: Facts): Finding[] {
  const findings: Finding[] = [];
  const ctx = { ...doc, facts } as const;

  for (const rule of pack.rules) {
    const ok = opEval(rule, doc, facts);
    if (!ok) {
      findings.push({
        id: rule.id,
        severity: rule.severity ?? "error",
        message: rule.message ?? rule.title ?? rule.id,
        evidence: (rule.evidence ?? []).map((path) => {
          const value = get(ctx, path);
          return JSON.stringify({ path, value });
        }),
      });
    }
  }

  return findings;
}

export function evaluatePacks(doc: StatuteDoc, packs: RulePack[], facts?: Facts): Finding[] {
  return packs.flatMap((pack) => evaluateRules(doc, pack, facts));
}
