/*
 * Copyright 2021 Google LLC
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

/**
 * Retrieve settings.
 *
 * @param {Object} state State of store.
 * @return {Object} Settings object.
 */
export function getSettings(state) {
  return state.settings;
}

/**
 * Get Modal state.
 *
 * @param  {Object} state State of the store.
 * @return {boolean} Flag for open state of modal.
 */
export function getModal(state) {
  return state.modalOpen;
}

/**
 * Get editor instance.
 *
 * @param {Object} state State for the store.
 * @return {string} Editor ID.
 */
export function getEditor(state) {
  return state.editor;
}

/**
 * Get current view for the store.
 *
 * @param {Object} state State object.
 * @return {string} Current view name.
 */
export function getCurrentView(state) {
  return state.currentView;
}

/**
 *Get settings for current view.
 *
 * @param {Object} state State object.
 * @return {Object} Settings object for current view.
 */
export function getCurrentViewSettings(state) {
  const currentView = getCurrentView(state);

  return state.settings[currentView];
}

export function getState(state) {
  return state;
}
