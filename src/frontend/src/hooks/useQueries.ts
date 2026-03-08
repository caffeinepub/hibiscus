import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ArchivedDay, TimetableEntry } from "../backend.d";
import { useActor } from "./useActor";

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const queryKeys = {
  entriesForDate: (date: string) => ["entries", date],
  archivedDays: () => ["archivedDays"],
  allEntryDates: () => ["allEntryDates"],
};

// ─── Queries ───────────────────────────────────────────────────────────────────

export function useEntriesForDate(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<TimetableEntry[]>({
    queryKey: queryKeys.entriesForDate(date),
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getEntriesForDate(date);
      return [...entries].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArchivedDays() {
  const { actor, isFetching } = useActor();
  return useQuery<ArchivedDay[]>({
    queryKey: queryKeys.archivedDays(),
    queryFn: async () => {
      if (!actor) return [];
      const days = await actor.getArchivedDaysWithinYear();
      return [...days].sort((a, b) => b.date.localeCompare(a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllEntryDates() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: queryKeys.allEntryDates(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntryDates();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

export function useAddEntry(date: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      startTime: string;
      endTime: string;
      taskName: string;
      priority: string;
      notes: string;
      colorTag: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await actor.addEntry(
        id,
        date,
        entry.startTime,
        entry.endTime,
        entry.taskName,
        entry.priority,
        entry.notes,
        entry.colorTag,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entriesForDate(date),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.allEntryDates() });
    },
  });
}

export function useUpdateEntry(date: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: TimetableEntry) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateEntry(
        entry.id,
        entry.date,
        entry.startTime,
        entry.endTime,
        entry.taskName,
        entry.priority,
        entry.notes,
        entry.colorTag,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entriesForDate(date),
      });
    },
  });
}

export function useDeleteEntry(date: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entriesForDate(date),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.allEntryDates() });
    },
  });
}

export function useArchiveDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.archiveDay(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.archivedDays() });
    },
  });
}

export function useUnarchiveDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.unarchiveDay(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.archivedDays() });
    },
  });
}
