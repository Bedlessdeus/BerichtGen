<script lang="ts">
  import { config, saveConfig, isConfigOpen } from '../lib/store.js';
  import type { Config } from '../lib/types.js';

  let formData: Config = $state({ ...$config });
  let isSaving = $state(false);
  let saveMessage = $state('');

  async function handleSave() {
    try {
      isSaving = true;
      saveMessage = '';
      await saveConfig(formData);
      saveMessage = 'Configuration saved successfully!';
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

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }

  function handleOverlayKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClose();
    }
  }

  function handleContentKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
  }

  // Update form data when config changes
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
        <button class="modal-close" onclick={handleClose}>×</button>
      </div>
      
      <div class="modal-body">
        <form class="config-form" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
            <label class="form-label" for="department-name">Department Name:</label>
            <input
              class="form-input"
              id="department-name"
              type="text"
              bind:value={formData.department_name}
              placeholder="Enter department name"
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
              placeholder="Enter company name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="output-directory">Output Directory:</label>
            <input
              class="form-input"
              id="output-directory"
              type="text"
              bind:value={formData.output_directory}
              placeholder="Enter output directory path"
              required
            />
          </div>

          {#if saveMessage}
            <div class="save-message" class:success={!saveMessage.includes('Error')} class:error={saveMessage.includes('Error')}>
              {saveMessage}
            </div>
          {/if}

          <div class="form-actions">
            <button class="btn-secondary" type="button" onclick={handleClose} disabled={isSaving}>
              Cancel
            </button>
            <button class="btn-primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}


