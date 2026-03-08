import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { TimetableEntry } from "../backend.d";
import { TinySparkle } from "./Y2KDecorations";

interface EntryCardProps {
  entry: TimetableEntry;
  index: number;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const PRIORITY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; emoji: string }
> = {
  high: {
    bg: "rgba(251, 207, 232, 0.85)",
    text: "#831843",
    border: "rgba(251,182,206,0.7)",
    emoji: "★★★",
  },
  medium: {
    bg: "rgba(254, 240, 199, 0.85)",
    text: "#78350f",
    border: "rgba(253,230,138,0.7)",
    emoji: "★★☆",
  },
  low: {
    bg: "rgba(187, 247, 208, 0.85)",
    text: "#064e3b",
    border: "rgba(134,239,172,0.7)",
    emoji: "★☆☆",
  },
};

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = Number.parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function EntryCard({
  entry,
  index,
  onEdit,
  onDelete,
  isDeleting,
}: EntryCardProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const priority = PRIORITY_STYLES[entry.priority] ?? PRIORITY_STYLES.medium;

  const ocidBase = `entry.item.${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.06 }}
      data-ocid={ocidBase}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 60%, ${entry.colorTag || "#ababdc"}18 100%)`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(171,171,220,0.35)",
          boxShadow:
            "0 6px 24px rgba(113,129,200,0.16), 0 1px 6px rgba(113,129,200,0.09), inset 0 1px 0 rgba(255,255,255,0.85)",
        }}
      >
        {/* Left color stripe — wider and gradient */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-2xl"
          style={{
            background: `linear-gradient(180deg, ${entry.colorTag || "#ababdc"} 0%, ${entry.colorTag || "#ababdc"}99 50%, ${entry.colorTag || "#ababdc"}55 100%)`,
            boxShadow: `2px 0 8px ${entry.colorTag || "#ababdc"}60`,
          }}
        />

        {/* Sparkle decoration — positioned in top-right area */}
        <TinySparkle
          size={12}
          color={entry.colorTag || "#ababdc"}
          opacity={0.75}
          className="absolute top-3 right-[4.5rem] pointer-events-none"
          style={{
            filter: `drop-shadow(0 0 3px ${entry.colorTag || "#ababdc"}90)`,
          }}
        />

        <div className="pl-4 pr-3 py-3.5">
          <div className="flex items-start justify-between gap-2">
            {/* Left: time + task */}
            <div className="flex-1 min-w-0">
              {/* Time range */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-cinzel text-sm font-semibold text-[#3a3060] tabular-nums">
                  {formatTime(entry.startTime)}
                </span>
                <span className="text-[#ababdc] text-xs">→</span>
                <span className="font-cinzel text-sm font-semibold text-[#3a3060] tabular-nums">
                  {formatTime(entry.endTime)}
                </span>
                {/* Color dot */}
                <span
                  className="ml-1 w-2.5 h-2.5 rounded-full flex-shrink-0 inline-block"
                  style={{ backgroundColor: entry.colorTag || "#ababdc" }}
                  aria-label={`Color: ${entry.colorTag}`}
                />
              </div>

              {/* Task name */}
              <p className="font-playfair text-base font-medium text-[#2d1f4a] truncate leading-snug">
                {entry.taskName}
              </p>

              {/* Priority badge */}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito font-semibold"
                  style={{
                    background: priority.bg,
                    color: priority.text,
                    border: `1px solid ${priority.border}`,
                  }}
                  data-ocid={`${ocidBase}.panel`}
                >
                  <span className="mr-1 text-[10px]">{priority.emoji}</span>
                  {entry.priority.charAt(0).toUpperCase() +
                    entry.priority.slice(1)}
                </span>

                {/* Notes toggle */}
                {entry.notes && (
                  <button
                    type="button"
                    onClick={() => setNotesOpen((v) => !v)}
                    className={cn(
                      "text-xs font-nunito text-[#7181c8] flex items-center gap-0.5 hover:text-[#3a3060] transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7181c8] rounded",
                    )}
                    aria-expanded={notesOpen}
                    aria-label="Toggle notes"
                    data-ocid={`${ocidBase}.toggle`}
                  >
                    Notes{" "}
                    {notesOpen ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                )}
              </div>

              {/* Collapsible notes */}
              <AnimatePresence>
                {notesOpen && entry.notes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 text-sm font-nunito text-[#5a4a7a] leading-relaxed bg-[#f1e5f6]/50 rounded-xl px-3 py-2">
                      {entry.notes}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: actions */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(entry)}
                className="h-8 w-8 rounded-xl text-[#7181c8] hover:bg-[#f1cfed]/60 hover:text-[#3a3060]"
                aria-label="Edit entry"
                data-ocid={`${ocidBase}.edit_button`}
              >
                <Pencil size={14} />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete entry"
                    disabled={isDeleting}
                    data-ocid={`${ocidBase}.delete_button`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  className="rounded-3xl border-0 font-nunito"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(241,229,246,0.95) 100%)",
                  }}
                  data-ocid={`${ocidBase}.dialog`}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-cinzel text-[#3a3060]">
                      Delete Entry?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#5a4a7a]">
                      This will permanently remove "{entry.taskName}" from your
                      timetable. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="rounded-xl border-[#ababdc]/50 text-[#3a3060] hover:bg-[#f1e5f6]"
                      data-ocid={`${ocidBase}.cancel_button`}
                    >
                      Keep It
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(entry.id)}
                      className="rounded-xl bg-rose-400 hover:bg-rose-500 text-white"
                      data-ocid={`${ocidBase}.confirm_button`}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
