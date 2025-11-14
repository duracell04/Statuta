import { SignatureAttestation } from "@/types/statute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Shield, CheckCircle2 } from "lucide-react";

interface SignaturePanelProps {
  signatures: SignatureAttestation[];
}

export const SignaturePanel = ({ signatures }: SignaturePanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Signatures & Provenance</CardTitle>
        <CardDescription>
          Cryptographic attestations for this revision
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {signatures.length === 0 ? (
          <p className="text-sm text-muted-foreground">No signatures available</p>
        ) : (
          signatures.map((sig, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 pb-3 border-b last:border-b-0 border-border"
            >
              <div className="mt-1">
                {sig.type === "QES" ? (
                  <Shield className="w-5 h-5 text-primary" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{sig.signer}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {sig.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {format(new Date(sig.time), "MMM d, yyyy HH:mm")}
                </p>
                <a
                  href={sig.evidence_uri}
                  className="text-xs text-primary hover:underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View evidence →
                </a>
              </div>
            </div>
          ))
        )}

        <div className="mt-4 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
          This is a demo. Signatures are mock data. No real legal effect.
        </div>
      </CardContent>
    </Card>
  );
};
