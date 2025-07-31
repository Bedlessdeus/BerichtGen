<script lang="ts">
  import { currentLanguage, saveDayEntry } from "../lib/store.js";
  import { AREAS, type DayEntry, type Weekday } from "../lib/types.js";
  import { translateArea, translateWeekday } from "./lang.js";

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

  const formatDateToGerman = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const parseDateFromGerman = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split(".");
    if (parts.length !== 3) return null;
    return new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0])
    );
  };

  const formatDateToISO = (dateStr: string): string => {
    const date = parseDateFromGerman(dateStr);
    if (!date) return dateStr;
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const formatDateFromISO = (isoStr: string): string => {
    if (!isoStr) return "";
    const parts = isoStr.split("-");
    if (parts.length !== 3) return isoStr;
    const date = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2])
    );
    return formatDateToGerman(date);
  };

  const startEditing = () => {
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
  };

  const cancelEditing = () => {
    isEditing = false;
    formData = {
      date: entry?.date || "",
      area: entry?.area || "Department",
      notes: entry?.notes || "",
    };
  };

  const handleSave = async () => {
    try {
      isSaving = true;
      formData.notes = formData.area !== AREAS[3] ? formData.notes : "";
      const saveData = {
        ...formData,
        date: formatDateToISO(formData.date),
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
  };

  const getMondayOfWeek = (year: number, week: number): Date => {
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const mondayOfWeek1 = new Date(jan4);
    mondayOfWeek1.setDate(jan4.getDate() - jan4Day + 1);

    const targetMonday = new Date(mondayOfWeek1);
    targetMonday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);

    return targetMonday;
  };

  $effect(() => {
    if (entry) {
      formData = {
        ...entry,
        date: formatDateFromISO(entry.date),
      };
    }
  });
</script>

<div class="day-card">
  <div class="day-header">
    <h3 class="day-title">{translateWeekday(weekday, $currentLanguage)}</h3>
    {#if !isEditing}
      <button class="btn-small" onclick={startEditing}>
        {entry
          ? $currentLanguage.day_button_edit_text
          : $currentLanguage.day_button_add_text}
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
        <label class="form-label" for="{weekday}-date"
          >{$currentLanguage.day_input_label_date}</label
        >
        <input
          class="form-input"
          id="{weekday}-date"
          type="text"
          bind:value={formData.date}
          title={$currentLanguage.day_input_placeholder_date}
          required
          disabled
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="{weekday}-area"
          >{$currentLanguage.day_input_label_area}</label
        >
        <select
          class="form-select"
          id="{weekday}-area"
          bind:value={formData.area}
          required
        >
          {#each AREAS as area}
            <option value={area}>{translateArea(area, $currentLanguage)}</option>
          {/each}
        </select>
      </div>

      {#if formData.area !== AREAS[3]}
        <div class="form-group">
          <label class="form-label" for="{weekday}-notes">{$currentLanguage.day_input_notes_label}</label>
          <textarea
            class="form-textarea"
            id="{weekday}-notes"
            bind:value={formData.notes}
            placeholder={$currentLanguage.day_input_notes_placeholder}
            rows="4"
            required
          ></textarea>
        </div>
      {/if}

      <div class="form-actions">
        <button
          class="btn-secondary text-sm py-2 px-3"
          type="button"
          onclick={cancelEditing}
          disabled={isSaving}
        >
          {$currentLanguage.day_button_cancel_text}
        </button>
        <button
          class="btn-primary text-sm py-2 px-3"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? $currentLanguage.day_button_save_text_saving : $currentLanguage.day_button_save_text}
        </button>
      </div>
    </form>
  {:else if entry}
    <div class="entry-display">
      <div class="entry-field">
        <span class="field-label">{$currentLanguage.day_view_label_date}</span>
        <span class="field-value">{entry.date}</span>
      </div>
      <div class="entry-field">
        <span class="field-label">{$currentLanguage.day_view_label_area}</span>
        <span class="field-value">{translateArea(entry.area, $currentLanguage)}</span>
      </div>
      <div class="entry-field">
        {#if entry.area !== AREAS[3]}
          <span class="field-label">{$currentLanguage.day_view_label_notes}</span>
          <span class="field-value">{entry.notes}</span>
        {:else}
          <span class="field-label">{$currentLanguage.day_view_label_no_notes}</span>
        {/if}
      </div>
    </div>
  {:else}
    <div class="entry-empty">
      <p>{$currentLanguage.day_view_missing_entry}</p>
    </div>
  {/if}
</div>
