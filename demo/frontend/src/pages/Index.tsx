import { useState, useEffect } from "react";
import { StatutaLogo } from "@/components/StatutaLogo";
import { RevisionList } from "@/components/RevisionList";
import { DiffView } from "@/components/DiffView";
import { ClauseChips } from "@/components/ClauseChips";
import { SignaturePanel } from "@/components/SignaturePanel";
import { BundleDownload } from "@/components/BundleDownload";
import { RationaleCard } from "@/components/RationaleCard";
import { Revision, Statute, SignatureAttestation } from "@/types/statute";
import { Badge } from "@/components/ui/badge";

// Import dummy data
import revisionsData from "@/data/revisions.json";
import statuteV1Data from "@/data/statute_v1.json";
import statuteV2Data from "@/data/statute_v2.json";
import signaturesData from "@/data/signatures.json";

const Index = () => {
  const [revisions] = useState<Revision[]>(revisionsData as Revision[]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<string>(
    revisionsData[0].rev_id
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const selectedRevision = revisions.find((r) => r.rev_id === selectedRevisionId)!;
  const parentRevision = revisions.find(
    (r) => r.rev_id === selectedRevision.parent_rev
  );

  // For demo purposes, use v1 as parent and v2 as current
  const oldStatute: Statute = parentRevision ? statuteV1Data : { clauses: [] };
  const newStatute: Statute = statuteV2Data;

  const signatures: SignatureAttestation[] =
    (signaturesData as Record<string, SignatureAttestation[]>)[selectedRevisionId] || [];

  // Get all unique tags from clauses
  const allTags = Array.from(
    new Set([
      ...oldStatute.clauses.flatMap((c) => c.tags),
      ...newStatute.clauses.flatMap((c) => c.tags),
    ])
  );

  // Handle tag click
  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      // Find first clause with this tag and scroll to it
      const clause = newStatute.clauses.find((c) => c.tags.includes(tag));
      if (clause) {
        const element = document.getElementById(clause.id);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <StatutaLogo className="text-primary" />
            <Badge variant="secondary" className="text-xs">
              Demo – Dummy Data Only
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Revision List */}
          <aside className="col-span-3">
            <div className="sticky top-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Revision Timeline
              </h2>
              <RevisionList
                revisions={revisions}
                selectedRevisionId={selectedRevisionId}
                onSelectRevision={setSelectedRevisionId}
              />
            </div>
          </aside>

          {/* Main Content - Diff View */}
          <main className="col-span-6">
            <div className="space-y-6">
              {/* Clause chips */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Filter by clause type
                </h3>
                <ClauseChips
                  tags={allTags}
                  activeTag={activeTag}
                  onTagClick={handleTagClick}
                />
              </div>

              {/* Diff view */}
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

          {/* Right Sidebar - Info Panels */}
          <aside className="col-span-3">
            <div className="sticky top-6 space-y-6">
              <RationaleCard rationale={selectedRevision.rationale} />
              <SignaturePanel signatures={signatures} />
              <BundleDownload
                revision={selectedRevision}
                statute={newStatute}
                signatures={signatures}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
