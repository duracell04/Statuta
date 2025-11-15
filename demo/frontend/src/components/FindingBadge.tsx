import React from "react";
import type { Finding } from "../mock/findings";

export const FindingBadge: React.FC<{ finding: Finding }> = ({ finding }) => {
  const cls = finding.class === "F" ? "Form" : "Judgement";
  return (
    <span className="chip">
      <span>{cls}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: Finding["status"]; classType: Finding["class"] }> = ({
  status,
  classType
}) => {
  const label =
    status === "pass"
      ? classType === "F"
        ? "Passed"
        : "Evidence complete"
      : "Open";
  const colorClass = status === "pass" ? "pass" : "fail";
  return (
    <span className="badge">
      <span className={`badge-dot ${colorClass}`} />
      {label}
    </span>
  );
};
