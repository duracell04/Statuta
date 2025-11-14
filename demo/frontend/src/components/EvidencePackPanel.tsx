import React from "react";
import { EvidencePack } from "../lib/types";

export default function EvidencePackPanel({ evidence }: { evidence: EvidencePack | null }) {
  const download = () => {
    if (!evidence) return;
    const blob = new Blob([JSON.stringify(evidence, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `evidence-pack-${evidence.meta.docId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      {evidence ? (
        <>
          <p><strong>Rule‑Pack:</strong> {evidence.meta.rulePackId}</p>
          <p><strong>Findings:</strong> {evidence.findings.length}</p>
          <button onClick={download}>Download Evidence Pack (JSON)</button>
          <details style={{marginTop:8}}>
            <summary>Preview</summary>
            <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(evidence, null, 2)}</pre>
          </details>
        </>
      ) : <em>Run lints to generate evidence.</em>}
    </div>
  );
}
