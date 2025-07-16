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
  } from "../lib/store.js";
  import { WEEKDAYS } from "../lib/types.js";
  import ConfigModal from "../lib/ConfigModal.svelte";
  import DayEntry from "../lib/DayEntry.svelte";
  import "../app.css";
  import PdfGen from "$lib/PDFGen.svelte";

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

  $effect(() => {
    if ($currentWeek) {
      loadWeekData($currentWeek.year, $currentWeek.week);
    }
  });

  function getWeekDateRange(year: number, week: number): string {
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const mondayOfWeek1 = new Date(jan4);
    mondayOfWeek1.setDate(jan4.getDate() - jan4Day + 1);
    
    const targetMonday = new Date(mondayOfWeek1);
    targetMonday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);
    
    const friday = new Date(targetMonday);
    friday.setDate(targetMonday.getDate() + 4);
    
    return `${targetMonday.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit'
    })} - ${friday.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit'
    })}`;
  }

  const currentWeekInfo = $derived(availableWeeks[selectedWeekIndex]);
</script>

<main class="app-container">
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">Berichtsheft Manager</h1>
      <div class="flex gap-4">
        <button class="btn-secondary" onclick={openConfig}>
          ⚙️ Settings
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
      ← Previous Week
    </button>

    <div class="week-info">
      {#if currentWeekInfo}
        <h2 class="week-title">
          Calendar Week {currentWeekInfo.week} - {currentWeekInfo.year}
        </h2>
        <h3 class="week-subtitle">
          {getWeekDateRange(currentWeekInfo.year, currentWeekInfo.week)}
        </h3>

        <div class="flex flex-col sm:flex-row gap-2">
          <button
            class="btn-success"
            onclick={handleGenerateReport}
            disabled={$isLoading}
          >
            PDF Preview
          </button>
          <button
            class="btn-primary"
            onclick={handleGenerateTextReport}
            disabled={reportGenerating || $isLoading}
          >
            {reportGenerating ? "Generating..." : "Text Report"}
          </button>
        </div>
      {:else}
        <h2 class="week-title">Loading...</h2>
      {/if}
    </div>

    <button
      class="btn-primary whitespace-nowrap w-full md:w-auto"
      onclick={() => handleWeekChange("next")}
      disabled={selectedWeekIndex === availableWeeks.length - 1 || $isLoading}
    >
      Next Week →
    </button>
  </div>

  {#if $isLoading}
    <div class="loading-container">
      <p>Loading week data...</p>
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
        Last report generated: <code class="success-code"
          >{lastGeneratedReport}</code
        >
      </p>
    </div>
  {/if}

  <ConfigModal />

  {#if showPdfPreview && currentWeekInfo}
    <PdfGen
      weekData={$currentWeekData}
      onClose={() => (showPdfPreview = false)}
    />
  {/if}
</main>
