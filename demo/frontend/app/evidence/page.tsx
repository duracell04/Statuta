'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle2, ExternalLink, Shield } from "lucide-react";
import { toast } from "sonner";

import { StatutaLogo } from "@/components/StatutaLogo";
import { DiffView } from "@/components/DiffView";
import { BundleDownload } from "@/components/BundleDownload";
import { RationaleCard } from "@/components/RationaleCard";
import { PageNavigation } from "@/components/PageNavigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Revision, Statute, SignatureAttestation } from "@/types/statute";

import revisionsData from "@/data/revisions.json";
import statuteV1Data from "@/data/statute_v1.json";
import statuteV2Data from "@/data/statute_v2.json";
import signaturesData from "@/data/signatures.json";

const formatDateTime = (iso: string) => format(new Date(iso), "MMM d, yyyy HH:mm");

const EvidencePage = () => {
  const revisions = revisionsData as Revision[];
  const searchParams = useSearchParams();
  const revisionId = searchParams.get("revId") ?? revisions[0]?.rev_id;
  const signerParam = searchParams.get("signer");
  const timeParam = searchParams.get("time");
  const typeParam = searchParams.get("type");

  const selectedRevision =
    revisions.find((revision) => revision.rev_id === revisionId) ?? revisions[0];
  const parentRevision = revisions.find((revision) => revision.rev_id === selectedRevision?.parent_rev);

  const oldStatute: Statute = parentRevision ? statuteV1Data : { clauses: [] };
  const newStatute: Statute = statuteV2Data;

  const signaturesMap = signaturesData as Record<string, SignatureAttestation[]>;
  const revisionSignatures = selectedRevision
    ? signaturesMap[selectedRevision.rev_id] ?? []
    : [];

  const activeSignature =
    revisionSignatures.find(
      (signature) =>
        (!signerParam || signature.signer === signerParam) &&
        (!timeParam || signature.time === timeParam) &&
        (!typeParam || signature.type === typeParam),
    ) ?? revisionSignatures[0];

  const handleOpenEvidence = () => {
    if (!selectedRevision || !activeSignature) {
      toast.error("No signature payload is available for this revision.");
      return;
    }

    if (activeSignature.evidence_uri?.startsWith("http")) {
      const opened = window.open(activeSignature.evidence_uri, "_blank", "noopener,noreferrer");
      if (!opened) {
        toast.error("Browser blocked the evidence tab. Please allow pop-ups or open the URI manually.");
      }
      return;
    }

    const payload = {
      revision: selectedRevision,
      signature: activeSignature,
      statute: newStatute,
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      toast.error("Browser blocked the evidence tab. Please allow pop-ups.");
      URL.revokeObjectURL(url);
      return;
    }

    const revoke = () => URL.revokeObjectURL(url);
    opened.addEventListener("load", revoke, { once: true });
    opened.addEventListener("beforeunload", revoke, { once: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StatutaLogo className="text-primary" />
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide sm:text-xs">
              Evidence bundle
            </Badge>
          </div>
          <PageNavigation />
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {selectedRevision?.label ?? "Unknown revision"}
              </CardTitle>
              {selectedRevision?.effective_from && (
                <CardDescription>
                  Effective {formatDateTime(selectedRevision.effective_from)} · Status{" "}
                  {selectedRevision.status}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {selectedRevision && (
                <>
                  <p>
                    Revision ID:{" "}
                    <span className="font-mono text-foreground">{selectedRevision.rev_id}</span>
                  </p>
                  {activeSignature && (
                    <p>
                      Viewing attestation by{" "}
                      <span className="text-foreground">{activeSignature.signer}</span>
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <div className="rounded-lg border border-border bg-card p-6">
            {selectedRevision ? (
              <DiffView
                oldClauses={oldStatute.clauses}
                newClauses={newStatute.clauses}
                effectiveDate={selectedRevision.effective_from}
                status={selectedRevision.status}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Unable to load revision diff without a valid revision id.
              </p>
            )}
          </div>

          {selectedRevision && (
            <RationaleCard
              rationale={selectedRevision.rationale}
              documents={selectedRevision.documents}
            />
          )}
        </section>

        <section className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic evidence</CardTitle>
              <CardDescription>Signature details sourced from the mock registry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSignature ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    {activeSignature.type === "QES" ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                    <Badge variant="secondary" className="uppercase">
                      {activeSignature.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeSignature.signer}</p>
                    <p className="text-xs text-muted-foreground">
                      Signed {formatDateTime(activeSignature.time)}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-3 text-xs">
                    Evidence URI:
                    <div className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                      {activeSignature.evidence_uri || "Generated locally (demo)"}
                    </div>
                  </div>
                  <Button onClick={handleOpenEvidence} className="w-full">
                    Open evidence
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No signature payload supplied for this revision.
                </p>
              )}
            </CardContent>
          </Card>

          {revisionSignatures.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Other attestations</CardTitle>
                <CardDescription>Select a signer to inspect a different payload</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {revisionSignatures.map((signature) => (
                  <div
                    key={`${signature.signer}-${signature.time}`}
                    className="rounded border border-border px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{signature.signer}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(signature.time)}
                    </p>
                    <Link
                      href={`/evidence?revId=${signature.rev_id}&signer=${encodeURIComponent(
                        signature.signer,
                      )}&type=${signature.type}&time=${signature.time}`}
                      className="mt-1 inline-flex text-xs text-primary hover:underline"
                    >
                      View this evidence
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {selectedRevision && (
            <BundleDownload
              revision={selectedRevision}
              statute={newStatute}
              signatures={revisionSignatures}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default EvidencePage;
