/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function setSettings(settings) {
  return {
    type: 'SET_SETTINGS',
    settings: settings,
  };
}

export function toggleModal(open) {
  return {
    type: 'TOGGLE_MODAL',
    modalOpen: open,
  };
}

export function setEditor(editor) {
  return {
    type: 'SET_EDITOR',
    editor: editor,
  };
}

/**
 * Set current view.
 *
 * @param {string} view Current view.
 * @return {{currentView: string, type: string}}
 */
export function setCurrentView(view) {
  return {
    type: 'SET_CURRENT_VIEW',
    currentView: view,
  };
}

/**
 * Set view settings.
 *
 * @param view
 * @param settings
 */
export function setViewSettings(view, settings) {
  return {
    type: 'SET_VIEW_SETTINGS',
    view: view,
    settings: settings,
  };
}
