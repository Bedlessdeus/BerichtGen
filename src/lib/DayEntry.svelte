<script lang="ts">
  import { saveDayEntry } from "../lib/store.js";
  import { AREAS, type DayEntry, type Weekday } from "../lib/types.js";

  interface Props {
    weekday: Weekday;
    year: number;
    week: number;
    entry?: DayEntry;
    onSave?: () => void;
  }

  let { weekday, year, week, entry, onSave }: Props = $props();

  let isEditing = $state(false);
  let isSaving = $state(false);
  let formData = $state<DayEntry>({
    date: entry?.date || "",
    area: entry?.area || "Department",
    notes: entry?.notes || "",
  });

  // Helper functions for date formatting
  function formatDateToGerman(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function parseDateFromGerman(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  function formatDateToISO(dateStr: string): string {
    const date = parseDateFromGerman(dateStr);
    if (!date) return dateStr;
    // Use UTC to avoid timezone offset issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDateFromISO(isoStr: string): string {
    if (!isoStr) return '';
    // Parse ISO date without timezone conversion
    const parts = isoStr.split('-');
    if (parts.length !== 3) return isoStr;
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const date = new Date(year, month, day);
    return formatDateToGerman(date);
  }

  function startEditing() {
    isEditing = true;
    if (!formData.date) {
      const mondayOfWeek = getMondayOfWeek(year, week);
      const dayOffset = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ].indexOf(weekday);
      const targetDate = new Date(mondayOfWeek);
      targetDate.setDate(targetDate.getDate() + dayOffset);
      formData.date = formatDateToGerman(targetDate);
    }
  }

  function cancelEditing() {
    isEditing = false;
    formData = {
      date: entry?.date || "",
      area: entry?.area || "Department",
      notes: entry?.notes || "",
    };
  }

  async function handleSave() {
    try {
      isSaving = true;
      const saveData = {
        ...formData,
        date: formatDateToISO(formData.date)
      };
      await saveDayEntry(year, week, weekday, saveData);
      isEditing = false;
      onSave?.();
    } catch (error) {
      console.error("Failed to save day entry:", error);
      alert("Failed to save entry. Please try again.");
    } finally {
      isSaving = false;
    }
  }

  function getMondayOfWeek(year: number, week: number): Date {
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const mondayOfWeek1 = new Date(jan4);
    mondayOfWeek1.setDate(jan4.getDate() - jan4Day + 1);

    const targetMonday = new Date(mondayOfWeek1);
    targetMonday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);

    return targetMonday;
  }

  $effect(() => {
    if (entry) {
      formData = { 
        ...entry,
        date: formatDateFromISO(entry.date)
      };
    }
  });
</script>

<div class="day-card">
  <div class="day-header">
    <h3 class="day-title">{weekday}</h3>
    {#if !isEditing}
      <button class="btn-small" onclick={startEditing}>
        {entry ? "Edit" : "Add"}
      </button>
    {/if}
  </div>

  {#if isEditing}
    <form
      class="flex flex-col gap-4"
      onsubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div class="form-group">
        <label class="form-label" for="{weekday}-date">Date:</label>
        <input
          class="form-input"
          id="{weekday}-date"
          type="text"
          bind:value={formData.date}
          title="Please enter date in DD.MM.YYYY format"
          required
          disabled
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="{weekday}-area">Area:</label>
        <select
          class="form-select"
          id="{weekday}-area"
          bind:value={formData.area}
          required
        >
          {#each AREAS as area}
            <option value={area}>{area}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="{weekday}-notes">Notes:</label>
        <textarea
          class="form-textarea"
          id="{weekday}-notes"
          bind:value={formData.notes}
          placeholder="What did you do today?"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button
          class="btn-secondary text-sm py-2 px-3"
          type="button"
          onclick={cancelEditing}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          class="btn-primary text-sm py-2 px-3"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  {:else if entry}
    <div class="entry-display">
      <div class="entry-field">
        <span class="field-label">Date:</span>
        <span class="field-value">{entry.date}</span>
      </div>
      <div class="entry-field">
        <span class="field-label">Area:</span>
        <span class="field-value">{entry.area}</span>
      </div>
      <div class="entry-field">
        <span class="field-label">Notes:</span>
        <div class="field-value field-notes">{entry.notes}</div>
      </div>
    </div>
  {:else}
    <div class="entry-empty">
      <p>No entry for this day</p>
    </div>
  {/if}
</div>
