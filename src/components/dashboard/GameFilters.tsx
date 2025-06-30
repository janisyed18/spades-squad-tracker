import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface GameFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: "all" | "in-progress" | "completed";
  onFilterChange: (filter: "all" | "in-progress" | "completed") => void;
  sort: { key: string; order: "asc" | "desc" };
  onSortChange: (key: string) => void;
}

export const GameFilters = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: GameFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Search by team or player name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => onFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "in-progress" ? "default" : "outline"}
          onClick={() => onFilterChange("in-progress")}
        >
          In Progress
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => onSortChange("createdAt")}>
          Date{" "}
          {sort.key === "createdAt" &&
            (sort.order === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            ))}
        </Button>
        <Button variant="ghost" onClick={() => onSortChange("teamName")}>
          Team Name{" "}
          {sort.key === "teamName" &&
            (sort.order === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            ))}
        </Button>
        <Button variant="ghost" onClick={() => onSortChange("score")}>
          Score{" "}
          {sort.key === "score" &&
            (sort.order === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            ))}
        </Button>
      </div>
    </div>
  );
};
