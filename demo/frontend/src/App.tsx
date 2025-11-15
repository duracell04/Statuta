import React, { useMemo, useState } from "react";
import { HeaderBar } from "./components/HeaderBar";
import { Sidebar } from "./components/Sidebar";
import { Card } from "./components/Layout";
import { FindingList } from "./components/FindingList";
import { scenarios, type ScenarioId } from "./mock/scenarios";
import { findings as allFindings } from "./mock/findings";

const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>("ag-minimum");

  const activeScenario = useMemo(
    () => scenarios.find((s) => s.id === activeScenarioId) ?? scenarios[0],
    [activeScenarioId]
  );

  const scenarioFindings = useMemo(
    () => allFindings.filter((f) => f.scenarioId === activeScenario.id),
    [activeScenario.id]
  );

  const classF = scenarioFindings.filter((f) => f.class === "F");
  const classJ = scenarioFindings.filter((f) => f.class === "J");
  const classFPass = classF.filter((f) => f.status === "pass").length;
  const classFFail = classF.filter((f) => f.status === "fail").length;

  return (
    <div className="app-root">
      <HeaderBar />
      <main className="app-main">
        <Sidebar
          scenarios={scenarios}
          activeId={activeScenario.id}
          onSelect={setActiveScenarioId}
        />
        <section className="content">
          <Card>
            <div className="card-header">
              <div>
                <div className="card-title">{activeScenario.label}</div>
                <div className="card-subtitle">{activeScenario.description}</div>
                <div className="summary-row">
                  <strong>Form checks (Class-F):</strong>{" "}
                  {classFPass + classFFail} total / {classFPass} passed / {classFFail} open
                  {"  |  "}
                  <strong>Judgement topics (Class-J):</strong> {classJ.length} (evidence only)
                </div>
                <div className="summary-row">
                  Statuta liefert <strong>formale Verlaesslichkeit &amp; Evidenz</strong> - keine
                  materiellen "OK"-Entscheide.
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <FindingList findings={scenarioFindings} />
          </Card>
        </section>
      </main>
    </div>
  );
};

export default App;
