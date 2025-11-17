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
    <div className="border-b border-border py-5 md:py-6" id={clause.id}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-foreground">
          {clause.article_no} {clause.heading}
        </h3>
        <button className="text-muted-foreground hover:text-foreground p-1">
          <Link className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm leading-relaxed md:grid-cols-2 md:gap-6">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:hidden">
            Previous
          </p>
          {oldClause ? (
            <p className="break-words text-foreground/80">{oldClause.text}</p>
          ) : (
            <p className="text-muted-foreground italic">Not present in prior version</p>
          )}
        </div>

        <div className="md:border-l-2 md:border-primary/20 md:pl-6">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:hidden">
            Current
          </p>
          {newClause ? (
            diff ? (
              <p className="break-words text-foreground">
                {diff.map((token, idx) => (
                  <DiffToken key={idx} token={token} />
                ))}
              </p>
            ) : (
              <p className="break-words text-foreground">{newClause.text}</p>
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
      <div className="mb-6 rounded-md border border-border bg-muted/50 p-3 md:p-4">
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

      <div className="mb-6 grid grid-cols-1 gap-2 border-b border-border pb-3 md:grid-cols-2 md:gap-6">
        <div className="text-sm font-medium text-muted-foreground">Prior Release</div>
        <div className="text-sm font-medium text-primary md:border-l-2 md:border-primary/20 md:pl-6">
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
