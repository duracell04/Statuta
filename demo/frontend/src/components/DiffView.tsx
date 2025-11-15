import { Clause } from "@/types/statute";
import { diffTexts } from "@/utils/diffUtils";
import type { DiffToken as DiffTokenType } from "@/utils/diffUtils";
import { Link } from "lucide-react";
import { format } from "date-fns";

interface DiffViewProps {
  oldClauses: Clause[];
  newClauses: Clause[];
  effectiveDate?: string;
  status: string;
}

const DiffToken = ({ token }: { token: DiffTokenType }) => {
  if (token.type === "equal") {
    return <span>{token.value}</span>;
  }
  if (token.type === "removed") {
    return (
      <span className="bg-diff-deletion-bg text-diff-deletion line-through">
        {token.value}
      </span>
    );
  }
  return (
    <span className="bg-diff-addition-bg text-diff-addition underline decoration-2">
      {token.value}
    </span>
  );
};

const ClauseDiff = ({ oldClause, newClause }: { oldClause?: Clause; newClause?: Clause }) => {
  if (!oldClause && !newClause) return null;

  const clause = newClause || oldClause!;
  const diff = oldClause && newClause ? diffTexts(oldClause.text, newClause.text) : null;

  return (
    <div className="border-b border-border py-6" id={clause.id}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-foreground">
          {clause.article_no} {clause.heading}
        </h3>
        <button className="text-muted-foreground hover:text-foreground p-1">
          <Link className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-sm leading-relaxed">
          {oldClause ? (
            <p className="text-foreground/80">{oldClause.text}</p>
          ) : (
            <p className="text-muted-foreground italic">Not present in prior version</p>
          )}
        </div>

        <div className="text-sm leading-relaxed border-l-2 border-primary/20 pl-6">
          {newClause ? (
            diff ? (
              <p className="text-foreground">
                {diff.map((token, idx) => (
                  <DiffToken key={idx} token={token} />
                ))}
              </p>
            ) : (
              <p className="text-foreground">{newClause.text}</p>
            )
          ) : (
            <p className="text-muted-foreground italic">Removed in this revision</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const DiffView = ({ oldClauses, newClauses, effectiveDate, status }: DiffViewProps) => {
  const allClauseIds = Array.from(
    new Set([...oldClauses.map((c) => c.id), ...newClauses.map((c) => c.id)])
  );

  return (
    <div>
      <div className="bg-muted/50 border border-border rounded-md px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">
              {status === "released" ? "Released version" : "Proposed revision"}
            </span>
            {effectiveDate && (
              <span className="text-sm text-muted-foreground ml-2">
                - Effective as of {format(new Date(effectiveDate), "PPP")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 pb-3 border-b border-border">
        <div className="text-sm font-medium text-muted-foreground">Prior Release</div>
        <div className="text-sm font-medium text-primary border-l-2 border-primary/20 pl-6">
          Current Revision
        </div>
      </div>

      <div className="space-y-0">
        {allClauseIds.map((clauseId) => {
          const oldClause = oldClauses.find((c) => c.id === clauseId);
          const newClause = newClauses.find((c) => c.id === clauseId);
          return <ClauseDiff key={clauseId} oldClause={oldClause} newClause={newClause} />;
        })}
      </div>
    </div>
  );
};
