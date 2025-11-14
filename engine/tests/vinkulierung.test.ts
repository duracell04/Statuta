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
  const file = resolve(root, "rulepacks/CH-OR/2025-01/vinkulierung.json");
  return JSON.parse(await readFile(file, "utf8")) as RulePack;
}

export async function testVinkulierungFormalities() {
  const statute = await loadStatute();
  const pack = await loadPack();
  const findings = evaluateRules(statute, pack);
  assert.equal(findings.length, 0, "sample transfer restrictions meet formal criteria");
}

export async function testVinkulierungMissingRationale() {
  const statute = await loadStatute();
  const pack = await loadPack();
  statute.sectionsById.transfer_restrictions = {
    present: true,
    categories: ["Namenaktien"],
    text: "Vinkulierungs-Klausel ohne Begründung"
  };

  const findings = evaluateRules(statute, pack);
  assert.equal(findings.length, 1);
  assert.equal(findings[0]?.id, "VINK-03.RATIONALE_PRESENT");
}
