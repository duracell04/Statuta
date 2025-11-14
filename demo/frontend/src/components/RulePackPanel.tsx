import React from "react";
import { RulePack } from "../lib/types";

export default function RulePackPanel({ pack }: { pack: RulePack }) {
  return (
    <div>
      <p><strong>ID:</strong> {pack.id}</p>
      <p><strong>Class:</strong> {pack.class}</p>
      <p><strong>Rules:</strong></p>
      <ul>
        {pack.rules.map(r => (
          <li key={r.id}>
            <code>{r.id}</code> – {r.title} <em>({r.severity || "error"})</em>
          </li>
        ))}
      </ul>
      <details>
        <summary>View JSON</summary>
        <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(pack, null, 2)}</pre>
      </details>
    </div>
  );
}
