'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatutaLogo } from "@/components/StatutaLogo";

const EvidenceContent = () => {
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "QES";
  const signer = searchParams.get("signer") || "Unknown";
  const time = searchParams.get("time") || new Date().toISOString();
  const revId = searchParams.get("revId") || "";

  const evidenceData =
    type === "QES"
      ? {
          title: "Qualified Electronic Signature (QES)",
          icon: Shield,
          certificate: {
            issuer: "SwissSign AG",
            serialNumber: "A7F3B2C8D1E4F5A6",
            validFrom: "2024-01-01",
            validUntil: "2025-12-31",
            algorithm: "RSA-4096 + SHA-256",
          },
          verification: {
            status: "Valid",
            timestamp: time,
            standard: "eIDAS compliant",
            trustAnchor: "Swiss Federal PKI",
          },
        }
      : {
          title: "Sigstore Transparency Log Entry",
          icon: CheckCircle2,
          certificate: {
            issuer: "Sigstore Public Good",
            logIndex: "142857",
            logId: "rekor.sigstore.dev",
            bundleHash: "sha256:b3f2e1d0c9b8a7f6e5d4c3b2",
            algorithm: "ECDSA P-256 + SHA-256",
          },
          verification: {
            status: "Verified",
            timestamp: time,
            standard: "Sigstore v1.0",
            trustAnchor: "Fulcio Root CA",
          },
        };

  const Icon = evidenceData.icon;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <StatutaLogo className="text-primary" />
            <Badge variant="secondary" className="text-xs">
              Demo - Mock Evidence
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to revisions
          </Link>
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{evidenceData.title}</CardTitle>
                  <CardDescription className="text-base">
                    Signature evidence for revision{" "}
                    <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
                      {revId.slice(0, 12)}...
                    </code>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Signer:</span>
                  <p className="text-sm text-muted-foreground mt-1">{signer}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Timestamp:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(time).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certificate Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {Object.entries(evidenceData.certificate).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <dt className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {Object.entries(evidenceData.verification).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <dt className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd
                      className={`text-sm ${
                        key === "status" ? "font-semibold text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">External Resources</CardTitle>
              <CardDescription>In production, these would link to live verification services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <span>{type === "QES" ? "Verify with SwissSign" : "View on Rekor"}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <span>Download full certificate chain</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <strong>Demo Notice:</strong> This is illustrative evidence data only. In production, this page would
            display cryptographically verifiable proof fetched from real QES providers or transparency logs like Rekor.
          </div>
        </div>
      </div>
    </div>
  );
};

const EvidencePage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading evidence...
      </div>
    }
  >
    <EvidenceContent />
  </Suspense>
);

export default EvidencePage;
