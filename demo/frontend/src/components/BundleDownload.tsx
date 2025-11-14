import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Revision, Statute, SignatureAttestation } from "@/types/statute";
import { toast } from "sonner";

interface BundleDownloadProps {
  revision: Revision;
  statute: Statute;
  signatures: SignatureAttestation[];
}

export const BundleDownload = ({ revision, statute, signatures }: BundleDownloadProps) => {
  const handleDownload = () => {
    const bundle = {
      revision,
      statute,
      signatures,
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statuta-demo-bundle-${revision.rev_id.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Bundle downloaded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Registry Bundle</CardTitle>
        <CardDescription>
          Download complete revision package
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleDownload} className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download bundle (demo)
        </Button>

        <div className="p-3 bg-muted/50 rounded text-xs text-muted-foreground">
          In production, this would include PDF, JSON and a signed receipt.
        </div>
      </CardContent>
    </Card>
  );
};
