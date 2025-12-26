import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Course {
  id: string; // Temporary client-side ID
  level: "UG" | "PG" | "Diploma" | "PhD";
  name: string;
  specialization?: string;
}

export interface CoursesEditorProps {
  value: Course[];
  onChange: (courses: Course[]) => void;
}

export function CoursesEditor({ value, onChange }: CoursesEditorProps) {
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      level: "UG",
      name: "",
      specialization: "",
    };
    onChange([...value, newCourse]);
  };

  const handleRemoveCourse = (id: string) => {
    onChange(value.filter((course) => course.id !== id));
  };

  const handleUpdateCourse = (id: string, updates: Partial<Course>) => {
    onChange(
      value.map((course) =>
        course.id === id ? { ...course, ...updates } : course
      )
    );
  };

  // Check for validation warnings
  const hasEmptyCourses = value.some((course) => !course.name || !course.level);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Courses</Label>
            {hasEmptyCourses && (
              <span className="text-xs text-yellow-600">
                Some courses have empty fields
              </span>
            )}
          </div>

          {value.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="text-sm">No courses added yet</p>
              <p className="text-xs mt-1">Click "Add Course" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {value.map((course) => (
                <div
                  key={course.id}
                  className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Level Dropdown */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Level
                      </Label>
                      <Select
                        value={course.level}
                        onValueChange={(val) =>
                          handleUpdateCourse(course.id, {
                            level: val as Course["level"],
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UG">UG</SelectItem>
                          <SelectItem value="PG">PG</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        value={course.name}
                        onChange={(e) =>
                          handleUpdateCourse(course.id, { name: e.target.value })
                        }
                        placeholder="e.g., B.Tech Computer Science"
                        className="h-9"
                      />
                    </div>

                    {/* Specialization Input */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Specialization (Optional)
                      </Label>
                      <Input
                        value={course.specialization || ""}
                        onChange={(e) =>
                          handleUpdateCourse(course.id, {
                            specialization: e.target.value,
                          })
                        }
                        placeholder="e.g., AI & ML"
                        className="h-9"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCourse(course.id)}
                    className="h-9 w-9 mt-5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddCourse}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>

          {value.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {value.length} course{value.length !== 1 ? "s" : ""} added
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
