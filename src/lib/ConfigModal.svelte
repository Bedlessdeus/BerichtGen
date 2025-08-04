<script lang="ts">
  import {
    config,
    saveConfig,
    isConfigOpen,
    selfDirectory,
    currentLanguage,
  } from "../lib/store.js";
  import { open } from "@tauri-apps/plugin-dialog";
  import type { Config } from "../lib/types.js";
  import { openUrl } from "@tauri-apps/plugin-opener";
  import {
    AVAILABLE_LANGUAGES,
    loadLanguageFile,
    registerLanguage,
    getAvailableLanguages,
    loadUserLanguagesFromDirectory,
  } from "./lang.js";

  let formData: Config = $state({ ...$config });
  let isSaving = $state(false);
  let saveMessage = $state("");
  let availableLanguages = $state(getAvailableLanguages());

  async function loadExternalLanguages() {
    const externalLanguages = [
      { code: "fr", name: "Français", path: "/languages/fr.json" },
      { code: "es", name: "Español", path: "/languages/es.json" },
      { code: "dn", name: "Denglish", path: "/languages/dn.json"},
    ];

    for (const lang of externalLanguages) {
      try {
        const langData = await loadLanguageFile(lang.path);
        if (langData) {
          registerLanguage(lang.code, lang.name, langData);
        }
      } catch (error) {
        console.warn(`Failed to load language ${lang.name}:`, error);
      }
    }

    availableLanguages = getAvailableLanguages();
  }

  $effect(() => {
    if ($isConfigOpen) {
      loadExternalLanguages();
      /*
      if (formData.custom_language_directory) {
        loadCustomLanguages();
      }*/
    }
  });

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

  async function selectCustomLanguageDirectory() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: formData.custom_language_directory || undefined,
      });

      if (selected) {
        formData.custom_language_directory = selected;
        await loadCustomLanguages();
      }
    } catch (error) {
      console.error("Failed to select custom language directory:", error);
    }
  }

  async function selectBannerImage() {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Image Files",
            extensions: ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"],
          },
        ],
        defaultPath: formData.banner_image || undefined,
      });

      if (selected) {
        formData.banner_image = selected;
      }
    } catch (error) {
      console.error("Failed to select banner image:", error);
    }
  }

  async function selectCompanyLogo() {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Image Files",
            extensions: ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"],
          },
        ],
        defaultPath: formData.company_logo || undefined,
      });

      if (selected) {
        formData.company_logo = selected;
      }
    } catch (error) {
      console.error("Failed to select company logo:", error);
    }
  }

  async function loadCustomLanguages() {
    if (formData.custom_language_directory) {
      try {
        const loadedCount = await loadUserLanguagesFromDirectory(
          formData.custom_language_directory
        );
        console.log(`Loaded ${loadedCount} custom language files`);

        availableLanguages = getAvailableLanguages();

        if (loadedCount > 0) {
          saveMessage = `Loaded ${loadedCount} custom language(s) successfully!`;
          setTimeout(() => {
            saveMessage = "";
          }, 3000);
        }
      } catch (error) {
        console.error("Failed to load custom languages:", error);
        saveMessage = `Error loading custom languages: ${error}`;
        setTimeout(() => {
          saveMessage = "";
        }, 5000);
      }
    }
  }

  async function handleSave() {
    try {
      isSaving = true;
      saveMessage = "";

      /*if (formData.custom_language_directory !== $config.custom_language_directory) {
        await loadCustomLanguages();
      }*/
      
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
        <h2 class="modal-title" id="config-title">
          {$currentLanguage.config_title_configuration}
        </h2>
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
            <label class="form-label" for="trainee-name"
              >{$currentLanguage.config_input_label_trainee}:</label
            >
            <input
              class="form-input"
              id="trainee-name"
              type="text"
              bind:value={formData.trainee_name}
              placeholder={$currentLanguage.config_input_placeholder_trainee}
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="department-name"
              >{$currentLanguage.config_input_label_department}:</label
            >
            <input
              class="form-input"
              id="department-name"
              type="text"
              bind:value={formData.department_name}
              placeholder={$currentLanguage.config_input_placeholder_department}
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="company-name"
              >{$currentLanguage.config_input_label_company}:</label
            >
            <input
              class="form-input"
              id="company-name"
              type="text"
              bind:value={formData.company_name}
              placeholder={$currentLanguage.config_input_placeholder_company}
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="start-date"
              >{$currentLanguage.config_input_label_training_start}:</label
            >
            <input
              class="form-input"
              id="start-date"
              type="date"
              bind:value={formData.start_date}
              placeholder={$currentLanguage.config_input_placeholder_training_start}
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="output-directory"
              >{$currentLanguage.config_input_label_output_directory}:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="output-directory"
                type="text"
                bind:value={formData.output_directory}
                placeholder={$currentLanguage.config_input_placeholder_output_directory}
                readonly
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={selectOutputDirectory}
              >
                {$currentLanguage.config_input_button_text_output_directory}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="self-directory"
              >{$currentLanguage.config_input_label_self_directory}:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="self-directory"
                type="text"
                value={$selfDirectory}
                placeholder={$currentLanguage.config_input_placeholder_self_directory}
                readonly
                disabled
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={openSelfDirectory}
              >
                {$currentLanguage.config_input_button_text_self_directory}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="language-select"
              >{$currentLanguage.config_input_label_language}:</label
            >
            <select
              class="form-select"
              id="language-select"
              bind:value={formData.language}
            >
              {#each availableLanguages as lang}
                <option value={lang.code}>{lang.name}</option>
              {/each}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="custom-language-directory"
              >{$currentLanguage.config_input_label_custom_language_directory}:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="custom-language-directory"
                type="text"
                bind:value={formData.custom_language_directory}
                placeholder={$currentLanguage.config_input_placeholder_custom_language_directory}
                readonly
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={selectCustomLanguageDirectory}
              >
                {$currentLanguage.config_input_button_text_custom_language_directory}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="output-format"
              >{$currentLanguage.config_input_label_output_format}:</label
            >
            <input
              class="form-input"
              id="output-format"
              type="text"
              bind:value={formData.output_format}
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="banner-image"
              >{$currentLanguage.config_input_label_banner_image}:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="banner-image"
                type="text"
                bind:value={formData.banner_image}
                placeholder={$currentLanguage.config_input_placeholder_banner_image}
                readonly
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={selectBannerImage}
              >
                {$currentLanguage.config_input_button_text_banner_image}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="company-logo"
              >{$currentLanguage.config_input_label_company_logo}:</label
            >
            <div class="flex gap-2">
              <input
                class="form-input flex-1"
                id="company-logo"
                type="text"
                bind:value={formData.company_logo}
                placeholder={$currentLanguage.config_input_placeholder_company_logo}
                readonly
              />
              <button
                type="button"
                class="btn-secondary px-3"
                onclick={selectCompanyLogo}
              >
                {$currentLanguage.config_input_button_text_company_logo}
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
              {$currentLanguage.config_button_cancel_text}
            </button>
            <button class="btn-primary" type="submit" disabled={isSaving}>
              {isSaving
                ? $currentLanguage.config_button_save_text_saving
                : $currentLanguage.config_button_save_text}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
