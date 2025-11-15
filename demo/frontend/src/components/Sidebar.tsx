import React from "react";
import type { Scenario, ScenarioId } from "../mock/scenarios";

interface SidebarProps {
  scenarios: Scenario[];
  activeId: ScenarioId;
  onSelect: (id: ScenarioId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ scenarios, activeId, onSelect }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Scenarios</div>
      <ul className="sidebar-list">
        {scenarios.map((s) => (
          <li key={s.id} className="sidebar-item">
            <button
              className={"sidebar-button" + (s.id === activeId ? " active" : "")}
              onClick={() => onSelect(s.id)}
            >
              <span className="label">{s.short}</span>
              <span className="tag">
                {s.classFPass + s.classFFail} checks · {s.classJTopics} J-topics
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
