import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { evaluateRules, type RulePack, type StatuteDoc, type Facts } from "../ts";

const root = resolve(process.cwd());

async function loadStatute(): Promise<StatuteDoc> {
  const file = resolve(root, "engine/tests/fixtures/statute-ag-sample.json");
  return JSON.parse(await readFile(file, "utf8")) as StatuteDoc;
}

async function loadFacts(): Promise<Facts> {
  const file = resolve(root, "engine/tests/fixtures/facts-gv-sample.json");
  return JSON.parse(await readFile(file, "utf8")) as Facts;
}

async function loadPack(): Promise<RulePack> {
  const file = resolve(root, "rulepacks/CH-OR/2025-01/gv-invite.json");
  return JSON.parse(await readFile(file, "utf8")) as RulePack;
}

export async function testGvInvite() {
  const statute = await loadStatute();
  const pack = await loadPack();
  const facts = await loadFacts();

  const findings = evaluateRules(statute, pack, facts);
  assert.equal(findings.length, 0, "sample invite facts should pass gv invite checks");
}

export async function testGvInviteViolation() {
  const statute = await loadStatute();
  const pack = await loadPack();
  const facts = await loadFacts();
  facts.invite = { ...facts.invite, medium_used: "Fax", diffDays: 10 };

  const findings = evaluateRules(statute, pack, facts);
  assert.equal(findings.length, 2, "unexpected number of findings for invalid invite");
  assert.deepEqual(
    findings.map((f) => f.id).sort(),
    ["GV.INVITE-01.MEDIUM_ALLOWED", "GV.INVITE-02.DEADLINE"]
  );
}
