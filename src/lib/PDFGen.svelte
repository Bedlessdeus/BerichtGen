<script lang="ts">
  import { onMount } from 'svelte';
  import { config } from './store.js';
  import { WEEKDAYS, type WeekData, type DayEntry } from './types.js';

  interface Props {
    weekData: WeekData;
    onClose: () => void;
  }

  let { weekData, onClose }: Props = $props();

  let printContainer: HTMLElement;

  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

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
      month: '2-digit',
      year: 'numeric'
    })} - ${friday.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })}`;
  }

  function handlePrint() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;
    
    const printContent = printContainer.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Berichtsheft KW ${weekData.week}/${weekData.year}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              color: #000;
              background: white;
              padding: 20mm;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            
            .print-title {
              font-size: 24pt;
              font-weight: bold;
              margin-bottom: 10px;
            }
            
            .print-subtitle {
              font-size: 14pt;
              color: #666;
              margin-bottom: 5px;
            }
            
            .company-info {
              margin-bottom: 30px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            
            .info-section h3 {
              font-size: 14pt;
              margin-bottom: 10px;
              color: #333;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            
            .info-item {
              margin-bottom: 8px;
            }
            
            .info-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            
            .days-container {
              margin-top: 30px;
            }
            
            .day-section {
              margin-bottom: 40px;
              break-inside: avoid;
            }
            
            .day-header {
              background-color: #f5f5f5;
              padding: 10px 15px;
              border-left: 4px solid #007acc;
              margin-bottom: 15px;
            }
            
            .day-title {
              font-size: 16pt;
              font-weight: bold;
              color: #333;
            }
            
            .day-content {
              margin-left: 20px;
            }
            
            .field-row {
              margin-bottom: 12px;
              display: flex;
              align-items: flex-start;
            }
            
            .field-label {
              font-weight: bold;
              width: 100px;
              color: #555;
              flex-shrink: 0;
            }
            
            .field-value {
              flex: 1;
            }
            
            .notes-content {
              background-color: #fafafa;
              padding: 15px;
              border-left: 3px solid #007acc;
              white-space: pre-wrap;
              font-family: 'Segoe UI', sans-serif;
              margin-top: 5px;
              border-radius: 0 4px 4px 0;
            }
            
            .no-entry {
              color: #999;
              font-style: italic;
              margin-left: 20px;
            }
            
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 10pt;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 20px;
            }
            
            @media print {
              body {
                padding: 15mm;
              }
              
              .day-section {
                page-break-inside: avoid;
              }
              
              .print-header {
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  function handleSavePDF() {
    handlePrint();
  }

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Berichtsheft Preview - KW {weekData.week}/{weekData.year}
      </h2>
      <div class="flex gap-3">
        <button 
          class="btn-success"
          onclick={handleSavePDF}
          title="Print/Save as PDF (Ctrl+P)"
        >
          📄 Print/Save PDF
        </button>
        <button 
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          onclick={onClose}
        >
          ×
        </button>
      </div>
    </div>

    <!-- Preview Content -->
    <div class="flex-1 overflow-auto p-6">
      <div bind:this={printContainer} class="max-w-none">
        <!-- Print Header -->
        <div class="print-header">
          <h1 class="print-title">BERICHTSHEFT</h1>
          <div class="print-subtitle">Kalenderwoche {weekData.week} • {weekData.year}</div>
          <div class="print-subtitle">{getWeekDateRange(weekData.year, weekData.week)}</div>
        </div>

        <!-- Company Info -->
        <div class="company-info">
          <div class="info-section">
            <h3>Persönliche Angaben</h3>
            <div class="info-item">
              <span class="info-label">Auszubildende/r:</span>
              <span>{$config.trainee_name || 'Nicht angegeben'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Abteilung:</span>
              <span>{$config.department_name || 'Nicht angegeben'}</span>
            </div>
          </div>
          <div class="info-section">
            <h3>Unternehmen</h3>
            <div class="info-item">
              <span class="info-label">Firma:</span>
              <span>{$config.company_name || 'Nicht angegeben'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Kalenderwoche:</span>
              <span>{weekData.week}/{weekData.year}</span>
            </div>
          </div>
        </div>

        <!-- Days -->
        <div class="days-container">
          {#each WEEKDAYS as weekday, index}
            {@const entry = weekData.entries[weekday]}
            {@const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']}
            
            <div class="day-section">
              <div class="day-header">
                <div class="day-title">{dayNames[index]}</div>
              </div>
              
              {#if entry}
                <div class="day-content">
                  <div class="field-row">
                    <span class="field-label">Datum:</span>
                    <span class="field-value">{formatDate(entry.date)}</span>
                  </div>
                  
                  <div class="field-row">
                    <span class="field-label">Bereich:</span>
                    <span class="field-value">{entry.area}</span>
                  </div>
                  
                  <div class="field-row">
                    <span class="field-label">Tätigkeiten:</span>
                    <div class="field-value">
                      <div class="notes-content">{entry.notes}</div>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="no-entry">Keine Einträge für diesen Tag</div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Erstellt am: {new Date().toLocaleDateString('de-DE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>Berichtsheft-Manager • Kalenderwoche {weekData.week}/{weekData.year}</p>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Tipp: Verwenden Sie Strg+P zum schnellen Drucken
      </div>
      <div class="flex gap-3">
        <button class="btn-secondary" onclick={onClose}>
          Schließen
        </button>
        <button class="btn-primary" onclick={handlePrint}>
          🖨️ Drucken
        </button>
      </div>
    </div>
  </div>
</div>