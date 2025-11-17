'use client';

import { useState } from "react";
import { StatutaLogo } from "@/components/StatutaLogo";
import { RevisionList } from "@/components/RevisionList";
import { DiffView } from "@/components/DiffView";
import { ClauseChips } from "@/components/ClauseChips";
import { SignaturePanel } from "@/components/SignaturePanel";
import { BundleDownload } from "@/components/BundleDownload";
import { RationaleCard } from "@/components/RationaleCard";
import { PageNavigation } from "@/components/PageNavigation";
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
        <div className="container mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <StatutaLogo className="text-primary" />
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide sm:text-xs">
                Demo - Dummy Data Only
              </Badge>
            </div>
            <PageNavigation />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="order-2 space-y-6 lg:order-1 lg:col-span-3">
            <div className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:p-0">
              <h2 className="text-sm font-semibold text-foreground mb-3">Revision Timeline</h2>
              <RevisionList
                revisions={revisions}
                selectedRevisionId={selectedRevisionId}
                onSelectRevision={setSelectedRevisionId}
              />
            </div>
          </aside>

          <main className="order-1 space-y-6 lg:order-2 lg:col-span-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Filter by clause type
                </h3>
                <ClauseChips tags={allTags} activeTag={activeTag} onTagClick={handleTagClick} />
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <DiffView
                  oldClauses={oldStatute.clauses}
                  newClauses={newStatute.clauses}
                  effectiveDate={selectedRevision.effective_from}
                  status={selectedRevision.status}
                />
              </div>
            </div>
          </main>

          <aside className="order-3 space-y-6 lg:col-span-3">
            <div className="grid gap-6 lg:sticky lg:top-6">
              <RationaleCard rationale={selectedRevision.rationale} documents={selectedRevision.documents} />
              <SignaturePanel signatures={signatures} />
              <BundleDownload revision={selectedRevision} statute={newStatute} signatures={signatures} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
