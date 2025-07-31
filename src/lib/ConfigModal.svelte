<script lang="ts">
  import { config, saveConfig, isConfigOpen, selfDirectory } from "../lib/store.js";
  import { open } from "@tauri-apps/plugin-dialog";
  import type { Config } from "../lib/types.js";
  import { openUrl } from "@tauri-apps/plugin-opener";

  let formData: Config = $state({ ...$config });
  let isSaving = $state(false);
  let saveMessage = $state("");

  async function selectOutputDirectory() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: formData.output_directory || undefined,
      });

      if (selected) {
        formData.output_directory = selected;
      }
    } catch (error) {
      console.error("Failed to select directory:", error);
    }
  }

  async function openSelfDirectory() {
    try {
      const path = $selfDirectory;
      if (path) {
        await openUrl(`file://${path}`);
      } else {
        console.warn("Self directory path is not available");
      }
    } catch (error) {
      console.error("Failed to open self directory:", error);
    }
  }

  async function handleSave() {
    try {
      isSaving = true;
      saveMessage = "";
      await saveConfig(formData);
      saveMessage = "Configuration saved successfully!";
      setTimeout(() => {
        isConfigOpen.set(false);
      }, 1500);
    } catch (error) {
      saveMessage = `Error saving configuration: ${error}`;
    } finally {
      isSaving = false;
    }
  }

  function handleClose() {
    isConfigOpen.set(false);
  }

  function handleOverlayKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
      handleClose();
    }
  }

  function handleContentKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
  }

  $effect(() => {
    formData = { ...$config };
  });
</script>

{#if $isConfigOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="modal-overlay"
    onclick={handleClose}
    onkeydown={handleOverlayKeyDown}
    role="button"
    tabindex="0"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="modal-content"
      onclick={(e) => e.stopPropagation()}
      onkeydown={handleContentKeyDown}
      role="dialog"
      aria-labelledby="config-title"
      tabindex="-1"
    >
      <div class="modal-header">
        <h2 class="modal-title" id="config-title">Configuration</h2>
      </div>

      <div class="modal-body">
        <form
          class="config-form"
          onsubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div class="form-group">
            <label class="form-label" for="trainee-name">Trainee Name:</label>
            <input
              class="form-input"
              id="trainee-name"
              type="text"
              bind:value={formData.trainee_name}
              placeholder="Enter your name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="department-name"
              >Department Name:</label
            >
            <input
              class="form-input"
              id="department-name"
              type="text"
              bind:value={formData.department_name}
              placeholder="Department name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="company-name">Company Name:</label>
            <input
              class="form-input"
              id="company-name"
              type="text"
              bind:value={formData.company_name}
              placeholder="Company name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="start-date"
              >Training Start Date:</label
            >
            <input
              class="form-input"
              id="start-date"
              type="date"
              bind:value={formData.start_date}
              placeholder="Select training start date"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="output-directory"
              >Output Directory:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="output-directory"
                type="text"
                bind:value={formData.output_directory}
                placeholder="Select output directory"
                readonly
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={selectOutputDirectory}
              >
                Browse
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="self-directory"
              >Self Directory:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="self-directory"
                type="text"
                value={$selfDirectory}
                placeholder="Select self directory"
                readonly
                disabled
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={openSelfDirectory}
              >
                Browse
              </button>
            </div>
          </div>

          {#if saveMessage}
            <div
              class="save-message"
              class:success={!saveMessage.includes("Error")}
              class:error={saveMessage.includes("Error")}
            >
              {saveMessage}
            </div>
          {/if}

          <div class="form-actions">
            <button
              class="btn-secondary"
              type="button"
              onclick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button class="btn-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
