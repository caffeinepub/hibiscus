import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Archive, Loader2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { TimetableEntry } from "../backend.d";
import {
  useAddEntry,
  useArchiveDay,
  useDeleteEntry,
  useEntriesForDate,
  useUpdateEntry,
} from "../hooks/useQueries";
import { EntryCard } from "./EntryCard";
import { EntryForm } from "./EntryForm";
import {
  EmptyStateDecoration,
  SparkleStarFour,
  TinySparkle,
} from "./Y2KDecorations";

interface TimetablePageProps {
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Sunday, March 8"
  subtitle?: string; // e.g. "Today" or "Tomorrow"
  showArchiveButton?: boolean;
}

function formatDateHeader(displayDate: string, subtitle?: string) {
  return (
    <div className="text-center">
      {subtitle && (
        <p
          className="font-nunito text-xs font-bold uppercase mb-2"
          style={{
            letterSpacing: "0.32em",
            color: "#7181c8",
            textShadow: "0 0 18px rgba(113,129,200,0.35)",
          }}
        >
          ✦ {subtitle} ✦
        </p>
      )}
      <h1
        className="font-cinzel font-bold tracking-wide"
        style={{
          fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
          background:
            "linear-gradient(135deg, #3a3060 20%, #7181c8 70%, #ababdc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none",
          filter: "drop-shadow(0 2px 8px rgba(113,129,200,0.25))",
          lineHeight: 1.15,
        }}
      >
        {displayDate}
      </h1>
    </div>
  );
}

export function TimetablePage({
  date,
  displayDate,
  subtitle,
  showArchiveButton = true,
}: TimetablePageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const { data: entries = [], isLoading } = useEntriesForDate(date);
  const addMutation = useAddEntry(date);
  const updateMutation = useUpdateEntry(date);
  const deleteMutation = useDeleteEntry(date);
  const archiveMutation = useArchiveDay();

  const openAddForm = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const openEditForm = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

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

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(date);
      toast.success("Day archived ✦ — check the Archive page!");
    } catch {
      toast.error("Could not archive this day. Please try again.");
    }
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="relative pt-6 pb-5 px-4 text-center">
        {/* Decorative sparkles */}
        <SparkleStarFour
          size={20}
          color="#7181c8"
          opacity={0.45}
          className="absolute top-5 left-4 animate-float"
        />
        <SparkleStarFour
          size={16}
          color="#ababdc"
          opacity={0.5}
          className="absolute top-8 right-6 animate-pulse-soft"
        />
        {formatDateHeader(displayDate, subtitle)}
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

      {/* Entries list */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="entry.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl bg-white/50" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-6"
            data-ocid="entry.empty_state"
          >
            <EmptyStateDecoration className="w-28 h-24" />
            <div className="text-center">
              <p className="font-cinzel text-[#7181c8] text-base font-medium mb-1">
                No entries yet
              </p>
              <p className="font-nunito text-sm text-[#a090c0]">
                Add your first task to start planning your day ✦
              </p>
            </div>
            <Button
              onClick={openAddForm}
              className="rounded-2xl px-6 font-nunito font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7181c8 0%, #ababdc 100%)",
                boxShadow: "0 4px 14px rgba(113,129,200,0.35)",
              }}
              data-ocid="entry.primary_button"
            >
              <Plus size={16} className="mr-2" /> Add First Entry
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {entries.map((entry, i) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  index={i + 1}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom actions (only when entries exist or as sticky footer) */}
      {!isLoading && (
        <div
          className="sticky bottom-0 px-4 pb-4 pt-3 flex flex-col gap-2.5"
          style={{
            background:
              "linear-gradient(to top, rgba(241,229,246,0.9) 0%, transparent 100%)",
          }}
        >
          {/* Add entry button - always visible */}
          <Button
            onClick={openAddForm}
            className="w-full rounded-2xl py-6 font-nunito font-semibold text-white text-base"
            style={{
              background: "linear-gradient(135deg, #7181c8 0%, #ababdc 100%)",
              boxShadow: "0 4px 14px rgba(113,129,200,0.35)",
            }}
            data-ocid="entry.primary_button"
          >
            <Plus size={18} className="mr-2" />
            Add Entry
          </Button>

          {/* Archive button */}
          {showArchiveButton && entries.length > 0 && (
            <Button
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
              variant="outline"
              className="w-full rounded-2xl py-5 font-nunito font-semibold text-[#3a3060] border-[#ababdc]/60 hover:bg-[#f1cfed]/40"
              data-ocid="entry.secondary_button"
            >
              {archiveMutation.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                  Archiving...
                </>
              ) : (
                <>
                  <Archive size={16} className="mr-2" /> Archive This Day
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Entry form sheet */}
      <EntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editingEntry}
        onSubmit={handleSubmit}
        isLoading={isMutating}
        title={editingEntry ? "Edit Entry" : "New Entry"}
      />
    </div>
  );
}
