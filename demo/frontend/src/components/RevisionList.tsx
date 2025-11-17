import { Revision } from "@/types/statute";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RevisionListProps {
  revisions: Revision[];
  selectedRevisionId: string;
  onSelectRevision: (revisionId: string) => void;
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  proposal: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  released: "bg-primary/10 text-primary",
};

export const RevisionList = ({
  revisions,
  selectedRevisionId,
  onSelectRevision,
}: RevisionListProps) => {
  return (
    <div className="space-y-2">
      {revisions.map((revision) => {
        const isSelected = revision.rev_id === selectedRevisionId;
        return (
          <button
            key={revision.rev_id}
            onClick={() => onSelectRevision(revision.rev_id)}
            className={`w-full text-left p-3 rounded-md border transition-colors ${
              isSelected
                ? "bg-primary/5 border-primary"
                : "bg-card border-border hover:bg-muted/50"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-sm">{revision.label}</h3>
              <Badge variant="secondary" className={statusColors[revision.status]}>
                {revision.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {format(new Date(revision.created_at), "MMM d, yyyy HH:mm")}
            </p>
            <code className="text-xs font-mono text-muted-foreground">
              {revision.rev_id.substring(0, 8)}
            </code>
          </button>
        );
      })}
    </div>
  );
};
