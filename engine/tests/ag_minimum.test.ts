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
  const file = resolve(root, "rulepacks/CH-OR/2025-01/ag-minimum.json");
  return JSON.parse(await readFile(file, "utf8")) as RulePack;
}

export async function testAgMinimum() {
  const statute = await loadStatute();
  const pack = await loadPack();

  const findings = evaluateRules(statute, pack);
  assert.equal(findings.length, 0, "sample statute should satisfy AG minimum rules");
}
