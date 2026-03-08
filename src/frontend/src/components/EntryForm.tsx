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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { TimetableEntry } from "../backend.d";
import { SparkleStarFour } from "./Y2KDecorations";

const PRESET_COLORS = [
  { hex: "#7181c8", label: "Pastel Purple" },
  { hex: "#ababdc", label: "Lavender" },
  { hex: "#b7d3f4", label: "Dream Sky" },
  { hex: "#f1cfed", label: "Candy Pink" },
  { hex: "#f1e5f6", label: "Fairy Pink" },
  { hex: "#c8b4e0", label: "Soft Violet" },
  { hex: "#f4c2d8", label: "Rose Blush" },
];

interface EntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: TimetableEntry | null;
  onSubmit: (data: {
    startTime: string;
    endTime: string;
    taskName: string;
    priority: string;
    notes: string;
    colorTag: string;
  }) => Promise<void>;
  isLoading?: boolean;
  title?: string;
}

interface FormState {
  startTime: string;
  endTime: string;
  taskName: string;
  priority: string;
  notes: string;
  colorTag: string;
}

const DEFAULT_FORM: FormState = {
  startTime: "",
  endTime: "",
  taskName: "",
  priority: "medium",
  notes: "",
  colorTag: "#ababdc",
};

export function EntryForm({
  open,
  onOpenChange,
  entry,
  onSubmit,
  isLoading = false,
  title = "Add Entry",
}: EntryFormProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (open) {
      if (entry) {
        setForm({
          startTime: entry.startTime,
          endTime: entry.endTime,
          taskName: entry.taskName,
          priority: entry.priority,
          notes: entry.notes,
          colorTag: entry.colorTag,
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
    }
  }, [open, entry]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.taskName.trim()) newErrors.taskName = "Task name is required";
    if (!form.startTime) newErrors.startTime = "Start time is required";
    if (!form.endTime) newErrors.endTime = "End time is required";
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-0 max-h-[92dvh] overflow-y-auto"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(241,229,246,0.95) 100%)",
          backdropFilter: "blur(20px)",
        }}
        data-ocid="entry.sheet"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 justify-center">
            <SparkleStarFour size={18} color="#7181c8" opacity={0.8} />
            <SheetTitle className="font-cinzel text-xl text-[#3a3060]">
              {title}
            </SheetTitle>
            <SparkleStarFour size={18} color="#7181c8" opacity={0.8} />
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pb-8">
          {/* Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="startTime"
                className="font-nunito text-[#3a3060] text-sm font-semibold"
              >
                Start Time ✦
              </Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => setField("startTime", e.target.value)}
                className="border-[#ababdc]/50 focus:border-[#7181c8] bg-white/70 font-cinzel text-[#3a3060] rounded-xl"
                data-ocid="entry.input"
              />
              {errors.startTime && (
                <p
                  className="text-xs text-rose-500"
                  data-ocid="entry.error_state"
                >
                  {errors.startTime}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="endTime"
                className="font-nunito text-[#3a3060] text-sm font-semibold"
              >
                End Time ✦
              </Label>
              <Input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setField("endTime", e.target.value)}
                className="border-[#ababdc]/50 focus:border-[#7181c8] bg-white/70 font-cinzel text-[#3a3060] rounded-xl"
                data-ocid="entry.input"
              />
              {errors.endTime && (
                <p
                  className="text-xs text-rose-500"
                  data-ocid="entry.error_state"
                >
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Task name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="taskName"
              className="font-nunito text-[#3a3060] text-sm font-semibold"
            >
              Task Name ✦
            </Label>
            <Input
              id="taskName"
              placeholder="What are you doing?"
              value={form.taskName}
              onChange={(e) => setField("taskName", e.target.value)}
              className="border-[#ababdc]/50 focus:border-[#7181c8] bg-white/70 font-playfair text-[#3a3060] rounded-xl"
              data-ocid="entry.input"
            />
            {errors.taskName && (
              <p
                className="text-xs text-rose-500"
                data-ocid="entry.error_state"
              >
                {errors.taskName}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="font-nunito text-[#3a3060] text-sm font-semibold">
              Priority ✦
            </Label>
            <Select
              value={form.priority}
              onValueChange={(v) => setField("priority", v)}
            >
              <SelectTrigger
                className="border-[#ababdc]/50 focus:border-[#7181c8] bg-white/70 font-nunito text-[#3a3060] rounded-xl"
                data-ocid="entry.select"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="font-nunito rounded-2xl">
                <SelectItem value="high">🔴 High Priority</SelectItem>
                <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                <SelectItem value="low">🟢 Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color tag */}
          <div className="space-y-2">
            <Label className="font-nunito text-[#3a3060] text-sm font-semibold">
              Color Tag ✦
            </Label>
            <div className="flex gap-2.5 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  title={color.label}
                  onClick={() => setField("colorTag", color.hex)}
                  className="w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7181c8]"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow:
                      form.colorTag === color.hex
                        ? `0 0 0 3px white, 0 0 0 5px ${color.hex}`
                        : "0 2px 6px rgba(0,0,0,0.12)",
                    transform:
                      form.colorTag === color.hex ? "scale(1.15)" : "scale(1)",
                  }}
                  aria-label={`Select ${color.label}`}
                  data-ocid="entry.toggle"
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label
              htmlFor="notes"
              className="font-nunito text-[#3a3060] text-sm font-semibold"
            >
              Notes{" "}
              <span className="text-[#ababdc] font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any extra details..."
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              className="border-[#ababdc]/50 focus:border-[#7181c8] bg-white/70 font-nunito text-[#3a3060] rounded-xl resize-none"
              data-ocid="entry.textarea"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border-[#ababdc]/50 text-[#3a3060] font-nunito font-semibold hover:bg-[#f1e5f6]"
              data-ocid="entry.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl font-nunito font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7181c8 0%, #ababdc 100%)",
                boxShadow: "0 4px 14px rgba(113,129,200,0.4)",
              }}
              data-ocid="entry.submit_button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <SparkleStarFour
                    size={14}
                    color="white"
                    opacity={1}
                    className="mr-1.5"
                  />{" "}
                  {entry ? "Update" : "Add"} Entry
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
