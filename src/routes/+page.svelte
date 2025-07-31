<script lang="ts">
  import { onMount } from "svelte";
  import {
    config,
    loadConfig,
    loadWeekData,
    currentWeek,
    currentWeekData,
    isConfigOpen,
    isLoading,
    getCurrentWeekInfo,
    generatePDF,
    getWeeksAroundCurrent,
    currentLanguage,
  } from "../lib/store.js";
  import { WEEKDAYS } from "../lib/types.js";
  import ConfigModal from "../lib/ConfigModal.svelte";
  import DayEntry from "../lib/DayEntry.svelte";
  import "../app.css";
  import PdfGen from "$lib/PDFGen.svelte";
  import { getWorkWeekDateRange } from "$lib/util.js";

  let availableWeeks = $state<Array<{ year: number; week: number }>>([]);
  let selectedWeekIndex = $state(0);
  let reportGenerating = $state(false);
  let lastGeneratedReport = $state("");
  let showPdfPreview = $state(false);

  onMount(async () => {
    try {
      await loadConfig();
      await getCurrentWeekInfo();
      const weeks = await getWeeksAroundCurrent(5, 5);
      availableWeeks = weeks.map(([year, week]) => ({ year, week }));

      const current = $currentWeek;
      selectedWeekIndex = availableWeeks.findIndex(
        (w) => w.year === current.year && w.week === current.week
      );
      if (selectedWeekIndex === -1) selectedWeekIndex = 0;

      await loadCurrentWeekData();
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  });

  async function loadCurrentWeekData() {
    const week = availableWeeks[selectedWeekIndex];
    if (week) {
      currentWeek.set(week);
      await loadWeekData(week.year, week.week);
    }
  }

  async function handleWeekChange(direction: "prev" | "next") {
    if (direction === "prev" && selectedWeekIndex > 0) {
      selectedWeekIndex--;
    } else if (
      direction === "next" &&
      selectedWeekIndex < availableWeeks.length - 1
    ) {
      selectedWeekIndex++;
    }
    await loadCurrentWeekData();
  }

  async function handleGenerateReport() {
    showPdfPreview = true;
  }

  async function handleGenerateTextReport() {
    try {
      reportGenerating = true;
      const week = availableWeeks[selectedWeekIndex];
      const reportPath = await generatePDF(week.year, week.week);
      lastGeneratedReport = reportPath;
      alert(`Report generated successfully!\nSaved to: ${reportPath}`);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert(`Failed to generate report: ${error}`);
    } finally {
      reportGenerating = false;
    }
  }

  function openConfig() {
    isConfigOpen.set(true);
  }

  const currentWeekInfo = $derived(availableWeeks[selectedWeekIndex]);
</script>

<main class="app-container">
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">{$currentLanguage.program_title}</h1>
      <div class="flex gap-4">
        <button class="btn-secondary" onclick={openConfig}>
          {$currentLanguage.config_button_text}
        </button>
      </div>
    </div>
  </header>

  <div class="week-navigation">
    <button
      class="btn-primary whitespace-nowrap w-full md:w-auto"
      onclick={() => handleWeekChange("prev")}
      disabled={selectedWeekIndex === 0 || $isLoading}
    >
      {$currentLanguage.program_previous_week}
    </button>

    <div class="week-info">
      {#if currentWeekInfo}
        <h2 class="week-title">
          {$currentLanguage.program_subtitle_calendar_week} {currentWeekInfo.week} - {currentWeekInfo.year}
        </h2>
        <h3 class="week-subtitle">
          {getWorkWeekDateRange(currentWeekInfo.year, currentWeekInfo.week)}
        </h3>

        <div class="flex flex-col sm:flex-row gap-2">
          <button
            class="btn-success"
            onclick={handleGenerateReport}
            disabled={$isLoading}
          >
            {$currentLanguage.program_button_pdf_preview}
          </button>
          <button
            class="btn-primary"
            onclick={handleGenerateTextReport}
            disabled={reportGenerating || $isLoading}
          >
            {reportGenerating ? $currentLanguage.program_button_generating : $currentLanguage.program_button_text_report}
          </button>
        </div>
      {:else}
        <h2 class="week-title">{$currentLanguage.program_loading}</h2>
      {/if}
    </div>

    <button
      class="btn-primary whitespace-nowrap w-full md:w-auto"
      onclick={() => handleWeekChange("next")}
      disabled={selectedWeekIndex === availableWeeks.length - 1 || $isLoading}
    >
      {$currentLanguage.program_next_week}
    </button>
  </div>

  {#if $isLoading}
    <div class="loading-container">
      <p>{$currentLanguage.program_loading_week_data}</p>
    </div>
  {:else if currentWeekInfo}
    <div class="week-grid">
      {#each WEEKDAYS as weekday}
        <DayEntry
          {weekday}
          year={currentWeekInfo.year}
          week={currentWeekInfo.week}
          entry={$currentWeekData.entries[weekday]}
          onSave={() => loadCurrentWeekData()}
        />
      {/each}
    </div>
  {/if}

  {#if lastGeneratedReport}
    <div class="success-message">
      <p>
        {$currentLanguage.program_last_report_generated} <code class="success-code"
          >{lastGeneratedReport}</code
        >
      </p>
    </div>
  {/if}

  <ConfigModal />

  {#if showPdfPreview && currentWeekInfo}
    <PdfGen
      weekData={$currentWeekData}
      onClose={() => {
        console.log("PDF preview closed");
        showPdfPreview = false;
      }}
    />
  {/if}
</main>
