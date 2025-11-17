'use client';

import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Revision } from "@/types/statute";

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
    <ol className="space-y-3">
      {revisions.map((revision, index) => {
        const isSelected = revision.rev_id === selectedRevisionId;
        return (
          <li key={revision.rev_id} className="relative pl-7">
            {index !== revisions.length - 1 && (
              <span
                className="absolute left-2 top-5 block h-[calc(100%_-_20px)] w-px bg-border"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "absolute left-0 top-4 h-3 w-3 rounded-full border-2",
                isSelected ? "border-primary bg-primary" : "border-border bg-background",
              )}
              aria-hidden
            />
            <button
              type="button"
              onClick={() => onSelectRevision(revision.rev_id)}
              aria-pressed={isSelected}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left transition-all duration-150",
                "hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{revision.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(revision.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <Badge variant="secondary" className={statusColors[revision.status]}>
                  {revision.status}
                </Badge>
              </div>
              <p className="mt-3 text-[11px] font-mono tracking-wide text-muted-foreground">
                {revision.rev_id.substring(0, 8)}
              </p>
            </button>
          </li>
        );
      })}
    </ol>
  );
};
