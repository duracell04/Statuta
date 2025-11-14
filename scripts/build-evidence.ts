import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { evaluateRules } from "../engine/ts/engine";
import type { EvidencePack, RulePack, StatuteDoc, Facts } from "../engine/ts/schema";

const root = resolve(process.cwd());

async function loadJson<T>(relativePath: string): Promise<T> {
  const file = resolve(root, relativePath);
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as T;
}

async function main() {
  const statute = await loadJson<StatuteDoc>("engine/tests/fixtures/statute-ag-sample.json");
  const facts = await loadJson<Facts>("engine/tests/fixtures/facts-gv-sample.json");
  const pack = await loadJson<RulePack>("rulepacks/CH-OR/2025-01/gv-invite.json");

  const findings = evaluateRules(statute, pack, facts);

  const evidence: EvidencePack = {
    meta: {
      docId: statute.meta.docId,
      orgType: statute.meta.orgType,
      rulePackId: pack.id,
      exportedAt: new Date().toISOString()
    },
    inputs: {
      statuteDoc: statute,
      rulePack: pack,
      facts
    },
    findings,
    decisions: []
  };

  const outDir = resolve(root, "out");
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "findings.json"), JSON.stringify(findings, null, 2));
  await writeFile(resolve(outDir, "evidence-pack.json"), JSON.stringify(evidence, null, 2));
  console.log(`Wrote ${findings.length} findings and evidence-pack.json to /out`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
