import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockExams = [
  { id: "1", name: "VITEEE 2026", exam_date: "2026-04-15" },
  { id: "2", name: "JEE Main 2026", exam_date: "2026-01-20" },
  { id: "3", name: "BITSAT 2026", exam_date: "2026-05-10" },
];

const mockColleges = [
  { id: "1", name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu" },
  { id: "2", name: "SRM Institute", city: "Chennai", state: "Tamil Nadu" },
  { id: "3", name: "MIT Manipal", city: "Manipal", state: "Karnataka" },
];

const mockScholarships = [
  { id: "1", name: "Merit Scholarship 2026", provider: "Govt of India" },
  { id: "2", name: "Sports Scholarship", provider: "Sports Authority" },
];

export interface EntitySelection {
  type: "exam" | "college" | "scholarship" | null;
  id: string | null;
}

export interface EntitySelectorProps {
  value: EntitySelection;
  onChange: (value: EntitySelection) => void;
}

export function EntitySelector({ value, onChange }: EntitySelectorProps) {
  const [open, setOpen] = useState(false);

  // Get entities based on type
  const entities = useMemo(() => {
    if (!value.type) return [];

    switch (value.type) {
      case "exam":
        return mockExams;
      case "college":
        return mockColleges;
      case "scholarship":
        return mockScholarships;
      default:
        return [];
    }
  }, [value.type]);

  // Get selected entity details
  const selectedEntity = useMemo(() => {
    if (!value.id || !value.type) return null;

    const entity = entities.find((e) => e.id === value.id);
    return entity || null;
  }, [value.id, value.type, entities]);

  // Format entity display
  const formatEntityDisplay = (entity: any, type: string) => {
    switch (type) {
      case "exam":
        return `${entity.name} (${new Date(entity.exam_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })})`;
      case "college":
        return `${entity.name} (${entity.city}, ${entity.state})`;
      case "scholarship":
        return `${entity.name} - ${entity.provider}`;
      default:
        return entity.name;
    }
  };

  // Handle type change
  const handleTypeChange = (newType: string) => {
    if (newType === "none") {
      onChange({ type: null, id: null });
    } else {
      onChange({
        type: newType as "exam" | "college" | "scholarship",
        id: null,
      });
    }
  };

  // Handle entity selection
  const handleEntitySelect = (entityId: string) => {
    onChange({
      type: value.type,
      id: entityId,
    });
    setOpen(false);
  };

  // Clear selection
  const handleClear = () => {
    onChange({ type: value.type, id: null });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Link to Entity (Optional)</Label>
        <RadioGroup
          value={value.type || "none"}
          onValueChange={handleTypeChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="entity-none" />
            <Label htmlFor="entity-none" className="font-normal cursor-pointer">
              None
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exam" id="entity-exam" />
            <Label htmlFor="entity-exam" className="font-normal cursor-pointer">
              Exam
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="college" id="entity-college" />
            <Label htmlFor="entity-college" className="font-normal cursor-pointer">
              College
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="scholarship" id="entity-scholarship" />
            <Label
              htmlFor="entity-scholarship"
              className="font-normal cursor-pointer"
            >
              Scholarship
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Entity Dropdown - shown only if type is selected */}
      {value.type && (
        <div className="space-y-2">
          <Label htmlFor="entity-select">
            Select {value.type.charAt(0).toUpperCase() + value.type.slice(1)}
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="entity-select"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedEntity
                  ? formatEntityDisplay(selectedEntity, value.type)
                  : `Select ${value.type}...`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={`Search ${value.type}s...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No {value.type} found.</CommandEmpty>
                  <CommandGroup>
                    {entities.map((entity: any) => (
                      <CommandItem
                        key={entity.id}
                        value={entity.name}
                        onSelect={() => handleEntitySelect(entity.id)}
                      >
                        {formatEntityDisplay(entity, value.type!)}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value.id === entity.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Selected Entity Display */}
      {selectedEntity && value.type && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="text-sm">
            <span className="font-medium">Selected: </span>
            <span>{formatEntityDisplay(selectedEntity, value.type)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-auto p-1 hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
