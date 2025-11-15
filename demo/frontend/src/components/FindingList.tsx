import React from "react";
import type { Finding } from "../mock/findings";
import { FindingBadge, StatusBadge } from "./FindingBadge";

interface FindingListProps {
  findings: Finding[];
}

export const FindingList: React.FC<FindingListProps> = ({ findings }) => {
  if (!findings.length) {
    return <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>No findings for this view.</div>;
  }

  return (
    <table className="findings-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Rule</th>
          <th>Type</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {findings.map((f) => (
          <tr key={f.id}>
            <td className="status-cell">
              <StatusBadge status={f.status} classType={f.class} />
            </td>
            <td className="code-cell">{f.ruleId}</td>
            <td>
              <FindingBadge finding={f} />
            </td>
            <td>{f.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
