import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ArchivedDay {
    date: string;
    archivedAt: bigint;
}
export interface TimetableEntry {
    id: string;
    startTime: string;
    endTime: string;
    date: string;
    taskName: string;
    colorTag: string;
    notes: string;
    priority: string;
}
export interface backendInterface {
    addEntry(id: string, date: string, startTime: string, endTime: string, taskName: string, priority: string, notes: string, colorTag: string): Promise<void>;
    archiveDay(date: string): Promise<void>;
    deleteEntry(id: string): Promise<void>;
    getAllEntryDates(): Promise<Array<string>>;
    getArchivedDaysWithinYear(): Promise<Array<ArchivedDay>>;
    getEntriesForDate(date: string): Promise<Array<TimetableEntry>>;
    unarchiveDay(date: string): Promise<void>;
    updateEntry(id: string, date: string, startTime: string, endTime: string, taskName: string, priority: string, notes: string, colorTag: string): Promise<void>;
}
