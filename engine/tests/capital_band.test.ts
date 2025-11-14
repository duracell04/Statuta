import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { evaluateRules, type RulePack, type StatuteDoc } from "../ts";

const root = resolve(process.cwd());

async function loadStatute(): Promise<StatuteDoc> {
  const file = resolve(root, "engine/tests/fixtures/statute-ag-sample.json");
  return JSON.parse(await readFile(file, "utf8")) as StatuteDoc;
}

async function loadPack(): Promise<RulePack> {
  const file = resolve(root, "rulepacks/CH-OR/2025-01/capital-band.json");
  return JSON.parse(await readFile(file, "utf8")) as RulePack;
}

export async function testCapitalBandValid() {
  const statute = await loadStatute();
  const pack = await loadPack();
  const findings = evaluateRules(statute, pack);
  assert.equal(findings.length, 0, "sample capital band should pass");
}

export async function testCapitalBandViolation() {
  const statute = await loadStatute();
  const pack = await loadPack();
  statute.sectionsById.capitalband = {
    ...statute.sectionsById.capitalband!,
    params: {
      ...statute.sectionsById.capitalband!.params,
      upper: 200000,
      lower: 40000
    }
  };

  const findings = evaluateRules(statute, pack);
  assert.equal(findings.length, 3, "expected upper bound, lower bound and minimum capital violations");
  assert.deepEqual(
    findings.map((f) => f.id).sort(),
    ["CAPBAND-02.UPPER_LIMIT", "CAPBAND-03.LOWER_LIMIT", "CAPBAND-04.MINIMUM_CAPITAL"]
  );
}
