<script lang="ts">
  import {
    formatDateToGerman,
    getWorkWeekDateRange,
    calculateTrainingWeekNumber,
  } from "./util";
  import { onMount } from "svelte";
  import { config } from "./store";
  import Printd from "printd";
  import {
    WEEKDAYS,
    type WeekData,
    type DayEntry,
    type AreaType,
  } from "./types";

  import { currentLanguage } from "../lib/store.js";
  import { translateArea, translateWeekday } from "./lang";

  interface Props {
    weekData: WeekData;
    onClose: () => void;
  }

  let { weekData, onClose }: Props = $props();

  let printContainer: HTMLElement;
  let weekMap = $state<Partial<Record<AreaType, DayEntry[]>>>({});

  function handleSavePDF() {
    openPrintWindow();
  }

  function openPrintWindow() {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = generatePrintHTML();
    new Printd().print(tempDiv);
  }

  function generatePrintHTML(): string {
    const content = printContainer.innerHTML;
    const trainingWeek = calculateTrainingWeekNumber(
      $config.start_date,
      weekData.year,
      weekData.week
    );

    const existingStyles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style')
    )
      .map((el) => {
        if (el.tagName === "LINK") {
          return `<link rel="stylesheet" href="${(el as HTMLLinkElement).href}">`;
        } else {
          return `<style>${(el as HTMLStyleElement).innerHTML}</style>`;
        }
      })
      .join("\n    ");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Berichtsheft Woche ${trainingWeek} (KW ${weekData.week}/${weekData.year})</title>
          <meta charset="utf-8">
          ${existingStyles}
          <style>
            /* Print-specific overrides */
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
              color: #000 !important;
              background: white !important;
              padding: 20mm !important;
            }
            
            @media print {
              body {
                padding: 15mm !important;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  }

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  $effect(() => {
    const newWeekMap: Partial<Record<AreaType, DayEntry[]>> = {};
    for (const day of WEEKDAYS) {
      const entry = weekData.entries[day];
      if (entry) {
        if (!newWeekMap[entry.area]) {
          newWeekMap[entry.area] = [];
        }
        newWeekMap[entry.area]!.push(entry);
      }
    }
    weekMap = newWeekMap;
  });
</script>

<div
  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <div
      class="flex place-self-center p-6 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {$currentLanguage.pdf_preview_title}
        {weekData.week}/{weekData.year}
      </h2>
    </div>

    <!-- Preview Content -->
    <div class="flex-1 overflow-auto p-6 bg-white !text-black">
      <div bind:this={printContainer} class="max-w-none">
        <!-- Print Header -->
        <div class="text-center mb-8 pb-6 border-b-2 border-gray-300">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            {$currentLanguage.pdf_gen_title}
          </h1>
          <p class="text-lg text-gray-600">
            {$currentLanguage.pdf_gen_subtitle_calender_week}
            {weekData.week}/{weekData.year}
          </p>
        </div>

        <!-- Info Table -->
        <div class="mb-8">
          <table class="w-full">
            <thead>
              <tr class="text-left">
                <th class="px-4 py-3 font-semibold text-gray-700"
                  >{$currentLanguage.pdf_gen_label_department}</th
                >
                <th class="px-4 py-3 font-semibold text-gray-700"
                  >{$currentLanguage.pdf_gen_label_from}</th
                >
                <th class="px-4 py-3 font-semibold text-gray-700"
                  >{$currentLanguage.pdf_gen_label_to}</th
                >
                <th class="px-4 py-3 font-semibold text-gray-700"
                  >{$currentLanguage.pdf_gen_label_trainee}</th
                >
                <th class="px-4 py-3 font-semibold text-gray-700"
                  >{$currentLanguage.pdf_gen_label_current_date}</th
                >
                <th class="px-4 py-3 font-semibold text-gray-700"
                  >{$currentLanguage.pdf_gen_label_report_number}</th
                >
              </tr>
            </thead>
            <tbody>
              <tr class="bg-gray-100">
                <td class="px-4 py-3 font-medium"
                  >{$config.department_name || "Nicht angegeben"}</td
                >
                <td class="px-4 py-3 font-medium"
                  >{getWorkWeekDateRange(
                    weekData.year,
                    weekData.week
                  ).startToString()}</td
                >
                <td class="px-4 py-3 font-medium"
                  >{getWorkWeekDateRange(
                    weekData.year,
                    weekData.week
                  ).endToString()}</td
                >
                <td class="px-4 py-3 font-medium"
                  >{$config.trainee_name || "Nicht angegeben"}</td
                >
                <td class="px-4 py-3 font-medium"
                  >{new Date().toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</td
                >
                <td class="px-4 py-3 font-medium"
                  >{calculateTrainingWeekNumber(
                    $config.start_date,
                    weekData.year,
                    weekData.week
                  )}</td
                >
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Days -->
        <div class="space-y-6 mb-12">
          {#each Object.entries(weekMap) as [area, entries]}
            <div>
              <h3
                class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500"
              >
                {translateArea(area, $currentLanguage)}
              </h3>
              <div class="space-y-3">
                {#each entries as entry}
                  <div class="p-4">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-semibold text-gray-800">
                        {translateWeekday(
                          new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                          }),
                          $currentLanguage
                        )}
                      </h4>
                      <span class="text-sm font-medium text-gray-600">
                        {formatDateToGerman(entry.date)}
                      </span>
                    </div>
                    <div class="text-gray-700 leading-relaxed">
                      <p class="whitespace-pre-wrap">{entry.notes}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <!-- Signature Section -->
        <div class="mt-16">
          <div class="bg-gray-100 p-8">
            <div class="grid grid-cols-3 gap-16">
              <div class="text-center">
                <div class="h-16 mb-2"></div>
                <div class="border-t border-gray-400 pt-2">
                  <p class="text-sm font-medium text-gray-700">
                    {$currentLanguage.pdf_gen_label_signature_trainer}
                  </p>
                </div>
              </div>
              <div class="text-center">
                <div class="h-16 mb-2"></div>
                <div class="border-t border-gray-400 pt-2">
                  <p class="text-sm font-medium text-gray-700">
                    {$currentLanguage.pdf_gen_label_signature_trainee}
                  </p>
                </div>
              </div>
              <div class="text-center">
                <div class="h-16 mb-2"></div>
                <div class="border-t border-gray-400 pt-2">
                  <p class="text-sm font-medium text-gray-700">
                    {$currentLanguage.pdf_gen_label_signature_guardian}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div
      class="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center"
    >
      <!--<div class="text-sm text-gray-600 dark:text-gray-400">
        Tipp: Verwenden Sie Strg+P zum schnellen Drucken
      </div>-->
      <div></div>
      <div class="flex gap-3">
        <button class="btn-primary" onclick={onClose}>
          {$currentLanguage.pdf_preview_button_close_text}
        </button>
        <button class="btn-primary" onclick={handleSavePDF}>
          {$currentLanguage.pdf_preview_button_save_text}
        </button>
        <button class="btn-primary" disabled>
          {$currentLanguage.pdf_preview_button_print_text}
        </button>
      </div>
    </div>
  </div>
</div>
