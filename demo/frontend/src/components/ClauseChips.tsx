import { Badge } from "@/components/ui/badge";

interface ClauseChipsProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

const tagLabels: Record<string, string> = {
  capital: "Capital",
  "transfer-restriction": "Transfer Restrictions",
  board: "Board",
  dividend: "Dividend",
  formation: "Formation",
  purpose: "Purpose",
};

export const ClauseChips = ({ tags, activeTag, onTagClick }: ClauseChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="transition-all"
        >
          <Badge
            variant={activeTag === tag ? "default" : "outline"}
            className={
              activeTag === tag
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }
          >
            {tagLabels[tag] || tag}
          </Badge>
        </button>
      ))}
    </div>
  );
};
