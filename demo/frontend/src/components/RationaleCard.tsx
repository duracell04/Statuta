import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Paperclip, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RationaleCardProps {
  rationale: string;
  documents?: {
    board_minutes?: string;
    supporting_memo?: string;
  };
}

export const RationaleCard = ({ rationale, documents }: RationaleCardProps) => {
  const handleDownload = (filename: string, type: string) => {
    const dummyContent = `STATUTA DEMO DOCUMENT
    
Document Type: ${type}
Filename: ${filename}
Generated: ${new Date().toISOString()}

This is a demonstration file. In production, this would be an actual PDF document containing:
${type === "Board Minutes" ? "- Meeting date and attendees\n- Discussion points\n- Resolutions passed\n- Voting records" : "- Executive summary\n- Detailed analysis\n- Supporting data\n- Recommendations"}

All content is illustrative for demo purposes only.`;

    const blob = new Blob([dummyContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Change Rationale</CardTitle>
        <CardDescription>
          Context for this revision
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{rationale}</p>

        {documents && (documents.board_minutes || documents.supporting_memo) && (
          <div className="space-y-2 pt-2 border-t border-border">
            {documents.board_minutes && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-auto py-2 px-2"
                onClick={() => handleDownload(documents.board_minutes!, "Board Minutes")}
              >
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm flex-1 text-left">Board minutes</span>
                <Download className="w-3 h-3 ml-2 text-muted-foreground" />
              </Button>
            )}
            {documents.supporting_memo && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-auto py-2 px-2"
                onClick={() => handleDownload(documents.supporting_memo!, "Supporting Memo")}
              >
                <Paperclip className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm flex-1 text-left">Supporting memo</span>
                <Download className="w-3 h-3 ml-2 text-muted-foreground" />
              </Button>
            )}
          </div>
        )}

        <div className="p-3 bg-muted/50 rounded text-xs text-muted-foreground">
          This rationale is part of the audit trail; content is illustrative.
        </div>
      </CardContent>
    </Card>
  );
};
