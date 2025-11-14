import { performance } from "node:perf_hooks";
import { testAgMinimum } from "./ag_minimum.test";
import { testGvInvite, testGvInviteViolation } from "./gv_invite.test";
import { testCapitalBandValid, testCapitalBandViolation } from "./capital_band.test";
import { testVinkulierungFormalities, testVinkulierungMissingRationale } from "./vinkulierung.test";

const tests: Array<[string, () => Promise<void>]> = [
  ["ag-minimum: valid statute", testAgMinimum],
  ["gv-invite: valid facts", testGvInvite],
  ["gv-invite: violations", testGvInviteViolation],
  ["capital-band: valid statute", testCapitalBandValid],
  ["capital-band: violations", testCapitalBandViolation],
  ["vinkulierung: formalities", testVinkulierungFormalities],
  ["vinkulierung: missing rationale", testVinkulierungMissingRationale]
];

async function run() {
  const start = performance.now();
  for (const [name, fn] of tests) {
    await fn();
    console.log(`✓ ${name}`);
  }
  const duration = performance.now() - start;
  console.log(`All ${tests.length} tests passed in ${duration.toFixed(1)}ms`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
