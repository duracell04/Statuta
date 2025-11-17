'use client';

import { useState } from "react";
import { StatutaLogo } from "@/components/StatutaLogo";
import { RevisionList } from "@/components/RevisionList";
import { DiffView } from "@/components/DiffView";
import { ClauseChips } from "@/components/ClauseChips";
import { SignaturePanel } from "@/components/SignaturePanel";
import { BundleDownload } from "@/components/BundleDownload";
import { RationaleCard } from "@/components/RationaleCard";
import { Revision, Statute, SignatureAttestation } from "@/types/statute";
import { Badge } from "@/components/ui/badge";

import revisionsData from "@/data/revisions.json";
import statuteV1Data from "@/data/statute_v1.json";
import statuteV2Data from "@/data/statute_v2.json";
import signaturesData from "@/data/signatures.json";

const HomePage = () => {
  const [revisions] = useState<Revision[]>(revisionsData as Revision[]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<string>(revisionsData[0].rev_id);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const selectedRevision = revisions.find((r) => r.rev_id === selectedRevisionId)!;
  const parentRevision = revisions.find((r) => r.rev_id === selectedRevision.parent_rev);

  const oldStatute: Statute = parentRevision ? statuteV1Data : { clauses: [] };
  const newStatute: Statute = statuteV2Data;

  const signatures: SignatureAttestation[] =
    (signaturesData as Record<string, SignatureAttestation[]>)[selectedRevisionId] || [];

  const allTags = Array.from(
    new Set([
      ...oldStatute.clauses.flatMap((c) => c.tags),
      ...newStatute.clauses.flatMap((c) => c.tags),
    ]),
  );

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      const clause = newStatute.clauses.find((c) => c.tags.includes(tag));
      if (clause) {
        const element = document.getElementById(clause.id);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 md:px-6 md:py-4">
          <StatutaLogo className="text-primary" />
          <Badge variant="secondary" className="text-xs">
            Demo - Dummy Data Only
          </Badge>
        </div>
      </header>

      <div
        className="
          mx-auto w-full max-w-6xl
          px-3 py-4
          flex flex-col gap-4
          md:px-6 md:py-8
          md:grid md:grid-cols-[260px,minmax(0,2fr),minmax(0,1.4fr)] md:gap-6
        "
      >
        <section className="order-1 md:order-none md:self-start">
          <div className="md:sticky md:top-6">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Revision Timeline</h2>
            <RevisionList
              revisions={revisions}
              selectedRevisionId={selectedRevisionId}
              onSelectRevision={setSelectedRevisionId}
            />
          </div>
        </section>

        <section className="order-2 space-y-4 md:order-none md:self-start md:space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Filter by clause type</h3>
            <ClauseChips tags={allTags} activeTag={activeTag} onTagClick={handleTagClick} />
          </div>

          <div className="rounded-lg border border-border bg-card p-3 md:p-4 lg:p-6">
            <DiffView
              oldClauses={oldStatute.clauses}
              newClauses={newStatute.clauses}
              effectiveDate={selectedRevision.effective_from}
              status={selectedRevision.status}
            />
          </div>
        </section>

        <aside className="order-3 space-y-6 md:order-none md:self-start">
          <div className="flex flex-col gap-6 md:sticky md:top-6">
            <RationaleCard rationale={selectedRevision.rationale} documents={selectedRevision.documents} />
            <SignaturePanel signatures={signatures} />
            <BundleDownload revision={selectedRevision} statute={newStatute} signatures={signatures} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
