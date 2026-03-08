import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArchiveRestore, ChevronDown, Loader2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { TimetableEntry } from "../backend.d";
import {
  useAddEntry,
  useArchivedDays,
  useDeleteEntry,
  useEntriesForDate,
  useUnarchiveDay,
  useUpdateEntry,
} from "../hooks/useQueries";
import { EntryCard } from "./EntryCard";
import { EntryForm } from "./EntryForm";
import {
  CrescentMoon,
  EmptyStateDecoration,
  SparkleStarFour,
  TinySparkle,
} from "./Y2KDecorations";

function formatDisplayDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysAgo(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  const diff = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
  return "1 year ago";
}

function ArchivedDayPanel({
  date,
  onUnarchive,
}: { date: string; onUnarchive: (d: string) => void }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const { data: entries = [], isLoading } = useEntriesForDate(date);
  const addMutation = useAddEntry(date);
  const updateMutation = useUpdateEntry(date);
  const deleteMutation = useDeleteEntry(date);

  const handleSubmit = async (formData: {
    startTime: string;
    endTime: string;
    taskName: string;
    priority: string;
    notes: string;
    colorTag: string;
  }) => {
    try {
      if (editingEntry) {
        await updateMutation.mutateAsync({ ...editingEntry, ...formData });
        toast.success("Entry updated ✦");
      } else {
        await addMutation.mutateAsync(formData);
        toast.success("Entry added ✦");
      }
      setFormOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Entry removed");
    } catch {
      toast.error("Could not delete entry. Please try again.");
    }
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="pt-3 pb-2 px-1">
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl bg-white/50" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div
          className="text-center py-6 text-[#a090c0] font-nunito text-sm"
          data-ocid="archive.empty_state"
        >
          <p>No entries for this day.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2.5">
            {entries.map((entry, i) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={i + 1}
                onEdit={(e) => {
                  setEditingEntry(e);
                  setFormOpen(true);
                }}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex gap-2.5">
        <Button
          onClick={() => {
            setEditingEntry(null);
            setFormOpen(true);
          }}
          size="sm"
          className="flex-1 rounded-xl font-nunito font-semibold text-white text-sm"
          style={{
            background: "linear-gradient(135deg, #7181c8 0%, #ababdc 100%)",
            boxShadow: "0 4px 14px rgba(113,129,200,0.3)",
          }}
          data-ocid="archive.primary_button"
        >
          <Plus size={14} className="mr-1.5" /> Add Entry
        </Button>
        <Button
          onClick={() => onUnarchive(date)}
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl font-nunito font-semibold text-[#3a3060] border-[#ababdc]/50 hover:bg-[#f1cfed]/40 text-sm"
          data-ocid="archive.secondary_button"
        >
          <ArchiveRestore size={14} className="mr-1.5" /> Unarchive
        </Button>
      </div>

      <EntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editingEntry}
        onSubmit={handleSubmit}
        isLoading={isMutating}
        title={editingEntry ? "Edit Entry" : "Add to Archive"}
      />
    </div>
  );
}

export function ArchivePage() {
  const { data: archivedDays = [], isLoading } = useArchivedDays();
  const unarchiveMutation = useUnarchiveDay();

  const handleUnarchive = async (date: string) => {
    try {
      await unarchiveMutation.mutateAsync(date);
      toast.success("Day unarchived ✦");
    } catch {
      toast.error("Could not unarchive this day. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="relative pt-6 pb-5 px-4 text-center">
        <SparkleStarFour
          size={36}
          color="#7181c8"
          opacity={0.55}
          glow
          className="absolute top-5 left-4 animate-float"
          style={{ filter: "drop-shadow(0 0 6px rgba(113,129,200,0.45))" }}
        />
        <CrescentMoon
          size={34}
          color="#c8b4e0"
          opacity={0.6}
          className="absolute top-3 right-5 animate-float"
          style={{
            animationDelay: "1.5s",
            filter: "drop-shadow(0 0 5px rgba(200,180,224,0.4))",
          }}
        />
        <p
          className="font-nunito text-xs font-bold uppercase mb-2"
          style={{
            letterSpacing: "0.32em",
            color: "#7181c8",
            textShadow: "0 0 18px rgba(113,129,200,0.35)",
          }}
        >
          ✦ Memory Lane ✦
        </p>
        <h1
          className="font-cinzel font-bold tracking-wide"
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            background:
              "linear-gradient(135deg, #3a3060 20%, #7181c8 70%, #ababdc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(113,129,200,0.25))",
            lineHeight: 1.15,
          }}
        >
          Archive
        </h1>
        <p className="font-nunito text-xs text-[#a090c0] mt-1.5">
          Showing up to 1 year back
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#ababdc]/60 to-[#ababdc]/60" />
          <SparkleStarFour
            size={14}
            color="#7181c8"
            opacity={0.75}
            glow
            style={{ filter: "drop-shadow(0 0 4px rgba(113,129,200,0.5))" }}
          />
          <TinySparkle
            size={8}
            color="#f4c2d8"
            opacity={0.9}
            className="animate-pulse-soft"
          />
          <SparkleStarFour
            size={14}
            color="#7181c8"
            opacity={0.75}
            glow
            style={{ filter: "drop-shadow(0 0 4px rgba(113,129,200,0.5))" }}
          />
          <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#ababdc]/60 to-[#ababdc]/60" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-8">
        {isLoading ? (
          <div className="space-y-3" data-ocid="archive.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl bg-white/50" />
            ))}
          </div>
        ) : archivedDays.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-6"
            data-ocid="archive.empty_state"
          >
            <EmptyStateDecoration className="w-28 h-24" />
            <div className="text-center">
              <p className="font-cinzel text-[#7181c8] text-base font-medium mb-1">
                No archived days yet
              </p>
              <p className="font-nunito text-sm text-[#a090c0] max-w-xs">
                When you archive a day from Today or Tomorrow, it will appear
                here ✦
              </p>
            </div>
          </motion.div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            <AnimatePresence>
              {archivedDays.map((day, i) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  data-ocid={`archive.item.${i + 1}`}
                >
                  <AccordionItem
                    value={day.date}
                    className="rounded-2xl overflow-hidden border-0"
                    style={{
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(171,171,220,0.25)",
                      boxShadow:
                        "0 4px 16px rgba(113,129,200,0.1), 0 1px 4px rgba(113,129,200,0.06)",
                    }}
                  >
                    <AccordionTrigger
                      className="px-4 py-3.5 hover:no-underline group"
                      data-ocid={`archive.item.${i + 1}.toggle`}
                    >
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="text-left">
                          <p className="font-cinzel text-sm font-semibold text-[#3a3060] group-hover:text-[#7181c8] transition-colors">
                            {formatDisplayDate(day.date)}
                          </p>
                          <p className="font-nunito text-xs text-[#a090c0] mt-0.5">
                            {getDaysAgo(day.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <TinySparkle
                            size={10}
                            color="#ababdc"
                            opacity={0.6}
                          />
                          <ChevronDown
                            size={16}
                            className="text-[#ababdc] transition-transform duration-200 group-data-[state=open]:rotate-180"
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-0">
                      <ArchivedDayPanel
                        date={day.date}
                        onUnarchive={handleUnarchive}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </Accordion>
        )}
      </div>
    </div>
  );
}
