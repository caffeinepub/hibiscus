import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type TimetableEntry = {
    id : Text;
    date : Text; // Format: YYYY-MM-DD
    startTime : Text; // Format: HH:MM
    endTime : Text; // Format: HH:MM
    taskName : Text;
    priority : Text; // "high", "medium", "low"
    notes : Text;
    colorTag : Text; // Hex color code
  };

  module TimetableEntry {
    public func compareByStartTime(entry1 : TimetableEntry, entry2 : TimetableEntry) : Order.Order {
      Text.compare(entry1.startTime, entry2.startTime);
    };
  };

  type ArchivedDay = {
    date : Text; // Format: YYYY-MM-DD
    archivedAt : Int;
  };

  let entries = Map.empty<Text, TimetableEntry>();
  let archivedDays = Map.empty<Text, Int>();

  public shared ({ caller }) func addEntry(id : Text, date : Text, startTime : Text, endTime : Text, taskName : Text, priority : Text, notes : Text, colorTag : Text) : async () {
    if (entries.containsKey(id)) {
      Runtime.trap("Entry with this ID already exists");
    };
    let entry : TimetableEntry = {
      id;
      date;
      startTime;
      endTime;
      taskName;
      priority;
      notes;
      colorTag;
    };
    entries.add(id, entry);
  };

  public shared ({ caller }) func updateEntry(id : Text, date : Text, startTime : Text, endTime : Text, taskName : Text, priority : Text, notes : Text, colorTag : Text) : async () {
    switch (entries.get(id)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?_) {
        let updatedEntry : TimetableEntry = {
          id;
          date;
          startTime;
          endTime;
          taskName;
          priority;
          notes;
          colorTag;
        };
        entries.add(id, updatedEntry);
      };
    };
  };

  public shared ({ caller }) func deleteEntry(id : Text) : async () {
    if (not entries.containsKey(id)) {
      Runtime.trap("Entry not found");
    };
    entries.remove(id);
  };

  public query ({ caller }) func getEntriesForDate(date : Text) : async [TimetableEntry] {
    let filteredEntriesList = List.empty<TimetableEntry>();

    for ((_, entry) in entries.entries()) {
      if (entry.date == date) {
        filteredEntriesList.add(entry);
      };
    };

    filteredEntriesList.toArray().sort(TimetableEntry.compareByStartTime);
  };

  public shared ({ caller }) func archiveDay(date : Text) : async () {
    let timestamp = Time.now();
    archivedDays.add(date, timestamp);
  };

  public query ({ caller }) func getArchivedDaysWithinYear() : async [ArchivedDay] {
    let currentTime = Time.now();
    let oneYearNanos : Int = 31536000000000000;

    let archivedList = List.empty<ArchivedDay>();

    for ((date, archivedAt) in archivedDays.entries()) {
      if (currentTime - archivedAt <= oneYearNanos) {
        let archivedDay : ArchivedDay = {
          date;
          archivedAt;
        };
        archivedList.add(archivedDay);
      };
    };

    archivedList.toArray();
  };

  public query ({ caller }) func getAllEntryDates() : async [Text] {
    let dates = List.empty<Text>();
    let seenDates = Map.empty<Text, ()>();

    for ((_, entry) in entries.entries()) {
      if (not seenDates.containsKey(entry.date)) {
        dates.add(entry.date);
        seenDates.add(entry.date, ());
      };
    };

    dates.toArray();
  };

  public shared ({ caller }) func unarchiveDay(date : Text) : async () {
    if (not archivedDays.containsKey(date)) {
      Runtime.trap("Day is not archived");
    };
    archivedDays.remove(date);
  };
};
