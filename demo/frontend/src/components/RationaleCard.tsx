import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Paperclip } from "lucide-react";

interface RationaleCardProps {
  rationale: string;
}

export const RationaleCard = ({ rationale }: RationaleCardProps) => {
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

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
            <FileText className="w-4 h-4" />
            <span>Board minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
            <Paperclip className="w-4 h-4" />
            <span>Supporting memo</span>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded text-xs text-muted-foreground">
          This rationale is part of the audit trail; content is illustrative.
        </div>
      </CardContent>
    </Card>
  );
};
