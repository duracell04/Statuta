import React, { useEffect, useMemo, useState } from "react";
import { EvidencePack, Finding, RulePack, StatuteDoc } from "./lib/types";
import { evaluateRules } from "./lib/engine";
import RulePackPanel from "./components/RulePackPanel";
import LintResults from "./components/LintResults";
import EvidencePackPanel from "./components/EvidencePackPanel";

export default function App() {
  const [doc, setDoc] = useState<StatuteDoc | null>(null);
  const [pack, setPack] = useState<RulePack | null>(null);
  const [findings, setFindings] = useState<Finding[] | null>(null);

  // load demo inputs
  useEffect(() => {
    (async () => {
      const [docRes, packRes] = await Promise.all([
        fetch("/data/statute-ag-v1.json"),
        fetch("/packs/ch-or-ag-2025.11.json")
      ]);
      setDoc(await docRes.json());
      setPack(await packRes.json());
    })();
  }, []);

  const runLint = () => {
    if (!doc || !pack) return;
    const f = evaluateRules(doc, pack);
    setFindings(f);
  };

  const evidence: EvidencePack | null = useMemo(() => {
    if (!doc || !pack || !findings) return null;
    return {
      meta: {
        docId: doc.meta.docId,
        orgType: doc.meta.orgType,
        rulePackId: pack.id,
        exportedAt: new Date().toISOString()
      },
      inputs: { statuteDoc: doc, rulePack: pack },
      findings,
      decisions: [] // Class-J placeholders (UI-only in this mock)
    };
  }, [doc, pack, findings]);

  return (
    <>
      <header>
        <strong>Statuta (Mock)</strong> — frontend-only demo (Class‑F lints & Evidence Pack)
      </header>
      <main>
        <div className="grid">
          <div className="card">
            <h3>Rule‑Pack</h3>
            {pack ? <RulePackPanel pack={pack} /> : "Loading..."}
          </div>
          <div className="card">
            <h3>Actions</h3>
            <p>Demo data: <code>AG</code> with capital band, invite policy, etc.</p>
            <button className="primary" onClick={runLint} disabled={!doc || !pack}>
              Run Lints
            </button>
          </div>
          <div className="card">
            <h3>Lint Results</h3>
            {findings ? <LintResults findings={findings}/> : <em>No results yet.</em>}
          </div>
          <div className="card">
            <h3>Evidence Pack</h3>
            <EvidencePackPanel evidence={evidence}/>
          </div>
        </div>
      </main>
    </>
  );
}
