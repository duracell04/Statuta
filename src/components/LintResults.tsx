import React from "react";
import { Finding } from "../lib/types";

export default function LintResults({ findings }: { findings: Finding[] }) {
  if (!findings.length) return <div className="ok">All checks passed.</div>;
  return (
    <ul>
      {findings.map(f => (
        <li key={f.id} className={f.severity === "error" ? "err" : f.severity === "warn" ? "warn" : "ok"}>
          <strong>{f.severity?.toUpperCase()}</strong> — <code>{f.id}</code>: {f.message}
          {f.evidence?.length ? (
            <div>
              <small>evidence:</small>
              <ul>{f.evidence.map((e, i) => <li key={i}><code>{e}</code></li>)}</ul>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
